/* Tell people exactly where their money is: Kemi sends £250 to her mum in a made-up banking app */
(function () {
  "use strict";
  const { icon, av, tabs, top, btn, main, row, banner, sheet, toast } = KEPhone;
  const TABS = [["Home", "home"], ["Payments", "move"], ["Savings", "pot"], ["Cards", "card"], ["Me", "user"]];
  const BAL = "£1,482.60";

  const home = () =>
    `<div class="scr dark"><div class="ap-hero">
      <div class="ap-head"><span class="av av-w">KA</span><span class="ap-search">${icon("search")}Search</span><span class="ap-circ">${icon("chart")}</span><span class="ap-circ">${icon("card")}</span></div>
      <div class="ap-bal"><small>Personal · GBP</small><b>£1,482<sup>.60</sup></b></div>
      <div class="ap-acts">
        <button type="button" class="ap-act" data-act="noop"><i>${icon("plus")}</i>Add money</button>
        <button type="button" class="ap-act" data-act="go" data-main><i>${icon("send")}</i>Send</button>
        <button type="button" class="ap-act" data-act="noop"><i>${icon("move")}</i>Move</button>
        <button type="button" class="ap-act" data-act="noop"><i>${icon("more")}</i>More</button>
      </div></div>
      <div class="ap-body"><div class="ap-card"><span class="ap-lbl">Today</span>
        ${row(av("T", "c"), "Tesco Express", "08:41 · Groceries", '<span class="ap-amt">-£23.40</span>')}
        ${row(av("L", "e"), "London Transport", "08:02 · Travel", '<span class="ap-amt">-£6.80</span>')}
        ${row(av("B", "a"), "Brightline Ltd", "Yesterday · Salary", '<span class="ap-amt in">+£2,350.00</span>')}
      </div>
      <div class="ap-card" style="display:flex;align-items:center;gap:10px">${av(icon("pot"), "f")}<span style="flex:1"><b style="font-weight:500;display:block">Pots</b><span class="ap-p" style="font-size:11px">Rent, Holiday, Rainy day</span></span><b style="font-weight:500">£2,140.00</b></div>
      </div>${tabs("Home", TABS)}</div>`;

  const people = () =>
    `<div class="scr white">${top("Send money", { right: icon("users") })}<div class="ap-body">
      <div class="ap-field"><div style="justify-content:flex-start;gap:8px;color:#9a9aab">${icon("search")}Name, account or phone</div></div>
      <span class="ap-lbl">People you’ve paid</span>
      <div class="ap-card" style="padding:4px 12px;box-shadow:inset 0 0 0 1px #eeeef3">
        ${`<button type="button" class="ap-row" data-act="pick" data-main>${av("M", "b")}<span class="t"><b>Mum</b><span>Barclays ··2291</span></span>${icon("chev")}</button>`}
        ${row(av("TB", "c"), "Tolu Bello", "Monzo ··8812", icon("chev"))}
        ${row(av("FA", "e"), "Femi Ade", "Lloyds ··0193", icon("chev"))}
        ${row(av("AO", "d"), "Ada Okafor", "Starling ··5520", icon("chev"))}
      </div></div></div>`;

  function amount(ui, p) {
    const v = ui.s.amt;
    const shown = v ? "£" + Number(v).toLocaleString("en-GB") : "£0";
    const note = p === "B" && v ? '<span class="ap-amtnote ok">No fee · Arrives in about 30 minutes</span>' : `<span class="ap-amtnote">Balance ${BAL}</span>`;
    return `<div class="scr">${top("Send to Mum")}<div class="ap-body" style="gap:8px">
      <span class="ap-to">${av("M", "b")}Mum · Barclays ··2291</span>
      <div class="ap-amtbig${v ? "" : " zero"}">${shown}</div>${note}
      <div class="ap-chips">${[50, 100, 250, 500].map((n) => `<button type="button" data-act="amt" data-v="${n}" class="${+v === n ? "on" : ""}" ${!v && n === 250 ? "data-main" : ""}>£${n}</button>`).join("")}</div>
      <div class="ap-keys">${["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k) => k ? `<button type="button" class="ap-key" data-act="key" data-k="${k}">${k === "del" ? "⌫" : k}</button>` : "<span></span>").join("")}</div>
      </div><div class="ap-foot" style="padding-top:4px">${btn("Continue", "review", "pri", v ? "data-main" : "disabled")}</div></div>`;
  }

  const review = (ui, p) =>
    amount(ui, p).replace(/ data-main/g, "").replace(/<\/div>$/, "") +
    sheet(`<b style="font-size:16px">Check and send</b>
      <div><div class="ap-kv"><span>To</span><b>Mum</b></div><div class="ap-kv"><span>Bank</span><b>Barclays ··2291</b></div>
      <div class="ap-kv"><span>Amount</span><b>£${Number(ui.s.amt).toLocaleString("en-GB")}.00</b></div><div class="ap-kv"><span>Fee</span><b>No fee</b></div>
      ${p === "B" ? '<div class="ap-kv ok"><span>Arrives</span><b>By 09:40 today</b></div>' : '<div class="ap-kv muted"><span>Arrives</span><b>Processing times vary</b></div>'}</div>
      ${main("Send £" + Number(ui.s.amt).toLocaleString("en-GB"), "send")}`) + "</div>";

  const LINES = ["Your payment is being processed.", "Still processing. Please check back later.", "Processing can take up to 3 working days."];
  function waitA(ui) {
    const n = ui.s.checks;
    return `<div class="scr white">${top("", { back: false, right: icon("close") })}<div class="ap-body">
      <div class="ap-success"><span class="ap-spin"></span><div class="ap-h">Processing</div><p class="ap-p">${LINES[Math.min(n, LINES.length - 1)]}</p>
      ${n ? `<span class="ap-pill">Last checked just now</span>` : ""}</div></div>
      <div class="ap-foot">${main("Check status", "check")}${btn("Back to home", "noop", "sec")}</div>
      ${n >= 2 ? banner("Mum", "Has it gone yet? The plumber is waiting", "b") : ""}</div>`;
  }

  const STEPS = [
    ["You set up the transfer", "09:12"],
    ["We took £250 from your account", "09:12"],
    ["Sent to Barclays", "09:13"],
    ["In Mum’s account", "by 09:40"]
  ];
  function track(ui) {
    const s = ui.s;
    const landed = s.landed;
    return `<div class="scr white">${top("", { back: false, right: icon("close") })}<div class="ap-body">
      <span class="ap-lbl">£250.00 to Mum</span>
      <div class="ap-big">${landed ? 'Arrived at <span class="ok">09:31</span>' : 'Arrives by <span class="ok">09:40</span>'}</div>
      <p class="ap-p">${landed ? "Nine minutes earlier than we said." : "Usually under 30 minutes."}</p>
      <div class="ap-track" style="margin-top:4px">${STEPS.map(([n, t], i) => {
        const done = i < s.upto || (i === 3 && landed);
        const now = i === s.upto && !landed;
        return `<div class="ap-step${done ? " done" : ""}${now ? " now" : ""}"><i>${done ? icon("check") : ""}</i><span>${i === 3 && landed ? "Arrived in Mum’s account" : n}</span><em>${i === 3 && landed ? "09:31" : t}</em></div>`;
      }).join("")}</div>
      ${landed ? "" : `<div class="ap-why">${icon("shield")}<span><b>Covered if it’s late</b>If it hasn’t arrived by 10:00, we’ll refund you automatically and tell you why.</span></div>`}
      </div><div class="ap-foot">${landed ? main("Done", "close") : main(s.shared ? "Receipt sent" : "Share receipt with Mum", "share") + btn("Check status", "check", "sec")}</div>
      ${s.shared && landed ? banner("Mum", "Got it, thank you! It’s showing in my account", "b") : ""}
      ${s.toast ? toast(s.toast) : ""}</div>`;
  }

  KEProto({
    names: { A: "Just “processing”", B: "A clear timeline" },
    hints: {
      A: "Tap Send, pay Mum £250, and see how sure you feel",
      B: "Same app, same £250. Send it again",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "checks", label: "Times she checked", zero: "0" },
      { k: "eta", label: "Knows when it lands", zero: "Not yet" }
    ],
    compare: {
      label: "Times Kemi checked",
      value: (r) => r.checks,
      text: (r) => `${r.checks} ${r.checks === 1 ? "check" : "checks"}${r.eta ? ", knew the time" : ", no idea when"}`
    },
    start(p, ui) {
      Object.assign(ui.s, { checks: 0, amt: "", upto: 0, landed: false, shared: false });
      ui.screen(home());
      ui.notes(p === "A" ? ["Watch what Kemi knows once she taps Send"] : ["Same app. Watch what changes after she taps Send"]);
    },
    act(name, el, ui, p) {
      const s = ui.s;
      if (name === "noop") return;
      if (name === "go") { ui.screen(people()); return; }
      if (name === "pick") { ui.screen(amount(ui, p)); return; }
      if (name === "amt") { s.amt = el.dataset.v; ui.update(amount(ui, p)); return; }
      if (name === "key") {
        const k = el.dataset.k;
        s.amt = k === "del" ? s.amt.slice(0, -1) : (s.amt + k).replace(/^0+/, "").slice(0, 5);
        ui.update(amount(ui, p));
        return;
      }
      if (name === "review") {
        ui.update(review(ui, p));
        ui.notes(p === "A" ? ["The one thing Kemi wants to know is when it lands. It isn’t here."] : ["The arrival time is promised before she pays"]);
        return;
      }
      if (name === "send") {
        if (p === "A") {
          ui.metric("eta", "No");
          ui.screen(waitA(ui));
          ui.notes(["“Processing” is a state, not an answer", "No time to expect, so she keeps checking"]);
          return;
        }
        ui.screen(track(ui));
        ui.notes(["An arrival time, not just a status", "Every step is a fact she can pass on to Mum", "A promise for when things go wrong"]);
        [1, 2, 3].forEach((n) => ui.later(() => { s.upto = n; ui.update(track(ui)); if (n === 3) ui.metric("eta", "Yes, by 09:40"); }, n * 650));
        return;
      }
      if (name === "check") {
        s.checks++;
        ui.metric("checks", s.checks);
        if (p === "A") {
          if (s.checks < 4) {
            ui.update(waitA(ui));
            if (s.checks === 2) ui.notes(["“Processing” is a state, not an answer", "No time to expect, so she keeps checking", "Now Mum is asking, and Kemi has nothing to tell her"]);
            return;
          }
          ui.screen(`<div class="scr white">${top("", { back: false })}<div class="ap-body"><div class="ap-success"><span class="tick">${icon("check")}</span><div class="ap-h">Completed</div><p class="ap-p">£250.00 to Mum</p></div></div></div>`);
          ui.notes(["No time, no detail. Kemi still has to ask Mum if it arrived"]);
          ui.done({ checks: s.checks, eta: false, toast: `Kemi checked ${s.checks} times. “Processing” never told her anything.` });
          return;
        }
        s.toast = "Still on track for 09:40";
        ui.update(track(ui));
        s.toast = "";
        return;
      }
      if (name === "share") {
        if (s.shared) return;
        s.shared = true;
        s.toast = "Receipt sent to Mum";
        ui.update(track(ui));
        s.toast = "";
        ui.later(() => { s.upto = 4; s.landed = true; ui.update(track(ui)); }, 1300);
        return;
      }
      if (name === "close") {
        ui.done({ checks: s.checks, eta: true, toast: s.checks ? `Kemi knew it would land by 09:40, and still checked ${s.checks} ${s.checks === 1 ? "time" : "times"}.` : "Kemi knew it would land by 09:40. She never needed to check." });
      }
    }
  });
})();
