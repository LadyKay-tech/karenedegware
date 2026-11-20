/* Reward real progress, not empty points: five days with a savings app, two ways */
(function () {
  "use strict";
  const { icon, av, tabs, top, btn, main, row, banner, sheet, ring, toast } = KEPhone;
  const TABS = [["Home", "home"], ["Payments", "move"], ["Savings", "pot"], ["Cards", "card"], ["Me", "user"]];
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const BUSY = 3, GOAL = 900, START = 556.6, ADD = 20, ROUND = 3.4;
  const gbp = (n) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

  const week = (s) =>
    `<div class="ap-week">${DAYS.map((d, i) => {
      const st = s.log[i];
      const cls = [st, i === s.day && s.day < 5 ? "today" : ""].join(" ");
      return `<span class="${cls}"><i>${st === "on" ? icon("check") : st === "off" ? icon("close") : ""}</i>${d.slice(0, 1)}</span>`;
    }).join("")}</div>`;

  function viewA(ui) {
    const s = ui.s;
    const busy = s.day === BUSY;
    const lost = s.lost;
    return `<div class="scr">${top("Savings", { back: false, right: `<span class="ap-points">${icon("star")}${s.points}</span>` })}<div class="ap-body">
      <div class="ap-streak${lost ? " lost" : ""}">${icon("flame")}<div><b>${s.streak} day streak</b><span>${lost ? "Streak lost. Start again today" : "Check in every day to keep it alive"}</span></div></div>
      <div class="ap-card">${week(s)}</div>
      <div class="ap-card" style="display:flex;align-items:center;gap:10px">${icon("trophy")}<span class="t" style="flex:1"><b style="font-weight:500">Weekly leaderboard</b><br><span class="ap-p" style="font-size:11px">You’re #1,204 of 40,000</span></span>${icon("chev")}</div>
      <div class="ap-badges"><span class="${s.points >= 10 ? "got" : ""}">${icon("star")}</span><span class="${s.streak >= 3 ? "got" : ""}">${icon("flame")}</span><span>${icon("trophy")}</span><span>${icon("lock")}</span></div>
      <div class="ap-card" style="display:flex;justify-content:space-between;align-items:center"><span class="ap-p">Savings balance</span><b style="font-weight:500">${gbp(START)}</b></div>
      </div><div class="ap-foot" style="padding-bottom:10px">${busy ? btn("No time today", "skip", "sec", "data-main") : `<div class="ap-split">${main(`Check in for ${DAYS[s.day]}, +10`, "in")}${btn("Skip", "skip", "sec")}</div>`}</div>
      ${tabs("Savings", TABS)}
      ${busy ? banner("Orra", `Don’t lose your ${s.streak} day streak! Check in before midnight`, "g", "18:30") : ""}
      ${s.toast ? toast(s.toast) : ""}</div>`;
  }

  function viewB(ui) {
    const s = ui.s;
    const busy = s.day === BUSY;
    const saved = s.saved;
    const left = GOAL - saved;
    return `<div class="scr">${top("Rent", { right: `<span class="ap-pill ok">${icon("check")}On track</span>` })}<div class="ap-body" style="gap:9px">
      ${ring(saved / GOAL, gbp(saved), "of " + gbp(GOAL))}
      <p class="ap-p" style="text-align:center">Due 1 December · ${gbp(Math.max(0, left))} to go</p>
      <div class="ap-card">${week(s)}</div>
      <div class="ap-card" style="padding:4px 12px">
        ${row(`<span class="av av-a">${icon("round")}</span>`, "Round-ups", "Spare change from every card payment", '<span class="ap-toggle"></span>')}
        ${s.feed.length ? s.feed.slice(-1).map((f) => row(av("+", "c"), f.t, f.d, `<span class="ap-amt in">+${gbp(f.v)}</span>`)).join("") : row(av("+", "c"), "Nothing added yet this week", "", "")}
      </div>
      </div><div class="ap-foot" style="padding-bottom:10px">${busy ? btn("No time today", "skip", "sec", "data-main") : `<div class="ap-split">${main(`Add £${ADD} for ${DAYS[s.day]}`, "in")}${btn("Skip", "skip", "sec")}</div>`}</div>
      ${tabs("Savings", TABS)}
      ${busy ? banner("Orra", "Busy day? Round-ups still added £3.40 to Rent", "g", "18:30") : ""}
      ${s.toast ? toast(s.toast) : ""}</div>`;
  }

  const view = (ui, p) => (p === "A" ? viewA(ui) : viewB(ui));

  function end(ui, p) {
    const s = ui.s;
    if (p === "A") {
      ui.screen(`<div class="scr">${top("Savings", { back: false, right: `<span class="ap-points">${icon("star")}${s.points}</span>` })}<div class="ap-body"><div class="ap-success">
        <span class="tick wait">${icon("star")}</span><div class="ap-h">${s.points} points this week</div>
        <p class="ap-p">Streak: ${s.streak} ${s.streak === 1 ? "day" : "days"}<br>Added to savings: £0</p></div></div>${tabs("Savings", TABS)}</div>`);
      ui.notes(["Points for opening the app, not for saving", "A whole week, and the balance never moved"]);
      ui.done({ saved: 0, toast: `${s.points} points and a broken streak. Not a penny closer to rent.` });
      return;
    }
    const added = s.saved - START;
    ui.screen(`<div class="scr">${top("Rent", { right: '<span class="ap-pill ok">On track</span>' })}<div class="ap-body" style="justify-content:center">
      ${ring(s.saved / GOAL, gbp(s.saved), "of " + gbp(GOAL))}
      <div class="ap-success" style="margin:0"><div class="ap-h">${gbp(added)} added this week</div><p class="ap-p">Rent is ${Math.round((s.saved / GOAL) * 100)}% covered, 11 days early.</p></div></div>${tabs("Savings", TABS)}</div>`);
    ui.notes(["Progress measured in the thing she cares about", "The busy day still counted"]);
    ui.done({ saved: Math.round(added), toast: `${gbp(added)} closer to rent. Missing a day didn’t undo anything.` });
  }

  KEProto({
    names: { A: "Streaks and points", B: "Progress on a goal" },
    hints: {
      A: "Live a week with a savings app. Thursday gets busy",
      B: "Same week. This time the app counts money, not visits",
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
      Object.assign(ui.s, { day: 0, streak: 0, points: 0, saved: START, log: [], feed: [], lost: false });
      ui.screen(view(ui, p));
      ui.notes(p === "A" ? ["The reward is for showing up, not for saving"] : ["The goal and the due date lead the screen"]);
    },
    act(name, el, ui, p) {
      const s = ui.s;
      if (name === "in") {
        s.log[s.day] = "on";
        if (p === "A") { s.streak++; s.points += 10; s.lost = false; s.toast = `+10 points · ${s.streak} day streak`; }
        else { s.saved += ADD; s.feed.push({ t: "You added", d: DAYS[s.day], v: ADD }); s.toast = `£${ADD} added to Rent`; }
      } else {
        s.log[s.day] = "off";
        if (p === "A") { s.lost = s.streak > 0; s.toast = s.streak ? `Streak lost. ${s.streak} days gone` : ""; s.streak = 0; }
        else {
          if (s.day === BUSY) { s.saved += ROUND; s.feed.push({ t: "Round-ups", d: DAYS[s.day], v: ROUND }); }
          s.toast = s.day === BUSY ? "Round-ups covered today" : "No problem. Nothing lost";
        }
      }
      ui.metric("points", s.points);
      ui.metric("saved", "£" + Math.round(s.saved - START));
      s.day++;
      if (s.day >= DAYS.length) { s.toast = ""; end(ui, p); return; }
      ui.screen(view(ui, p));
      s.toast = "";
      if (s.day === BUSY) ui.notes(p === "A" ? ["The reward is for showing up, not for saving", "Now the app nags, because the streak is at risk"] : ["The goal and the due date lead the screen", "Automation covers the busy day"]);
      if (s.day === BUSY + 1 && p === "A") ui.notes(["One busy day wiped out the streak", "Her savings never moved"]);
    }
  });
})();
