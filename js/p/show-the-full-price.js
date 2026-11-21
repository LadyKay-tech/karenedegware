/* Show the full price before the last step: Tolu buys trainers in a made-up shopping app, two ways */
(function () {
  "use strict";
  const { icon, btn, main, shoe } = KEPhone;
  const ITEM = 48, DELIVERY = 3.99, FEE = 2.5, TOTAL = ITEM + DELIVERY + FEE;
  const money = (n) => "£" + n.toFixed(2);
  const SIZES = ["4", "5", "6", "7", "8", "9"];

  const stepper = (n) => `<div class="sh-steps">${["Bag", "Delivery", "Payment"].map((x, i) => `<span class="${i < n ? "done" : i === n ? "now" : ""}">${x}</span>`).join("<i></i>")}</div>`;
  const line = (a, b, cls = "") => `<div class="ap-kv ${cls}"><span>${a}</span><b>${b}</b></div>`;
  const thumb = () => `<span class="sh-thumb">${shoe()}</span>`;
  const top2 = (t, sub = "") => `<div class="ap-top"><span class="ap-ib">${icon("back")}</span><b>${t}</b><span class="ap-tr">${sub}</span></div>`;

  function product(p) {
    return `<div class="scr white shop"><div class="sh-hero">
        <div class="sh-icons"><span class="ap-ib">${icon("back")}</span><span style="flex:1"></span><span class="ap-ib">${icon("heart")}</span><span class="ap-ib">${icon("bag")}</span></div>
        ${shoe()}<div class="sh-dots"><i class="on"></i><i></i><i></i><i></i></div></div>
      <div class="ap-body" style="gap:9px;padding-top:12px">
        <div class="sh-titlerow"><div><span class="sh-brand">Stride</span><div class="sh-name">Runner One</div></div><div class="sh-price">${money(ITEM)}</div></div>
        ${p === "B" ? `<div class="sh-full">${icon("truck")}<span><b>${money(TOTAL)} delivered</b>, including ${money(DELIVERY)} delivery and a ${money(FEE)} service fee</span></div>` : `<div class="sh-rate">★★★★★ <span>4.7 · 212 reviews</span></div>`}
        <div class="sh-sw"><span class="sh-lbl">Colour: Coral</span><div><i class="on" style="background:#e48a76"></i><i style="background:#1e1e22"></i><i style="background:#d9d4ca"></i></div></div>
        <div><span class="sh-lbl">Size (UK)</span><div class="sh-sizes">${SIZES.map((x) => `<span class="${x === "6" ? "on" : ""}${x === "9" ? " out" : ""}">${x}</span>`).join("")}</div></div>
        <div class="sh-acc"><span>Details and fit</span>${icon("down")}</div><div class="sh-acc"><span>Free returns within 30 days</span>${icon("down")}</div>
      </div>
      <div class="ap-foot">${main("Add to bag", "next")}</div></div>`;
  }

  function bag(p) {
    return `<div class="scr shop">${top2("Bag", "1 item")}<div class="ap-body">
      <div class="ap-card sh-item">${thumb()}<div class="t"><b>Runner One</b><span>Coral · UK 6</span><div class="sh-qty"><span>−</span>1<span>+</span></div></div><b class="ap-amt">${money(ITEM)}</b></div>
      <div class="ap-card" style="display:flex;align-items:center;gap:10px;padding:11px 12px">${icon("tag")}<span style="flex:1;color:#6e6e80">Add a promo code</span>${icon("chev")}</div>
      <div class="ap-card">${p === "A"
        ? line("Subtotal", money(ITEM)) + '<p class="ap-p" style="font-size:11px;padding:2px 0 4px">Delivery and fees are worked out at checkout</p>'
        : line("Subtotal", money(ITEM)) + line("Delivery", money(DELIVERY)) + line("Service fee", money(FEE)) + `<div class="ap-kv sh-tot"><span>Total</span><b>${money(TOTAL)}</b></div>`}</div>
      </div><div class="ap-foot">${main(`Checkout · ${money(p === "A" ? ITEM : TOTAL)}`, "next")}</div></div>`;
  }

  function delivery(p) {
    return `<div class="scr shop">${top2("Checkout")}${stepper(1)}<div class="ap-body">
      <span class="sh-lbl">Deliver to</span>
      <div class="ap-card sh-addr">${icon("pin")}<div><b>Tolu Bello</b><span>22 Marlowe Road, London E17 3LP</span></div><em>Change</em></div>
      <span class="sh-lbl">Delivery</span>
      <div class="sh-opt on"><i></i><div><b>Standard</b><span>3 to 5 working days</span></div><em>${p === "B" ? money(DELIVERY) : ""}</em></div>
      <div class="sh-opt"><i></i><div><b>Next day</b><span>Order before 10pm</span></div><em>${p === "B" ? "£6.99" : ""}</em></div>
      </div><div class="ap-foot">${main("Continue to payment", "next")}</div></div>`;
  }

  function payment(p) {
    return `<div class="scr shop">${top2("Checkout")}${stepper(2)}<div class="ap-body">
      <span class="sh-lbl">Pay with</span>
      <div class="sh-opt on"><i></i><div><b>Visa ending 4417</b><span>Expires 08/28</span></div><em class="sh-visa">VISA</em></div>
      <div class="sh-opt"><i></i><div><b>Pay in 3</b><span>Three interest-free payments</span></div></div>
      <div class="sh-opt"><i></i><div><b>Add a new card</b></div></div>
      ${p === "B" ? `<div class="ap-card">${line("Runner One", money(ITEM))}${line("Delivery", money(DELIVERY))}${line("Service fee", money(FEE))}<div class="ap-kv sh-tot"><span>Total</span><b>${money(TOTAL)}</b></div></div>` : ""}
      </div><div class="ap-foot">${p === "A" ? main("Review order", "next") : main("Pay " + money(TOTAL), "pay")}</div></div>`;
  }

  function review() {
    return `<div class="scr shop">${top2("Review and pay")}<div class="ap-body">
      <div class="ap-card sh-item">${thumb()}<div class="t"><b>Runner One</b><span>Coral · UK 6 · Standard delivery</span></div></div>
      <div class="ap-card">${line("Runner One", money(ITEM))}${line("Delivery", money(DELIVERY), "sh-new")}${line("Service fee", money(FEE), "sh-new")}<div class="ap-kv sh-tot"><span>Total</span><b>${money(TOTAL)}</b></div></div>
      <p class="ap-p" style="font-size:11px">By paying you agree to our terms of sale.</p>
      </div><div class="ap-foot">${main("Pay " + money(TOTAL), "pay")}${btn("Leave checkout", "leave", "ghost")}</div></div>`;
  }

  const SCREENS = { A: [product, bag, delivery, payment, review], B: [product, bag, delivery, payment] };
  const NOTES = {
    A: [["£48 is the only number on the page"], ["The bag still says £48, and so does the button"], ["Delivery options with no prices next to them"], ["Card ready, and still no total"], ["£6.49 appears on the last screen, after all her effort"]],
    B: [["The delivered price sits right under the price tag"], ["The bag adds up to what she’ll pay"], ["Every option shows its cost"], ["The button says exactly what leaves her account"]]
  };

  function show(ui, p) {
    const list = SCREENS[p];
    ui.screen(list[ui.s.i](p));
    ui.notes(NOTES[p][ui.s.i]);
    if (ui.s.i === list.length - 1) ui.metric("paid", money(TOTAL));
  }

  const done = (cls, ic, title, sub) => `<div class="scr white shop"><div class="ap-body"><div class="ap-success"><span class="tick ${cls}">${icon(ic)}</span><div class="ap-h">${title}</div><p class="ap-p">${sub}</p></div></div></div>`;

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
      if (name === "leave") {
        ui.screen(done("wait", "bag", "Checkout abandoned", "Tolu got all the way to the last screen, then left."));
        ui.notes(["The sale is lost at the very last step"]);
        ui.done({ surprise, toast: `Tolu left on the last screen. ${money(surprise)} she didn’t see coming.` });
        return;
      }
      ui.screen(done("", "check", "Order placed", p === "A" ? `${money(TOTAL)} paid. Tolu was expecting ${money(ITEM)}.` : `${money(TOTAL)} paid, exactly what Tolu expected. Arriving Thursday.`));
      ui.notes(p === "A" ? ["She paid, but she’ll remember how it felt"] : ["No surprise, so nothing to resent"]);
      ui.done({ surprise, toast: p === "A" ? `Tolu paid ${money(surprise)} more than the price she started with.` : `Same ${money(TOTAL)}. Tolu knew it from the first screen.` });
    }
  });
})();
