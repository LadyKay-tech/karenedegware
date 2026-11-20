/* A notification should be worth the interruption: one day of alerts from a shopping app */
(function () {
  "use strict";
  const { go, ghost, btns } = KEProto.h;

  const ALL = [
    { t: "08:05", c: "recs", m: "Good morning! New arrivals are waiting for you" },
    { t: "09:30", c: "sales", m: "Flash sale: 20% off everything, today only" },
    { t: "10:15", c: "nudge", m: "You left something in your basket" },
    { t: "11:40", c: "orders", m: "Your order has shipped. Arriving today" },
    { t: "12:10", c: "price", m: "The jacket you saved has dropped to £62" },
    { t: "13:00", c: "nudge", m: "We miss you! Come back and have a look" },
    { t: "14:20", c: "recs", m: "Top picks for you today" },
    { t: "15:45", c: "orders", m: "Your parcel is at the door" },
    { t: "16:30", c: "stock", m: "Runner One is back in your size" },
    { t: "17:30", c: "sales", m: "Last chance: flash sale ends in 2 hours" },
    { t: "19:00", c: "nudge", m: "Enjoying Kora? Rate us in the app store" }
  ];
  const USEFUL_A = ["orders", "price"];
  const CATS = [
    { c: "orders", n: "Orders and delivery", on: true },
    { c: "price", n: "Price drops on things I saved", on: true },
    { c: "stock", n: "Back in stock, in my size", on: false },
    { c: "sales", n: "Sales and offers", on: false },
    { c: "recs", n: "Recommendations", on: false }
  ];

  const lock = (clock, list, foot = "") =>
    `<div class="xlock"><div class="xclock">${clock}</div><div class="xnotes">${list}</div>${foot}</div>`;
  const note = (n) => `<div class="xnote"><i></i><div><b>Kora</b><span>${n.m}</span></div><em>${n.t}</em></div>`;

  function settings(ui) {
    const s = ui.s;
    return "<h4>What should Kora tell you about?</h4><p class=\"sm\">You can change this any time.</p>" +
      CATS.map((c) => `<button type="button" class="xtog${s.on[c.c] ? " on" : ""}" data-act="tog" data-c="${c.c}"><span>${c.n}</span><i></i></button>`).join("") +
      go("Save and play the day", "play");
  }

  function play(ui, p) {
    const s = ui.s;
    const list = p === "A" ? ALL : ALL.filter((n) => s.on[n.c]);
    s.shown = [];
    ui.screen(lock("07:00", '<p class="xquiet">Nothing yet</p>'));
    ui.progress("Morning", 0);
    if (!list.length) {
      ui.later(() => finish(ui, p, list), 900);
      return;
    }
    list.forEach((n, i) => {
      ui.later(() => {
        s.shown.unshift(n);
        ui.update(lock(n.t, s.shown.map(note).join("")));
        ui.metric("sent", s.shown.length);
        const useful = p === "A" ? s.shown.filter((x) => USEFUL_A.includes(x.c)).length : s.shown.length;
        ui.metric("useful", useful);
        ui.progress(n.t, (i + 1) / list.length);
      }, 450 + i * 520);
    });
    ui.later(() => finish(ui, p, list), 450 + list.length * 520 + 500);
  }

  function finish(ui, p, list) {
    ui.progress("End of the day", 1);
    if (p === "A") {
      ui.update(lock("19:30", ui.s.shown.map(note).join(""),
        '<div class="xsheet"><b>Keep getting notifications from Kora?</b>' + btns(go("Turn them off", "off"), ghost("Keep them", "keep")) + "</div>"));
      return;
    }
    const n = list.length;
    ui.done({
      sent: n, useful: n,
      toast: n ? `${n} ${n === 1 ? "alert" : "alerts"}, every one of them something Tolu asked for.` : "No alerts at all. A quiet app is better than a muted one."
    });
  }

  KEProto({
    names: { A: "Send everything", B: "Only what they chose" },
    hints: {
      A: "Play a day of alerts from a shopping app",
      B: "This time Tolu picks what she hears about first",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "sent", label: "Alerts sent", zero: "0" },
      { k: "useful", label: "Worth reading", zero: "0" }
    ],
    compare: {
      label: "Alerts worth reading",
      value: (r) => (r.sent ? r.useful / r.sent : 1),
      text: (r) => `${r.useful} of ${r.sent}${r.muted ? ", then muted" : ""}`
    },
    start(p, ui) {
      if (p === "A") {
        ui.screen(lock("07:00", '<p class="xquiet">A normal day for Tolu</p>', go("Play the day", "play")));
        return;
      }
      ui.s.on = {};
      CATS.forEach((c) => (ui.s.on[c.c] = c.on));
      ui.screen(settings(ui));
    },
    act(name, el, ui, p) {
      if (name === "tog") { ui.s.on[el.dataset.c] = !ui.s.on[el.dataset.c]; ui.update(settings(ui)); return; }
      if (name === "play") { play(ui, p); return; }
      const sent = ui.s.shown.length;
      const useful = ui.s.shown.filter((x) => USEFUL_A.includes(x.c)).length;
      const muted = name === "off";
      ui.update(lock("19:30", '<p class="xquiet">' + (muted ? "Kora notifications are off" : "Kora notifications are still on") + "</p>"));
      ui.done({
        sent, useful, muted,
        toast: muted ? `${sent} alerts, ${useful} worth reading. Kora lost the right to interrupt her.` : `${sent} alerts, ${useful} worth reading. Most people would have switched these off.`
      });
    }
  });
})();
