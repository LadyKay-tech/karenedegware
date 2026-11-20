/* Explain why you need each step: Seun verifies her shop for payouts in a made-up business app */
(function () {
  "use strict";
  const { icon, top, btn, main, toast } = KEPhone;

  const STEPS = [
    { n: "Photo ID", kind: "cam", ask: "Scan your ID", tip: "Place your NIN slip, passport or driver’s licence inside the frame",
      why: "The law asks us to confirm who gets paid. We check it once. Buyers never see it.", mins: 4, cta: "Take photo" },
    { n: "Selfie", kind: "face", ask: "Take a selfie", tip: "Look straight at the camera, in good light",
      why: "So nobody can use a stolen ID to open a shop in your name.", mins: 3, cta: "Take selfie" },
    { n: "Address", kind: "doc", ask: "Proof of address", tip: "A utility bill or bank statement",
      why: "Banks need it before they’ll send payouts. Anything from the last 3 months works.", mins: 2, cta: "Upload" },
    { n: "Bank", kind: "bank", ask: "Your payout account", tip: "",
      why: "This is where your money lands. We only ever pay in. We can’t take money out.", mins: 1, cta: "Submit" }
  ];

  const seg = (i) => `<div class="ap-seg">${STEPS.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</div>`;

  function view(ui, p) {
    const s = ui.s;
    const x = STEPS[s.i];
    const B = p === "B";
    const cam = x.kind === "cam" || x.kind === "face";
    const meta = B ? `<span class="ap-pill" style="margin:8px 14px 0;align-self:flex-start">${icon("clock")}Step ${s.i + 1} of 4 · about ${x.mins} min left</span>` : "";
    const why = B
      ? `<div class="ap-why">${icon("lock")}<span><b>Why we ask</b>${x.why}</span></div>`
      : s.asked ? `<div class="ap-why cold">${icon("info")}<span>This information is required for verification purposes.</span></div>` : "";
    const extra = B ? btn("Save and finish later", "later", "ghost", cam ? 'style="color:#c9c3ff"' : "") : btn("Why do you need this?", "why", "ghost", cam ? 'style="color:#c9c3ff"' : "");

    if (cam) {
      return `<div class="scr cam">${top(x.ask)}${seg(s.i)}${meta}
        <p class="ap-camtxt">${x.tip}</p>
        <div class="ap-cam" style="margin-top:10px">${x.kind === "cam" ? '<span class="ap-frame"></span>' : '<span class="ap-oval"></span>'}</div>
        <div class="ap-foot" style="padding-top:10px;gap:8px">${why}<button type="button" class="ap-shutter" data-act="next" data-main aria-label="${x.cta}"></button>${extra}</div></div>`;
    }
    const body = x.kind === "doc"
      ? `<div class="ap-drop">${icon("doc")}<b style="color:#121217;font-weight:500">${x.tip}</b><span>PDF or photo, up to 10MB</span></div>
         <div class="ap-card" style="display:flex;gap:10px;align-items:center;padding:10px 12px;box-shadow:inset 0 0 0 1px #eeeef3">${icon("camera")}<span style="flex:1">Take a photo instead</span>${icon("chev")}</div>`
      : `<div class="ap-field"><span>Bank</span><div>Access Bank ${icon("chev")}</div></div>
         <div class="ap-field"><span>Account number</span><div><span style="white-space:nowrap">0123456789</span><em style="font-style:normal;font-size:10.5px;color:#13804b;display:flex;align-items:center;gap:3px;white-space:nowrap">${icon("check")}SEUN ADEYEMI</em></div></div>
         <div class="ap-field"><span>BVN</span><div>222 •••• •• 41</div></div>`;
    return `<div class="scr white">${top(x.ask)}${seg(s.i)}${meta}<div class="ap-body" style="padding-top:10px;gap:8px">${why}${body}</div>
      <div class="ap-foot">${main(x.cta, "next")}${extra}</div>${s.toast ? toast(s.toast) : ""}</div>`;
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
      Object.assign(ui.s, { i: 0, asked: 0, askedTotal: 0 });
      ui.metric("why", p === "A" ? "0 of 4" : "1 of 4");
      ui.metric("left", p === "A" ? "No" : "Yes");
      ui.screen(view(ui, p));
      ui.notes(p === "A" ? ["Asks for her ID with no reason", "No sense of how long this takes"] : ["One honest sentence on why", "How long is left, up front"]);
    },
    act(name, el, ui, p) {
      const s = ui.s;
      if (name === "why") {
        s.asked++; s.askedTotal++;
        ui.update(view(ui, p));
        ui.notes(["Asks for her ID with no reason", "No sense of how long this takes", "“Required for verification” isn’t an answer"]);
        return;
      }
      if (name === "later") {
        ui.screen(`<div class="scr white">${top("Verification", { back: false })}<div class="ap-body"><div class="ap-success"><span class="tick wait">${icon("clock")}</span><div class="ap-h">Saved for later</div><p class="ap-p">Pick up at step ${s.i + 1}. Your shop stays live; payouts start once this is done.</p></div></div></div>`);
        ui.notes(["She can stop without losing her place"]);
        ui.done({ why: 4, asked: 0, toast: "Seun can stop and come back. Nothing is lost, and she knows what’s left." });
        return;
      }
      s.i++;
      s.asked = 0;
      if (p === "B") ui.metric("why", `${Math.min(s.i + 1, 4)} of 4`);
      if (s.i < STEPS.length) {
        ui.screen(view(ui, p));
        if (s.i === 1) ui.notes(p === "A" ? ["Now it wants her face. Still no reason"] : ["Each step names the risk it protects her from", "A way out without losing progress"]);
        if (s.i === 3) ui.notes(p === "A" ? ["Bank details and BVN, with no word on how they’re used"] : ["The scariest step gets the plainest promise"]);
        return;
      }
      if (p === "A") {
        ui.screen(`<div class="scr white">${top("", { back: false })}<div class="ap-body"><div class="ap-success"><span class="tick wait">${icon("clock")}</span><div class="ap-h">Verification submitted</div><p class="ap-p">We’ll be in touch.</p></div></div></div>`);
        ui.notes(["No time frame, no next step", "She can’t tell if she can start selling"]);
        ui.done({ why: 0, asked: s.askedTotal, toast: "Four requests for personal documents, and not one reason. “We’ll be in touch” is all Seun got back." });
      } else {
        ui.screen(`<div class="scr white">${top("", { back: false })}<div class="ap-body"><div class="ap-success"><span class="tick">${icon("check")}</span><div class="ap-h">You’re all set</div><p class="ap-p">Most shops are approved within 2 hours. We’ll text you, and you can keep listing products meanwhile.</p><span class="ap-pill ok">${icon("clock")}Expected by 14:00 today</span></div></div></div>`);
        ui.notes(["A time to expect", "She knows she can keep selling"]);
        ui.done({ why: 4, asked: 0, toast: "Every step said why. Seun knew what she was handing over, and what happens next." });
      }
    }
  });
})();
