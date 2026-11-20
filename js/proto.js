/*
  The shared prototype frame used by every principle page.
  A principle file calls KEProto({...}) with two approaches (A and B), the
  numbers to show underneath, and two functions:
    start(path, ui)          draw the first screen for that approach
    act(name, el, ui, path)  react to a click on anything with data-act="name"
  ui gives a principle what it needs: ui.screen(html), ui.metric(key, value),
  ui.progress(text, fraction), ui.hint(text), ui.later(fn, ms), ui.done(result),
  ui.s (scratch state, reset on each run) and ui.clicks (clicks this run).
*/
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);

  function KEProto(cfg) {
    const el = {
      card: $("scr"), hint: $("xH"), tabA: $("tA"), tabB: $("tB"),
      toast: $("xToast"), toastText: $("xTt"), toastBtn: $("xTb"),
      foot: $("xF"), compare: $("xG"), reset: $("reset"),
      prog: $("xP"), progText: $("xN"), progBar: $("xB")
    };
    const results = {};
    let path = "A";
    let timers = [];
    const other = (p) => (p === "A" ? "B" : "A");

    // Score strip: one block per metric, then the comparison bars
    el.foot.insertAdjacentHTML(
      "afterbegin",
      cfg.metrics.map((m) => `<div class="ost" data-k="${m.k}"><b>${m.label}</b><span>${m.zero}</span></div>`).join("")
    );

    const ui = {
      s: {},
      clicks: 0,
      get path() { return path; },
      screen(html) {
        el.card.innerHTML = html;
        el.card.style.animation = "none";
        void el.card.offsetWidth;
        el.card.style.animation = "";
        if (!results.A && !results.B && ui.clicks === 0) {
          const first = el.card.querySelector(".xgo");
          if (first) first.classList.add("pulse");
        }
      },
      update(html) { el.card.innerHTML = html; },
      metric(k, v) {
        const n = el.foot.querySelector(`[data-k="${k}"] span`);
        if (n) n.textContent = v;
      },
      progress(text, frac) {
        if (text == null) { el.prog.hidden = true; return; }
        el.prog.hidden = false;
        el.progText.textContent = text;
        el.progBar.style.width = Math.max(0, Math.min(1, frac)) * 100 + "%";
      },
      hint(t) { el.hint.textContent = t; },
      later(fn, ms) { timers.push(setTimeout(fn, ms)); },
      done(res) {
        if (results[path]) return;
        results[path] = res;
        renderCompare();
        const both = results.A && results.B;
        el.toastText.textContent = res.toast;
        el.toastBtn.textContent = both ? "Start again" : "Now try " + cfg.names[other(path)].toLowerCase();
        el.toast.hidden = false;
        ui.hint(both ? "Compare the two below" : cfg.hints.after || "Now try the other way");
      }
    };

    function renderCompare() {
      const vals = ["A", "B"].map((p) => (results[p] ? cfg.compare.value(results[p]) : 0));
      const max = Math.max(...vals, 0) || 1;
      el.compare.innerHTML =
        `<span class="ocl">${cfg.compare.label}</span>` +
        ["A", "B"]
          .map((p, i) => {
            const r = results[p];
            const w = r ? Math.max(3, (vals[i] / max) * 100) : 0;
            const v = r ? cfg.compare.text(r) : "Not tried yet";
            return `<div class="r ${p === "A" ? "a" : "b"}"><span>${cfg.names[p]}</span><span class="t"><i style="width:${w}%"></i></span><span class="v">${v}</span></div>`;
          })
          .join("");
    }

    function setPath(p) {
      timers.forEach(clearTimeout);
      timers = [];
      path = p;
      ui.s = {};
      ui.clicks = 0;
      el.tabA.setAttribute("aria-selected", p === "A");
      el.tabB.setAttribute("aria-selected", p === "B");
      el.toast.hidden = true;
      cfg.metrics.forEach((m) => ui.metric(m.k, m.zero));
      ui.progress(null);
      ui.hint(results[p] ? "Run it again, or switch approach" : cfg.hints[p]);
      cfg.start(p, ui);
      renderCompare();
    }

    function restart() { delete results.A; delete results.B; setPath("A"); }

    el.card.addEventListener("click", (e) => {
      const t = e.target.closest("[data-act]");
      if (!t || t.disabled || !el.card.contains(t)) return;
      ui.clicks++;
      cfg.act(t.dataset.act, t, ui, path);
    });
    el.toastBtn.addEventListener("click", () => (results.A && results.B ? restart() : setPath(other(path))));
    el.tabA.addEventListener("click", () => setPath("A"));
    el.tabB.addEventListener("click", () => setPath("B"));
    el.reset.addEventListener("click", restart);

    setPath("A");
    const page = document.querySelector("[data-reveal]");
    if (page) requestAnimationFrame(() => requestAnimationFrame(() => page.classList.add("on")));
  }

  // Small builders shared by the principle files
  const tick = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2.5 6.3l2.3 2.2 4.7-5"/></svg>';
  KEProto.h = {
    tick,
    go: (text, act, extra = "") => `<button class="xgo" type="button" data-act="${act}" ${extra}>${text}</button>`,
    ghost: (text, act, extra = "") => `<button class="xghost" type="button" data-act="${act}" ${extra}>${text}</button>`,
    link: (text, act) => `<button class="xlink" type="button" data-act="${act}">${text}</button>`,
    row: (a, b, cls = "") => `<div class="xrow ${cls}"><span>${a}</span><span>${b}</span></div>`,
    field: (label, value) => `<div class="xf">${label}<div>${value}</div></div>`,
    money: (n) => "£" + n.toFixed(2),
    btns: (...b) => `<div class="xbtns">${b.join("")}</div>`
  };

  window.KEProto = KEProto;
})();
