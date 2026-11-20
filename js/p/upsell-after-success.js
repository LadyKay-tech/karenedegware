/* Upsell after success, not on a schedule: Ngozi pays 20 suppliers in a made-up business banking app */
(function () {
  "use strict";
  const { icon, av, tabs, top, btn, main, row, sheet, toast } = KEPhone;
  const TABS = [["Home", "home"], ["Transfers", "move"], ["Invoices", "doc"], ["Cards", "card"], ["More", "grid"]];
  const TOTAL = 20, BATCH = 5;
  const BANKS = ["GTBank", "Access", "Zenith", "First Bank", "UBA", "Kuda", "Opay", "Wema"];
  const NAMES = ["Ada Fabrics", "Bisi Prints", "Chuka Logistics", "Dami Packaging", "Eko Threads", "Funmi Beads", "Gbenga Wood", "Halima Dyes", "Ife Leather", "Jide Courier",
    "Kemi Labels", "Lola Studio", "Musa Metals", "Nkem Paper", "Obi Glass", "Peju Cotton", "Rafi Tools", "Sade Ribbons", "Tunde Boxes", "Uche Inks"];
  const TONES = ["a", "b", "c", "d", "e", "f"];
  const amt = (i) => 18500 + ((i * 7349) % 64000);
  const naira = (n) => "₦" + n.toLocaleString("en-GB");
  const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

  function view(ui, p) {
    const s = ui.s;
    const next = NAMES.slice(s.sent, s.sent + BATCH).map((n, k) => ({ n, i: s.sent + k }));
    const sum = next.reduce((t, x) => t + amt(x.i), 0);
    return `<div class="scr">${top("Friday payouts", { right: `<span class="ap-pill">${s.sent} of ${TOTAL} paid</span>` })}<div class="ap-body" style="gap:8px">
      ${p === "A" ? `<div class="ap-why" style="background:#ece9ff">${icon("spark")}<span><b>Try Business+ free for 30 days</b>Bulk transfers, invoices and team access.</span></div>` : ""}
      <div style="height:6px;border-radius:3px;background:#e6e6ee;overflow:hidden"><i style="display:block;height:100%;width:${(s.sent / TOTAL) * 100}%;background:#13804b;border-radius:3px;transition:width .5s"></i></div>
      <div class="ap-card" style="padding:2px 12px">${next.map((x) => row(av(initials(x.n), TONES[x.i % 6]), x.n, `${BANKS[x.i % BANKS.length]} ··${String(1000 + ((x.i * 373) % 9000)).slice(0, 4)}`, `<span class="ap-amt">${naira(amt(x.i))}</span>`)).join("")}</div>
      </div><div class="ap-foot" style="padding-bottom:10px">${s.promo || s.pin ? btn(`Pay these ${BATCH}, ${naira(sum)}`, "pay") : main(`Pay these ${BATCH}, ${naira(sum)}`, "pay")}</div>${tabs("Transfers", TABS)}
      ${s.pin ? sheet(`<b style="font-size:16px;text-align:center">Enter your PIN</b><div class="ap-pin"><i></i><i></i><i></i><i></i></div><p class="ap-p" style="text-align:center">Approving ${BATCH} transfers, ${naira(sum)}</p>`) : ""}
      ${s.promo ? sheet(`<div class="ap-promo"><span class="ap-pill brand" style="justify-self:start;background:rgba(255,255,255,.18);color:#fff">New</span><b>Upgrade to Business+</b><ul><li>Bulk transfers</li><li>Unlimited invoices</li><li>Team roles and approvals</li></ul><span style="font-size:12px;opacity:.8">₦15,000 a month after your free trial</span></div>${main("Start free trial", "dismiss", "brand")}${btn("Maybe later", "dismiss", "ghost")}`) : ""}
      ${s.toast ? toast(s.toast) : ""}</div>`;
  }

  function pay(ui, p) {
    const s = ui.s;
    s.pin = true;
    ui.update(view(ui, p));
    [1, 2, 3, 4].forEach((k) => ui.later(() => {
      const dot = document.querySelectorAll("#scr .ap-pin i")[k - 1];
      if (dot) dot.classList.add("on");
    }, 150 + k * 140));
    ui.later(() => {
      s.pin = false;
      s.sent += BATCH;
      ui.metric("sent", s.sent);
      if (s.sent >= TOTAL) { finish(ui, p); return; }
      s.toast = `${BATCH} transfers sent`;
      if (p === "A" && s.sent === 10) { s.promo = true; s.stops++; ui.metric("stops", s.stops); ui.notes(["The offer interrupts a job halfway through", "A generic pitch with nothing about her business"]); }
      ui.screen(view(ui, p));
      s.toast = "";
    }, 900);
  }

  function finish(ui, p) {
    const s = ui.s;
    const total = NAMES.reduce((t, _, i) => t + amt(i), 0);
    const done = `<div class="ap-success" style="margin:10px 0 0"><span class="tick">${icon("check")}</span><div class="ap-h">20 suppliers paid</div><p class="ap-p">${naira(total)} sent in 4 rounds</p></div>`;
    if (p === "A") {
      ui.screen(`<div class="scr">${top("Friday payouts", { back: false })}<div class="ap-body">${done}<p class="ap-p" style="text-align:center;margin-top:auto">Next Friday: 20 more, one batch at a time.</p></div>${tabs("Transfers", TABS)}</div>`);
      ui.done({ stops: s.stops, toast: "The offer turned up halfway through the job. It was just in the way." });
      return;
    }
    ui.screen(`<div class="scr">${top("Friday payouts", { back: false })}<div class="ap-body">${done}
      <div class="ap-suggest" style="margin-top:auto"><span class="h">${icon("sheet")}Pay all 20 in one go next Friday</span>
      <p class="ap-p">You’ve paid the same suppliers every Friday this month. Bulk transfers sends them all from one spreadsheet, with one PIN. About 15 minutes back each week.</p>
      ${main("Try it next Friday", "yes", "brand")}${btn("Not now", "later", "ghost")}</div></div>${tabs("Transfers", TABS)}</div>`);
    ui.notes(["Waits until the job is done", "Talks about her suppliers, her Friday, her time"]);
  }

  KEProto({
    names: { A: "On a schedule", B: "After it helps" },
    hints: {
      A: "Ngozi pays 20 suppliers every Friday. Pay them",
      B: "Same Friday, same 20 payments. Pay them again",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "sent", label: "Suppliers paid", zero: "0" },
      { k: "stops", label: "Interruptions", zero: "0" }
    ],
    compare: {
      label: "Times the offer got in the way",
      value: (r) => r.stops,
      text: (r) => (r.stops ? `${r.stops}, halfway through a task` : "None. It came after the job was done")
    },
    start(p, ui) {
      Object.assign(ui.s, { sent: 0, stops: 0, promo: false, pin: false });
      ui.screen(view(ui, p));
      ui.notes(p === "A" ? ["A banner pitches the upgrade before she’s done anything"] : ["Nothing between Ngozi and the job she came to do"]);
    },
    act(name, el, ui, p) {
      const s = ui.s;
      if (name === "dismiss") { s.promo = false; ui.update(view(ui, p)); return; }
      if (name === "pay") { if (s.pin || s.promo) return; pay(ui, p); return; }
      ui.screen(name === "yes"
        ? `<div class="scr">${top("Bulk transfers", { back: false })}<div class="ap-body"><div class="ap-success"><span class="tick">${icon("check")}</span><div class="ap-h">Ready for next Friday</div><p class="ap-p">We’ve saved this week’s 20 suppliers as a list. Next Friday it’s one review and one PIN.</p></div></div>${tabs("Transfers", TABS)}</div>`
        : `<div class="scr">${top("Friday payouts", { back: false })}<div class="ap-body"><div class="ap-success"><div class="ap-h">No problem</div><p class="ap-p">We’ll only mention it again if Friday keeps growing.</p></div></div>${tabs("Transfers", TABS)}</div>`);
      ui.done({ stops: 0, toast: "The offer came with proof. Ngozi had just felt the problem it solves." });
    }
  });
})();
