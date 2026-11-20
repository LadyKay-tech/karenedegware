/* Show the full price before the last step: the same £54.49, revealed late or shown from the start */
(function () {
  "use strict";
  const { go, ghost, row, field, money, btns } = KEProto.h;
  const ITEM = 48, DELIVERY = 3.99, FEE = 2.5, TOTAL = ITEM + DELIVERY + FEE;

  const product = (sub) =>
    `<div class="xprod"><span class="ximg ximg-shoe"></span><div><span class="sm">Runner One trainers</span><div class="xbig">${money(ITEM)}</div>${sub}</div></div>` +
    `<div class="xchips"><span>UK 5</span><span class="on">UK 6</span><span>UK 7</span></div>`;

  const A = [
    () => product('<span class="sm">Free returns</span>') + go("Add to basket", "next"),
    () => "<h4>Your basket</h4>" + row("Runner One, UK 6", money(ITEM)) + row("Subtotal", money(ITEM), "tot") +
      '<p class="sm">Delivery and fees are worked out at checkout</p>' + go("Checkout", "next"),
    () => "<h4>Delivery</h4>" + field("Address", "22 Marlowe Road, London") +
      '<div class="xopt on"><b>Standard delivery</b><span>3 to 5 days</span></div>' + go("Continue to payment", "next"),
    () => "<h4>Payment</h4>" + field("Card", "Visa ending 4417") + go("Review order", "next"),
    () => "<h4>Review and pay</h4>" + row("Runner One, UK 6", money(ITEM)) +
      row("Delivery", money(DELIVERY), "new") + row("Service fee", money(FEE), "new") + row("Total", money(TOTAL), "tot") +
      btns(go("Pay " + money(TOTAL), "pay"), ghost("Leave basket", "leave"))
  ];
  const B = [
    () => product(`<span class="sm">${money(TOTAL)} delivered, including ${money(DELIVERY)} delivery and a ${money(FEE)} service fee</span>`) + go("Add to basket", "next"),
    () => "<h4>Your basket</h4>" + row("Runner One, UK 6", money(ITEM)) + row("Delivery", money(DELIVERY)) +
      row("Service fee", money(FEE)) + row("Total", money(TOTAL), "tot") + go("Checkout", "next"),
    () => "<h4>Delivery</h4>" + field("Address", "22 Marlowe Road, London") +
      `<div class="xopt on"><b>Standard delivery</b><span>3 to 5 days, ${money(DELIVERY)}</span></div>` + go("Continue to payment", "next"),
    () => "<h4>Payment</h4>" + field("Card", "Visa ending 4417") + row("Total", money(TOTAL), "tot") + go("Pay " + money(TOTAL), "pay")
  ];
  const PATHS = { A, B };

  function show(ui, p) {
    const list = PATHS[p];
    ui.screen(list[ui.s.i]());
    ui.progress(`Step ${ui.s.i + 1} of ${list.length}`, (ui.s.i + 1) / list.length);
    if (ui.s.i === list.length - 1) ui.metric("paid", money(TOTAL));
  }

  KEProto({
    names: { A: "Fees at the end", B: "Total from the start" },
    hints: {
      A: "Buy the trainers. Watch the price you were shown",
      B: "Same shop, same trainers, same total. Buy them again",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "seen", label: "First price shown", zero: money(0) },
      { k: "paid", label: "Price at payment", zero: money(0) }
    ],
    compare: {
      label: "Surprise at payment",
      value: (r) => r.surprise,
      text: (r) => (r.surprise ? `${money(r.surprise)} more than first shown` : "None")
    },
    start(p, ui) {
      ui.s.i = 0;
      ui.metric("seen", money(p === "A" ? ITEM : TOTAL));
      show(ui, p);
    },
    act(name, el, ui, p) {
      if (name === "next") { ui.s.i++; show(ui, p); return; }
      const surprise = p === "A" ? TOTAL - ITEM : 0;
      ui.progress(null);
      if (name === "leave") {
        ui.screen('<div class="xdone"><h4>Basket abandoned</h4><p class="sm">Tolu got all the way to the last screen, then left.</p></div>');
        ui.done({ surprise, toast: `Tolu left on the last screen. ${money(surprise)} she didn’t see coming.` });
        return;
      }
      ui.screen(`<div class="xdone"><span class="xok">${KEProto.h.tick}</span><h4>Order placed</h4><p class="sm">${money(TOTAL)} paid. ${p === "A" ? `Tolu was expecting ${money(ITEM)}.` : "Exactly what Tolu expected."}</p></div>`);
      ui.done({
        surprise,
        toast: p === "A" ? `Tolu paid ${money(surprise)} more than the price she started with.` : `Same ${money(TOTAL)}. Tolu knew it from the first screen.`
      });
    }
  });
})();
