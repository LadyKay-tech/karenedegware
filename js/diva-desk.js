/* The desktop scene around the Diva preview: summon, hide, share selected text, voice */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const win = $("dvWin"), frame = $("dvFrame"), doc = $("dvDoc"), hint = $("dvHint"), toasts = $("dvToasts"), heard = $("dvHeard");
  if (!win) return;
  let loaded = false;
  let lastSel = "";

  function load() {
    if (loaded) return;
    loaded = true;
    frame.src = frame.dataset.src;
  }
  function call(fn, ...args) {
    try { const w = frame.contentWindow; if (w && typeof w[fn] === "function") return w[fn](...args); } catch (e) { /* not ready */ }
  }
  function focusInput() {
    try { const i = frame.contentDocument && frame.contentDocument.querySelector("input, textarea"); if (i) i.focus(); } catch (e) { /* ignore */ }
  }
  function show() {
    load();
    win.hidden = false;
    hint.classList.add("off");
    requestAnimationFrame(() => win.classList.add("on"));
    if (lastSel) call("__divaSetText", lastSel);
    setTimeout(focusInput, 350);
  }
  function hide() {
    win.classList.remove("on");
    hint.classList.remove("off");
    setTimeout(() => { if (!win.classList.contains("on")) win.hidden = true; }, 260);
  }
  function notify(title, body) {
    const t = document.createElement("div");
    t.className = "dv-toast";
    t.innerHTML = `<b></b><span></span>`;
    t.querySelector("b").textContent = title || "Diva";
    t.querySelector("span").textContent = body || "";
    toasts.appendChild(t);
    setTimeout(() => t.classList.add("out"), 3200);
    setTimeout(() => t.remove(), 3700);
  }

  window.__divaDesk = {
    show, hide, notify,
    toggle: () => (win.hidden ? show() : hide()),
    getSelection: () => lastSel,
  };

  // Text highlighted in the note becomes Diva's input
  document.addEventListener("selectionchange", () => {
    const s = window.getSelection();
    if (!s || s.isCollapsed || !doc.contains(s.anchorNode)) return;
    const t = s.toString().trim();
    if (t.length > 3) { lastSel = t; call("__divaSetText", t); }
  });

  // Ctrl or Cmd + Space, as on the desktop
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.code === "Space") { e.preventDefault(); window.__divaDesk.toggle(); }
    if (e.key === "Escape" && !win.hidden && !document.querySelector(".ow.fs")) hide();
  });
  $("dvSummon").addEventListener("click", show);
  frame.addEventListener("load", () => {
    try { frame.contentWindow.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.code === "Space") { e.preventDefault(); hide(); } }); } catch (e) { /* ignore */ }
  });

  // "Hey Diva": real speech recognition where the browser has it, a short demo where it doesn't
  const mic = $("dvMic");
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function say(text, after) {
    heard.hidden = false;
    heard.textContent = "";
    heard.classList.add("on");
    let i = 0;
    const tick = setInterval(() => { heard.textContent = "“" + text.slice(0, ++i) + (i < text.length ? "" : "”"); if (i >= text.length) { clearInterval(tick); setTimeout(() => { heard.classList.remove("on"); heard.hidden = true; after && after(); }, 700); } }, 38);
  }
  function runSummary() {
    show();
    const go = () => { if (call("__executeCommand", "/summarize") === undefined && !frame.contentWindow.__executeCommand) return setTimeout(go, 300); };
    setTimeout(go, 600);
  }
  mic.addEventListener("click", () => {
    if (mic.classList.contains("live")) return;
    if (SR) {
      try {
        const r = new SR();
        r.lang = "en-GB"; r.interimResults = true; r.maxAlternatives = 1;
        mic.classList.add("live");
        heard.hidden = false; heard.classList.add("on"); heard.textContent = "Listening… say “Hey Diva, summarise this”";
        let done = false, gotAny = false;
        const giveUp = setTimeout(() => { if (!gotAny && !done) { done = true; try { r.abort(); } catch (e) {} mic.classList.remove("live"); say("Hey Diva, summarise this", runSummary); } }, 5000);
        r.onresult = (ev) => {
          gotAny = true;
          const t = Array.from(ev.results).map((x) => x[0].transcript).join(" ");
          heard.textContent = "“" + t + "”";
          if (!done && /\b(diva|deva|dever|diver)\b/i.test(t)) {
            done = true; r.stop();
            setTimeout(() => { heard.classList.remove("on"); heard.hidden = true; /summar/i.test(t) ? runSummary() : show(); }, 600);
          }
        };
        r.onerror = () => { clearTimeout(giveUp); if (done) return; done = true; mic.classList.remove("live"); heard.classList.remove("on"); heard.hidden = true; say("Hey Diva, summarise this", runSummary); };
        r.onend = () => { mic.classList.remove("live"); if (!done) { heard.classList.remove("on"); heard.hidden = true; } };
        r.start();
        return;
      } catch (e) { mic.classList.remove("live"); }
    }
    say("Hey Diva, summarise this", runSummary);
  });

  // Live clock in the menu bar
  const clock = $("dvClock");
  const tickClock = () => { const d = new Date(); clock.textContent = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); };
  tickClock(); setInterval(tickClock, 30000);

  // Full screen on phones: Diva fills the screen
  const fsBtn = $("fsBtn");
  if (fsBtn) fsBtn.addEventListener("click", () => setTimeout(() => { if (document.querySelector(".ow.fs")) show(); }, 50));
})();
