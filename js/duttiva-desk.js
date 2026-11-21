/* The desktop scene around the Duttiva preview: a note you can edit, the floating
   Duttiva window, shortcuts, voice, and the bridge the app uses to read your text. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const win = $("dvWin"), frame = $("dvFrame"), doc = $("dvDoc"), hint = $("dvHint"), toasts = $("dvToasts"), heard = $("dvHeard");
  const tabs = $("dvTabs"), title = $("dvTitle");
  if (!win) return;

  // Where the AI relay lives, if one has been set up for this page (never a key)
  const relay = document.querySelector('meta[name="duttiva-ai"]');
  window.__duttivaAI = relay && relay.content ? relay.content : "";

  /* ---------- notes ---------- */
  const SAMPLES = {
    meeting: { label: "Meeting", title: "Launch sync", mono: false, text: "Launch sync, Tuesday. We agreed to move the beta launch from 3 March to 17 March so the payments flow can be tested properly. Ngozi will finish the onboarding copy by Friday. Femi owns the payment provider integration and needs sandbox keys from finance this week. Ada will brief the support team on the new refund policy before launch. Budget for paid ads stays at £4,000 for the first month, with a review after two weeks. Risks: the app store review could take longer than expected, and two designers are on leave next week." },
    email: { label: "Email", title: "Re: Order 4471", mono: false, text: "Hi there, I ordered the blue linen bedding set on the 4th and was told it would arrive within five working days. It is now the 16th and nothing has come. I have emailed twice and had no reply, which is frustrating because it was meant to be a birthday present. Could you tell me where the order is? If it cannot get here by Saturday, I would like a full refund. Thanks, Tolu" },
    code: { label: "Code", title: "basket.js", mono: true, text: "function totalWithVat(items, rate) {\n  let total = 0;\n  for (var i = 0; i <= items.length; i++) {\n    total += items[i].price * items[i].qty;\n  }\n  return total + total * rate;\n}" },
    data: { label: "Data", title: "team.csv", mono: true, text: "Name, Role, City, Started\nAmara Okafor, Designer, Lagos, 2021\nTom Hughes, Engineer, Manchester, 2019\nSade Bello, Product Manager, London, 2022\nKofi Mensah, Data Analyst, Accra, 2020" },
  };
  const notes = {};
  Object.keys(SAMPLES).forEach((k) => { notes[k] = Object.assign({}, SAMPLES[k]); });
  let current = "meeting";
  let shown = false;

  function renderTabs() {
    tabs.innerHTML = Object.keys(notes).map((k) => `<button type="button" role="tab" aria-selected="${k === current}" data-note="${k}">${notes[k].label}</button>`).join("") +
      `<button type="button" class="dv-clear" data-clear title="Start with an empty note">+ Your own text</button>`;
  }
  function showNote(k) {
    save();
    current = k;
    const n = notes[k];
    title.textContent = n.title;
    doc.classList.toggle("mono", !!n.mono);
    doc.textContent = n.text;
    shown = true;
    renderTabs();
    lastSel = "";
    push();
  }
  function save() { if (shown && notes[current]) notes[current].text = doc.innerText.replace(/\n{3,}/g, "\n\n").trim(); }
  tabs.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-clear")) {
      save();
      if (!notes.mine) notes.mine = { label: "My note", title: "My note", mono: false, text: "" };
      showNote("mine");
      doc.focus();
      notify("Your turn", "Type or paste anything here, then press Ctrl + Space");
      return;
    }
    showNote(b.getAttribute("data-note"));
  });
  doc.addEventListener("input", () => { save(); push(); });
  doc.addEventListener("paste", (e) => {
    // Paste as plain text, so styling from elsewhere doesn't come along
    const t = (e.clipboardData || window.clipboardData).getData("text");
    if (t == null) return;
    e.preventDefault();
    document.execCommand("insertText", false, t);
  });

  /* ---------- the Duttiva window ---------- */
  let loaded = false;
  let lastSel = "";
  function load() { if (!loaded) { loaded = true; frame.src = frame.dataset.src; } }
  function call(fn, ...args) {
    try { const w = frame.contentWindow; if (w && typeof w[fn] === "function") return w[fn](...args); } catch (e) { /* not ready */ }
  }
  const text = () => lastSel || doc.innerText.trim();
  function push() { call("__duttivaSetText", text()); }
  function focusInput() {
    try { const i = frame.contentDocument && frame.contentDocument.querySelector("input, textarea"); if (i) i.focus(); } catch (e) { /* ignore */ }
  }
  function show() {
    load();
    win.hidden = false;
    hint.classList.add("off");
    requestAnimationFrame(() => win.classList.add("on"));
    push();
    if (!matchMedia("(hover: none)").matches) setTimeout(focusInput, 350);
  }
  function hide() {
    win.classList.remove("on");
    hint.classList.remove("off");
    setTimeout(() => { if (!win.classList.contains("on")) win.hidden = true; }, 260);
  }
  function notify(head, body) {
    const t = document.createElement("div");
    t.className = "dv-toast";
    t.innerHTML = "<b></b><span></span>";
    t.querySelector("b").textContent = head || "Duttiva";
    t.querySelector("span").textContent = body || "";
    toasts.appendChild(t);
    setTimeout(() => t.classList.add("out"), 3400);
    setTimeout(() => t.remove(), 3900);
  }
  function addNote(name, content) {
    save();
    const k = "n" + Date.now();
    notes[k] = { label: String(name || "New note").slice(0, 24), title: name || "New note", mono: false, text: String(content || "").replace(/^#\s+.*\n+/, "") };
    showNote(k);
    notify("Saved to Notes", `“${name}” is open in the notes window`);
  }

  window.__duttivaDesk = {
    show, hide, notify, addNote,
    toggle: () => (win.hidden ? show() : hide()),
    getSelection: () => text(),
    getText: () => text(),
  };

  // Highlighting part of the note narrows what Duttiva works on
  document.addEventListener("selectionchange", () => {
    const s = window.getSelection();
    if (!s || !doc.contains(s.anchorNode)) return;
    const t = s.isCollapsed ? "" : s.toString().trim();
    if (t.length > 3 || (s.isCollapsed && lastSel)) { lastSel = t.length > 3 ? t : ""; push(); }
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.code === "Space") { e.preventDefault(); window.__duttivaDesk.toggle(); }
    if (e.key === "Escape" && !win.hidden && !document.querySelector(".ow.fs")) hide();
  });
  $("dvSummon").addEventListener("click", show);
  frame.addEventListener("load", () => {
    push();
    try { frame.contentWindow.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.code === "Space") { e.preventDefault(); hide(); } }); } catch (e) { /* ignore */ }
  });

  /* ---------- "Hey Duttiva" ---------- */
  const mic = $("dvMic");
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const WAKE = /\b(duttiva|dutiva|duty ?va|do ?tiva|due ?tiva|the ?diva|deeva|diva)\b/i;
  const VOICE_CMDS = [
    [/summar/i, "/summarize"], [/action/i, "/actionitems"], [/to ?do|checklist/i, "/todo"], [/bullet/i, "/bulletify"],
    [/simpl/i, "/simplify"], [/sentiment|tone|feel/i, "/sentiment"], [/keyword/i, "/keywords"], [/hashtag/i, "/hashtag"],
    [/tweet|thread/i, "/tweet"], [/reply|respond|answer/i, "/reply"], [/explain/i, "/explain"], [/review|check/i, "/review"],
    [/translate.*french/i, "/translate french"], [/translate.*spanish/i, "/translate spanish"], [/translate.*german/i, "/translate german"], [/translate.*pidgin/i, "/translate pidgin"],
  ];
  function say(phrase, after) {
    heard.hidden = false;
    heard.classList.add("on");
    let i = 0;
    const tick = setInterval(() => {
      heard.textContent = "“" + phrase.slice(0, ++i) + (i < phrase.length ? "" : "”");
      if (i >= phrase.length) { clearInterval(tick); setTimeout(() => { heard.classList.remove("on"); heard.hidden = true; after && after(); }, 650); }
    }, 36);
  }
  function run(cmd) {
    show();
    let tries = 0;
    const go = () => {
      let ok = false;
      try { ok = typeof frame.contentWindow.__executeCommand === "function"; } catch (e) { ok = false; }
      if (!ok) { if (++tries < 30) setTimeout(go, 300); return; }
      push();
      setTimeout(() => call("__executeCommand", cmd), 150);
    };
    setTimeout(go, 500);
  }
  const demo = () => say("Hey Duttiva, summarise this", () => run("/summarize"));
  mic.addEventListener("click", () => {
    if (mic.classList.contains("live")) return;
    if (!SR) return demo();
    let r;
    try { r = new SR(); } catch (e) { return demo(); }
    r.lang = "en-GB"; r.interimResults = true; r.maxAlternatives = 1;
    mic.classList.add("live");
    heard.hidden = false; heard.classList.add("on");
    heard.textContent = "Listening. Say “Hey Duttiva”, then what you need";
    let done = false, gotAny = false;
    const stop = () => { mic.classList.remove("live"); heard.classList.remove("on"); heard.hidden = true; };
    const giveUp = setTimeout(() => { if (!gotAny && !done) { done = true; try { r.abort(); } catch (e) { /* ignore */ } stop(); demo(); } }, 6000);
    r.onresult = (ev) => {
      gotAny = true;
      const t = Array.from(ev.results).map((x) => x[0].transcript).join(" ");
      heard.textContent = "“" + t + "”";
      const final = ev.results[ev.results.length - 1].isFinal;
      if (!done && WAKE.test(t) && (final || VOICE_CMDS.some(([re]) => re.test(t)))) {
        done = true; clearTimeout(giveUp);
        try { r.stop(); } catch (e) { /* ignore */ }
        const hit = VOICE_CMDS.find(([re]) => re.test(t));
        setTimeout(() => { stop(); hit ? run(hit[1]) : show(); }, 500);
      }
    };
    r.onerror = () => { clearTimeout(giveUp); if (done) return; done = true; stop(); demo(); };
    r.onend = () => { clearTimeout(giveUp); if (!done) { done = true; stop(); if (gotAny) show(); } };
    try { r.start(); } catch (e) { clearTimeout(giveUp); stop(); demo(); }
  });

  /* ---------- small things ---------- */
  const clock = $("dvClock");
  const tickClock = () => { clock.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); };
  tickClock(); setInterval(tickClock, 30000);

  const engine = $("dvEngine");
  if (engine) {
    let own = false;
    try { own = !!localStorage.getItem("duttiva_own_key"); } catch (e) { /* ignore */ }
    engine.dataset.mode = own ? "key" : window.__duttivaAI ? "relay" : "offline";
  }

  const fsBtn = $("fsBtn");
  if (fsBtn) fsBtn.addEventListener("click", () => setTimeout(() => { if (document.querySelector(".ow.fs")) show(); }, 50));

  showNote("meeting");
})();
