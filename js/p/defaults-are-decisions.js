/* Defaults are decisions you make for people: what's ticked when Ada orders a lamp */
(function () {
  "use strict";
  const { go, money } = KEProto.h;
  const ITEM = 48;
  const EXTRAS = [
    { k: "cover", n: "2 year protection plan", p: 6, a: true },
    { k: "wrap", n: "Gift wrap", p: 2, a: true },
    { k: "fast", n: "Next day delivery", p: 4.99, a: true },
    { k: "card", n: "Save my card for next time", p: 0, a: true },
    { k: "offers", n: "Email me offers", p: 0, a: true },
    { k: "receipt", n: "Email me a receipt", p: 0, a: true, b: true }
  ];

  const total = (s) => ITEM + EXTRAS.reduce((t, x) => t + (s.on[x.k] ? x.p : 0), 0);

  function view(ui) {
    const s = ui.s;
    const t = total(s);
    return `<div class="xprod"><span class="ximg ximg-lamp"></span><div><span class="sm">Arc table lamp</span><div class="xbig">${money(ITEM)}</div><span class="sm">Standard delivery, free</span></div></div>` +
      '<div class="xextras"><span class="sm">Your order</span>' +
      EXTRAS.map((x) => `<button type="button" class="xcb${s.on[x.k] ? " on" : ""}" data-act="tog" data-k="${x.k}"><i>${KEProto.h.tick}</i><span>${x.n}</span><em>${x.p ? money(x.p) : "Free"}</em></button>`).join("") +
      "</div>" + go("Place order, " + money(t), "order");
  }

  KEProto({
    names: { A: "Pre-ticked", B: "Honest defaults" },
    hints: {
      A: "Ada wants the lamp. Order it the way most people do",
      B: "Same lamp, same options. Order it again",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "total", label: "Order total", zero: money(ITEM) },
      { k: "extra", label: "Extras she didn’t choose", zero: money(0) }
    ],
    compare: {
      label: "Paid for without choosing",
      value: (r) => r.extra,
      text: (r) => (r.extra ? `${money(r.extra)} she never picked` : "Nothing")
    },
    start(p, ui) {
      ui.s.on = {};
      EXTRAS.forEach((x) => (ui.s.on[x.k] = p === "A" ? x.a : !!x.b));
      ui.s.def = Object.assign({}, ui.s.on);
      ui.metric("total", money(total(ui.s)));
      ui.metric("extra", money(total(ui.s) - ITEM));
      ui.screen(view(ui));
    },
    act(name, el, ui, p) {
      const s = ui.s;
      if (name === "tog") {
        s.on[el.dataset.k] = !s.on[el.dataset.k];
        ui.update(view(ui));
        ui.metric("total", money(total(s)));
        const left = EXTRAS.filter((x) => s.def[x.k] && s.on[x.k] && x.p);
        ui.metric("extra", money(left.reduce((t, x) => t + x.p, 0)));
        return;
      }
      const forced = EXTRAS.filter((x) => s.def[x.k] && s.on[x.k] && !x.b);
      const extra = forced.reduce((t, x) => t + x.p, 0);
      const t = total(s);
      ui.metric("total", money(t));
      ui.metric("extra", money(extra));
      ui.screen(`<div class="xdone"><span class="xok">${KEProto.h.tick}</span><h4>Order placed, ${money(t)}</h4><p class="sm">${forced.length ? "Also on the order: " + forced.map((x) => x.n.toLowerCase()).join(", ") + "." : "Just the lamp, and anything Ada chose herself."}</p></div>`);
      ui.done({
        extra, items: forced.length,
        toast: p === "A"
          ? (forced.length ? `${money(extra)} of extras, plus ${forced.filter((x) => !x.p).length} sign ups, that Ada never asked for.` : "You unticked the lot. Most people never read that far.")
          : `${money(t)}. Anything extra on there, Ada chose.`
      });
    }
  });
})();
