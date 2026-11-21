/*
  P3MO working files. Each page has one artefact, drawn here with made-up data:
  no real company, client, colleague or figure appears anywhere in this file.
*/
(function () {
  "use strict";
  const root = document.getElementById("art");
  if (!root) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (k) => (k >= 1000 ? "£" + (k / 1000).toFixed(k >= 10000 ? 1 : 2).replace(/\.?0+$/, "") + "m" : "£" + Math.round(k) + "k");

  /* A small seeded random generator, so the sample data is the same on every visit */
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];

  const ART = {};

  /* ======================= PORTFOLIO ======================= */

  ART.ops = function () {
    const OFFERINGS = [
      { name: "Cloud migration", owner: "Tolu" }, { name: "Data and analytics", owner: "James" },
      { name: "Cyber security", owner: "Chioma" }, { name: "Managed support", owner: "Kwame" }, { name: "Training", owner: "Priya" },
    ];
    const STAGES = ["New lead", "First meeting", "Qualified", "Solution and demo", "Proposal", "Negotiation", "Contract signed", "Paid"];
    const EXPECT = [7, 10, 14, 14, 10, 14, 21, 30];
    const PROB = [0.05, 0.1, 0.2, 0.35, 0.5, 0.7, 0.9, 1];
    const SECTORS = ["Finance", "Health", "Retail", "Public sector", "Logistics"];
    const CLIENTS = ["Harbour Logistics", "Northgate Foods", "Kestrel Bank", "Atlas Clinics", "Meridian Schools", "Lakeside Council", "Brightwater Retail", "Summit Insurance", "Orchid Telecom", "Pinecrest Homes", "Redwood Freight", "Silverline Media", "Cedar Health", "Falcon Airways", "Marlow Credit Union", "Quayside Hotels"];
    const NEEDS = { "Cloud migration": ["server move", "cloud landing zone", "email migration"], "Data and analytics": ["reporting suite", "data warehouse", "sales dashboard"], "Cyber security": ["security review", "staff phishing tests", "firewall upgrade"], "Managed support": ["helpdesk contract", "network support", "device management"], Training: ["leadership course", "Excel training", "onboarding academy"] };
    const HOLD = ["Client", "Finance", "Legal", "Delivery", "PMO"];
    seed = 11;
    const opps = [];
    for (let i = 0; i < 66; i++) {
      const off = OFFERINGS[i % 5];
      const W = [12, 11, 10, 9, 8, 6, 4, 6];
      let r = rnd() * 66, stage = 0;
      while (r > W[stage] && stage < 7) { r -= W[stage]; stage++; }
      const days = Math.round(rnd() * EXPECT[stage] * 1.7) + 1;
      const moves = [0, 1, 2, 3].map(() => (rnd() < 0.2 ? 1 : 0));
      const ups = [0, 1, 2, 3].map(() => (rnd() < 0.62 ? Math.round(1 + rnd() * 2.2) : 0));
      opps.push({
        title: pick(CLIENTS) + " " + pick(NEEDS[off.name]), off: off.name, owner: off.owner, stage, days,
        value: Math.round((20 + rnd() * 380) / 5) * 5, sector: SECTORS[Math.floor(rnd() * 5)],
        held: days > EXPECT[stage] * 1.25 ? pick(HOLD) : null, moves, ups,
      });
    }
    let off = "All", weeks = 1;
    const view = () => (off === "All" ? opps : opps.filter((o) => o.off === off));
    const bar = (v, max, cls = "") => `<span class="p3-bar ${cls}"><i style="width:${max ? Math.max(2, (v / max) * 100) : 0}%"></i></span>`;

    function draw() {
      const list = view();
      // A new lead reaching its first meeting is a new entry, so movement starts from the second stage
      const moved = list.filter((o) => o.moves.slice(0, weeks).some(Boolean) && o.stage > 1);
      const stalled = list.filter((o) => o.held && o.stage < 7).sort((a, b) => b.days / EXPECT[b.stage] - a.days / EXPECT[a.stage]);
      const updates = list.reduce((a, o) => a + o.ups.slice(0, weeks).reduce((x, y) => x + y, 0), 0);
      const perDay = updates / (5 * weeks);
      const target = off === "All" ? 20 : 4;
      const weighted = list.filter((o) => o.stage < 7).reduce((a, o) => a + o.value * PROB[o.stage], 0);
      const byStage = STAGES.map((s, i) => list.filter((o) => o.stage === i));
      const maxStage = Math.max(...byStage.map((x) => x.length));
      const daily = [];
      seed = 99 + weeks + OFFERINGS.findIndex((o) => o.name === off);
      for (let d = 0; d < 5 * weeks; d++) daily.push(Math.max(0, Math.round(perDay * (0.6 + rnd() * 0.8))));
      const maxDay = Math.max(target * 1.2, ...daily);
      const sectors = SECTORS.map((s) => { const r = list.filter((o) => o.sector === s); return { s, n: r.length, up: r.filter((o) => o.ups.slice(0, weeks).some((u) => u > 0)).length }; });

      root.innerHTML = `
<div class="p3-app">
  <div class="p3-top">
    <div class="p3-chips" role="group" aria-label="Offering">${["All", ...OFFERINGS.map((o) => o.name)].map((n) => `<button type="button" data-off="${esc(n)}" class="${n === off ? "on" : ""}">${esc(n)}</button>`).join("")}</div>
    <div class="p3-seg" role="group" aria-label="Period"><button type="button" data-w="1" class="${weeks === 1 ? "on" : ""}">This week</button><button type="button" data-w="4" class="${weeks === 4 ? "on" : ""}">Last 4 weeks</button></div>
  </div>
  <div class="p3-kpis">
    <div class="p3-kpi"><span>Updates a day</span><b>${perDay.toFixed(1)}</b><em class="${perDay >= target ? "up" : "down"}">Target ${target}</em></div>
    <div class="p3-kpi"><span>Stage movements</span><b>${moved.length}</b><em>${weeks === 1 ? "this week" : "in 4 weeks"}</em></div>
    <div class="p3-kpi"><span>Stalled</span><b>${stalled.length}</b><em class="${stalled.length > 8 ? "down" : ""}">past expected time</em></div>
    <div class="p3-kpi"><span>Weighted pipeline</span><b>${money(weighted)}</b><em>value × chance of winning</em></div>
  </div>
  <div class="p3-grid2">
    <section class="p3-card"><h4>Pipeline by stage</h4>
      ${byStage.map((x, i) => `<div class="p3-srow"><span>${STAGES[i]}</span>${bar(x.length, maxStage)}<b>${x.length}</b><em>${money(x.reduce((a, o) => a + o.value, 0))}</em></div>`).join("")}
    </section>
    <section class="p3-card"><h4>Updates each day <small>dashed line is the target</small></h4>
      <div class="p3-days"><div class="p3-plot" style="--t:${(target / maxDay) * 100}%">${daily.map((v) => `<span title="${v} updates"><i class="${v >= target ? "ok" : ""}" style="height:${(v / maxDay) * 100}%"></i></span>`).join("")}</div>
      <div class="p3-xl">${daily.map((v, i) => `<em>${weeks === 1 ? ["Mon", "Tue", "Wed", "Thu", "Fri"][i] : i % 5 === 0 ? "Week " + (Math.floor(i / 5) + 1) : ""}</em>`).join("")}</div></div>
    </section>
  </div>
  <div class="p3-grid2">
    <section class="p3-card"><h4>What moved</h4>
      ${moved.length ? `<ul class="p3-list">${moved.slice(0, 7).map((o) => `<li><b>${esc(o.title)}</b><span>${STAGES[o.stage - 1]} → ${STAGES[o.stage]}</span><em>${esc(o.owner)}</em></li>`).join("")}</ul>` : `<p class="p3-empty">Nothing moved in this period.</p>`}
    </section>
    <section class="p3-card"><h4>Stalled, and who it is waiting on</h4>
      ${stalled.length ? `<ul class="p3-list">${stalled.slice(0, 7).map((o) => `<li><b>${esc(o.title)}</b><span>${STAGES[o.stage]} · ${o.days} days, expected ${EXPECT[o.stage]}</span><em class="p3-hold h-${o.held.toLowerCase()}">${o.held}</em></li>`).join("")}</ul>` : `<p class="p3-empty">Nothing is stalled.</p>`}
    </section>
  </div>
  <section class="p3-card"><h4>Coverage by sector <small>records with at least one update in the period</small></h4>
    <div class="p3-cov">${sectors.map((x) => `<div><span>${x.s}</span>${bar(x.up, x.n, x.n && x.up / x.n < 0.5 ? "warn" : "")}<b>${x.up} of ${x.n}</b></div>`).join("")}</div>
  </section>
</div>`;
    }
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.off) off = b.dataset.off;
      if (b.dataset.w) weeks = +b.dataset.w;
      draw();
    });
    draw();
  };

  ART.updates = function () {
    const CHOICES = [
      ["movement", "Movement", "The opportunity changed stage"],
      ["update", "Update", "Progress the client can see, same stage"],
      ["commitment", "Commitment", "Promised, but nothing has reached the client"],
      ["fix", "Fix first", "The record isn't fit to report"],
    ];
    const CASES = [
      ["Sent the revised proposal to the client’s procurement team.", "update", "It reached the client and moved the conversation on, so it counts as an update. The stage only changes when the client responds to it."],
      ["Followed up by email. No reply yet.", "commitment", "A chaser with nothing to show for it is effort, not progress. It is logged as a commitment and counts once something comes back."],
      ["The proposal is ready and waiting for internal sign-off.", "commitment", "Internal readiness is not an update. It becomes one the moment the document reaches the client."],
      ["The client accepted the proposal and asked for a draft contract.", "movement", "The opportunity has moved from Proposal to Negotiation. That is exactly what the pipeline exists to show."],
      ["A referral came in and the opportunity was created straight into Negotiation.", "movement", "An opportunity entering at a later stage counts as movement. Only a brand new lead entering the first stage is treated as a simple new entry."],
      ["Logged a call, but the record has no account or sector.", "fix", "Records without an account or sector go back to the PMO to correct. They are never shown to leadership as they are."],
      ["The delivery team confirmed the demo environment is ready.", "commitment", "This is internal readiness again. It counts when the demo happens with the client."],
      ["Ran the product demo with the client’s operations team.", "update", "The client saw something new, so it counts as an update, even though the opportunity stays in the same stage for now."],
      ["The invoice was paid and the money is in the bank.", "movement", "The final stage. Nothing counts as won until this happens."],
    ];
    const answers = {};
    function draw() {
      const done = Object.keys(answers).length;
      const right = Object.entries(answers).filter(([i, a]) => CASES[i][1] === a).length;
      root.innerHTML = `
<div class="p3-app">
  <div class="p3-rule"><b>The rule</b><p>An entry counts when the client can see the progress or the opportunity changes stage. Everything else is either a commitment or a record to fix.</p></div>
  <div class="p3-legend">${CHOICES.map(([k, n, d]) => `<span class="c-${k}"><b>${n}</b>${d}</span>`).join("")}</div>
  <div class="p3-score">${done ? `${right} of ${done} matched how I would treat them` : "How would you treat each entry?"}${done ? ` <button type="button" class="p3-link" data-reset>Start again</button>` : ""}</div>
  <ol class="p3-cases">${CASES.map(([text, ans, why], i) => {
    const a = answers[i];
    return `<li class="${a ? (a === ans ? "right" : "wrong") : ""}"><p>${esc(text)}</p>
      <div class="p3-opts">${CHOICES.map(([k, n]) => `<button type="button" data-i="${i}" data-a="${k}" class="c-${k}${a === k ? " on" : ""}${a && k === ans ? " ans" : ""}" ${a ? "disabled" : ""}>${n}</button>`).join("")}</div>
      ${a ? `<p class="p3-why"><b>${a === ans ? "Yes." : "I’d call it " + CHOICES.find((c) => c[0] === ans)[1].toLowerCase() + "."}</b> ${esc(why)}</p>` : ""}</li>`;
  }).join("")}</ol>
</div>`;
    }
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-reset")) { Object.keys(answers).forEach((k) => delete answers[k]); draw(); return; }
      if (b.dataset.a) { answers[b.dataset.i] = b.dataset.a; draw(); }
    });
    draw();
  };

  ART.prioritise = function () {
    const CRIT = [["fit", "Strategic fit", "#6366f1"], ["rev", "Revenue impact", "#10b981"], ["cust", "Customer impact", "#f59e0b"], ["risk", "Delivery risk", "#f43f5e"]];
    const CAT = {
      Customer: ["#ec4899", "#fdf2f8", '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c.8-4 4-6 8-6s7.2 2 8 6"/>'],
      Platform: ["#6366f1", "#eef2ff", '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01"/>'],
      Sales: ["#10b981", "#ecfdf5", '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>'],
      People: ["#f59e0b", "#fffbeb", '<path d="M4 6l8-3 8 3-8 3zM8 8v5c0 1.5 2 3 4 3s4-1.5 4-3V8"/>'],
      Compliance: ["#14b8a6", "#f0fdfa", '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>'],
    };
    const W = { fit: 4, rev: 4, cust: 3, risk: 2 };
    let budget = 600, view = "rank";
    const P = [
      ["Self-service customer portal", "Portal", 220, { fit: 5, rev: 4, cust: 5, risk: 3 }, "Customer"],
      ["Move billing to the cloud", "Billing", 180, { fit: 4, rev: 2, cust: 2, risk: 4 }, "Platform"],
      ["Sales dashboard for regional teams", "Dashboard", 60, { fit: 4, rev: 4, cust: 2, risk: 1 }, "Sales"],
      ["New onboarding training academy", "Academy", 90, { fit: 3, rev: 3, cust: 4, risk: 2 }, "People"],
      ["Replace the ageing helpdesk tool", "Helpdesk", 120, { fit: 2, rev: 1, cust: 4, risk: 2 }, "Platform"],
      ["Partner referral programme", "Referrals", 40, { fit: 4, rev: 5, cust: 1, risk: 2 }, "Sales"],
      ["Security certification", "Security", 150, { fit: 5, rev: 3, cust: 3, risk: 3 }, "Compliance"],
      ["Mobile app for field teams", "Field app", 260, { fit: 3, rev: 3, cust: 3, risk: 5 }, "Customer"],
    ];
    const icon = (cat, size) => `<span class="pf-ic" style="--c:${CAT[cat][0]};--b:${CAT[cat][1]};width:${size}px;height:${size}px"><svg viewBox="0 0 24 24">${CAT[cat][2]}</svg></span>`;
    function parts(sc) {
      const tot = CRIT.reduce((a, [k]) => a + W[k], 0) || 1;
      return CRIT.map(([k, , c]) => ({ k, c, v: ((W[k] * (k === "risk" ? 6 - sc[k] : sc[k])) / (tot * 5)) * 100 }));
    }
    function ring(used, total) {
      const r = 46, C = 2 * Math.PI * r, f = Math.min(1, used / total);
      return `<svg class="pf-ring" viewBox="0 0 112 112" aria-hidden="true"><circle cx="56" cy="56" r="${r}" stroke="rgba(255,255,255,.18)" stroke-width="12" fill="none"/><circle cx="56" cy="56" r="${r}" stroke="url(#pfg)" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="${C * f} ${C}" transform="rotate(-90 56 56)"/><defs><linearGradient id="pfg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#67e8f9"/><stop offset="1" stop-color="#a7f3d0"/></linearGradient></defs><text x="56" y="61" text-anchor="middle">${Math.round(f * 100)}%</text></svg>`;
    }
    function matrix(ranked) {
      const Wd = 640, Hd = 330, L = 44, R = 16, T = 16, B = 34;
      const x = (c) => L + (c / 300) * (Wd - L - R), y = (s) => T + (1 - (s - 30) / 70) * (Hd - T - B);
      const mx = x(150), my = y(65);
      let g = `<rect x="${L}" y="${T}" width="${mx - L}" height="${my - T}" fill="#ecfdf5"/><rect x="${mx}" y="${T}" width="${Wd - R - mx}" height="${my - T}" fill="#eef2ff"/><rect x="${L}" y="${my}" width="${mx - L}" height="${Hd - B - my}" fill="#f8fafc"/><rect x="${mx}" y="${my}" width="${Wd - R - mx}" height="${Hd - B - my}" fill="#fff1f2"/>`;
      g += `<text class="q" x="${L + 10}" y="${T + 20}">Quick wins</text><text class="q" x="${Wd - R - 10}" y="${T + 20}" text-anchor="end">Big bets</text><text class="q" x="${L + 10}" y="${Hd - B - 10}">Fill-ins</text><text class="q" x="${Wd - R - 10}" y="${Hd - B - 10}" text-anchor="end">Think twice</text>`;
      [0, 100, 200, 300].forEach((c) => { g += `<text class="ax" x="${x(c)}" y="${Hd - 12}" text-anchor="middle">£${c}k</text>`; });
      [40, 60, 80, 100].forEach((s) => { g += `<text class="ax" x="${L - 8}" y="${y(s) + 4}" text-anchor="end">${s}</text>`; });
      g += `<text class="ax" x="${(L + Wd) / 2}" y="${Hd}" text-anchor="middle">Cost</text>`;
      const dots = ranked.slice().sort((a, b) => b.c - a.c).map((r) => {
        const col = CAT[r.tag][0], rad = 12 + r.c / 18;
        return `<g class="pf-dot ${r.in ? "in" : "out"}"><circle cx="${x(r.c)}" cy="${y(r.sc)}" r="${rad}" fill="${r.in ? col : "#fff"}" fill-opacity="${r.in ? 0.88 : 1}" stroke="${col}" stroke-width="${r.in ? 3 : 2}" ${r.in ? "" : 'stroke-dasharray="4 3"'}><title>${esc(r.n)}: score ${r.sc}, ${money(r.c)}</title></circle><text x="${x(r.c)}" y="${y(r.sc) - rad - 6}" text-anchor="middle">${esc(r.short)}</text></g>`;
      }).join("");
      return `<svg class="pf-matrix" viewBox="0 0 ${Wd} ${Hd + 6}" role="img" aria-label="Value against cost">${g}${dots}</svg>`;
    }
    function draw() {
      const ranked = P.map(([n, short, c, s, tag]) => { const pt = parts(s); return { n, short, c, s, tag, pt, sc: Math.round(pt.reduce((a, x) => a + x.v, 0)) }; }).sort((a, b) => b.sc - a.sc || a.c - b.c);
      let run = 0;
      ranked.forEach((r) => { run += r.c; r.in = run <= budget; });
      run = ranked.filter((r) => r.in).reduce((a, r) => a + r.c, 0);
      ranked.forEach((r) => { if (!r.in && run + r.c <= budget) { r.in = true; r.late = true; run += r.c; } });
      const funded = ranked.filter((r) => r.in);
      const used = funded.reduce((a, r) => a + r.c, 0);
      const avg = funded.length ? Math.round(funded.reduce((a, r) => a + r.sc, 0) / funded.length) : 0;
      const lineAt = ranked.findIndex((r) => !r.in);
      const byCat = Object.keys(CAT).map((k) => [k, funded.filter((r) => r.tag === k).reduce((a, r) => a + r.c, 0)]).filter((x) => x[1]);
      root.innerHTML = `
<div class="pf">
  <header class="pf-hero">
    <div class="pf-title"><span class="pf-kicker">Portfolio planner</span><h3>Next year’s investment plan</h3><p>Eight proposals, one budget. Weights are agreed first, then the list funds itself from the top.</p></div>
    <div class="pf-gauge">${ring(used, budget)}<div><b>${money(used)}</b><span>of ${money(budget)} committed</span></div></div>
    <div class="pf-hstats"><div><b>${funded.length}<small>/${P.length}</small></b><span>funded</span></div><div><b>${avg}</b><span>average score</span></div><div><b>${money(budget - used)}</b><span>left over</span></div></div>
    <div class="pf-mix" title="How the funded budget splits by area">${byCat.map(([k, v]) => `<i style="flex:${v};background:${CAT[k][0]}"><span>${k}</span></i>`).join("")}</div>
  </header>
  <div class="pf-body">
    <aside class="pf-panel">
      <h4>Weights</h4><p>Agreed with leadership before anyone sees the scores.</p>
      ${CRIT.map(([k, n, c]) => `<label class="pf-sl"><span><i style="background:${c}"></i>${n}${k === "risk" ? "&nbsp;<small>(lower is better)</small>" : ""}<b style="color:${c}">${W[k]}</b></span><input type="range" min="0" max="5" step="1" value="${W[k]}" data-k="${k}" style="--c:${c};--p:${W[k] * 20}%"></label>`).join("")}
      <h4 class="pf-mt">Budget</h4>
      <label class="pf-sl"><span>Available this year<b>${money(budget)}</b></span><input type="range" min="200" max="1200" step="20" value="${budget}" data-b style="--c:#4338ca;--p:${((budget - 200) / 1000) * 100}%"></label>
      <div class="pf-tip"><b>Tip</b> Push delivery risk up and watch the mobile app drop below the line.</div>
    </aside>
    <section class="pf-main">
      <div class="pf-tabs"><button type="button" data-v="rank" class="${view === "rank" ? "on" : ""}">Ranking</button><button type="button" data-v="matrix" class="${view === "matrix" ? "on" : ""}">Value against cost</button>
        <span class="pf-legend">${CRIT.map(([, n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join("")}</span></div>
      ${view === "matrix" ? `<div class="pf-mcard">${matrix(ranked)}<p class="pf-cap">Bubble size is cost. Filled bubbles are funded; dashed ones fall below the budget line.</p></div>` : `
      <ol class="pf-list">${ranked.map((r, i) => `${i === lineAt ? `<li class="pf-line"><span>Budget line · ${money(budget)}</span></li>` : ""}<li class="pf-row ${r.in ? "in" : "out"}" style="--cc:${CAT[r.tag][0]}">
        <span class="pf-rank">${i + 1}</span>${icon(r.tag, 40)}
        <span class="pf-name"><b>${esc(r.n)}</b><small><em style="color:${CAT[r.tag][0]}">${r.tag}</em> · ${money(r.c)}</small></span>
        <span class="pf-stack">${r.pt.map((x) => `<i style="width:${x.v}%;background:${x.c}"></i>`).join("")}</span>
        <span class="pf-score"><b>${r.sc}</b><small>/100</small></span>
        <span class="pf-tag">${r.in ? (r.late ? "Funded · fits" : "Funded") : "Not this year"}</span></li>`).join("")}</ol>`}
    </section>
  </div>
</div>`;
    }
    root.addEventListener("input", (e) => {
      const t = e.target;
      if (t.dataset.k) W[t.dataset.k] = +t.value;
      if (t.hasAttribute("data-b")) budget = +t.value;
      const focus = t.dataset.k || (t.hasAttribute("data-b") ? "b" : "");
      draw();
      const again = focus === "b" ? root.querySelector("[data-b]") : root.querySelector(`[data-k="${focus}"]`);
      if (again) again.focus();
    });
    root.addEventListener("click", (e) => { const b = e.target.closest(".pf-tabs button"); if (b) { view = b.dataset.v; draw(); } });
    draw();
  };

  /* ======================= PROGRAMMES ======================= */

  ART.rhythm = function () {
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const EV = {
      mov: { name: "Movement review", when: "Monday, 7:30 to 8:15", kind: "weekly",
        why: "Look back at what moved last week and agree what should move this week. This is the only meeting that looks across stages.",
        who: "Offering owners, business development leads, the PMO", brings: "Each owner’s list of what moved, what stalled and why", leaves: "Named items expected to move this week, with the blocker and its owner for each one" },
      scrum: { name: "Daily scrum", when: "Tuesday to Friday, 7:30 to 8:00", kind: "daily",
        why: "A quick check of what changed yesterday, grouped by sector, against the daily target for updates.",
        who: "Business development team, offering owners, the PMO", brings: "Yesterday’s updates, already logged in the pipeline", leaves: "Commitments for today, and anything that needs escalating" },
      aar: { name: "After action review", when: "Within a day of any important client meeting", kind: "as needed",
        why: "Capture what the client told us while it is fresh, and agree the follow-up before it slips.",
        who: "Everyone who was in the client meeting, chaired by the PMO", brings: "Notes from the meeting", leaves: "A one-page review with next steps, owners and dates" },
      lead: { name: "Leadership scorecard", when: "Thursday, 16:00 to 17:00", kind: "weekly",
        why: "Give leadership one view of the business and the decisions only they can make.",
        who: "Leadership team, offering owners, the PMO", brings: "A three-part scorecard: state of the business, movement and stalls, pipeline coverage", leaves: "Decisions, approvals and blockers removed, recorded with owners" },
      data: { name: "Pipeline data check", when: "Friday, 11:00 to 11:45", kind: "weekly",
        why: "Make sure next week’s numbers can be trusted before anyone presents them.",
        who: "The PMO reporting team", brings: "Records with missing accounts, owners, sectors or dates", leaves: "A clean pipeline, and a short list of owners to chase" },
      month: { name: "Monthly scorecard pack", when: "First Thursday of the month", kind: "monthly",
        why: "Show the trend behind the weekly numbers and agree priorities for the month.",
        who: "Leadership team and the PMO", brings: "The same three-part scorecard, with four weeks of history", leaves: "Priorities for the month and changes to targets" },
      ninety: { name: "90-day commitments review", when: "Last week of each month", kind: "monthly",
        why: "Check progress against the commitments for the quarter and adjust what is not working.",
        who: "Head of PMO and the sponsoring director", brings: "Status for each commitment, with evidence", leaves: "Agreed changes, and any help needed from leadership" },
      quarter: { name: "Quarterly planning", when: "Once a quarter", kind: "quarterly",
        why: "Step back, review the portfolio and decide what to start, stop or continue.",
        who: "Leadership team, offering owners, the PMO", brings: "Quarter review, prioritisation scores and capacity", leaves: "The funded list for next quarter and the next set of 90-day commitments" },
    };
    const GRID = [["mov", 0, "7:30"], ["scrum", 1, "7:30"], ["scrum", 2, "7:30"], ["scrum", 3, "7:30"], ["scrum", 4, "7:30"], ["aar", 1, "14:00"], ["lead", 3, "16:00"], ["data", 4, "11:00"]];
    let sel = "mov";
    function draw() {
      const e = EV[sel];
      root.innerHTML = `
<div class="p3-app p3-cols wide-r">
  <section class="p3-card"><h4>A typical week</h4>
    <div class="p3-week">${DAYS.map((d, i) => `<div class="p3-day"><span class="p3-dh">${d.slice(0, 3)}</span>${GRID.filter((g) => g[1] === i).sort((a, b) => parseFloat(a[2]) - parseFloat(b[2])).map((g) => `<button type="button" data-e="${g[0]}" class="ev ev-${g[0]}${sel === g[0] ? " on" : ""}"><em>${g[2]}</em>${EV[g[0]].name}</button>`).join("")}</div>`).join("")}</div>
    <h4 class="p3-mt">Every month and quarter</h4>
    <div class="p3-rowbtns">${["month", "ninety", "quarter"].map((k) => `<button type="button" data-e="${k}" class="ev ev-${k}${sel === k ? " on" : ""}">${EV[k].name}<em>${EV[k].when}</em></button>`).join("")}</div>
  </section>
  <aside class="p3-card p3-detail"><span class="p3-kind">${e.kind}</span><h3>${e.name}</h3><p class="p3-when">${e.when}</p><p>${e.why}</p>
    <dl><div><dt>Who is there</dt><dd>${e.who}</dd></div><div><dt>What they bring</dt><dd>${e.brings}</dd></div><div><dt>What they leave with</dt><dd>${e.leaves}</dd></div></dl>
  </aside>
</div>`;
    }
    root.addEventListener("click", (ev) => { const b = ev.target.closest("[data-e]"); if (b) { sel = b.dataset.e; draw(); } });
    draw();
  };

  ART.ninety = function () {
    const C = [
      { t: "One definition of progress", m: "A written definition of an update, signed off and used in every report", o: "Head of PMO",
        s: [[40, "a", "Draft definition shared with all teams", "Sign-off from leadership"], [85, "g", "Signed off and used in the daily scrum", "Retrain two teams still logging chasers"], [100, "g", "Used in every report for six weeks", "Nothing left"]] },
      { t: "A pipeline we can trust", m: "No records missing an account, owner or sector", o: "Pipeline lead",
        s: [[30, "r", "312 incomplete records found", "Work through them by sector"], [70, "a", "Down to 48 incomplete records", "Lock fields so new gaps cannot appear"], [95, "g", "Fields locked, 6 records left", "Close the last six"]] },
      { t: "Compliance documents current", m: "Every licence and registration valid, with renewal dates tracked", o: "Compliance officer",
        s: [[50, "a", "Register of all documents built", "Renew the two that have lapsed"], [80, "g", "Both renewed", "Set reminders 60 days before expiry"], [100, "g", "Reminders running", "Nothing left"]] },
      { t: "Movement you can see", m: "A weekly report of what moved, what stalled and why", o: "Reporting analyst",
        s: [[25, "a", "Report format agreed", "First four weekly reports"], [65, "a", "Four reports issued", "Add who each blocker sits with"], [90, "g", "Blockers named by team", "Add expected versus actual time per stage"]] },
      { t: "One view for leadership", m: "One dashboard used in every leadership meeting", o: "Head of PMO",
        s: [[20, "r", "Three competing spreadsheets in use", "Agree one source"], [60, "a", "Dashboard live, used in two meetings", "Retire the old spreadsheets"], [90, "g", "Used in every meeting", "Monthly trend view"]] },
    ];
    let month = 0, open = 0;
    const RAG = { g: "On track", a: "At risk", r: "Off track" };
    function draw() {
      const avg = Math.round(C.reduce((a, c) => a + c.s[month][0], 0) / C.length);
      root.innerHTML = `
<div class="p3-app">
  <div class="p3-top"><div class="p3-seg" role="group" aria-label="Month">${["Month 1", "Month 2", "Month 3"].map((m, i) => `<button type="button" data-m="${i}" class="${i === month ? "on" : ""}">${m}</button>`).join("")}</div>
  <span class="p3-overall"><span class="p3-bar"><i style="width:${avg}%"></i></span><b>${avg}%</b> overall</span></div>
  <ul class="p3-commit">${C.map((c, i) => { const [pct, rag, done, next] = c.s[month]; return `<li class="${open === i ? "open" : ""}">
    <button type="button" data-o="${i}" class="p3-chead"><span class="p3-ct"><b>${esc(c.t)}</b><small>${esc(c.m)}</small></span><span class="p3-own">${esc(c.o)}</span><span class="p3-rag r-${rag}">${RAG[rag]}</span><span class="p3-bar"><i style="width:${pct}%"></i></span><b class="p3-pct">${pct}%</b></button>
    <div class="p3-cbody"><div><span>Done so far</span><p>${esc(done)}</p></div><div><span>Next</span><p>${esc(next)}</p></div></div></li>`; }).join("")}</ul>
</div>`;
    }
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.m) month = +b.dataset.m;
      if (b.dataset.o) open = open === +b.dataset.o ? -1 : +b.dataset.o;
      draw();
    });
    draw();
  };

  ART.raci = function () {
    const STAGES = ["Find", "Qualify", "Shape the solution", "Propose", "Negotiate and close", "Deliver and collect"];
    const TEAMS = [
      ["Offering owners", "Generate, mature and convert opportunities for their offering, and support the business development team every day.", "RARAAA".split("")],
      ["Business development", "Own the client relationship, log every update and move opportunities through the stages.", "ARRRRC".split("")],
      ["Marketing", "Create access to new clients through campaigns, events and introductions, and hand over qualified conversations.", "RCIIII".split("")],
      ["Technical support", "Run demos, answer technical questions and write the technical parts of proposals.", "ICRRCR".split("")],
      ["Finance and legal", "Price the work, agree terms, draft contracts and chase payment.", "IICRRR".split("")],
      ["Operations", "Handle procurement, logistics and getting people on site.", "IIICCR".split("")],
      ["HR", "Make sure the right people are available, and supply staff records for bids.", "IICCCC".split("")],
      ["PMO", "Check that every movement is real, keep the scorecard, track actions and chase blockers.", "CCCCCC".split("")],
      ["Leadership", "Remove barriers, approve resources and make decisions on time.", "IIICCI".split("")],
    ];
    const KEY = { R: "Responsible: does the work", A: "Accountable: owns the outcome", C: "Consulted: gives input", I: "Informed: kept up to date" };
    let stage = 3, team = -1;
    function draw() {
      const col = TEAMS.map((t) => t[2][stage]);
      root.innerHTML = `
<div class="p3-app">
  <div class="p3-legend small">${Object.entries(KEY).map(([k, v]) => `<span class="k-${k}"><b>${k}</b>${v}</span>`).join("")}</div>
  <div class="p3-scroll"><table class="p3-raci">
    <thead><tr><th></th>${STAGES.map((s, i) => `<th><button type="button" data-s="${i}" class="${i === stage && team < 0 ? "on" : ""}">${s}</button></th>`).join("")}</tr></thead>
    <tbody>${TEAMS.map(([n, , r], i) => `<tr class="${team === i ? "on" : ""}"><th><button type="button" data-t="${i}">${n}</button></th>${r.map((x, j) => `<td class="k-${x}${j === stage && team < 0 ? " col" : ""}">${x}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>
  <div class="p3-card p3-explain">${team >= 0
    ? `<h4>${TEAMS[team][0]}</h4><p>${TEAMS[team][1]}</p>`
    : `<h4>${STAGES[stage]}</h4><p><b>Leads:</b> ${TEAMS.filter((t, i) => col[i] === "A").map((t) => t[0]).join(", ") || "None"}. <b>Does the work:</b> ${TEAMS.filter((t, i) => col[i] === "R").map((t) => t[0]).join(", ") || "None"}. <b>Gives input:</b> ${TEAMS.filter((t, i) => col[i] === "C").map((t) => t[0]).join(", ") || "None"}.</p>`}</div>
</div>`;
    }
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.s) { stage = +b.dataset.s; team = -1; }
      if (b.dataset.t) team = team === +b.dataset.t ? -1 : +b.dataset.t;
      draw();
    });
    draw();
  };

  /* ======================= PROJECTS ======================= */

  ART.status = function () {
    const AREAS = [
      ["Scope", "g", "Agreed and signed off; two small change requests approved"],
      ["Schedule", "a", "Testing started three days late; launch date still holds"],
      ["Budget", "g", "£184k spent of £260k, in line with plan"],
      ["People", "a", "One developer off for two weeks; cover agreed from another team"],
      ["Risks", "r", "Payment provider has not confirmed the test account"],
    ];
    const ORDER = ["g", "a", "r"];
    const LABEL = { g: "Green", a: "Amber", r: "Red" };
    function overall() {
      const r = AREAS.filter((a) => a[1] === "r").length, am = AREAS.filter((a) => a[1] === "a").length;
      return r ? "r" : am >= 2 ? "a" : "g";
    }
    function draw() {
      const o = overall();
      const say = { g: "On track. No decisions needed this week.", a: "At risk, but recoverable with the actions below.", r: "Off track unless the decision below is made this week." }[o];
      root.innerHTML = `
<div class="p3-app p3-doc">
  <header class="p3-dh2"><div><span class="p3-kind">Weekly status · Week 7 of 12</span><h3>Customer portal launch</h3><p>Sponsor: Director of Customer Service · Project manager: Ada</p></div><div class="p3-big r-${o}">${LABEL[o]}<small>${say}</small></div></header>
  <section><h4>Health <small>click a rating to change it</small></h4>
    <ul class="p3-health">${AREAS.map((a, i) => `<li><span>${a[0]}</span><button type="button" data-i="${i}" class="p3-rag r-${a[1]}">${LABEL[a[1]]}</button><p>${esc(a[2])}</p></li>`).join("")}</ul></section>
  <div class="p3-grid2 tight">
    <section><h4>Moved this week</h4><ul class="p3-bul"><li>Account sign-up and login finished and tested</li><li>Content for the help centre approved</li><li>Load testing booked for week 9</li></ul></section>
    <section><h4>Stuck, and who holds it</h4><ul class="p3-bul"><li>Payment test account <em class="p3-hold h-client">Supplier</em></li><li>Privacy notice wording <em class="p3-hold h-legal">Legal</em></li></ul></section>
  </div>
  <div class="p3-grid2 tight">
    <section><h4>Decision needed</h4><p class="p3-ask">Approve switching to the backup payment provider if the test account is not confirmed by Friday. Cost: about £6k, no change to the launch date.</p></section>
    <section><h4>Next milestones</h4><ul class="p3-ms"><li><b>Week 8</b> Payments connected</li><li><b>Week 9</b> Load testing</li><li><b>Week 11</b> Pilot with 200 customers</li><li><b>Week 12</b> Launch</li></ul></section>
  </div>
</div>`;
    }
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-i]");
      if (!b) return;
      const a = AREAS[+b.dataset.i];
      a[1] = ORDER[(ORDER.indexOf(a[1]) + 1) % 3];
      draw();
    });
    draw();
  };

  ART.raid = function () {
    const TYPES = { R: "Risk", A: "Assumption", I: "Issue", D: "Dependency" };
    const rows = [
      { t: "R", d: "Payment provider may not confirm the test account in time", o: "Ada", l: 4, i: 5, due: "2026-12-04", s: "Open" },
      { t: "I", d: "Testing started three days late", o: "Samuel", l: 5, i: 3, due: "2026-11-28", s: "Open" },
      { t: "D", d: "Single sign-on needs the IT security review to finish", o: "Grace", l: 3, i: 4, due: "2026-12-02", s: "Open" },
      { t: "A", d: "Customers will verify their email within 24 hours", o: "Ada", l: 2, i: 3, due: "2026-12-10", s: "Open" },
      { t: "R", d: "Help centre content may not be translated before launch", o: "Funmi", l: 3, i: 2, due: "2026-12-12", s: "Open" },
      { t: "I", d: "One developer off sick for two weeks", o: "Samuel", l: 5, i: 2, due: "2026-11-30", s: "Open" },
      { t: "R", d: "Pilot customers may not respond to the invitation", o: "Funmi", l: 2, i: 3, due: "2026-12-15", s: "Open" },
      { t: "D", d: "Marketing launch email depends on the final go-live date", o: "Grace", l: 3, i: 2, due: "2026-12-18", s: "Open" },
      { t: "I", d: "Staging server ran out of storage", o: "Samuel", l: 5, i: 2, due: "2026-11-20", s: "Closed" },
    ];
    let type = "all", status = "Open", sort = "score", adding = false;
    const score = (r) => r.l * r.i;
    const sev = (n) => (n >= 15 ? "r" : n >= 8 ? "a" : "g");
    function draw() {
      let list = rows.filter((r) => (type === "all" || r.t === type) && (status === "all" || r.s === status));
      list = list.slice().sort((a, b) => (sort === "score" ? score(b) - score(a) : a.due.localeCompare(b.due)));
      const counts = Object.keys(TYPES).map((k) => [k, rows.filter((r) => r.t === k && r.s === "Open").length]);
      root.innerHTML = `
<div class="p3-app">
  <div class="p3-top">
    <div class="p3-chips">${[["all", "All"], ...Object.entries(TYPES)].map(([k, n]) => `<button type="button" data-ty="${k}" class="${type === k ? "on" : ""}">${n}${k !== "all" ? ` <small>${counts.find((c) => c[0] === k)[1]}</small>` : ""}</button>`).join("")}</div>
    <div class="p3-seg"><button type="button" data-st="Open" class="${status === "Open" ? "on" : ""}">Open</button><button type="button" data-st="all" class="${status === "all" ? "on" : ""}">Everything</button></div>
    <div class="p3-seg"><button type="button" data-so="score" class="${sort === "score" ? "on" : ""}">Most serious</button><button type="button" data-so="due" class="${sort === "due" ? "on" : ""}">Due soonest</button></div>
    <button type="button" class="p3-btn" data-add>${adding ? "Cancel" : "Add an entry"}</button>
  </div>
  ${adding ? `<form class="p3-form" data-form>
    <select name="t">${Object.entries(TYPES).map(([k, n]) => `<option value="${k}">${n}</option>`).join("")}</select>
    <input name="d" required maxlength="120" placeholder="What could happen, or what has happened">
    <input name="o" required maxlength="24" placeholder="Owner">
    <label>Likelihood <select name="l">${[1, 2, 3, 4, 5].map((n) => `<option ${n === 3 ? "selected" : ""}>${n}</option>`).join("")}</select></label>
    <label>Impact <select name="i">${[1, 2, 3, 4, 5].map((n) => `<option ${n === 3 ? "selected" : ""}>${n}</option>`).join("")}</select></label>
    <input name="due" type="date" required value="2026-12-11">
    <button class="p3-btn" type="submit">Add</button></form>` : ""}
  <div class="p3-scroll"><table class="p3-table">
    <thead><tr><th>Type</th><th>Description</th><th>Owner</th><th>Score</th><th>Due</th><th>Status</th></tr></thead>
    <tbody>${list.map((r) => `<tr class="${r.s === "Closed" ? "closed" : ""}"><td><span class="p3-type t-${r.t}">${TYPES[r.t]}</span></td><td>${esc(r.d)}</td><td>${esc(r.o)}</td><td><span class="p3-sev s-${sev(score(r))}">${score(r)}</span></td><td>${new Date(r.due).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td><td><button type="button" class="p3-link" data-close="${rows.indexOf(r)}">${r.s === "Open" ? "Close" : "Reopen"}</button></td></tr>`).join("") || `<tr><td colspan="6" class="p3-empty">Nothing here.</td></tr>`}</tbody>
  </table></div>
  <p class="p3-note">Score is likelihood × impact, each out of 5. Anything at 15 or above goes to the sponsor that week.</p>
</div>`;
    }
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || b.type === "submit") return;
      if (b.dataset.ty) type = b.dataset.ty;
      if (b.dataset.st) status = b.dataset.st;
      if (b.dataset.so) sort = b.dataset.so;
      if (b.hasAttribute("data-add")) adding = !adding;
      if (b.dataset.close) { const r = rows[+b.dataset.close]; r.s = r.s === "Open" ? "Closed" : "Open"; }
      draw();
    });
    root.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      rows.unshift({ t: f.get("t"), d: f.get("d"), o: f.get("o"), l: +f.get("l"), i: +f.get("i"), due: f.get("due"), s: "Open" });
      adding = false; type = "all"; status = "Open";
      draw();
    });
    draw();
  };

  ART.aar = function () {
    const EX = {
      client: "Lakeside Council, IT and finance teams", date: "Tuesday 18 November", purpose: "Introduce our managed support service and understand their current set-up",
      ours: "Account lead, technical lead, PMO",
      people: [["Head of IT", "Runs a team of six; deep knowledge of their network, less of cloud tools"], ["Finance business partner", "Holds the budget; focused on cost per user"], ["Service desk manager", "Handles 400 tickets a month; the person who feels the pain most"]],
      pains: ["Tickets take four days on average to close", "No visibility of which devices are out of warranty", "Their current contract renews in March and they are unhappy with it"],
      outlook: "warm",
      answers: [["Can you take over from their current supplier mid-contract?", 4], ["What does it cost per user?", 2], ["How do you handle out-of-hours calls?", 5]],
      steps: [["Send a costed proposal with three service levels", "Account lead", "28 November"], ["Book a call between their service desk manager and one of our clients", "Account lead", "2 December"], ["Prepare a clear pricing sheet for the finance partner", "Technical lead", "26 November"]],
      lesson: "We were not ready for the pricing question. Next time, bring an indicative price per user.",
    };
    let mode = "example";
    const stars = (n) => [1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("");
    function text() {
      return [`After action review: ${EX.client}`, `Date: ${EX.date}`, `Purpose: ${EX.purpose}`, `Our team: ${EX.ours}`, "", "Who was in the room",
        ...EX.people.map((p) => `- ${p[0]}: ${p[1]}`), "", "What they told us", ...EX.pains.map((p) => `- ${p}`), "", `Outlook: ${EX.outlook}`, "",
        "How well we answered (out of 5)", ...EX.answers.map((a) => `- ${a[0]} ${a[1]}/5`), "", "Next steps", ...EX.steps.map((s) => `- ${s[0]} (${s[1]}, ${s[2]})`), "", `What we will do differently: ${EX.lesson}`].join("\n");
    }
    function blank() {
      return ["After action review: [client and teams]", "Date:", "Purpose of the meeting:", "Our team:", "", "Who was in the room (role, and what they know)", "- ", "- ", "", "What they told us (their problems, in their words)", "- ", "- ", "", "Outlook: hot / warm / cold", "",
        "How well we answered their questions (out of 5)", "- ", "", "Next steps (action, owner, date)", "- ", "- ", "", "What we will do differently next time:"].join("\n");
    }
    function draw() {
      const ex = mode === "example";
      root.innerHTML = `
<div class="p3-app p3-doc">
  <div class="p3-top"><div class="p3-seg"><button type="button" data-m="example" class="${ex ? "on" : ""}">Completed example</button><button type="button" data-m="blank" class="${ex ? "" : "on"}">Blank template</button></div><button type="button" class="p3-btn" data-copy>Copy as text</button></div>
  ${ex ? `
  <header class="p3-dh2"><div><span class="p3-kind">After action review · ${EX.date}</span><h3>${EX.client}</h3><p>${EX.purpose}. Our team: ${EX.ours}.</p></div><div class="p3-big o-${EX.outlook}">Warm<small>Interested, with a real deadline in March</small></div></header>
  <section><h4>Who was in the room</h4><ul class="p3-people">${EX.people.map((p) => `<li><b>${p[0]}</b><span>${p[1]}</span></li>`).join("")}</ul></section>
  <div class="p3-grid2 tight">
    <section><h4>What they told us</h4><ul class="p3-bul">${EX.pains.map((p) => `<li>${p}</li>`).join("")}</ul></section>
    <section><h4>How well we answered</h4><ul class="p3-ans">${EX.answers.map((a) => `<li><span>${a[0]}</span><b class="p3-stars">${stars(a[1])}</b></li>`).join("")}</ul></section>
  </div>
  <section><h4>Next steps</h4><table class="p3-table small"><thead><tr><th>Action</th><th>Owner</th><th>By</th></tr></thead><tbody>${EX.steps.map((s) => `<tr><td>${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td></tr>`).join("")}</tbody></table></section>
  <section><h4>What we will do differently</h4><p class="p3-ask">${EX.lesson}</p></section>`
  : `<textarea class="p3-blank" spellcheck="false" aria-label="Blank after action review template">${esc(blank())}</textarea>`}
</div>`;
    }
    root.addEventListener("click", async (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.m) { mode = b.dataset.m; draw(); return; }
      if (b.hasAttribute("data-copy")) {
        const ta = root.querySelector(".p3-blank");
        const t = mode === "example" ? text() : ta ? ta.value : blank();
        try { await navigator.clipboard.writeText(t); b.textContent = "Copied"; } catch (err) { b.textContent = "Select and copy"; }
        setTimeout(() => { b.textContent = "Copy as text"; }, 1800);
      }
    });
    draw();
  };

  const fn = ART[root.dataset.art];
  if (fn) fn();
})();
