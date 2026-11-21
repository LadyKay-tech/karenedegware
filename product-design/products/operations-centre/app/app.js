/*
  Operations Centre, demo workspace.
  Everything here is invented: the people, organisations, opportunities and figures.
  Data is generated in the browser and saved to this browser only.
*/
(function () {
  "use strict";
  const KEY = "opsc-demo-v5";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------- reference data ---------------- */
  const ROLES = {
    bd: { name: "Business development", tag: "BD", bg: "#eef0ff", fg: "#3343b8", target: 16 },
    pm: { name: "Product", tag: "PM", bg: "#ddf5ea", fg: "#0f7a4d", target: 4 },
    cs: { name: "Client success", tag: "CS", bg: "#fdf0d4", fg: "#94600a", target: 3 },
    md: { name: "Market development", tag: "MD", bg: "#fde8e7", fg: "#b8332d", target: 2 },
  };
  const PROFILES = [["pmo", "Project Management Office", "All teams"], ["bd", "Business development", "Business development view"], ["pm", "Product", "Product view"], ["cs", "Client success", "Client success view"], ["md", "Market development", "Market development view"], ["exec", "Executive", "Leadership view"]];
  const PEOPLE = [["p1", "Tolu Adebayo", "bd"], ["p2", "James Carter", "bd"], ["p3", "Chioma Eze", "bd"], ["p4", "Daniel Musa", "bd"], ["p5", "Priya Nair", "pm"], ["p6", "Kwame Mensah", "cs"], ["p7", "Grace Okon", "cs"], ["p8", "Samuel Reid", "md"]].map(([id, name, role]) => ({ id, name, role }));
  const person = (id) => PEOPLE.find((p) => p.id === id) || PEOPLE[0];
  const STAGES = ["First meeting", "Discovery", "Solution design", "Proposal", "Negotiation", "Approval", "Contracting", "Delivery", "Invoiced", "Paid"];
  const EXPECT = [7, 10, 14, 10, 14, 10, 14, 30, 21, 30];
  const SCOL = ["#3b82f6", "#6366f1", "#f59e0b", "#f97316", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#10b981", "#15803d"];
  const TARGET = 25;
  const HOLDERS = ["Finance", "Legal", "Client", "Delivery", "Leadership"];
  const CATS = { A: "p-g", B: "p-v", C: "p-a", D: "p-r", E: "p-b" };
  const ORGS = [
    ["Kestrel Bank", "Banking", "London"], ["Harbour Logistics", "Logistics", "Lagos"], ["Atlas Clinics", "Healthcare", "Accra"], ["Northgate Foods", "Retail", "Manchester"],
    ["Meridian Schools", "Education", "Abuja"], ["Lakeside Council", "Public sector", "Leeds"], ["Brightwater Retail", "Retail", "Nairobi"], ["Summit Insurance", "Insurance", "London"],
    ["Orchid Telecom", "Telecoms", "Lagos"], ["Pinecrest Homes", "Property", "Birmingham"], ["Redwood Freight", "Logistics", "Port Elizabeth"], ["Silverline Media", "Media", "London"],
    ["Cedar Health", "Healthcare", "Kumasi"], ["Falcon Airways", "Aviation", "Nairobi"], ["Marlow Credit Union", "Banking", "Bristol"], ["Quayside Hotels", "Hospitality", "Cape Town"],
    ["Ironbridge Manufacturing", "Manufacturing", "Sheffield"], ["Sunrise Microfinance", "Banking", "Ibadan"], ["Greenfield Agritech", "Agriculture", "Kaduna"], ["Bluewave Energy Services", "Utilities", "Accra"],
    ["Highland Water", "Utilities", "Glasgow"], ["Copperleaf Pharmacy", "Healthcare", "Lagos"], ["Elmwood University", "Education", "Nottingham"], ["Vantage Couriers", "Logistics", "Abuja"],
  ];
  const NEEDS = ["data warehouse", "staff training programme", "cloud migration", "security review", "helpdesk contract", "reporting dashboards", "CRM rollout", "network upgrade", "process automation", "analytics retainer", "device management", "compliance audit", "customer portal", "payroll integration"];
  const UPDATE_NOTES = ["Sent the revised proposal to procurement", "Held a discovery call with the finance team", "Shared a case study with the head of operations", "Ran a product demo for the IT team", "Agreed next steps for a two-week pilot", "Clarified scope with the project sponsor", "Shared three pricing options", "Answered security questions from their IT lead", "Presented the implementation plan", "Introduced our delivery lead to their team", "Confirmed decision makers and timeline", "Sent a draft statement of work"];
  const COMMIT_NOTES = ["Send revised pricing", "Book a demo with the operations team", "Share a reference client", "Draft the statement of work", "Confirm budget holder", "Send the security questionnaire back", "Arrange a site visit", "Follow up on the signed contract", "Prepare the pilot plan", "Send the onboarding schedule"];
  const FIRST = ["Ade", "Amaka", "Ben", "Chidi", "Efua", "Femi", "Hannah", "Ibrahim", "Joy", "Kofi", "Lara", "Musa", "Nkem", "Oliver", "Rita", "Sipho", "Tunde", "Uche", "Wale", "Zara"];
  const LAST = ["Adeyemi", "Bello", "Clarke", "Diallo", "Edwards", "Fashola", "Green", "Hughes", "Idowu", "Johnson", "Kamara", "Lawal", "Mensah", "Nwosu", "Owusu", "Patel", "Quinn", "Sule", "Taylor", "Wright"];
  const SOURCES = ["Referral", "Event", "Website", "Outbound", "Partner"];

  /* ---------------- dates ---------------- */
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const isWeekday = (s) => { const g = parse(s).getDay(); return g > 0 && g < 6; };
  const diff = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
  const prevWeekday = (s) => { let d = addDays(s, -1); while (!isWeekday(d)) d = addDays(d, -1); return d; };
  const nice = (s, opts) => parse(s).toLocaleDateString("en-GB", opts || { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const short = (s) => parse(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  let TODAY = iso(new Date());
  if (!isWeekday(TODAY)) TODAY = prevWeekday(TODAY);

  /* ---------------- seeded data ---------------- */
  let seed = 20261;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const uid = () => Math.random().toString(36).slice(2, 10);

  function generate() {
    seed = 20261;
    const bdPeople = PEOPLE.filter((p) => p.role === "bd");
    const accounts = ORGS.map(([name, industry, city], i) => ({ id: "a" + i, name, industry, city, cat: "ABCDE"[i % 5], owner: bdPeople[i % 4].id, contacts: 1 + Math.floor(rnd() * 4), revenue: Math.round(40 + rnd() * 900) }));
    const start = addDays(TODAY, -120);
    const opps = [];
    const W = [16, 13, 10, 8, 6, 5, 4, 4, 3, 3];
    for (let i = 0; i < 72; i++) {
      const acc = accounts[Math.floor(rnd() * accounts.length)];
      let r = rnd() * 72, stage = 0;
      while (r > W[stage] && stage < 9) { r -= W[stage]; stage++; }
      const since = addDays(TODAY, -Math.round(rnd() < 0.8 ? rnd() * EXPECT[stage] : EXPECT[stage] * (1.05 + rnd() * 1.2)) - 1);
      opps.push({ id: "o" + i, title: `${acc.name} ${pick(NEEDS)}`, account: acc.id, owner: acc.owner, stage, since, created: addDays(since, -Math.round(10 + rnd() * 70)), value: Math.round((15 + rnd() * 420) / 5) * 5 });
    }
    const events = [];
    const commitments = [];
    for (let d = start; d <= TODAY; d = addDays(d, 1)) {
      if (!isWeekday(d)) continue;
      const n = Math.round(12 + rnd() * 9 + (diff(start, d) / 120) * 4);
      for (let k = 0; k < n; k++) {
        const r = rnd();
        const role = r < 0.7 ? "bd" : r < 0.82 ? "pm" : r < 0.94 ? "cs" : "md";
        const who = pick(PEOPLE.filter((p) => p.role === role));
        const opp = pick(opps);
        if (rnd() < 0.11 && opp.stage > 0) {
          const to = Math.max(1, Math.min(9, opp.stage - Math.floor(rnd() * 2)));
          events.push({ id: uid(), date: d, who: who.id, opp: opp.id, kind: "movement", from: to - 1, to, note: "" });
        } else {
          events.push({ id: uid(), date: d, who: who.id, opp: opp.id, kind: "update", note: pick(UPDATE_NOTES) });
        }
      }
      if (rnd() < 0.75) {
        const opp = pick(opps);
        const due = addDays(d, 2 + Math.floor(rnd() * 8));
        const closed = diff(d, TODAY) > 4 && rnd() < 0.86 ? addDays(d, 1 + Math.floor(rnd() * 6)) : null;
        commitments.push({ id: uid(), text: pick(COMMIT_NOTES), opp: opp.id, who: opp.owner, created: d, due, closed: closed && closed <= TODAY ? closed : null });
      }
    }
    const blockers = [];
    opps.filter((o) => o.stage < 9 && diff(o.since, TODAY) > EXPECT[o.stage] * 1.2).slice(0, 9).forEach((o, i) => {
      blockers.push({ id: uid(), opp: o.id, holder: HOLDERS[i % 5], note: ["Waiting on budget sign-off", "Contract with their legal team", "Client restructuring, no decision maker", "Needs a delivery lead assigned", "Pricing approval outstanding"][i % 5], opened: addDays(o.since, Math.round(EXPECT[o.stage] * 0.8)), resolved: i > 6 ? TODAY : null });
    });
    const leads = [];
    for (let i = 0; i < 140; i++) {
      const created = addDays(TODAY, -Math.floor(rnd() * 100));
      const acc = rnd() < 0.5 ? pick(accounts) : null;
      const r = rnd();
      leads.push({ id: "l" + i, name: `${pick(FIRST)} ${pick(LAST)}`, title: `${cap(pick(NEEDS))}`, company: acc ? acc.name : `${pick(["Riverside", "Crown", "Oakland", "Sterling", "Beacon", "Unity", "Horizon", "Pioneer"])} ${pick(["Group", "Holdings", "Partners", "Services", "Ltd"])}`, stage: r < 0.06 ? "Converted" : r < 0.3 ? "Qualified" : r < 0.62 ? "Contacted" : "New", cat: "ABCDE"[Math.floor(rnd() * 5)], source: pick(SOURCES), owner: pick(bdPeople).id, value: Math.round((10 + rnd() * 300) / 5) * 5, created });
    }
    const notes = [
      { id: uid(), title: "Leadership questions for Thursday", body: "Two contracts are waiting on legal. Ask leadership whether we can use the standard terms for anything under £50k.\n\nAtlas Clinics wants a pilot before committing. Do we fund it from the delivery budget?", updated: TODAY },
      { id: uid(), title: "Scrum rules, reminder", body: "An update counts when the client sees progress or the opportunity changes stage.\nA chaser with no reply is a commitment.\nRecords without an account or category go back to the owner before they are reported.", updated: addDays(TODAY, -6) },
      { id: uid(), title: "Ideas for next quarter", body: "Partner referrals brought in our best leads this month. Worth a proper programme.\nClient success should join the Monday movement review.", updated: addDays(TODAY, -15) },
    ];
    return { v: 3, seeded: TODAY, accounts, opps, events, commitments, blockers, leads, notes };
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  let S;
  try { S = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { S = null; }
  if (!S || S.seeded !== TODAY) S = generate();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked */ } };
  save();

  /* ---------------- UI state ---------------- */
  const U = { view: "dashboard", profile: "pmo", date: TODAY, trend: "daily", stageMode: "now", cfilter: "open", efilter: "all", masked: true, period: "month", anchor: TODAY, rtab: "synthesis", note: S.notes[0] && S.notes[0].id, q: "", leadsShown: 20, goal: "month" };
  const roleOf = () => (ROLES[U.profile] ? U.profile : null);
  const inRole = (pid) => !roleOf() || person(pid).role === roleOf();
  const target = () => (roleOf() ? ROLES[roleOf()].target : TARGET);
  const opp = (id) => S.opps.find((o) => o.id === id) || { title: "Unknown", account: "", stage: 0 };
  const acct = (id) => S.accounts.find((a) => a.id === id) || { name: "" };
  const money = (k) => (U.masked ? "£•••" : k >= 1000 ? "£" + (k / 1000).toFixed(2).replace(/\.?0+$/, "") + "m" : "£" + Math.round(k) + "k");
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const avColour = (id) => ["#4b5bdc", "#0f9f6e", "#d9822b", "#c2410c", "#7c3aed", "#0e7490", "#be185d", "#4d7c0f"][(parseInt(String(id).replace(/\D/g, ""), 10) || 0) % 8];
  const av = (pid) => { const p = person(pid); return `<span class="av" style="background:${avColour(p.id)}" title="${esc(p.name)}">${initials(p.name)}</span>`; };
  const rtag = (role) => `<span class="rtag" style="background:${ROLES[role].bg};color:${ROLES[role].fg}">${ROLES[role].tag}</span>`;
  const ev = (filter) => S.events.filter((e) => inRole(e.who) && (!filter || filter(e)));
  const daysIn = (o, at) => diff(o.since, at || U.date);
  const stalled = (at) => S.opps.filter((o) => o.stage < 9 && o.since <= (at || U.date) && daysIn(o, at) > EXPECT[o.stage] && (!roleOf() || roleOf() !== "bd" || true));
  const openCommit = (at) => S.commitments.filter((c) => inRole(c.who) && c.created <= (at || U.date) && (!c.closed || c.closed > (at || U.date)));
  const openBlockers = () => S.blockers.filter((b) => !b.resolved);

  /* ---------------- charts ---------------- */
  function lineChart({ labels, series, tgt, h = 220 }) {
    const W = 720, P = { l: 34, r: 14, t: 14, b: 28 };
    const max = Math.max(tgt || 0, ...series.flatMap((s) => s.values)) * 1.15 || 10;
    const step = Math.pow(10, Math.floor(Math.log10(max))) / (max / Math.pow(10, Math.floor(Math.log10(max))) > 5 ? 1 : 2);
    const top = Math.ceil(max / step) * step;
    const x = (i) => P.l + (labels.length < 2 ? 0 : (i * (W - P.l - P.r)) / (labels.length - 1));
    const y = (v) => P.t + (h - P.t - P.b) * (1 - v / top);
    let g = `<g class="grid">`;
    for (let v = 0; v <= top + 0.001; v += step) g += `<line x1="${P.l}" x2="${W - P.r}" y1="${y(v)}" y2="${y(v)}"/><text x="${P.l - 8}" y="${y(v) + 4}" text-anchor="end">${Math.round(v)}</text>`;
    g += "</g>";
    const every = Math.ceil(labels.length / 8);
    const xl = labels.map((l, i) => (i % every === 0 || i === labels.length - 1 ? `<text x="${x(i)}" y="${h - 8}" text-anchor="middle">${esc(l)}</text>` : "")).join("");
    const paths = series.map((s) => {
      const pts = s.values.map((v, i) => [x(i), y(v)]);
      const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");
      const area = s.fill ? `<path d="${d}L${pts[pts.length - 1][0]},${y(0)}L${pts[0][0]},${y(0)}Z" fill="${s.color}" opacity=".09" stroke="none"/>` : "";
      const dots = s.dots === false ? "" : pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${s.color}" stroke="#fff" stroke-width="1.5"><title>${esc(labels[i])}: ${s.values[i]}</title></circle>`).join("");
      return `${area}<path d="${d}" stroke="${s.color}" stroke-width="2.2" ${s.dash ? 'stroke-dasharray="5 4"' : ""}/>${dots}`;
    }).join("");
    const t = tgt ? `<line class="tline" x1="${P.l}" x2="${W - P.r}" y1="${y(tgt)}" y2="${y(tgt)}"/><text x="${W - P.r}" y="${y(tgt) - 5}" text-anchor="end" style="fill:#e04a43">Target ${tgt}</text>` : "";
    return `<svg class="chart" viewBox="0 0 ${W} ${h}" role="img">${g}${t}${paths}${xl}</svg>`;
  }
  function barChart({ labels, values, colors, h = 260 }) {
    const W = 960, P = { l: 34, r: 10, t: 22, b: 40 };
    const max = Math.max(4, ...values);
    const top = Math.ceil(max / 4) * 4;
    const bw = (W - P.l - P.r) / labels.length;
    const y = (v) => P.t + (h - P.t - P.b) * (1 - v / top);
    let g = `<g class="grid">`;
    for (let i = 0; i <= 4; i++) { const v = (top / 4) * i; g += `<line x1="${P.l}" x2="${W - P.r}" y1="${y(v)}" y2="${y(v)}"/><text x="${P.l - 8}" y="${y(v) + 4}" text-anchor="end">${Math.round(v)}</text>`; }
    g += "</g>";
    const bars = values.map((v, i) => {
      const x0 = P.l + i * bw + bw * 0.16, w = bw * 0.68;
      return `<rect x="${x0}" y="${y(v)}" width="${w}" height="${Math.max(0, y(0) - y(v))}" rx="4" fill="${colors[i]}" stroke="none"><title>${esc(labels[i])}: ${v}</title></rect><text x="${x0 + w / 2}" y="${y(v) - 6}" text-anchor="middle" style="fill:#161a23;font-weight:700">${v}</text><text x="${x0 + w / 2}" y="${h - 16}" text-anchor="middle">${esc(labels[i].length > 13 ? labels[i].slice(0, 12) + "…" : labels[i])}</text>`;
    }).join("");
    return `<svg class="chart" viewBox="0 0 ${W} ${h}" role="img">${g}${bars}</svg>`;
  }

  /* ---------------- navigation ---------------- */
  const ICON = {
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    updates: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 3-5.4 6-5.4s5.4 2 6 5.4"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14.2c2.6.2 4.4 2 5 5"/>',
    commitments: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 12.2l2.4 2.3 4.6-5"/>',
    blockers: '<path d="M12 3.5l9 16H3z"/><path d="M12 10v4.2M12 17.2v.1"/>',
    stalled: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pipeline: '<rect x="3" y="7" width="18" height="12" rx="2.5"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18"/>',
    notes: '<path d="M6 3.5h9l3.5 3.5v13.5H6z"/><path d="M9 11h6M9 14.5h6M9 18h4"/>',
    reports: '<path d="M5 3.5h14v17H5z"/><path d="M8.5 16v-3M12 16V9M15.5 16v-5"/>',
    leads: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    accounts: '<path d="M4 20.5V7l8-3.5L20 7v13.5"/><path d="M9 20.5v-5h6v5M8 10h.1M12 10h.1M16 10h.1"/>',
    goals: '<path d="M8 4h8v4.5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 12.5V17M8.5 20.5h7"/>',
  };
  const VIEWS = [
    ["Daily operations", [["dashboard", "Dashboard"], ["updates", "Role updates"], ["commitments", "Commitments"], ["blockers", "Blockers"], ["stalled", "Stalled deals"], ["pipeline", "Pipeline"], ["notes", "Notes"], ["reports", "Reports"]]],
    ["CRM", [["leads", "Leads"], ["accounts", "Accounts"], ["goals", "Goals and forecasts"]]],
  ];
  function drawNav() {
    const counts = { commitments: [openCommit(TODAY).length, ""], blockers: [openBlockers().length, ""], stalled: [stalled(TODAY).length, "amber"] };
    $("nav").innerHTML = VIEWS.map(([g, items]) => `<span class="cap">${g}</span>` + items.map(([k, n]) => `<button type="button" data-view="${k}" class="${U.view === k ? "on" : ""}" title="${n}"><svg viewBox="0 0 24 24">${ICON[k]}</svg><span class="lbl">${n}</span>${counts[k] && counts[k][0] ? `<span class="badge ${counts[k][1]}">${counts[k][0]}</span>` : ""}</button>`).join("")).join("");
  }
  $("profile").innerHTML = PROFILES.map(([k, n]) => `<option value="${k}">${n}</option>`).join("");
  $("profile").addEventListener("change", (e) => { U.profile = e.target.value; render(); });
  $("nav").addEventListener("click", (e) => { const b = e.target.closest("[data-view]"); if (!b) return; U.view = b.dataset.view; $("oc").classList.remove("open"); render(); $("view").scrollTop = 0; });
  $("collapse").addEventListener("click", () => $("oc").classList.toggle("mini"));
  $("menu").addEventListener("click", () => $("oc").classList.toggle("open"));
  $("side").addEventListener("click", (e) => { if (e.target === $("side")) $("oc").classList.remove("open"); });
  $("viewDate").max = TODAY;
  $("viewDate").addEventListener("change", (e) => { const v = e.target.value || TODAY; U.date = v > TODAY ? TODAY : v; U.anchor = U.date; render(); });
  $("addBtn").addEventListener("click", () => openEntry());
  $("resetBtn").addEventListener("click", () => { S = generate(); save(); U.date = TODAY; U.anchor = TODAY; render(); toast("Demo data reset"); });
  $("sessDate").textContent = nice(TODAY, { day: "numeric", month: "short", year: "numeric" });

  function toast(t) { const el = document.createElement("div"); el.className = "toast"; el.textContent = t; $("toasts").appendChild(el); setTimeout(() => el.remove(), 2800); }

  /* ---------------- views ---------------- */
  const V = {};
  const TITLES = { dashboard: "Dashboard", updates: "Role updates", commitments: "Commitments", blockers: "Blockers", stalled: "Stalled deals", pipeline: "Pipeline", notes: "Notes", reports: "Reports", leads: "Leads", accounts: "Accounts", goals: "Goals and forecasts" };

  V.dashboard = function () {
    const d = U.date;
    const today = ev((e) => e.date === d);
    const prev = ev((e) => e.date === prevWeekday(d));
    const t = target();
    const gap = Math.max(0, t - today.length);
    const live = S.opps.filter((o) => o.stage < 9 && o.created <= d);
    const created = S.opps.filter((o) => o.created === d).length;
    const moved = today.filter((e) => e.kind === "movement");
    const st = stalled(d);
    const oc = openCommit(d);
    const dueSoon = oc.filter((c) => c.due <= addDays(d, 5)).length;
    let labels = [], vals = [];
    if (U.trend === "daily") {
      let x = d; const days = [];
      for (let i = 0; i < 10; i++) { days.unshift(x); x = prevWeekday(x); }
      labels = days.map(short); vals = days.map((day) => ev((e) => e.date === day).length);
    } else {
      for (let w = 7; w >= 0; w--) {
        const end = addDays(d, -7 * w), startW = addDays(end, -6);
        labels.push(short(startW)); vals.push(ev((e) => e.date >= startW && e.date <= end).length);
      }
    }
    const roles = Object.keys(ROLES).filter((r) => !roleOf() || r === roleOf());
    const byRole = roles.map((r) => [r, today.filter((e) => person(e.who).role === r).length]);
    const maxRole = Math.max(1, ...byRole.map((x) => x[1]));
    let sv;
    if (U.stageMode === "now") sv = STAGES.map((s, i) => S.opps.filter((o) => o.stage === i && o.created <= d).length);
    else { const ws = addDays(d, -6); sv = STAGES.map((s, i) => ev((e) => e.kind === "movement" && e.to === i && e.date >= ws && e.date <= d).length); }
    return `
<div class="grid g4">
  <div class="card kpi t-r"><span class="cap">Total updates</span><b>${today.length}</b><div class="meter ${today.length >= t ? "g" : "r"}"><i style="width:${Math.min(100, (today.length / t) * 100)}%"></i></div><p>vs target <b style="display:inline;font-size:13px">${t}</b> ${gap ? `<span class="pill p-r">${gap} short</span>` : `<span class="pill p-g">Target met</span>`}</p></div>
  <div class="card kpi"><span class="cap">Pipeline movement</span><b>${moved.length}</b><p>${live.length} open opportunities · <b style="display:inline;font-size:13px;color:#4b5bdc">+${created} new</b></p></div>
  <div class="card kpi t-a"><span class="cap">Stalled deals</span><b>${st.length}</b><p>Over the expected time in their stage</p></div>
  <div class="card kpi t-g"><span class="cap">Open commitments</span><b>${oc.length}</b><p>${dueSoon} due in the next five days</p></div>
</div>
<div class="grid g21 mt">
  <section class="card"><div class="chead"><h3>Daily update trend</h3><small>${today.length >= prev.length ? "+" : ""}${today.length - prev.length} vs ${short(prevWeekday(d))}</small><div class="sp seg acc"><button type="button" data-act="trend" data-v="daily" class="${U.trend === "daily" ? "on" : ""}">Daily</button><button type="button" data-act="trend" data-v="weekly" class="${U.trend === "weekly" ? "on" : ""}">Weekly</button></div></div>
    <div class="cbody">${lineChart({ labels, series: [{ values: vals, color: "#e04a43", fill: true }], tgt: U.trend === "daily" ? t : t * 5 })}</div></section>
  <section class="card"><div class="chead"><h3>Updates by role</h3><small>${nice(d, { day: "numeric", month: "short" })}</small></div>
    <ul class="rows role-bars">${byRole.map(([r, n]) => `<li>${rtag(r)}<span class="rl"><span>${ROLES[r].name}</span><span class="meter" style="--x:1"><i style="width:${(n / maxRole) * 100}%;background:${ROLES[r].fg}"></i></span></span><b>${n}</b></li>`).join("")}</ul></section>
</div>
<section class="card mt"><div class="chead"><h3>Opportunity movement by stage</h3><small>${U.stageMode === "now" ? "Opportunities sitting in each stage" : "Moves into each stage over the last seven days"}</small><div class="sp seg acc"><button type="button" data-act="stage" data-v="now" class="${U.stageMode === "now" ? "on" : ""}">In stage now</button><button type="button" data-act="stage" data-v="week" class="${U.stageMode === "week" ? "on" : ""}">Moved this week</button></div></div>
  <div class="cbody">${barChart({ labels: STAGES, values: sv, colors: SCOL })}</div></section>
<div class="grid g2 mt">
  <section class="card"><div class="chead"><h3>Open commitments</h3><button type="button" class="sp link" data-goto="commitments">View all</button></div>
    ${oc.length ? `<ul class="rows">${oc.sort((a, b) => a.due.localeCompare(b.due)).slice(0, 6).map((c) => `<li>${av(c.who)}<span class="main2"><b>${esc(c.text)}</b><span>${esc(opp(c.opp).title)}</span></span>${c.due < d ? `<span class="pill p-r">Overdue</span>` : `<span class="pill p-n">Due ${short(c.due)}</span>`}</li>`).join("")}</ul>` : `<p class="empty">Nothing open.</p>`}</section>
  <section class="card"><div class="chead"><h3>Stalled deals</h3><button type="button" class="sp link" data-goto="stalled">View all</button></div>
    ${st.length ? `<ul class="rows">${st.sort((a, b) => daysIn(b) / EXPECT[b.stage] - daysIn(a) / EXPECT[a.stage]).slice(0, 6).map((o) => { const bl = openBlockers().find((x) => x.opp === o.id); return `<li>${av(o.owner)}<span class="main2"><b>${esc(o.title)}</b><span>${STAGES[o.stage]} · ${daysIn(o)} days, expected ${EXPECT[o.stage]}</span></span>${bl ? `<span class="pill p-v">${bl.holder}</span>` : `<span class="pill p-a">No blocker logged</span>`}</li>`; }).join("")}</ul>` : `<p class="empty">Nothing is stalled.</p>`}</section>
</div>`;
  };

  V.updates = function () {
    const d = U.date;
    let list = ev((e) => e.date === d);
    if (U.efilter !== "all") list = list.filter((e) => e.kind === U.efilter);
    const people = PEOPLE.filter((p) => inRole(p.id));
    const groups = people.map((p) => [p, list.filter((e) => e.who === p.id)]).filter((g) => g[1].length || U.efilter === "all");
    return `
<div class="toolbar"><div class="seg"><button type="button" data-act="ef" data-v="all" class="${U.efilter === "all" ? "on" : ""}">Everything</button><button type="button" data-act="ef" data-v="update" class="${U.efilter === "update" ? "on" : ""}">Updates</button><button type="button" data-act="ef" data-v="movement" class="${U.efilter === "movement" ? "on" : ""}">Movements</button></div><span class="muted">${list.length} entries on ${nice(d, { weekday: "long", day: "numeric", month: "long" })}</span></div>
<div class="grid g2">${groups.map(([p, items]) => `<section class="card"><div class="chead">${av(p.id)}<div><h3>${esc(p.name)}</h3><small>${ROLES[p.role].name}</small></div><span class="sp pill ${items.length ? "p-b" : "p-r"}">${items.length ? items.length + " today" : "No updates"}</span></div>
  ${items.length ? `<ul class="rows">${items.map((e) => `<li><span class="main2"><b>${esc(opp(e.opp).title)}</b><span>${e.kind === "movement" ? `Moved from ${STAGES[e.from]} to ${STAGES[e.to]}` : esc(e.note)}</span></span><span class="pill ${e.kind === "movement" ? "p-g" : "p-b"}">${e.kind === "movement" ? "Movement" : "Update"}</span></li>`).join("")}</ul>` : `<p class="empty">Nothing logged for this day.</p>`}</section>`).join("")}</div>`;
  };

  V.commitments = function () {
    const all = S.commitments.filter((c) => inRole(c.who) && c.created <= U.date);
    const open = all.filter((c) => !c.closed || c.closed > U.date);
    const closed = all.filter((c) => c.closed && c.closed <= U.date);
    const rate = all.length ? Math.round((closed.length / all.length) * 100) : 0;
    let list = U.cfilter === "open" ? open : U.cfilter === "closed" ? closed : all;
    list = list.slice().sort((a, b) => (U.cfilter === "closed" ? b.closed.localeCompare(a.closed) : a.due.localeCompare(b.due))).slice(0, 60);
    return `
<div class="grid g3"><div class="card kpi t-a"><span class="cap">Open</span><b>${open.length}</b><p>${open.filter((c) => c.due < U.date).length} overdue</p></div><div class="card kpi t-g"><span class="cap">Closed</span><b>${closed.length}</b><p>Since tracking began</p></div><div class="card kpi"><span class="cap">Closure rate</span><b>${rate}%</b><div class="meter ${rate >= 75 ? "g" : "a"}"><i style="width:${rate}%"></i></div></div></div>
<section class="card mt"><div class="chead"><h3>Commitments</h3><div class="sp seg"><button type="button" data-act="cf" data-v="open" class="${U.cfilter === "open" ? "on" : ""}">Open</button><button type="button" data-act="cf" data-v="closed" class="${U.cfilter === "closed" ? "on" : ""}">Closed</button><button type="button" data-act="cf" data-v="all" class="${U.cfilter === "all" ? "on" : ""}">All</button></div></div>
<div class="tw"><table class="t"><thead><tr><th>Commitment</th><th>Opportunity</th><th>Owner</th><th>Made</th><th>Due</th><th></th></tr></thead><tbody>
${list.map((c) => { const done = c.closed && c.closed <= U.date; return `<tr class="${done ? "done" : ""}"><td><b>${esc(c.text)}</b></td><td>${esc(opp(c.opp).title)}</td><td><span class="co">${av(c.who)}${esc(person(c.who).name)}</span></td><td>${short(c.created)}</td><td>${done ? `<span class="pill p-g">Closed ${short(c.closed)}</span>` : c.due < U.date ? `<span class="pill p-r">${short(c.due)}</span>` : short(c.due)}</td><td>${done ? "" : `<button type="button" class="btn sec small" data-close="${c.id}">Mark done</button>`}</td></tr>`; }).join("") || `<tr><td colspan="6" class="empty">Nothing here.</td></tr>`}
</tbody></table></div></section>`;
  };

  V.blockers = function () {
    const open = openBlockers();
    const counts = HOLDERS.map((h) => [h, open.filter((b) => b.holder === h).length]);
    return `
<div class="grid g4" style="grid-template-columns:repeat(5,minmax(0,1fr))">${counts.map(([h, n]) => `<div class="card kpi ${n ? "t-r" : "t-g"}"><span class="cap">${h}</span><b>${n}</b><p>${n === 1 ? "item" : "items"} waiting</p></div>`).join("")}</div>
<section class="card mt"><div class="chead"><h3>Open blockers</h3><small>Each one names the team it is waiting on, so leadership knows who to ask</small></div>
${open.length ? `<ul class="rows">${open.map((b) => { const o = opp(b.opp); return `<li>${av(o.owner)}<span class="main2"><b>${esc(o.title)}</b><span>${esc(b.note)} · open ${diff(b.opened, U.date)} days</span></span><span class="pill p-v">${b.holder}</span><button type="button" class="btn sec small" data-resolve="${b.id}">Resolved</button></li>`; }).join("")}</ul>` : `<p class="empty">No open blockers.</p>`}</section>`;
  };

  V.stalled = function () {
    const st = stalled().sort((a, b) => daysIn(b) / EXPECT[b.stage] - daysIn(a) / EXPECT[a.stage]);
    return `
<section class="card"><div class="chead"><h3>Opportunities past their expected time</h3><small>Each stage has an expected number of days. These have gone over.</small><button type="button" class="sp btn sec small" data-act="mask">${U.masked ? "Show values" : "Hide values"}</button></div>
<div class="tw"><table class="t"><thead><tr><th>Opportunity</th><th>Stage</th><th>Days in stage</th><th>Owner</th><th>Value</th><th>Waiting on</th><th></th></tr></thead><tbody>
${st.map((o) => { const bl = openBlockers().find((x) => x.opp === o.id); const over = daysIn(o) / EXPECT[o.stage]; return `<tr><td><b>${esc(o.title)}</b><div class="muted">${esc(acct(o.account).name)}</div></td><td><span class="pill" style="background:${SCOL[o.stage]}22;color:${SCOL[o.stage]}">${STAGES[o.stage]}</span></td><td><b>${daysIn(o)}</b> <span class="muted">of ${EXPECT[o.stage]}</span><div class="meter ${over > 2 ? "r" : "a"}" style="margin-top:6px;max-width:120px"><i style="width:${Math.min(100, (EXPECT[o.stage] / daysIn(o)) * 100)}%"></i></div></td><td><span class="co">${av(o.owner)}${esc(person(o.owner).name)}</span></td><td>${money(o.value)}</td><td>${bl ? `<span class="pill p-v">${bl.holder}</span>` : `<span class="muted">Not logged</span>`}</td><td><button type="button" class="btn sec small" data-nudge="${o.id}">Nudge owner</button></td></tr>`; }).join("") || `<tr><td colspan="7" class="empty">Nothing is stalled.</td></tr>`}
</tbody></table></div></section>`;
  };

  V.pipeline = function () {
    const list = S.opps.filter((o) => o.created <= U.date && (roleOf() !== "bd" || true));
    const total = list.filter((o) => o.stage < 9).reduce((a, o) => a + o.value, 0);
    return `
<div class="toolbar"><span class="muted">${list.filter((o) => o.stage < 9).length} open opportunities worth ${money(total)}. Click a card to move it.</span><button type="button" class="sp btn sec small" data-act="mask">${U.masked ? "Show values" : "Hide values"}</button></div>
<div class="board">${STAGES.map((s, i) => { const items = list.filter((o) => o.stage === i); return `<div class="col"><h4><span><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${SCOL[i]};margin-right:6px"></i>${s}</span><span>${items.length}</span></h4>${items.slice(0, 12).map((o) => `<button type="button" class="opp ${daysIn(o) > EXPECT[i] && i < 9 ? "stall" : ""}" data-opp="${o.id}"><b>${esc(o.title)}</b><span>${esc(person(o.owner).name)} · ${daysIn(o)} days</span><span class="ft"><span>${money(o.value)}</span>${daysIn(o) > EXPECT[i] && i < 9 ? `<span class="pill p-r">Stalled</span>` : ""}</span></button>`).join("")}${items.length > 12 ? `<span class="muted" style="text-align:center;font-size:12px">+${items.length - 12} more</span>` : ""}</div>`; }).join("")}</div>`;
  };

  V.notes = function () {
    const n = S.notes.find((x) => x.id === U.note) || S.notes[0];
    return `
<div class="notes"><section class="card"><div class="chead"><h3>Notes</h3><button type="button" class="sp btn small" data-act="newnote">New note</button></div><div class="list">${S.notes.map((x) => `<button type="button" data-note="${x.id}" class="${n && x.id === n.id ? "on" : ""}"><b>${esc(x.title || "Untitled")}</b><span>${short(x.updated)}</span></button>`).join("")}</div></section>
<section class="card ed">${n ? `<input id="nTitle" value="${esc(n.title)}" placeholder="Title" aria-label="Note title"><textarea id="nBody" placeholder="Write here" aria-label="Note">${esc(n.body)}</textarea>` : `<p class="empty">No notes yet.</p>`}</section></div>`;
  };

  /* Reports */
  function periodRange() {
    const a = parse(U.anchor);
    let s, e, label;
    if (U.period === "week") { const day = (a.getDay() + 6) % 7; const st = new Date(a); st.setDate(a.getDate() - day); s = iso(st); e = addDays(s, 6); label = `Week of ${short(s)}`; }
    else if (U.period === "month") { s = iso(new Date(a.getFullYear(), a.getMonth(), 1)); e = iso(new Date(a.getFullYear(), a.getMonth() + 1, 0)); label = a.toLocaleDateString("en-GB", { month: "long", year: "numeric" }); }
    else if (U.period === "quarter") { const q = Math.floor(a.getMonth() / 3); s = iso(new Date(a.getFullYear(), q * 3, 1)); e = iso(new Date(a.getFullYear(), q * 3 + 3, 0)); label = `Q${q + 1} ${a.getFullYear()}`; }
    else { s = iso(new Date(a.getFullYear(), 0, 1)); e = iso(new Date(a.getFullYear(), 11, 31)); label = String(a.getFullYear()); }
    return { s, e, label };
  }
  function weekdaysBetween(s, e) { let n = 0; for (let d = s; d <= e; d = addDays(d, 1)) if (isWeekday(d)) n++; return n; }
  function synth() {
    const { s, e, label } = periodRange();
    const end = e < TODAY ? e : TODAY;
    const list = end >= s ? ev((x) => x.date >= s && x.date <= end) : [];
    const days = end >= s ? weekdaysBetween(s, end) : 0;
    const tUpd = target() * days;
    const mov = list.filter((x) => x.kind === "movement");
    const tMov = Math.max(1, Math.round((25 * (diff(s, e) + 1)) / 30));
    const active = new Set(list.map((x) => x.date)).size;
    const cm = S.commitments.filter((c) => inRole(c.who) && c.created >= s && c.created <= end);
    const closed = cm.filter((c) => c.closed && c.closed <= end);
    const byPerson = PEOPLE.filter((p) => inRole(p.id)).map((p) => [p, list.filter((x) => x.who === p.id).length]).sort((a, b) => b[1] - a[1]);
    const byRole = Object.keys(ROLES).filter((r) => !roleOf() || r === roleOf()).map((r) => [r, list.filter((x) => person(x.who).role === r).length]);
    const uniq = new Set(mov.map((m) => m.opp));
    const clients = new Set(mov.map((m) => opp(m.opp).account));
    const dest = STAGES.map((st, i) => [st, mov.filter((m) => m.to === i).length]).filter((x) => x[1]).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return { s, e, end, label, list, days, tUpd, mov, tMov, active, cm, closed, byPerson, byRole, uniq, clients, dest };
  }
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const pcls = (p) => (p >= 75 ? "p-g" : p >= 50 ? "p-a" : "p-r");
  V.reports = function () {
    const tabs = `<div class="tabs"><button type="button" data-act="rtab" data-v="synthesis" class="${U.rtab === "synthesis" ? "on" : ""}">Period synthesis</button><button type="button" data-act="rtab" data-v="scrum" class="${U.rtab === "scrum" ? "on" : ""}">Daily scrum update</button></div>`;
    if (U.rtab === "scrum") return tabs + `<div class="toolbar"><span class="muted">Generated from everything logged on ${nice(U.date)}</span><button type="button" class="sp btn" data-act="copyscrum">Copy for the team chat</button></div><pre class="scrum" id="scrumText">${esc(scrumText())}</pre>`;
    const x = synth();
    const up = pct(x.list.length, x.tUpd), mv = pct(x.mov.length, x.tMov), ad = pct(x.active, x.days), cr = pct(x.closed.length, x.cm.length);
    const maxP = Math.max(1, ...x.byPerson.map((p) => p[1]));
    const maxD = Math.max(1, ...x.dest.map((d) => d[1]));
    return tabs + `
<div class="toolbar"><div class="seg">${["week", "month", "quarter", "year"].map((p) => `<button type="button" data-act="period" data-v="${p}" class="${U.period === p ? "on" : ""}">${cap(p)}</button>`).join("")}</div>
  <div class="nav2"><button type="button" data-act="pnav" data-v="-1" aria-label="Previous">‹</button><span>${x.label}</span><button type="button" data-act="pnav" data-v="1" aria-label="Next">›</button></div>
  <button type="button" class="btn sec small" data-act="ptoday">Today</button>
  <button type="button" class="sp btn" data-act="present"><svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg><span>Present</span></button></div>
<div class="grid g4">
  <div class="card kpi t-a"><span class="cap">Updates <span class="pill ${pcls(up)}" style="float:right">${up}%</span></span><b>${x.list.length} <small class="muted" style="font-size:15px;font-weight:500">/ ${x.tUpd}</small></b><div class="meter ${up >= 75 ? "g" : "r"}"><i style="width:${Math.min(100, up)}%"></i></div><p>${target()} a day × ${x.days} working days</p></div>
  <div class="card kpi t-g"><span class="cap">Movements <span class="pill ${pcls(mv)}" style="float:right">${mv}%</span></span><b>${x.mov.length} <small class="muted" style="font-size:15px;font-weight:500">/ ${x.tMov}</small></b><div class="meter ${mv >= 75 ? "g" : "r"}"><i style="width:${Math.min(100, mv)}%"></i></div><p>${x.uniq.size} different opportunities</p></div>
  <div class="card kpi"><span class="cap">Active days <span class="pill ${pcls(ad)}" style="float:right">${ad}%</span></span><b>${x.active} <small class="muted" style="font-size:15px;font-weight:500">/ ${x.days}</small></b><div class="meter ${ad >= 75 ? "g" : "a"}"><i style="width:${ad}%"></i></div><p>Days with at least one update</p></div>
  <div class="card kpi t-r"><span class="cap">Commitments closed <span class="pill ${pcls(cr)}" style="float:right">${cr}%</span></span><b>${x.closed.length} <small class="muted" style="font-size:15px;font-weight:500">/ ${x.cm.length}</small></b><div class="meter ${cr >= 75 ? "g" : "a"}"><i style="width:${cr}%"></i></div><p>${x.cm.length - x.closed.length} still open</p></div>
</div>
<div class="grid g2 mt">
  <section class="card"><div class="chead"><h3>Updates for the period</h3></div><div class="cbody"><div class="big">${x.list.length}<small>/ ${x.tUpd}</small></div><div class="meter r" style="margin:10px 0 4px"><i style="width:${Math.min(100, up)}%"></i></div>
    <div class="mini-stats"><div><span class="cap">Average a day</span><b>${x.days ? (x.list.length / x.days).toFixed(1) : 0} <span class="muted" style="font-size:12px">/ ${target()}</span></b></div><div><span class="cap">Days logged</span><b>${x.active} <span class="muted" style="font-size:12px">/ ${x.days}</span></b></div><div><span class="cap">By team</span><b style="font-size:13px;margin-top:4px">${x.byRole.map(([r, n]) => `${ROLES[r].tag} ${n}`).join(" · ")}</b></div></div></div></section>
  <section class="card"><div class="chead"><h3>Contributor leaderboard</h3><small>Updates and movements logged</small></div><div class="cbody"><ul class="rows lead">${x.byPerson.slice(0, 6).map(([p, n], i) => `<li><span class="pos">${["1st", "2nd", "3rd", "4th", "5th", "6th"][i]}</span>${av(p.id)}<span class="rl"><span>${esc(p.name)} <em>${ROLES[p.role].tag}</em></span><span class="meter"><i style="width:${(n / maxP) * 100}%"></i></span></span><b style="text-align:right">${n} <span class="muted" style="font-weight:500;font-size:12px">${pct(n, x.list.length)}%</span></b></li>`).join("")}</ul></div></section>
</div>
<div class="grid g2 mt">
  <section class="card"><div class="chead"><h3>Movements for the period</h3></div><div class="cbody"><div class="big">${x.mov.length}<small>/ ${x.tMov}</small></div><div class="meter g" style="margin:10px 0 4px"><i style="width:${Math.min(100, mv)}%"></i></div>
    <div class="mini-stats"><div><span class="cap">Opportunities</span><b>${x.uniq.size}</b></div><div><span class="cap">Average moves each</span><b>${x.uniq.size ? (x.mov.length / x.uniq.size).toFixed(1) : 0}</b></div><div><span class="cap">Clients</span><b>${x.clients.size}</b></div></div></div></section>
  <section class="card"><div class="chead"><h3>Where opportunities moved to</h3></div><div class="cbody">${x.dest.length ? x.dest.map(([st, n]) => `<div style="display:grid;grid-template-columns:140px minmax(0,1fr) 28px;gap:12px;align-items:center;padding:6px 0;font-size:13px"><span>${st}</span><span class="meter g"><i style="width:${(n / maxD) * 100}%"></i></span><b style="text-align:right">${n}</b></div>`).join("") : `<p class="empty">No movements in this period.</p>`}</div></section>
</div>
<section class="card mt"><div class="chead"><h3>Commitments and how they were handled</h3></div><div class="cbody"><div class="mini-stats" style="grid-template-columns:repeat(4,minmax(0,1fr));margin:0"><div><span class="cap">Closed</span><b style="color:#16a36a">${x.closed.length}</b></div><div><span class="cap">Open</span><b style="color:#e09a12">${x.cm.length - x.closed.length}</b></div><div><span class="cap">Closure rate</span><b>${cr}%</b></div><div><span class="cap">Overdue now</span><b style="color:#e04a43">${x.cm.filter((c) => !c.closed && c.due < TODAY).length}</b></div></div></div></section>`;
  };
  function scrumText() {
    const d = U.date;
    const list = ev((e) => e.date === d);
    const mov = list.filter((e) => e.kind === "movement");
    const newC = S.commitments.filter((c) => inRole(c.who) && c.created === d);
    const t = target();
    const roles = Object.keys(ROLES).filter((r) => !roleOf() || r === roleOf());
    return [
      `Daily scrum, ${nice(d, { weekday: "long", day: "numeric", month: "long" })}`,
      "",
      `Updates: ${list.length} of ${t}${list.length < t ? ` (${t - list.length} short)` : " (target met)"}`,
      `By team: ${roles.map((r) => `${ROLES[r].name} ${list.filter((e) => person(e.who).role === r).length}`).join(" · ")}`,
      "",
      "What moved",
      ...(mov.length ? mov.map((m) => `• ${opp(m.opp).title}: ${STAGES[m.from]} → ${STAGES[m.to]} (${person(m.who).name.split(" ")[0]})`) : ["• Nothing moved"]),
      "",
      "New commitments",
      ...(newC.length ? newC.map((c) => `• ${c.text}, ${opp(c.opp).title} (${person(c.who).name.split(" ")[0]}, due ${short(c.due)})`) : ["• None"]),
      "",
      "Blockers to raise",
      ...(openBlockers().length ? openBlockers().slice(0, 5).map((b) => `• ${opp(b.opp).title}: waiting on ${b.holder.toLowerCase()}`) : ["• None"]),
      "",
      `Stalled: ${stalled(d).length} opportunities over their expected time`,
    ].join("\n");
  }

  /* CRM */
  V.leads = function () {
    const q = U.q.toLowerCase();
    const list = S.leads.filter((l) => l.created <= U.date && (!q || `${l.name} ${l.title} ${l.company}`.toLowerCase().includes(q))).sort((a, b) => b.created.localeCompare(a.created));
    const month = S.leads.filter((l) => l.created.slice(0, 7) === U.date.slice(0, 7) && l.created <= U.date).length;
    const conv = S.leads.filter((l) => l.stage === "Converted" && l.created <= U.date).length;
    const all = S.leads.filter((l) => l.created <= U.date);
    const labels = [], daily = [], cum = [];
    let run = 0;
    for (let i = 29; i >= 0; i--) { const d = addDays(U.date, -i); const n = S.leads.filter((l) => l.created === d).length; run += n; labels.push(short(d)); daily.push(n); cum.push(run); }
    const SP = { New: "p-n", Contacted: "p-b", Qualified: "p-a", Converted: "p-g" };
    return `
<div class="grid g4"><div class="card kpi"><span class="cap">Total leads</span><b style="color:#4b5bdc">${all.length}</b><p>${month} this month</p></div><div class="card kpi t-g"><span class="cap">Pipeline value</span><b style="color:#16a36a">${money(all.reduce((a, l) => a + l.value, 0))}</b><p>Estimated total</p></div><div class="card kpi t-v"><span class="cap">Converted</span><b style="color:#7c3aed">${conv}</b><p>Became opportunities</p></div><div class="card kpi t-a"><span class="cap">Conversion rate</span><b style="color:#c2410c">${pct(conv, all.length)}%</b><p>Lead to opportunity</p></div></div>
<div class="toolbar mt"><input class="search" id="q" placeholder="Search leads" value="${esc(U.q)}" aria-label="Search leads"><button type="button" class="sp btn sec small" data-act="mask">${U.masked ? "Show values" : "Hide values"}</button></div>
<section class="card"><div class="chead"><h3>Leads trend, last 30 days</h3><small>${run} added</small></div><div class="cbody"><div class="legend"><span><i style="background:#3b82f6"></i>New leads</span><span><i style="background:#16a36a"></i>Running total</span></div>${lineChart({ labels, series: [{ values: daily, color: "#3b82f6", dots: false }, { values: cum, color: "#16a36a", dash: true, dots: false }], h: 210 })}</div></section>
<section class="card mt"><div class="tw"><table class="t"><thead><tr><th>Name</th><th>Need</th><th>Company</th><th>Stage</th><th>Source</th><th>Owner</th><th>Value</th></tr></thead><tbody>
${list.slice(0, U.leadsShown).map((l) => `<tr><td><span class="co"><span class="av" style="background:${avColour(l.id)}">${initials(l.name)}</span><b>${esc(l.name)}</b></span></td><td>${esc(l.title)}</td><td>${esc(l.company)}</td><td><span class="pill ${SP[l.stage]}">${l.stage}</span> <span class="pill ${CATS[l.cat]}">Category ${l.cat}</span></td><td>${l.source}</td><td>${esc(person(l.owner).name)}</td><td>${money(l.value)}</td></tr>`).join("") || `<tr><td colspan="7" class="empty">No leads match.</td></tr>`}
</tbody></table></div>${list.length > U.leadsShown ? `<div style="padding:14px;text-align:center"><button type="button" class="btn sec small" data-act="more">Show more (${list.length - U.leadsShown})</button></div>` : ""}</section>`;
  };

  V.accounts = function () {
    const q = U.q.toLowerCase();
    const list = S.accounts.filter((a) => !q || `${a.name} ${a.industry} ${a.city}`.toLowerCase().includes(q));
    return `
<div class="grid g4"><div class="card kpi"><span class="cap">Total accounts</span><b style="color:#4b5bdc">${S.accounts.length}</b><p>Active organisations</p></div><div class="card kpi t-g"><span class="cap">Total revenue</span><b style="color:#16a36a">${money(S.accounts.reduce((a, x) => a + x.revenue, 0))}</b><p>Annual, combined</p></div><div class="card kpi t-v"><span class="cap">Contacts</span><b style="color:#7c3aed">${S.accounts.reduce((a, x) => a + x.contacts, 0)}</b><p>Across all accounts</p></div><div class="card kpi t-a"><span class="cap">Industries</span><b style="color:#c2410c">${new Set(S.accounts.map((a) => a.industry)).size}</b><p>Different sectors</p></div></div>
<div class="toolbar mt"><input class="search" id="q" placeholder="Search accounts" value="${esc(U.q)}" aria-label="Search accounts"><button type="button" class="sp btn sec small" data-act="mask">${U.masked ? "Show values" : "Hide values"}</button></div>
<section class="card"><div class="tw"><table class="t"><thead><tr><th>Company</th><th>Industry</th><th>Category</th><th>Owner</th><th>Contacts</th><th>Revenue</th><th>Location</th></tr></thead><tbody>
${list.map((a) => `<tr><td><span class="co"><span class="sq" style="background:${avColour(a.id)}">${initials(a.name)}</span><b>${esc(a.name)}</b></span></td><td><span class="pill p-n">${a.industry}</span></td><td><span class="pill ${CATS[a.cat]}">Category ${a.cat}</span></td><td>${esc(person(a.owner).name)}</td><td>${a.contacts}</td><td>${money(a.revenue)}</td><td>${a.city}</td></tr>`).join("") || `<tr><td colspan="7" class="empty">No accounts match.</td></tr>`}
</tbody></table></div></section>`;
  };

  V.goals = function () {
    const a = parse(U.date);
    let s, label, mult;
    if (U.goal === "month") { s = iso(new Date(a.getFullYear(), a.getMonth(), 1)); label = a.toLocaleDateString("en-GB", { month: "long", year: "numeric" }); mult = 1; }
    else if (U.goal === "quarter") { const q = Math.floor(a.getMonth() / 3); s = iso(new Date(a.getFullYear(), q * 3, 1)); label = `Q${q + 1} ${a.getFullYear()}`; mult = 3; }
    else { s = iso(new Date(a.getFullYear(), 0, 1)); label = String(a.getFullYear()); mult = 12; }
    const e = U.date;
    const G = { rev: 600 * mult, leads: 40 * mult, opps: 8 * mult, conv: 5 * mult };
    const revA = S.events.filter((x) => x.kind === "movement" && x.to === 9 && x.date >= s && x.date <= e).reduce((t, x) => t + opp(x.opp).value, 0);
    const leadsA = S.leads.filter((l) => l.created >= s && l.created <= e).length;
    const oppsA = S.events.filter((x) => x.kind === "movement" && x.to === 2 && x.date >= s && x.date <= e).length;
    const convA = S.events.filter((x) => x.kind === "movement" && x.to === 6 && x.date >= s && x.date <= e).length;
    const goal = (name, act, tgt, fmt) => { const p = pct(act, tgt); const c = p >= 75 ? "g" : p >= 50 ? "a" : "r"; return `<div class="goal"><div class="gh"><span>${name}</span><b style="color:${c === "g" ? "#16a36a" : c === "a" ? "#c08012" : "#e04a43"}">${p}%</b></div><div class="meter ${c}"><i style="width:${Math.min(100, p)}%"></i></div><div class="gv"><b>${fmt(act)}</b><span>of ${fmt(tgt)}</span></div></div>`; };
    const day = (a.getDay() + 6) % 7, ws = addDays(U.date, -day);
    const wk = (fn) => fn(ws, U.date);
    const lw = wk((x, y) => S.leads.filter((l) => l.created >= x && l.created <= y).length);
    const ow = wk((x, y) => S.events.filter((v) => v.kind === "movement" && v.to === 2 && v.date >= x && v.date <= y).length);
    const wdone = Math.max(1, Math.min(5, day + 1));
    const tl = Math.round(40 / 4.3), to = Math.max(1, Math.round(8 / 4.3));
    const teams = Object.keys(ROLES).map((r) => { const l = S.events.filter((v) => person(v.who).role === r && v.date >= s && v.date <= e); return [r, l.length, l.filter((v) => v.kind === "movement").length]; });
    return `
<div class="toolbar"><span class="muted">Targets for each period, tracked live from leads and opportunities</span><div class="sp seg acc"><button type="button" data-act="goal" data-v="month" class="${U.goal === "month" ? "on" : ""}">Monthly</button><button type="button" data-act="goal" data-v="quarter" class="${U.goal === "quarter" ? "on" : ""}">Quarterly</button><button type="button" data-act="goal" data-v="year" class="${U.goal === "year" ? "on" : ""}">Yearly</button></div></div>
<section class="card"><div class="chead"><h3>Company-wide goals</h3><small>${label}. Green from 75%, amber from 50%, red below.</small></div><div class="cbody"><div class="grid g4">${goal("Revenue", revA, G.rev, (v) => money(v))}${goal("Leads", leadsA, G.leads, (v) => v)}${goal("Qualified opportunities", oppsA, G.opps, (v) => v)}${goal("Contracts", convA, G.conv, (v) => v)}</div></div></section>
<section class="card mt"><div class="chead"><h3>This week’s pace</h3><small>Worked out from the monthly goals · day ${wdone} of 5</small></div><div class="cbody"><div class="grid g4">
  <div class="pace b"><div class="gh"><span>Leads</span><span>${pct(lw, tl)}%</span></div><b>${lw} <small>/ ${tl}</small></b><div class="meter ${lw >= tl ? "g" : "r"}"><i style="width:${Math.min(100, pct(lw, tl))}%"></i></div></div>
  <div class="pace g"><div class="gh"><span>Opportunities</span><span>${pct(ow, to)}%</span></div><b>${ow} <small>/ ${to}</small></b><div class="meter ${ow >= to ? "g" : "r"}"><i style="width:${Math.min(100, pct(ow, to))}%"></i></div></div>
  <div class="pace v"><div class="gh"><span>Daily lead pace</span></div><b>${(lw / wdone).toFixed(1)} <small>a day</small></b><small>Need ${(tl / 5).toFixed(1)} a day to hit the weekly target</small></div>
  <div class="pace y"><div class="gh"><span>Daily opportunity pace</span></div><b>${(ow / wdone).toFixed(1)} <small>a day</small></b><small>Need ${(to / 5).toFixed(1)} a day to hit the weekly target</small></div>
</div></div></section>
<section class="card mt"><div class="chead"><h3>Team breakdown</h3><small>${label}</small></div><div class="tw"><table class="t"><thead><tr><th>Team</th><th>Updates</th><th>Movements</th><th>Share of updates</th></tr></thead><tbody>${teams.map(([r, n, m]) => `<tr><td><span class="co">${rtag(r)}<b>${ROLES[r].name}</b></span></td><td>${n}</td><td>${m}</td><td style="min-width:200px"><div class="meter"><i style="width:${pct(n, teams.reduce((t, x) => t + x[1], 0))}%;background:${ROLES[r].fg}"></i></div></td></tr>`).join("")}</tbody></table></div></section>`;
  };

  /* ---------------- rendering and actions ---------------- */
  function render() {
    $("viewDate").value = U.date;
    $("hist").hidden = U.date === TODAY;
    $("title").textContent = TITLES[U.view];
    const prof = PROFILES.find((p) => p[0] === U.profile);
    $("subtitle").textContent = `${nice(U.date)}${U.date === TODAY ? "" : " · historical view"} · ${prof[2]}`;
    $("view").innerHTML = V[U.view]();
    drawNav();
    const q = $("q");
    if (q) q.addEventListener("input", () => { U.q = q.value; const pos = q.selectionStart; render(); const n = $("q"); n.focus(); n.setSelectionRange(pos, pos); });
    const t = $("nTitle"), b = $("nBody");
    if (t && b) {
      const n = S.notes.find((x) => x.id === U.note) || S.notes[0];
      const upd = () => { n.title = t.value; n.body = b.value; n.updated = TODAY; save(); };
      t.addEventListener("input", upd); b.addEventListener("input", upd);
      t.addEventListener("change", () => drawView());
    }
  }
  const drawView = () => render();

  $("view").addEventListener("click", async (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const act = b.dataset.act, v = b.dataset.v;
    if (b.dataset.goto) { U.view = b.dataset.goto; render(); return; }
    if (act === "trend") U.trend = v;
    if (act === "stage") U.stageMode = v;
    if (act === "cf") U.cfilter = v;
    if (act === "ef") U.efilter = v;
    if (act === "mask") U.masked = !U.masked;
    if (act === "rtab") U.rtab = v;
    if (act === "period") { U.period = v; U.anchor = U.date; }
    if (act === "goal") U.goal = v;
    if (act === "more") U.leadsShown += 25;
    if (act === "ptoday") U.anchor = TODAY;
    if (act === "pnav") {
      const a = parse(U.anchor), n = +v;
      if (U.period === "week") a.setDate(a.getDate() + 7 * n);
      else if (U.period === "month") a.setMonth(a.getMonth() + n, 1);
      else if (U.period === "quarter") a.setMonth(a.getMonth() + 3 * n, 1);
      else a.setFullYear(a.getFullYear() + n);
      U.anchor = iso(a) > TODAY ? TODAY : iso(a);
    }
    if (act === "present") { present(); return; }
    if (act === "copyscrum") { try { await navigator.clipboard.writeText(scrumText()); toast("Copied. Paste it into the team chat."); } catch (err) { toast("Select the text and copy it"); } return; }
    if (act === "newnote") { const n = { id: uid(), title: "", body: "", updated: TODAY }; S.notes.unshift(n); U.note = n.id; save(); render(); $("nTitle").focus(); return; }
    if (b.dataset.note) U.note = b.dataset.note;
    if (b.dataset.close) { const c = S.commitments.find((x) => x.id === b.dataset.close); c.closed = U.date; save(); toast("Commitment closed"); }
    if (b.dataset.resolve) { const x = S.blockers.find((y) => y.id === b.dataset.resolve); x.resolved = U.date; save(); toast("Blocker resolved"); }
    if (b.dataset.nudge) { const o = opp(b.dataset.nudge); S.commitments.push({ id: uid(), text: "Give a status update and next step", opp: o.id, who: o.owner, created: U.date, due: addDays(U.date, 2), closed: null }); save(); toast(`Commitment added for ${person(o.owner).name.split(" ")[0]}`); }
    if (b.dataset.opp) { openMove(b.dataset.opp); return; }
    render();
  });

  /* Add entry */
  function openEntry(type) {
    let kind = type || "update";
    const role = roleOf();
    const people = PEOPLE.filter((p) => !role || p.role === role);
    const opps = S.opps.filter((o) => o.stage < 9).sort((a, b) => a.title.localeCompare(b.title));
    const draw = () => {
      $("modal").innerHTML = `<div class="mbox" role="dialog" aria-modal="true" aria-label="Add entry"><h3>Add entry for ${nice(U.date, { day: "numeric", month: "long" })}</h3><form id="entryForm">
        <div class="types">${[["update", "Update"], ["movement", "Movement"], ["commitment", "Commitment"], ["blocker", "Blocker"]].map(([k, n]) => `<button type="button" data-k="${k}" class="${kind === k ? "on" : ""}">${n}</button>`).join("")}</div>
        <p class="help">${{ update: "Progress the client can see, without a change of stage.", movement: "The opportunity has moved to a new stage.", commitment: "Something promised that hasn’t reached the client yet.", blocker: "The opportunity is waiting on another team." }[kind]}</p>
        <div class="row"><label>Who<select name="who">${people.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></label>
        <label>Opportunity<select name="opp">${opps.map((o) => `<option value="${o.id}">${esc(o.title)} · ${STAGES[o.stage]}</option>`).join("")}</select></label></div>
        ${kind === "movement" ? `<label>Move to<select name="to">${STAGES.map((s, i) => `<option value="${i}">${s}</option>`).join("")}</select></label>` : ""}
        ${kind === "commitment" ? `<label>Due<input type="date" name="due" value="${addDays(U.date, 3)}" required></label>` : ""}
        ${kind === "blocker" ? `<label>Waiting on<select name="holder">${HOLDERS.map((h) => `<option>${h}</option>`).join("")}</select></label>` : ""}
        <label>${kind === "commitment" ? "What was promised" : "Note"}<textarea name="note" ${kind === "movement" ? "" : "required"} placeholder="${kind === "update" ? "Sent the revised proposal to procurement" : kind === "commitment" ? "Send revised pricing" : kind === "blocker" ? "Waiting on budget sign-off" : "Optional"}"></textarea></label>
        <div class="acts"><button type="button" class="btn sec" data-cancel>Cancel</button><button type="submit" class="btn">Save entry</button></div></form></div>`;
      const f = $("entryForm");
      const syncTo = () => { if (!f.to) return; const o = opp(f.opp.value); f.to.value = String(Math.min(9, o.stage + 1)); };
      if (f.opp) f.opp.addEventListener("change", syncTo);
      syncTo();
    };
    $("modal").hidden = false;
    draw();
    $("modal").onclick = (e) => {
      if (e.target === $("modal") || e.target.closest("[data-cancel]")) { $("modal").hidden = true; return; }
      const k = e.target.closest("[data-k]");
      if (k) { kind = k.dataset.k; draw(); }
    };
    $("modal").onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const o = opp(f.get("opp"));
      const who = f.get("who"), note = String(f.get("note") || "").trim();
      if (kind === "update") S.events.push({ id: uid(), date: U.date, who, opp: o.id, kind: "update", note });
      if (kind === "movement") { const to = +f.get("to"); if (to === o.stage) { toast("Pick a different stage"); return; } S.events.push({ id: uid(), date: U.date, who, opp: o.id, kind: "movement", from: o.stage, to, note }); o.stage = to; o.since = U.date; }
      if (kind === "commitment") S.commitments.push({ id: uid(), text: note, opp: o.id, who, created: U.date, due: f.get("due"), closed: null });
      if (kind === "blocker") S.blockers.push({ id: uid(), opp: o.id, holder: f.get("holder"), note, opened: U.date, resolved: null });
      save(); $("modal").hidden = true; render();
      toast({ update: "Update logged", movement: `Moved to ${STAGES[o.stage]}`, commitment: "Commitment added", blocker: "Blocker logged" }[kind]);
    };
  }
  function openMove(id) {
    const o = opp(id);
    $("modal").hidden = false;
    $("modal").innerHTML = `<div class="mbox" role="dialog" aria-modal="true" aria-label="Move opportunity"><h3>${esc(o.title)}</h3><form id="mvForm">
      <p class="help" style="margin:0">${esc(acct(o.account).name)} · owned by ${esc(person(o.owner).name)} · in ${STAGES[o.stage]} for ${daysIn(o)} days (expected ${EXPECT[o.stage]})</p>
      <label>Move to<select name="to">${STAGES.map((s, i) => `<option value="${i}" ${i === Math.min(9, o.stage + 1) ? "selected" : ""}>${s}</option>`).join("")}</select></label>
      <label>Note<textarea name="note" placeholder="What happened"></textarea></label>
      <div class="acts"><button type="button" class="btn sec" data-cancel>Cancel</button><button type="submit" class="btn">Log the movement</button></div></form></div>`;
    $("modal").onclick = (e) => { if (e.target === $("modal") || e.target.closest("[data-cancel]")) $("modal").hidden = true; };
    $("modal").onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(e.target), to = +f.get("to");
      if (to === o.stage) { toast("Pick a different stage"); return; }
      S.events.push({ id: uid(), date: U.date, who: o.owner, opp: o.id, kind: "movement", from: o.stage, to, note: String(f.get("note") || "") });
      o.stage = to; o.since = U.date; save(); $("modal").hidden = true; render(); toast(`Moved to ${STAGES[to]}`);
    };
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("modal").hidden) $("modal").hidden = true; });

  /* Present mode: the period synthesis as full-screen slides */
  function present() {
    const x = synth();
    const slides = [
      `<span class="cap">Period synthesis</span><h2>${x.label}</h2><p>${PROFILES.find((p) => p[0] === U.profile)[1]}</p>`,
      `<span class="cap">Updates</span><div class="huge">${x.list.length}<small> / ${x.tUpd}</small></div><p>${pct(x.list.length, x.tUpd)}% of target, an average of ${x.days ? (x.list.length / x.days).toFixed(1) : 0} a day</p>`,
      `<span class="cap">Movements</span><div class="huge">${x.mov.length}<small> / ${x.tMov}</small></div><ul>${x.dest.slice(0, 4).map(([s, n]) => `<li><b>${n}</b> moved into ${s}</li>`).join("")}</ul>`,
      `<span class="cap">Commitments</span><div class="huge">${pct(x.closed.length, x.cm.length)}%<small> closed</small></div><p>${x.closed.length} closed, ${x.cm.length - x.closed.length} still open</p>`,
      `<span class="cap">Top contributors</span><ul>${x.byPerson.slice(0, 5).map(([p, n], i) => `<li>${i + 1}. <b>${esc(p.name)}</b>, ${n} updates</li>`).join("")}</ul>`,
    ];
    let i = 0;
    const el = $("present");
    const draw = () => { el.innerHTML = `<header><span>Operations Centre · ${x.label}</span><button type="button" data-x>Close</button></header><div class="slide">${slides[i]}</div><footer>${slides.map((s, j) => `<i class="${j === i ? "on" : ""}"></i>`).join("")}</footer><div class="arrows"><button type="button" data-p aria-label="Previous">‹</button><button type="button" data-n aria-label="Next">›</button></div>`; };
    const close = () => { el.hidden = true; document.removeEventListener("keydown", key); };
    const key = (e) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight" || e.key === " ") { i = Math.min(slides.length - 1, i + 1); draw(); } if (e.key === "ArrowLeft") { i = Math.max(0, i - 1); draw(); } };
    el.onclick = (e) => { if (e.target.closest("[data-x]")) close(); else if (e.target.closest("[data-p]")) { i = Math.max(0, i - 1); draw(); } else if (e.target.closest("[data-n]") || e.target.closest(".slide")) { i = Math.min(slides.length - 1, i + 1); draw(); } };
    document.addEventListener("keydown", key);
    el.hidden = false;
    draw();
  }

  /* Deep links: app/#reports/scrum opens that view; ?embed=1 starts with the menu folded */
  function fromHash() {
    const [v, sub] = location.hash.replace(/^#/, "").split("/");
    if (V[v]) U.view = v;
    if (v === "reports" && (sub === "scrum" || sub === "synthesis")) U.rtab = sub;
    if (v === "commitments" && sub) U.cfilter = sub;
  }
  if (/[?&]embed=1/.test(location.search)) $("oc").classList.add("mini");
  fromHash();
  window.addEventListener("hashchange", () => { fromHash(); render(); });
  render();
})();
