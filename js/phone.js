/*
  App UI kit for the money prototypes. Everything renders inside the phone on
  the principle page. "Orra" is a made-up bank, used only for these examples.
*/
(function () {
  "use strict";
  const P = {
    home: '<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>',
    send: '<path d="M7 17 17 7M9 7h8v8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    move: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M7 14.5h3"/>',
    pot: '<path d="M4.5 12a7.5 6.5 0 0 1 15 0v1.5a5.5 5.5 0 0 1-5.5 5.5h-4a5.5 5.5 0 0 1-5.5-5.5z"/><path d="M9.5 7h5M12 7V4.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',
    back: '<path d="M15 5 8 12l7 7"/>',
    chev: '<path d="m9 5 7 7-7 7"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.4"/>',
    shield: '<path d="M12 3 4.5 6v6c0 4.6 3.2 7.8 7.5 9 4.3-1.2 7.5-4.4 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
    bank: '<path d="M3 10 12 4.5 21 10M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    flame: '<path d="M12 3c.8 3.6 5 5.4 5 10a5 5 0 0 1-10 0c0-2.4 1.3-3.6 2-5 .8 1.4 1.8 2 1.8 2s-.8-3.4 1.2-7z"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    chart: '<path d="M5 20V11M12 20V4M19 20v-6"/>',
    more: '<circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/>',
    share: '<path d="M12 15V3.5M7.5 8 12 3.5 16.5 8M5 13v7h14v-7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    upload: '<path d="M12 16V4.5M7.5 9 12 4.5 16.5 9M4 20h16"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6 6 0 0 1 3.5 6"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    sheet: '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M4 9h16M4 14.5h16M10 3.5v17"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
    round: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8.5 20h7"/>'
  };
  const icon = (n, cls = "") =>
    `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;
  const av = (txt, tone = "a") => `<span class="av av-${tone}">${txt}</span>`;
  const tabs = (active, set) =>
    `<nav class="ap-tabs">${set.map(([label, ic]) => `<span class="${label === active ? "on" : ""}">${icon(ic)}<em>${label}</em></span>`).join("")}</nav>`;
  const top = (title, { back = true, right = "" } = {}) =>
    `<div class="ap-top">${back ? `<span class="ap-ib">${icon("back")}</span>` : ""}<b>${title}</b><span class="ap-tr">${right}</span></div>`;
  const btn = (text, act, kind = "pri", attrs = "") => `<button type="button" class="ab ab-${kind}" data-act="${act}" ${attrs}>${text}</button>`;
  const main = (text, act, kind = "pri") => btn(text, act, kind, "data-main");
  const row = (left, title, sub, right = "", attrs = "") =>
    `<div class="ap-row" ${attrs}>${left}<span class="t"><b>${title}</b>${sub ? `<span>${sub}</span>` : ""}</span>${right}</div>`;
  const banner = (from, text, tone = "g", when = "now") =>
    `<div class="ph-banner">${av(from.slice(0, 1), tone)}<div><b>${from}</b><span>${text}</span></div><em>${when}</em></div>`;
  const sheet = (inner, scrim = true) => (scrim ? '<div class="ap-scrim"></div>' : "") + `<div class="ap-sheet"><i class="ap-grab"></i>${inner}</div>`;
  const ring = (frac, label, sub) => {
    const r = 46, c = 2 * Math.PI * r;
    return `<div class="ap-ring"><svg viewBox="0 0 110 110"><circle cx="55" cy="55" r="${r}" class="bg"/><circle cx="55" cy="55" r="${r}" class="fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.min(1, frac))}"/></svg><div><b>${label}</b><span>${sub}</span></div></div>`;
  };
  const toast = (text) => `<div class="ap-toast">${text}</div>`;

  window.KEPhone = { icon, av, tabs, top, btn, main, row, banner, sheet, ring, toast };
})();
