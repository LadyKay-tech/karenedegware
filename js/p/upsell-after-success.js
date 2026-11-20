/* Upsell after success, not on a schedule: paying twenty suppliers */
(function () {
  "use strict";
  const { go, ghost, btns } = KEProto.h;
  const TOTAL = 20, BATCH = 5;
  const NAMES = ["Ada Fabrics", "Bisi Prints", "Chuka Logistics", "Dami Packaging", "Eko Threads", "Funmi Beads", "Gbenga Wood", "Halima Dyes", "Ife Leather", "Jide Courier",
    "Kemi Labels", "Lola Studio", "Musa Metals", "Nkem Paper", "Obi Glass", "Peju Cotton", "Rafi Tools", "Sade Ribbons", "Tunde Boxes", "Uche Inks"];

  function view(ui) {
    const s = ui.s;
    const next = NAMES.slice(s.sent, s.sent + BATCH);
    return `<div class="xpay"><div><span class="sm">Friday supplier run</span><div class="xbig">${s.sent} <em>of ${TOTAL} paid</em></div></div></div>` +
      `<div class="xmeter"><i style="width:${(s.sent / TOTAL) * 100}%"></i></div>` +
      `<div class="xlist">${next.map((n, i) => `<div class="xrow"><span>${n}</span><span>£${(120 + ((s.sent + i) * 37) % 300).toFixed(2)}</span></div>`).join("")}</div>` +
      go(`Pay these ${BATCH}`, "pay") +
      (s.modal ? `<div class="xmodal"><div class="xmodalc"><span class="xpill">New</span><h4>Go Business!</h4><p class="sm">Bulk payouts, invoices, team access and more. £12 a month.</p>${btns(go("Upgrade now", "dismiss"), ghost("Not now", "dismiss"))}</div></div>` : "");
  }

  KEProto({
    names: { A: "On a schedule", B: "After it helps" },
    hints: {
      A: "Ngozi pays 20 suppliers every Friday. Pay them",
      B: "Same Friday, same 20 payments. Pay them again",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "sent", label: "Payments sent", zero: "0" },
      { k: "stops", label: "Interruptions", zero: "0" }
    ],
    compare: {
      label: "Times the offer got in the way",
      value: (r) => r.stops,
      text: (r) => (r.stops ? `${r.stops}, halfway through a task` : "None. It came after the job was done")
    },
    start(p, ui) {
      Object.assign(ui.s, { sent: 0, stops: 0, modal: false });
      ui.progress(null);
      ui.screen(view(ui));
    },
    act(name, el, ui, p) {
      const s = ui.s;
      if (name === "dismiss") { s.modal = false; ui.update(view(ui)); return; }
      if (name === "pay") {
        if (s.modal) return;
        s.sent += BATCH;
        ui.metric("sent", s.sent);
        if (p === "A" && s.sent === 10) { s.modal = true; s.stops++; ui.metric("stops", s.stops); }
        if (s.sent < TOTAL) { ui.update(view(ui)); return; }
        if (p === "A") {
          ui.screen(`<div class="xdone"><span class="xok">${KEProto.h.tick}</span><h4>20 payments sent</h4><p class="sm">Four rounds of clicking. Next Friday, the same again.</p></div>`);
          ui.done({ stops: s.stops, toast: "The offer turned up halfway through the job. It was just in the way." });
          return;
        }
        ui.screen(`<div class="xdone"><span class="xok">${KEProto.h.tick}</span><h4>20 payments sent</h4></div>` +
          '<div class="xsug"><b>You pay about 20 suppliers every Friday</b><p class="sm">Bulk payouts would send them all at once from one spreadsheet. About 15 minutes back each week.</p>' +
          btns(go("Try it next Friday", "yes"), ghost("Maybe later", "later")) + "</div>");
        return;
      }
      ui.screen(name === "yes"
        ? `<div class="xdone"><span class="xok">${KEProto.h.tick}</span><h4>Bulk payouts on trial</h4><p class="sm">Ready for next Friday. Ngozi can upload her supplier list whenever.</p></div>`
        : '<div class="xdone"><h4>No problem</h4><p class="sm">We’ll mention it again only if her Friday runs keep growing.</p></div>');
      ui.done({ stops: 0, toast: "The offer came with proof. Ngozi had just felt the problem it solves." });
    }
  });
})();
