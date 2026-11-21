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
    play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14" stroke-width="3"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.3 4.5 4.5 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    library: '<path d="M5 4v16M10 4v16M14.5 4.5l5 15"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    pin: '<path d="M12 21s7-6.1 7-11.5a7 7 0 0 0-14 0C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    tag: '<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.4"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    file: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/>',
    trend: '<path d="M4 16l5-5 4 3 7-7M15 7h5v5"/>',
    note: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    dl: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v8M8.5 12.5 12 16l3.5-3.5"/>',
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

  /* A trainer, drawn for the shop prototype */
  const shoe = (c1 = "#e9a99b", c2 = "#c8705d") =>
    `<svg class="ap-shoe" viewBox="0 0 240 140" aria-hidden="true"><defs><linearGradient id="shU" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <ellipse cx="122" cy="128" rx="104" ry="8" fill="rgba(0,0,0,.12)"/>
      <path d="M22 104c0-14 8-22 22-26l46-14c10-3 16-14 22-26l6-10c4-6 12-7 17-2l14 13c10 9 22 14 36 17l18 4c14 3 22 14 22 28v6H22z" fill="url(#shU)"/>
      <path d="M22 104h203v6c0 6-4 10-10 10H34c-7 0-12-5-12-12z" fill="#fff"/>
      <path d="M22 112h203" stroke="#e8e4dc" stroke-width="3"/>
      <path d="M58 88c26-4 52-16 74-36" stroke="rgba(255,255,255,.75)" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M108 44l12 9M114 36l12 9M120 28l12 9" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <circle cx="196" cy="86" r="4" fill="rgba(255,255,255,.6)"/></svg>`;

  /* Album and playlist cover art: original illustrated covers with a fine grain */
  let cvId = 0;
  const T = (x, y, txt, size, opts = "") => `<text x="${x}" y="${y}" font-family="Inter Tight,Inter,system-ui,sans-serif" font-size="${size}" ${opts}>${txt}</text>`;
  const ART = {
    liked: (u) => `<defs><linearGradient id="${u}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3d1fd1"/><stop offset="1" stop-color="#b9d3ff"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#${u}a)"/><path d="M50 72S28 58.5 28 43a11 11 0 0 1 22-4.5A11 11 0 0 1 72 43c0 15.5-22 29-22 29z" fill="#fff"/>`,
    afro: (u) => `<defs><linearGradient id="${u}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb36b"/><stop offset=".45" stop-color="#ff5f6d"/><stop offset="1" stop-color="#5b1f5f"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#${u}a)"/><circle cx="50" cy="60" r="24" fill="#ffe08a"/>
      <g fill="#ff7a6a"><rect x="20" y="58" width="60" height="2.4"/><rect x="20" y="64" width="60" height="3"/><rect x="20" y="71" width="60" height="3.6"/></g>
      <path d="M0 78q25-6 50 0t50 0v22H0z" fill="#3a1640"/><path d="M72 78c-1-12 1-22 4-30m0 0c-6-1-11 2-14 6m14-6c5-3 11-2 14 2m-14-2c-2-5-7-7-12-6m12 6c3-5 9-6 13-4" stroke="#3a1640" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      ${T(8, 16, "Afro Chill", 9, 'font-weight="800" fill="#fff"')}`,
    daily: (u) => `<rect width="100" height="100" fill="#0f8f83"/><circle cx="74" cy="30" r="34" fill="#13a594"/><circle cx="74" cy="30" r="20" fill="#5fd3bc"/>
      <rect x="0" y="0" width="100" height="100" fill="none"/>${T(8, 18, "Daily Mix", 8, 'font-weight="700" fill="#e9fffb"')}${T(6, 92, "01", 40, 'font-weight="800" fill="#fff" letter-spacing="-2"')}`,
    focus: (u) => `<defs><radialGradient id="${u}a" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#fff4dc"/><stop offset="1" stop-color="#e7c08f"/></radialGradient></defs>
      <rect width="100" height="100" fill="url(#${u}a)"/>${[10, 18, 26, 34, 42, 50].map((r, i) => `<circle cx="50" cy="55" r="${r}" fill="none" stroke="#b9773e" stroke-opacity="${0.55 - i * 0.07}" stroke-width="1.2"/>`).join("")}
      <circle cx="50" cy="55" r="5" fill="#b9773e"/>${T(8, 16, "focus flow", 8.5, 'font-weight="600" fill="#6b3f17"')}`,
    gym: (u) => `<rect width="100" height="100" fill="#141414"/><g transform="rotate(-24 50 50)"><rect x="-20" y="30" width="140" height="12" fill="#ff3b3b"/><rect x="-20" y="46" width="140" height="7" fill="#ff7a3d"/><rect x="-20" y="57" width="140" height="4" fill="#ffc23d"/></g>
      ${T(8, 90, "GYM", 30, 'font-weight="900" font-style="italic" fill="#fff" letter-spacing="-1"')}`,
    late: (u) => `<defs><linearGradient id="${u}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#090d2e"/><stop offset="1" stop-color="#43207a"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#${u}a)"/>${[[14, 14], [30, 26], [82, 12], [62, 22], [90, 36], [8, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="#fff"/>`).join("")}
      <circle cx="70" cy="30" r="12" fill="#f8e7bf"/><circle cx="75" cy="26" r="11" fill="#13163f"/>
      <path d="M0 100V70h10v-8h8v12h7V58h10v16h6v-9h9v-12h10v24h7v-6h9v-14h10v18h7v-8h7v41z" fill="#0b0b1e"/>
      ${[[30, 64], [32, 70], [52, 58], [54, 66], [74, 62], [82, 74], [14, 74]].map(([x, y]) => `<rect x="${x}" y="${y}" width="1.8" height="1.8" fill="#ffd27a"/>`).join("")}`,
    discover: (u) => `<defs><linearGradient id="${u}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4b3be8"/><stop offset="1" stop-color="#d061ff"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#${u}a)"/><g fill="#fff" fill-opacity=".35">${Array.from({ length: 22 }, (_, i) => { const h = 6 + Math.abs(Math.sin(i * 1.7)) * 26; return `<rect x="${6 + i * 4}" y="${52 - h / 2}" width="2.4" height="${h}" rx="1.2"/>`; }).join("")}</g>
      ${T(8, 82, "Discover", 15, 'font-weight="800" fill="#fff" letter-spacing="-.5"')}${T(8, 93, "Weekly", 9, 'font-weight="600" fill="#f1e6ff"')}`,
    radar: (u) => `<defs><linearGradient id="${u}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d2a33"/><stop offset="1" stop-color="#1f5560"/></linearGradient><linearGradient id="${u}b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5fd3bc" stop-opacity="0"/><stop offset="1" stop-color="#5fd3bc" stop-opacity=".7"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#${u}a)"/>${[12, 22, 32, 42].map((r) => `<circle cx="50" cy="44" r="${r}" fill="none" stroke="#5fd3bc" stroke-opacity=".35"/>`).join("")}
      <path d="M50 44L92 44A42 42 0 0 0 79.7 14.3z" fill="url(#${u}b)"/><circle cx="72" cy="30" r="2.4" fill="#c9fff3"/><circle cx="36" cy="58" r="1.8" fill="#c9fff3"/>
      ${T(8, 86, "Release", 12, 'font-weight="800" fill="#fff"')}${T(8, 96, "Radar", 9, 'font-weight="600" fill="#bdf3e7"')}`,
    repeat: (u) => `<defs><linearGradient id="${u}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3d6b"/><stop offset="1" stop-color="#ffab7a"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#${u}a)"/><g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".92"><path d="M28 40h38l-8-8M72 58H34l8 8"/></g>
      ${T(8, 92, "On Repeat", 12, 'font-weight="800" fill="#fff"')}`,
    sunday: (u) => `<defs><linearGradient id="${u}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd59e"/><stop offset=".6" stop-color="#f7a8bf"/><stop offset=".6" stop-color="#7fb4dd"/><stop offset="1" stop-color="#3f7fb6"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#${u}a)"/><path d="M28 60a22 22 0 0 1 44 0z" fill="#fff3d1"/>
      ${[66, 74, 82, 90].map((y, i) => `<path d="M${10 + i * 4} ${y}h${80 - i * 8}" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>`).join("")}
      ${T(8, 16, "sunday slow", 9, 'font-weight="700" fill="#7a3550"')}`,
    highlife: (u) => `<rect width="100" height="100" fill="#20160c"/><circle cx="58" cy="56" r="38" fill="#0e0e0e"/>${[34, 30, 26, 22, 18].map((r) => `<circle cx="58" cy="56" r="${r}" fill="none" stroke="#2c2c2c" stroke-width=".8"/>`).join("")}
      <circle cx="58" cy="56" r="12" fill="#d9a521"/><circle cx="58" cy="56" r="2" fill="#20160c"/><path d="M30 30a40 40 0 0 1 20-12" stroke="#fff" stroke-opacity=".2" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${T(8, 15, "HIGHLIFE", 9, 'font-weight="800" fill="#e8b93a" letter-spacing="1.5"')}${T(8, 25, "GOLD", 9, 'font-weight="800" fill="#e8b93a" letter-spacing="1.5"')}`,
    run: (u) => `<rect width="100" height="100" fill="#d4573d"/><g fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.5">${[0, 8, 16, 24].map((d) => `<path d="M${-10 + d} 110C${10 + d} 60 ${50 + d} 40 ${110} ${30 + d}"/>`).join("")}</g>
      ${T(8, 20, "RUN", 18, 'font-weight="900" fill="#fff" letter-spacing="-.5"')}${T(8, 34, "CLUB", 18, 'font-weight="900" fill="#ffd8cc" letter-spacing="-.5"')}`,
    midnight: (u) => `<defs><linearGradient id="${u}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0b33"/><stop offset=".55" stop-color="#5a1a6b"/><stop offset=".55" stop-color="#140822"/></linearGradient><linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd36b"/><stop offset="1" stop-color="#ff4d8d"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#${u}a)"/><circle cx="50" cy="52" r="20" fill="url(#${u}b)"/><g fill="#5a1a6b"><rect x="28" y="44" width="44" height="2"/><rect x="28" y="49" width="44" height="2.6"/></g>
      <g stroke="#ff4dd2" stroke-opacity=".8" stroke-width="1"><path d="M50 56L10 100M50 56L90 100M50 56L35 100M50 56L65 100"/><path d="M0 64h100M0 72h100M0 84h100" stroke-opacity=".4"/></g>`
  };
  const KEYS = Object.keys(ART);
  const cover = (key) => {
    const k = typeof key === "number" ? KEYS[key % KEYS.length] : key;
    const u = "cv" + cvId++;
    return `<span class="cv"><svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${ART[k](u)}
      <filter id="${u}n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0"/></filter>
      <rect width="100" height="100" filter="url(#${u}n)" opacity=".16" style="mix-blend-mode:overlay"/></svg></span>`;
  };

  window.KEPhone = { icon, av, tabs, top, btn, main, row, banner, sheet, ring, toast, shoe, cover };
})();
