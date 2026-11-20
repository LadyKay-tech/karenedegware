/* Explain why you need each step: Seun sets up payouts for her shop */
(function () {
  "use strict";
  const { go, link, btns, tick } = KEProto.h;

  const STEPS = [
    { n: "Photo ID", ask: "Upload a photo of your passport or driving licence", why: "The law asks us to confirm who gets paid. We check it once. Buyers never see it.", mins: 4, art: "id" },
    { n: "Selfie", ask: "Take a quick selfie", why: "So nobody can use a stolen ID to open a shop in your name.", mins: 3, art: "face" },
    { n: "Proof of address", ask: "Upload a bill or bank statement", why: "Banks need it before they’ll send payouts. Anything from the last 3 months works.", mins: 2, art: "doc" },
    { n: "Bank details", ask: "Add the account you want paid into", why: "This is where your money lands. We only ever pay in. We can’t take money out.", mins: 1, art: "bank" }
  ];

  function view(ui, p) {
    const s = ui.s;
    const x = STEPS[s.i];
    const list = STEPS.map((y, i) => `<span class="${i < s.i ? "done" : i === s.i ? "now" : ""}">${i < s.i ? tick : ""}${y.n}</span>`).join("");
    if (p === "A") {
      return `<div class="xkyc">${list}</div><h4>${x.ask}</h4><div class="xdrop xdrop-${x.art}"><span></span></div>` +
        (s.asked ? '<p class="xmsg xmsg-cold">This is required for verification purposes.</p>' : "") +
        btns(go("Upload", "next")) + link("Why do you need this?", "why");
    }
    return `<div class="xkyc">${list}</div><span class="xday">Step ${s.i + 1} of 4, about ${x.mins} ${x.mins === 1 ? "minute" : "minutes"} left</span>` +
      `<h4>${x.ask}</h4><div class="xdrop xdrop-${x.art}"><span></span></div>` +
      `<div class="xwhy"><b>Why we ask</b><span>${x.why}</span></div>` +
      btns(go("Upload", "next")) + link("Save and finish later", "later");
  }

  KEProto({
    names: { A: "Just asks", B: "Explains why" },
    hints: {
      A: "Seun wants to get paid for her first sale. Verify her shop",
      B: "Same four steps. Do them again",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "why", label: "Steps explained", zero: "0 of 4" },
      { k: "left", label: "Time left shown", zero: "No" }
    ],
    compare: {
      label: "Steps with a reason",
      value: (r) => r.why,
      text: (r) => `${r.why} of 4${r.asked ? `, asked why ${r.asked} ${r.asked === 1 ? "time" : "times"}` : ""}`
    },
    start(p, ui) {
      Object.assign(ui.s, { i: 0, asked: 0 });
      ui.metric("why", p === "A" ? "0 of 4" : "1 of 4");
      ui.metric("left", p === "A" ? "No" : "Yes");
      ui.screen(view(ui, p));
    },
    act(name, el, ui, p) {
      const s = ui.s;
      if (name === "why") { s.asked++; s.askedTotal = (s.askedTotal || 0) + 1; ui.update(view(ui, p)); return; }
      if (name === "later") {
        ui.screen('<div class="xdone"><h4>Saved</h4><p class="sm">Pick up where you left off. Your shop stays live; payouts start once this is done.</p></div>');
        ui.done({ why: 4, asked: 0, toast: "Seun can stop and come back. Nothing is lost, and she knows what’s left." });
        return;
      }
      s.i++;
      if (p === "B") ui.metric("why", `${Math.min(s.i + 1, 4)} of 4`);
      s.asked = 0;
      if (s.i < STEPS.length) { ui.screen(view(ui, p)); return; }
      if (p === "A") {
        ui.screen('<div class="xdone"><h4>Verification submitted</h4><p class="sm">We’ll be in touch.</p></div>');
        ui.done({ why: 0, asked: s.askedTotal || 0, toast: "Four requests for personal documents, and not one reason. “We’ll be in touch” is all Seun got back." });
      } else {
        ui.screen(`<div class="xdone"><span class="xok">${tick}</span><h4>All done</h4><p class="sm">Most shops are approved within 2 hours. We’ll email Seun, and she can keep listing products meanwhile.</p></div>`);
        ui.done({ why: 4, asked: 0, toast: "Every step said why. Seun knew what she was handing over, and what happens next." });
      }
    }
  });
})();
