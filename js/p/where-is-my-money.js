/* Tell people exactly where their money is: Kemi sends £250 to her mum */
(function () {
  "use strict";
  const { go, ghost, field, btns, tick } = KEProto.h;

  const send = () =>
    '<h4>Send money</h4>' + field("To", "Mum, Barclays ending 2291") + field("Amount", "£250.00") + go("Send £250", "send");

  const LINES = ["Still processing.", "Still processing. Please check back later.", "Processing can take up to 3 working days."];

  function waitA(ui) {
    const n = ui.s.checks;
    return '<div class="xstat"><span class="xspin"></span><div><h4>Payment processing</h4>' +
      `<p class="sm">${n ? LINES[Math.min(n - 1, LINES.length - 1)] : "Your payment is being processed."}</p></div></div>` +
      (n >= 2 ? '<p class="xmsg">Mum has just texted: “Has it gone yet?”</p>' : "") +
      btns(go("Check status", "check"));
  }

  const STEPS = [
    { t: "09:12", n: "Sent from your account" },
    { t: "09:13", n: "Received by Barclays" },
    { t: "by 09:40", n: "In Mum’s account", note: "Usually under 30 minutes" }
  ];

  function timeline(ui, upto, landed) {
    return '<h4>£250 to Mum</h4><div class="xtl">' +
      STEPS.map((x, i) => {
        const done = i < upto || (i === 2 && landed);
        const now = i === upto && !landed;
        const t = i === 2 && landed ? "09:31" : x.t;
        const n = i === 2 && landed ? "Arrived in Mum’s account" : x.n;
        return `<div class="xtli${done ? " done" : ""}${now ? " now" : ""}"><i>${done ? tick : ""}</i><span>${n}${now && x.note ? `<small>${x.note}</small>` : ""}</span><em>${t}</em></div>`;
      }).join("") +
      "</div>" +
      (landed ? "" : '<p class="xmsg">If it hasn’t arrived by 10:00, we’ll tell you, and refund it automatically.</p>') +
      btns(landed ? go("Done", "close") : go("Share receipt with Mum", "share"), landed ? "" : ghost("Check status", "check"));
  }

  KEProto({
    names: { A: "Just “processing”", B: "A clear timeline" },
    hints: {
      A: "Send the money, then see how sure you feel",
      B: "Same payment. Send it again",
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
      Object.assign(ui.s, { checks: 0, stage: "send" });
      ui.screen(send());
    },
    act(name, el, ui, p) {
      const s = ui.s;
      if (name === "send") {
        s.stage = "wait";
        if (p === "A") { ui.metric("eta", "No"); ui.screen(waitA(ui)); return; }
        ui.screen(timeline(ui, 0, false));
        ui.later(() => ui.update(timeline(ui, 1, false)), 700);
        ui.later(() => { ui.update(timeline(ui, 2, false)); ui.metric("eta", "Yes, by 09:40"); }, 1400);
        return;
      }
      if (name === "check") {
        s.checks++;
        ui.metric("checks", s.checks);
        if (p === "A") {
          if (s.checks < 4) { ui.update(waitA(ui)); return; }
          ui.screen('<div class="xdone"><h4>Completed</h4><p class="sm">No time, no detail. Kemi still has to ask Mum whether it arrived.</p></div>');
          ui.done({ checks: s.checks, eta: false, toast: `Kemi checked ${s.checks} times. “Processing” never told her anything.` });
          return;
        }
        el.classList.add("xshake");
        return;
      }
      if (name === "share") {
        ui.update(timeline(ui, 2, false).replace("Share receipt with Mum", "Receipt sent to Mum"));
        ui.later(() => ui.update(timeline(ui, 3, true)), 900);
        return;
      }
      ui.done({ checks: s.checks, eta: true, toast: s.checks ? `Kemi knew it would land by 09:40, and still checked ${s.checks} ${s.checks === 1 ? "time" : "times"}.` : "Kemi knew it would land by 09:40. She never needed to check." });
    }
  });
})();
