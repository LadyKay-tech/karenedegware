/* Make leaving easy, and listen on the way out: cancelling a music subscription */
(function () {
  "use strict";
  const { go, ghost, link, row, btns } = KEProto.h;
  const REASONS = ["Too pricey", "Not using it enough", "Found another app", "Just need a break"];

  const account = (manage) =>
    "<h4>Account</h4>" + row("Profile", "Femi Ade") + row("Plan", "Premium, £9.99 a month") +
    row("Notifications", "On") + row("Help", "") + manage;

  const A = [
    () => account(`<div class="xspacer"></div>${link("Manage plan", "next")}`),
    () => '<h4>Premium</h4><p class="sm">Ad free listening, offline downloads, better sound.</p>' +
      btns(go("Change plan", "decoy")) + `<div class="xspacer"></div>${link("Other options", "next")}`,
    () => '<h4>Are you sure?</h4><p class="sm">You’ll lose 2,341 saved songs and every playlist you’ve made.</p>' +
      btns(go("Keep Premium", "back"), ghost("Continue", "next")),
    () => '<div class="xoffer">Wait. 50% off for 3 months?</div><p class="sm">Only £4.99 a month. Offer ends today.</p>' +
      btns(go("Claim offer", "decoy")) + `<div class="xspacer"></div>${link("No thanks, continue", "next")}`,
    () => '<h4>To cancel, please call us</h4><p class="sm">0800 123 4567<br>Monday to Friday, 9am to 5pm</p>' + go("OK", "finish")
  ];
  const B = [
    () => account(go("Manage plan", "next")),
    () => '<h4>Premium</h4><p class="sm">Ad free listening, offline downloads, better sound.</p>' +
      btns(ghost("Change plan", "decoy"), ghost("Cancel plan", "next")),
    (ui) => '<h4>Sorry to see you go</h4><p class="sm">What’s the main reason? It helps us get better.</p>' +
      `<div class="xchips">${REASONS.map((r) => `<button type="button" data-act="pick" data-r="${r}" class="${ui.s.reason === r ? "on" : ""}">${r}</button>`).join("")}</div>` +
      (ui.s.reason === "Just need a break" ? '<p class="xmsg">You can pause for up to 3 months and keep everything.</p>' : "") +
      btns(go("Cancel plan", "finish"), ghost("Pause for a month instead", "pause"))
  ];
  const PATHS = { A, B };

  const show = (ui, p) => {
    ui.screen(PATHS[p][ui.s.i](ui));
    ui.metric("clicks", ui.clicks);
  };

  KEProto({
    names: { A: "The maze", B: "One clear exit" },
    hints: {
      A: "Femi wants to cancel. Find the way out",
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
    start(p, ui) { ui.s.i = 0; show(ui, p); },
    act(name, el, ui, p) {
      if (name === "next") { ui.s.i++; show(ui, p); return; }
      if (name === "back") { ui.s.i = 0; show(ui, p); ui.hint("Back to the start. Keep looking"); return; }
      if (name === "decoy") { ui.metric("clicks", ui.clicks); el.classList.add("xshake"); return; }
      if (name === "pick") { ui.s.reason = el.dataset.r; ui.update(PATHS[p][ui.s.i](ui)); ui.metric("clicks", ui.clicks); return; }
      ui.metric("clicks", ui.clicks);
      if (p === "A") {
        ui.screen('<div class="xdone"><h4>Still subscribed</h4><p class="sm">Femi will have to ring during working hours. Until then, he keeps paying.</p></div>');
        ui.done({ clicks: ui.clicks, learnt: "Unknown", toast: `${ui.clicks} clicks and a phone number. Nobody learnt why Femi wanted to leave.` });
        return;
      }
      const learnt = name === "pause" ? "Paused instead" : ui.s.reason || "Skipped the question";
      ui.metric("learnt", learnt);
      ui.screen(name === "pause"
        ? `<div class="xdone"><span class="xok">${KEProto.h.tick}</span><h4>Paused until 20 December</h4><p class="sm">Nothing is charged meanwhile. Your playlists are safe.</p></div>`
        : `<div class="xdone"><span class="xok">${KEProto.h.tick}</span><h4>Plan cancelled</h4><p class="sm">Premium runs until 30 November. Your playlists stay saved if you come back.</p></div>`);
      ui.done({
        clicks: ui.clicks, learnt,
        toast: name === "pause" ? `${ui.clicks} clicks. Femi stayed, on his own terms.` : `${ui.clicks} clicks. Femi left on good terms${ui.s.reason ? `, and told you why: ${ui.s.reason.toLowerCase()}` : ""}.`
      });
    }
  });
})();
