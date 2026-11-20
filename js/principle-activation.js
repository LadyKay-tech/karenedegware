/* Principle: A sign-up is not activation. Two paths through the same product, timed to first value. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);

  const REPORT =
    '<div class="xrep"><span class="lb">Your first report</span><div class="xbig">₦ 48.2m</div>' +
    '<span class="xup">Monthly sales, up 12% on last month</span><div class="xbars">' +
    [42, 55, 48, 66, 71, 88, 80].map((h) => `<i style="height:${h}%"></i>`).join("") +
    "</div></div>";
  const field = (label, value) => `<div class="xf">${label}<div>${value}</div></div>`;
  const go = (text) => `<button class="xgo" type="button">${text}</button>`;

  const PATHS = {
    A: [
      { t: "Create account", h: "<h4>Create your account</h4>" + field("Work email", "ada@northwind.com") + go("Create account") },
      { t: "Verify email", h: '<h4>Check your inbox</h4><p class="sm">We sent a code to ada@northwind.com</p><div class="xf xcode"><div>4</div><div>8</div><div>1</div><div>9</div></div>' + go("Verify") },
      { t: "Company details", h: "<h4>About your company</h4>" + field("Company", "Northwind Ltd") + go("Continue") },
      { t: "Choose a plan", h: '<h4>Choose a plan</h4><div class="xplans"><div class="on"><b>Starter</b>Small teams</div><div><b>Team</b>Growing teams</div></div>' + go("Start free trial") },
      { t: "Product tour", h: '<h4>Welcome to your workspace</h4><p class="sm">Reports live in the sidebar. Connect data from settings.</p>' + go("Finish tour") },
      { t: "Empty workspace", h: '<h4>Your workspace</h4><div class="xempty">No reports yet</div>' + go("Create a report") },
      { t: "First report", v: true, h: REPORT }
    ],
    B: [
      { t: "Pick sample data", h: '<h4>See your numbers in seconds</h4><p class="sm">Start with sample data. Connect your own later.</p><div class="xchips"><span class="on">Sample sales data</span><span>Upload a spreadsheet</span></div>' + go("Build my report") },
      { t: "First report", v: true, h: REPORT + go("Keep this report") },
      { t: "Save and sign up", h: "<h4>Keep this report</h4>" + field("Work email", "ada@northwind.com") + go("Save and create account") }
    ]
  };
  const NAME = { A: "Account first", B: "Value first" };
  const other = (p) => (p === "A" ? "B" : "A");
  const fmt = (t) => { const m = Math.floor(t / 60), s = t - m * 60; return m + ":" + (s < 10 ? "0" : "") + s.toFixed(1); };

  const el = {
    screen: $("scr"), time: $("xT"), clicks: $("xC"), steps: $("xS"), compare: $("xG"),
    tabA: $("tA"), tabB: $("tB"), stepText: $("xN"), stepBar: $("xB"), hint: $("xH"),
    toast: $("xToast"), toastText: $("xTt"), toastBtn: $("xTb")
  };
  const st = { p: "A", i: 0, clicks: 0, t0: 0, raf: 0, times: [], last: 0 };
  const results = {};

  function renderSteps() {
    const path = PATHS[st.p];
    const vi = path.findIndex((x) => x.v);
    el.steps.innerHTML = path
      .map((x, i) => {
        const done = i < st.i, cur = i === st.i;
        const cls = [done && "ok", cur && "cur", x.v && "val"].filter(Boolean).join(" ");
        const time = st.times[i] != null && done ? st.times[i].toFixed(1) + "s" : "";
        return (i === vi + 1 ? '<li class="xdiv"></li>' : "") +
          `<li class="${cls}"><span class="ic">${done ? "✓" : i + 1}</span><b>${x.t}</b><em>${time}</em></li>`;
      })
      .join("");
    const toValue = vi + 1;
    el.stepText.textContent = st.i < toValue ? `Step ${st.i + 1} of ${toValue} to first value` : "After first value";
    el.stepBar.style.width = Math.min(100, ((st.i + 1) / toValue) * 100) + "%";
  }

  function renderCompare() {
    const max = Math.max(results.A ? results.A.t : 0, results.B ? results.B.t : 0) || 1;
    el.compare.innerHTML = ["A", "B"]
      .map((p) => {
        const r = results[p];
        const w = r ? Math.max(3, (r.t / max) * 100) : 0;
        const v = r ? `${r.c} clicks, ${r.t.toFixed(1)}s` : "Not tried yet";
        return `<div class="r ${p === "A" ? "a" : "b"}"><span>${NAME[p]}</span><span class="t"><i style="width:${w}%"></i></span><span class="v">${v}</span></div>`;
      })
      .join("");
  }

  function renderClock() {
    const r = results[st.p];
    el.time.textContent = fmt(r ? r.t : st.t0 ? (performance.now() - st.t0) / 1000 : 0);
    el.clicks.textContent = r ? r.c : st.clicks;
  }

  function tick() {
    renderClock();
    if (st.t0 && !results[st.p]) st.raf = requestAnimationFrame(tick);
  }

  function renderToast() {
    const r = results[st.p];
    if (!r || !PATHS[st.p][st.i].v) { el.toast.hidden = true; return; }
    const both = results.A && results.B;
    el.toastText.textContent = `First report after ${r.c} ${r.c === 1 ? "click" : "clicks"}, ${r.t.toFixed(1)}s`;
    el.toastBtn.textContent = both ? "Start again" : "Now try " + NAME[other(st.p)].toLowerCase();
    el.toast.hidden = false;
  }

  function render() {
    el.screen.innerHTML = PATHS[st.p][st.i].h;
    el.screen.style.animation = "none";
    void el.screen.offsetWidth;
    el.screen.style.animation = "";
    const button = el.screen.querySelector(".xgo");
    if (button && !st.t0 && !results.A && !results.B) button.classList.add("pulse");
    el.hint.textContent =
      results.A && results.B ? "Compare the two paths below"
      : results[st.p] ? "Ada has her report. Try the other path to compare"
      : st.p === "A" ? "Click the dark button to move through each screen"
      : "Same product, value shown first. Click through again";
    renderSteps();
    renderCompare();
    renderClock();
    renderToast();
  }

  function setPath(p) {
    cancelAnimationFrame(st.raf);
    Object.assign(st, { p, i: 0, clicks: 0, t0: 0, times: [] });
    el.tabA.setAttribute("aria-selected", p === "A");
    el.tabB.setAttribute("aria-selected", p === "B");
    render();
  }

  function restart() { delete results.A; delete results.B; setPath("A"); }

  el.screen.addEventListener("click", (e) => {
    if (!e.target.closest(".xgo")) return;
    const now = performance.now();
    if (!st.t0) { st.t0 = now; st.last = now; tick(); }
    const path = PATHS[st.p];
    if (!results[st.p]) st.clicks++;
    st.times[st.i] = (now - st.last) / 1000;
    st.last = now;
    if (st.i < path.length - 1) st.i++;
    else { setPath(other(st.p)); return; }
    if (path[st.i].v && !results[st.p]) results[st.p] = { c: st.clicks, t: (now - st.t0) / 1000 };
    render();
  });
  el.toastBtn.addEventListener("click", () => (results.A && results.B ? restart() : setPath(other(st.p))));
  el.tabA.addEventListener("click", () => setPath("A"));
  el.tabB.addEventListener("click", () => setPath("B"));
  $("reset").addEventListener("click", restart);

  render();
  const page = document.querySelector("[data-reveal]");
  if (page) requestAnimationFrame(() => requestAnimationFrame(() => page.classList.add("on")));
})();
