/* A sign-up is not activation: Ada gets her first sales report in a made-up web app, two ways */
(function () {
  "use strict";
  const { icon, av, btn, main, toast } = KEPhone;
  const t0 = { v: 0 };

  const logo = '<span class="wa-mark"><i></i><i></i><i></i></span><b>Ledgerly</b>';
  const field = (label, value, extra = "") => `<label class="wa-field"><span>${label}</span><div ${extra}>${value}</div></label>`;

  function shell(content, s, active = "Home") {
    const nav = [["Home", "home"], ["Reports", "chart"], ["Customers", "users"], ["Products", "tag"], ["Settings", "gear"]];
    return `<div class="scr web"><div class="wa-shell">
      <aside class="wa-side"><div class="wa-logo">${logo}</div>
        <nav>${nav.map(([n, ic]) => `<span class="${n === active ? "on" : ""}">${icon(ic)}${n}</span>`).join("")}</nav>
        ${s.saved ? `<div class="wa-sub"><span class="wa-lbl">Saved reports</span><span class="on">${icon("file")}Weekly sales</span></div>` : ""}
        <div class="wa-ws">${av("B", "c")}<span><b>Bright Stores</b>${s.trial ? "Sample data" : "Free trial"}</span></div>
      </aside>
      <section class="wa-main">
        <header class="wa-top"><span class="wa-burger">${icon("menu")}</span><span class="wa-search">${icon("search")}Search reports, customers…</span><span class="wa-ico">${icon("bell")}</span>${s.trial && !s.saved ? '<span class="wa-chip">Not signed in</span>' : av("AO", "e")}</header>
        <div class="wa-body">${content}</div>
      </section></div>${s.modal || ""}${s.toast ? toast(s.toast) : ""}</div>`;
  }

  const report = () => {
    const days = [["Mon", 52], ["Tue", 61], ["Wed", 48], ["Thu", 70], ["Fri", 88], ["Sat", 100], ["Sun", 66]];
    return `<div class="wa-h"><div><span class="wa-crumb">Reports</span><h3>Weekly sales</h3><span class="wa-meta">10 to 16 November · Bright Stores</span></div>
      <div class="wa-acts"><button type="button" class="wa-btn" data-act="noop">${icon("share")}Share</button><button type="button" class="wa-btn pri" data-act="noop">Export</button></div></div>
      <div class="wa-kpis">
        <div class="wa-card"><span>Revenue</span><b>£48,240</b><em class="up">${icon("trend")}12.4%</em></div>
        <div class="wa-card"><span>Orders</span><b>1,284</b><em class="up">${icon("trend")}8.1%</em></div>
        <div class="wa-card"><span>Average order</span><b>£37.57</b><em class="up">${icon("trend")}3.9%</em></div>
      </div>
      <div class="wa-card wa-chart"><div class="wa-ch"><b>Revenue by day</b><span class="wa-leg"><i></i>This week <i class="b"></i>Last week</span></div>
        <div class="wa-bars">${days.map(([d, v], i) => `<div><span><i class="b" style="height:${v * 0.78}%"></i><i style="height:${v}%;animation-delay:${i * 50}ms"></i></span><em>${d}</em></div>`).join("")}</div></div>`;
  };

  const steps = (n) => `<div class="wa-steps">${["Company", "Team", "Data"].map((x, i) => `<span class="${i < n ? "done" : i === n ? "now" : ""}"><i>${i < n ? icon("check") : i + 1}</i>${x}</span>`).join("")}</div>`;
  const centre = (inner) => `<div class="scr web soft"><div class="wa-centre"><div class="wa-logo sm">${logo}</div><div class="wa-panel">${inner}</div></div></div>`;

  const A = [
    () => `<div class="scr web"><div class="wa-auth">
        <div class="wa-brand"><div class="wa-logo light">${logo}</div><h3>Reports your whole team actually reads.</h3>
          <div class="wa-art">${[40, 62, 48, 80, 66, 92].map((h) => `<i style="height:${h}%"></i>`).join("")}</div>
          <p>“We stopped arguing over spreadsheets on Monday mornings.”<br><span>Tunde, operations lead</span></p></div>
        <div class="wa-form"><h3>Create your account</h3><p class="wa-p">Free for 14 days. No card needed.</p>
          ${field("Full name", "Ada Okafor")}${field("Work email", "ada@brightstores.co")}${field("Password", "•••••••••••")}
          ${main("Create account", "next", "wa")}<div class="wa-or"><span>or</span></div>${btn('<b class="g">G</b>Continue with Google', "next", "line")}</div>
      </div></div>`,
    () => centre(`<span class="wa-big-ic">${icon("mail")}</span><h3>Check your inbox</h3><p class="wa-p">We’ve sent a link to <b>ada@brightstores.co</b>. Click it to carry on.</p>${main("Open my inbox", "next", "wa")}${btn("Resend email", "noop", "ghost")}`),
    () => `<div class="scr web"><div class="wa-mail"><aside>
        <span class="wa-lbl">Inbox</span>
        <div class="on"><b>Ledgerly</b><span>Confirm your email</span></div><div><b>Bank</b><span>Your statement is ready</span></div><div><b>Supplier</b><span>Invoice 2201</span></div><div><b>Team</b><span>Stock count Friday</span></div></aside>
        <div class="wa-read"><span class="wa-meta">From Ledgerly · now</span><h3>Confirm your email address</h3><p class="wa-p">Hi Ada, tap the button below to confirm it’s you. This link expires in 24 hours.</p>${main("Verify email", "next", "wa")}</div></div></div>`,
    (ui) => centre(`${steps(0)}<h3>Tell us about your business</h3>${field("Company name", "Bright Stores")}
      <div class="wa-field"><span>Team size</span><div class="wa-chips"><span class="on">1 to 10</span><span>11 to 50</span><span>51 to 200</span><span>200+</span></div></div>
      ${field("Your role", `Owner ${icon("down")}`)}${main("Continue", "next", "wa")}`),
    () => centre(`${steps(1)}<h3>Invite your team</h3><p class="wa-p">Reports are better with colleagues. Add a few now.</p>${field("Email", '<span class="ph">name@company.com</span>')}${field("Email", '<span class="ph">name@company.com</span>')}
      ${btn("Send invites", "noop", "wa", "disabled")}${main("Skip for now", "next", "line")}`),
    () => centre(`${steps(2)}<h3>Connect your sales data</h3><p class="wa-p">Pick where your sales live. You can add more later.</p>
      <div class="wa-int"><span>${icon("bag")}Online shop</span><span>${icon("card")}Till system</span><span>${icon("sheet")}Google Sheets</span><button type="button" data-act="next" data-main>${icon("upload")}Upload a file</button></div>`),
    (ui) => shell(`<div class="wa-empty"><span class="wa-big-ic">${icon("chart")}</span><h3>Welcome, Ada</h3><p class="wa-p">Your workspace is ready. You haven’t made a report yet.</p>${main("Create your first report", "next", "wa")}</div>`, ui.s),
    (ui) => shell(`<div class="wa-h"><div><span class="wa-crumb">Reports</span><h3>Pick a template</h3></div></div>
      <div class="wa-tpl"><button type="button" data-act="next" data-main>${icon("chart")}<b>Weekly sales</b><span>Revenue, orders and best days</span></button><span>${icon("tag")}<b>Top products</b><span>What sells, what sits</span></span><span>${icon("users")}<b>Customers</b><span>New and returning</span></span></div>`, ui.s, "Reports")
  ];

  const NOTES = {
    A: [
      ["Ada came for a report. The first thing she gets is a form"],
      ["Now she has to leave the product to find an email"],
      ["Still nothing to show for her time"],
      ["Setup questions before she’s seen a single number"],
      ["Inviting people to a product she hasn’t tried"],
      ["Choosing a data source is a commitment she can’t judge yet"],
      ["An empty dashboard is the first thing the product shows her"],
      ["One more choice before the moment she came for"]
    ],
    B: [["She can try it with sample data. Nothing to set up"], ["Value first. The ask comes after she’s seen it"], ["Signing up now feels like saving her work"]]
  };

  function firstValue(ui, p) {
    const secs = ((performance.now() - t0.v) / 1000).toFixed(1);
    ui.metric("clicks", ui.clicks);
    ui.metric("screens", ui.s.screens);
    ui.s.first = { clicks: ui.clicks, secs };
    return secs;
  }

  KEProto({
    names: { A: "Account first", B: "Value first" },
    hints: {
      A: "Ada wants a sales report. Get her there",
      B: "Same product, same Ada. Get her to the report again",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "clicks", label: "Clicks to first report", zero: "0" },
      { k: "screens", label: "Screens before value", zero: "0" }
    ],
    compare: {
      label: "Clicks before Ada saw a report",
      value: (r) => r.clicks,
      text: (r) => `${r.clicks} ${r.clicks === 1 ? "click" : "clicks"}, ${r.screens} ${r.screens === 1 ? "screen" : "screens"}`
    },
    start(p, ui) {
      t0.v = performance.now();
      Object.assign(ui.s, { i: 0, screens: 1, trial: p === "B", saved: false, modal: "", toast: "" });
      if (p === "A") { ui.screen(A[0](ui)); ui.notes(NOTES.A[0]); return; }
      ui.screen(shell(`<div class="wa-banner">${icon("spark")}<span>You’re exploring with sample data. Nothing to set up.</span></div>
        <div class="wa-drop"><span class="wa-big-ic">${icon("upload")}</span><h3>See your week in sales</h3><p class="wa-p">Drop your sales export here, or try it with ours first.</p>
        <div class="wa-row">${main("Use the sample file", "sample", "wa")}${btn("Upload my file", "sample", "line")}</div></div>`, ui.s));
      ui.notes(NOTES.B[0]);
    },
    act(name, el, ui, p) {
      const s = ui.s;
      if (name === "noop") return;
      if (p === "A" && name === "next") {
        s.i++;
        s.screens++;
        if (s.i < A.length) { ui.screen(A[s.i](ui)); ui.notes(NOTES.A[s.i]); return; }
        const secs = firstValue(ui, p);
        ui.screen(shell(report(), s, "Reports"));
        ui.notes(["Eight screens of setup, then the thing she came for"]);
        ui.done({ clicks: ui.clicks, screens: s.screens - 1, toast: `First report after ${ui.clicks} clicks and ${s.screens - 1} screens of setup.` });
        return;
      }
      if (name === "sample") {
        firstValue(ui, p);
        ui.metric("screens", 0);
        ui.screen(shell(`<div class="wa-banner save">${icon("spark")}<span>Like it? Save this report to a free account.</span>${main("Save report", "save", "wa")}</div>` + report(), s, "Reports"));
        ui.notes(NOTES.B[1]);
        return;
      }
      if (name === "save") {
        s.modal = `<div class="ap-scrim"></div><div class="wa-modal"><h3>Save your report</h3><p class="wa-p">So it’s here next week, with your own numbers.</p>
          ${main('<b class="g">G</b>Continue with Google', "google", "line")}<div class="wa-or"><span>or</span></div>${field("Work email", "ada@brightstores.co")}${btn("Save with email", "google", "wa")}</div>`;
        ui.update(shell(`<div class="wa-banner save">${icon("spark")}<span>Like it? Save this report to a free account.</span></div>` + report(), s, "Reports"));
        ui.notes(NOTES.B[2]);
        return;
      }
      if (name === "google") {
        s.modal = ""; s.saved = true; s.trial = false; s.toast = "Report saved to your account";
        ui.update(shell(report(), s, "Reports"));
        s.toast = "";
        ui.done({ clicks: s.first.clicks, screens: 0, toast: `First report after ${s.first.clicks} click. She signed up afterwards, to keep it.` });
      }
    }
  });
})();
