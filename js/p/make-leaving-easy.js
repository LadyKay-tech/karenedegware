/* Make leaving easy, and listen on the way out: cancelling Premium in a made-up music app */
(function () {
  "use strict";
  const { icon, av, btn, main, cover } = KEPhone;
  const REASONS = ["Too pricey", "Not using it enough", "Found another app", "Just need a break"];
  const TABS = [["Home", "home"], ["Search", "search"], ["Library", "library"], ["Premium", "spark"]];

  const tabs = (active) => `<nav class="ap-tabs mu-tabs">${TABS.map(([l, ic]) => `<span class="${l === active ? "on" : ""}">${icon(ic)}<em>${l}</em></span>`).join("")}</nav>`;
  const player = () => `<div class="mu-player">${cover("midnight")}<div><b>Midnight Drive</b><span>Lumen</span></div>${icon("heart")}<span class="mu-play">${icon("play")}</span></div>`;
  const back = (t) => `<div class="ap-top mu-top"><span class="ap-ib">${icon("back")}</span><b>${t}</b></div>`;
  const rows = (list) => `<div class="mu-list">${list.map(([a, b]) => `<div class="mu-row"><span><b>${a}</b>${b ? `<em>${b}</em>` : ""}</span>${icon("chev")}</div>`).join("")}</div>`;
  const plan = () => `<div class="mu-plan"><span class="mu-pill">Your plan</span><b>Premium Individual</b><span>£11.99 a month · Next payment 30 November</span><div class="mu-perks"><span>${icon("dl")}Downloads</span><span>${icon("note")}No ads</span><span>${icon("spark")}Lossless</span></div></div>`;
  const me = () => `<div class="mu-me">${av("FA", "f")}<div><b>Femi Ade</b><span>femi.ade@mail.com</span></div></div>`;

  const home = () => `<div class="scr mu"><div class="mu-head"><button type="button" class="av mu-av" data-act="acct" data-main>FA</button><div class="mu-chips"><span class="on">All</span><span>Music</span><span>Podcasts</span></div></div>
    <div class="ap-body" style="gap:12px">
      <div class="mu-grid">${[["Liked Songs", "liked"], ["Afro Chill", "afro"], ["Daily Mix 1", "daily"], ["Focus Flow", "focus"], ["Gym Hits", "gym"], ["Late Nights", "late"]].map(([n, k]) => `<div class="mu-tile">${cover(k)}<b>${n}</b></div>`).join("")}</div>
      <span class="mu-h">Made for Femi</span>
      <div class="mu-cards">${[["Discover Weekly", "discover", "Your weekly mixtape"], ["Release Radar", "radar", "New from artists you follow"], ["On Repeat", "repeat", "Songs you can’t stop playing"]].map(([n, k, d]) => `<div>${cover(k)}<b>${n}</b><span>${d}</span></div>`).join("")}</div>
      <span class="mu-h">Recently played</span>
      <div class="mu-cards">${[["Sunday Slow", "sunday", "Playlist · 42 songs"], ["Highlife Gold", "highlife", "Playlist · 58 songs"], ["Run Club", "run", "Playlist · 2h 10m"]].map(([n, k, d]) => `<div>${cover(k)}<b>${n}</b><span>${d}</span></div>`).join("")}</div>
    </div>${player()}${tabs("Home")}</div>`;

  const A = [
    home,
    () => `<div class="scr mu">${back("Account")}<div class="ap-body">${me()}
      ${rows([["Profile", ""], ["Plan", "Premium Individual"], ["Notifications", ""], ["Storage", "2,341 songs downloaded"], ["Privacy", ""], ["Help", ""]])}
      <div style="flex:1"></div>${btn("Manage plan", "next", "mu-tiny")}</div></div>`,
    () => `<div class="scr mu">${back("Premium")}<div class="ap-body">${plan()}
      ${main("Change plan", "decoy", "mu")}<div style="flex:1"></div>${btn("Other options", "next", "mu-tiny")}</div></div>`,
    () => `<div class="scr mu"><div class="mu-fade">${["liked", "afro", "late", "discover", "highlife", "sunday"].map((k) => cover(k)).join("")}</div><div class="ap-body" style="justify-content:flex-end">
      <h3 class="mu-big">Are you sure?</h3><p class="mu-p">You’ll lose 2,341 downloaded songs, your offline playlists and lossless audio.</p>
      ${main("Keep Premium", "back", "mu")}${btn("Continue", "next", "mu-text")}</div></div>`,
    () => `<div class="scr mu"><div class="ap-body" style="justify-content:center">
      <div class="mu-offer"><span class="mu-pill">Just for you</span><b>Stay for £5.99 a month</b><span>Half price for 3 months. Offer ends today.</span></div>
      ${main("Claim offer", "decoy", "mu")}<div style="height:40px"></div>${btn("No thanks", "next", "mu-tiny")}</div></div>`,
    () => `<div class="scr mu">${back("Cancel Premium")}<div class="ap-body" style="justify-content:center;text-align:center;align-items:center">
      <span class="mu-icon">${icon("info")}</span><h3 class="mu-big" style="font-size:20px">To cancel, please call us</h3><p class="mu-p">0800 123 4567<br>Monday to Friday, 9am to 5pm</p>
      <div style="flex:1"></div>${main("OK", "finish", "mu")}</div></div>`
  ];

  const B = [
    home,
    () => `<div class="scr mu">${back("Account")}<div class="ap-body">${me()}
      <div class="mu-list"><div class="mu-row"><span><b>Plan</b><em>Premium Individual · £11.99 a month</em></span><button type="button" class="mu-manage" data-act="next" data-main>Manage</button></div></div>
      ${rows([["Profile", ""], ["Notifications", ""], ["Storage", "2,341 songs downloaded"], ["Privacy", ""], ["Help", ""]])}</div></div>`,
    () => `<div class="scr mu">${back("Premium")}<div class="ap-body">${plan()}
      <div class="mu-two">${btn("Change plan", "decoy", "mu-line")}${btn("Cancel Premium", "next", "mu-line", "data-main")}</div></div></div>`,
    (ui) => `<div class="scr mu">${back("Premium")}<div class="ap-body">${plan()}</div>
      <div class="ap-scrim"></div><div class="ap-sheet mu-sheet"><i class="ap-grab"></i><b style="font-size:16px">Sorry to see you go</b><p class="mu-p" style="margin:0">What’s the main reason? It helps us get better.</p>
      <div class="mu-reasons">${REASONS.map((r) => `<button type="button" data-act="pick" data-r="${r}" class="${ui.s.reason === r ? "on" : ""}">${r}</button>`).join("")}</div>
      ${ui.s.reason === "Just need a break" ? '<p class="mu-tip">You can pause for up to 3 months and keep everything.</p>' : ""}
      ${main("Cancel Premium", "finish", "mu")}${btn("Pause for a month instead", "pause", "mu-text")}</div></div>`
  ];
  const PATHS = { A, B };
  const NOTES = {
    A: [["Femi wants to cancel. Watch where the way out is"], ["No cancel option. Just a faint link at the bottom"], ["The big button changes his plan. Leaving is hidden again"], ["Guilt first, and the bright button sends him back to the start"], ["A discount when he’s already said no"], ["After all that, a phone number during working hours"]],
    B: [["Same app. This time the exit is easy to find"], ["The plan has a clear Manage button"], ["Cancel sits beside Change, equally easy"], ["One honest question, and a pause for anyone who just needs a break"]]
  };

  const show = (ui, p) => {
    ui.screen(PATHS[p][ui.s.i](ui));
    ui.metric("clicks", ui.clicks);
    ui.notes(NOTES[p][ui.s.i]);
  };
  const end = (cls, ic, title, sub) => `<div class="scr mu"><div class="ap-body"><div class="ap-success"><span class="tick ${cls}">${icon(ic)}</span><div class="ap-h" style="color:#fff">${title}</div><p class="mu-p">${sub}</p></div></div></div>`;

  KEProto({
    names: { A: "The maze", B: "One clear exit" },
    hints: {
      A: "Femi wants to cancel Premium. Tap his picture and find the way out",
      B: "Same app, same plan. Cancel again",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "clicks", label: "Clicks", zero: "0" },
      { k: "learnt", label: "Why Femi left", zero: "Unknown" }
    ],
    compare: {
      label: "Clicks to leave",
      value: (r) => r.clicks,
      text: (r) => `${r.clicks} clicks${r.learnt === "Unknown" ? ", no reason" : r.learnt === "Paused instead" ? ", paused" : r.learnt === "Skipped the question" ? "" : ", told you why"}`
    },
    start(p, ui) { ui.s.i = 0; ui.s.reason = ""; show(ui, p); },
    act(name, el, ui, p) {
      if (name === "acct" || name === "next") { ui.s.i++; show(ui, p); return; }
      if (name === "back") { ui.s.i = 0; show(ui, p); ui.hint("Back to the start. Keep looking"); return; }
      if (name === "decoy") { ui.metric("clicks", ui.clicks); el.classList.add("xshake"); setTimeout(() => el.classList.remove("xshake"), 400); return; }
      if (name === "pick") { ui.s.reason = el.dataset.r; ui.update(PATHS[p][ui.s.i](ui)); ui.metric("clicks", ui.clicks); return; }
      ui.metric("clicks", ui.clicks);
      if (p === "A") {
        ui.screen(end("wait", "clock", "Still subscribed", "Femi will have to ring during working hours. Until then, he keeps paying."));
        ui.notes(["He’s still paying, and he won’t be back"]);
        ui.done({ clicks: ui.clicks, learnt: "Unknown", toast: `${ui.clicks} clicks and a phone number. Nobody learnt why Femi wanted to leave.` });
        return;
      }
      const learnt = name === "pause" ? "Paused instead" : ui.s.reason || "Skipped the question";
      ui.metric("learnt", learnt);
      ui.screen(name === "pause"
        ? end("mu-tick", "check", "Paused until 20 December", "Nothing is charged meanwhile. Your downloads and playlists are safe.")
        : end("mu-tick", "check", "Premium cancelled", "You keep Premium until 30 November. Your playlists stay put if you come back."));
      ui.notes(name === "pause" ? ["He stayed, on his own terms"] : ["He leaves on good terms, and you learn why"]);
      ui.done({
        clicks: ui.clicks, learnt,
        toast: name === "pause" ? `${ui.clicks} clicks. Femi stayed, on his own terms.` : `${ui.clicks} clicks. Femi left on good terms${ui.s.reason ? `, and told you why: ${ui.s.reason.toLowerCase()}` : ""}.`
      });
    }
  });
})();
