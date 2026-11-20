/* Reward real progress, not empty points: five days with a savings app */
(function () {
  "use strict";
  const { go, ghost, btns } = KEProto.h;
  const DAYS = 5, BUSY = 4, GOAL = 900, START = 560, ADD = 20;

  const head = (d) => `<span class="xday">Day ${Math.min(d, DAYS)} of ${DAYS}${d === BUSY ? ", a busy one" : ""}</span>`;

  function viewA(ui, msg) {
    const s = ui.s;
    const busy = s.day === BUSY;
    return head(s.day) +
      `<div class="xstreak"><div><span class="sm">Streak</span><div class="xbig">${s.streak} ${s.streak === 1 ? "day" : "days"}</div></div><div><span class="sm">Points</span><div class="xbig">${s.points}</div></div></div>` +
      `<div class="xdots">${Array.from({ length: DAYS }, (_, i) => `<i class="${s.log[i] || ""}"></i>`).join("")}</div>` +
      (msg ? `<p class="xmsg">${msg}</p>` : '<p class="sm">Open the app every day to keep your streak going.</p>') +
      (busy ? btns(ghost("No time today", "skip")) : btns(go("Check in", "in"), ghost("Skip today", "skip")));
  }

  function viewB(ui, msg) {
    const s = ui.s;
    const busy = s.day === BUSY;
    const pct = (s.saved / GOAL) * 100;
    return head(s.day) +
      `<div><span class="sm">Rent fund</span><div class="xbig">£${s.saved} <em>of £${GOAL}</em></div></div>` +
      `<div class="xmeter"><i style="width:${pct}%"></i></div>` +
      `<div class="xdots">${Array.from({ length: DAYS }, (_, i) => `<i class="${s.log[i] || ""}"></i>`).join("")}</div>` +
      (msg ? `<p class="xmsg">${msg}</p>` : `<p class="sm">£${GOAL - s.saved} to go before rent is due.</p>`) +
      (busy ? btns(ghost("No time today", "skip")) : btns(go(`Move £${ADD} to rent`, "in"), ghost("Skip today", "skip")));
  }

  function end(ui, p) {
    const s = ui.s;
    ui.progress("Week done", 1);
    if (p === "A") {
      ui.update(`<div class="xdone"><h4>${s.points} points</h4><p class="sm">Streak: ${s.streak} ${s.streak === 1 ? "day" : "days"}. Money set aside this week: £0.</p></div>`);
      ui.done({ saved: 0, toast: `${s.points} points and a broken streak. Not a penny closer to rent.` });
    } else {
      const added = s.saved - START;
      ui.update(`<div class="xdone"><h4>£${s.saved} of £${GOAL}</h4><div class="xmeter"><i style="width:${(s.saved / GOAL) * 100}%"></i></div><p class="sm">£${added} added this week. The busy day cost nothing.</p></div>`);
      ui.done({ saved: added, toast: `£${added} closer to rent. Missing a day didn’t undo anything.` });
    }
  }

  KEProto({
    names: { A: "Streaks and points", B: "Progress on a goal" },
    hints: {
      A: "Live five days with a savings app. Day 4 gets busy",
      B: "Same five days. This time the app counts money, not visits",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "points", label: "Points", zero: "0" },
      { k: "saved", label: "Saved this week", zero: "£0" }
    ],
    compare: {
      label: "Money saved this week",
      value: (r) => r.saved,
      text: (r) => `£${r.saved}`
    },
    start(p, ui) {
      Object.assign(ui.s, { day: 1, streak: 0, points: 0, saved: START, log: [] });
      ui.progress("Day 1", 1 / DAYS);
      ui.screen(p === "A" ? viewA(ui) : viewB(ui));
    },
    act(name, el, ui, p) {
      const s = ui.s;
      let msg;
      if (name === "in") {
        s.log[s.day - 1] = "on";
        if (p === "A") { s.streak++; s.points += 10; msg = `+10 points. ${s.streak} day streak.`; }
        else { s.saved += ADD; msg = `£${ADD} moved. You’re ${Math.round((s.saved / GOAL) * 100)}% of the way there.`; }
      } else {
        s.log[s.day - 1] = "off";
        if (p === "A") { msg = s.streak ? `Streak lost. ${s.streak} days back to zero.` : "No check in today."; s.streak = 0; }
        else msg = `No problem. £${s.saved} is still saved.`;
      }
      ui.metric("points", s.points);
      ui.metric("saved", "£" + (s.saved - START));
      s.day++;
      if (s.day > DAYS) { end(ui, p); return; }
      ui.progress("Day " + s.day, s.day / DAYS);
      ui.screen(p === "A" ? viewA(ui, msg) : viewB(ui, msg));
    }
  });
})();
