/* Home: opening wordmark, the light that moves over the portrait, hidden lines, folders */
(function () {
  "use strict";
  const { reduced, folderSVG, openFolder } = window.KE;
  const body = document.body;

  /* Folders */
  const foldersEl = document.getElementById("folders");
  const meta = { "product-design": window.KE_DATA.principles.length + " files", p3mo: window.KE_DATA.p3mo.length + " files" };
  foldersEl.innerHTML = window.KE_DATA.folders
    .map(
      (f) =>
        `<a class="folder" href="${f.path}" data-id="${f.id}" aria-label="Open ${f.name}">` +
        `<span class="fwrap">${folderSVG()}</span>` +
        `<span class="fname">${f.name}<span class="fmeta">${meta[f.id] || ""}</span></span></a>`
    )
    .join("");

  let busy = false;
  foldersEl.addEventListener("click", (e) => {
    const link = e.target.closest(".folder");
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (busy) return;
    busy = true;
    const folder = window.KE_DATA.folders.find((f) => f.id === link.dataset.id);
    openFolder(folder, link.querySelector(".fwrap"));
  });
  window.addEventListener("pageshow", () => { busy = false; });

  /* Light over the portrait */
  const hero = document.getElementById("hero");
  const portrait = document.getElementById("portrait");
  const ring = document.getElementById("ring");
  const words = document.getElementById("words");
  const lines = [...words.querySelectorAll("span")];

  const P = { x: 0, y: 0 };
  const T = { x: 0, y: 0 };
  let R = 160;
  let face = { x: 0, y: 0, r: 0 };
  let route = [];
  let stop = 0;
  let stopAt = 0;
  let lastMove = -1e9;
  let running = false;

  function place() {
    const hb = hero.getBoundingClientRect();
    const pb = portrait.getBoundingClientRect();
    const pw = pb.width;
    const cx = pb.left - hb.left + pw / 2;
    const top = pb.top - hb.top;
    const narrow = hb.width < 700;
    const touch = window.matchMedia("(hover: none)").matches;
    const off = Math.min(hb.width * 0.5 - 110, pw * 0.56);

    /* Where each hidden line sits: [horizontal offset from the face, height in the portrait] */
    const spots = narrow
      ? [[0.16, 0.24], [0.84, 0.4], [0.16, 0.56], [0.84, 0.72]]
      : [[-1, 0.16], [1.28, 0.24], [-1.28, 0.36], [1, 0.44], [-1, 0.56], [1.28, 0.64], [-1.28, 0.76], [1, 0.84]];
    const pts = spots.map(([sx, sy]) => ({ x: narrow ? hb.width * sx : cx + sx * off, y: top + pb.height * sy }));

    lines.forEach((el, i) => {
      const q = pts[i];
      el.style.display = q ? "" : "none";
      if (q) { el.style.left = q.x + "px"; el.style.top = q.y + "px"; }
    });

    R = Math.max(100, Math.min(190, pw * 0.2));
    face = { x: cx, y: top + pb.height * 0.36, r: pw * 0.2 };

    /* On phones the light stays near the face; elsewhere it visits each line in turn */
    if (narrow || touch) {
      route = [face, { x: face.x - pw * 0.06, y: face.y + pb.height * 0.04 }, face, { x: face.x + pw * 0.06, y: face.y + pb.height * 0.02 }];
    } else {
      route = [face, ...pts];
      route.splice(Math.ceil(route.length / 2), 0, face);
    }
    if (!P.x) { P.x = T.x = face.x; P.y = T.y = face.y; }
  }

  function paint() {
    const hb = hero.getBoundingClientRect();
    const pb = portrait.getBoundingClientRect();
    portrait.style.setProperty("--x", P.x - (pb.left - hb.left) + "px");
    portrait.style.setProperty("--y", P.y - (pb.top - hb.top) + "px");
    portrait.style.setProperty("--r", R + "px");
    words.style.setProperty("--hx", P.x + "px");
    words.style.setProperty("--hy", P.y + "px");
    words.style.setProperty("--r", R * 1.05 + "px");
    portrait.classList.toggle("glow", Math.hypot(P.x - face.x, P.y - face.y) < face.r);
    ring.style.width = ring.style.height = R * 1.3 + "px";
    ring.style.transform = `translate3d(${P.x - R * 0.65}px,${P.y - R * 0.65}px,0)`;
  }

  function loop(now) {
    if (now - lastMove > 2500 && route.length) {
      if (now - stopAt > 2600) { stop = (stop + 1) % route.length; stopAt = now; }
      T.x = route[stop].x;
      T.y = route[stop].y;
    }
    P.x += (T.x - P.x) * 0.045;
    P.y += (T.y - P.y) * 0.045;
    paint();
    if (!document.hidden) requestAnimationFrame(loop);
    else running = false;
  }

  function start() {
    if (reduced.matches) { paint(); return; }
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  hero.addEventListener("pointermove", (e) => {
    const hb = hero.getBoundingClientRect();
    T.x = e.clientX - hb.left;
    T.y = e.clientY - hb.top;
    lastMove = performance.now();
    if (reduced.matches) { P.x = T.x; P.y = T.y; paint(); }
  });
  document.addEventListener("visibilitychange", start);
  const heroObserver = new ResizeObserver(() => { place(); paint(); });
  heroObserver.observe(hero);

  /* Introduction fades in as it reaches the screen */
  const intro = document.getElementById("intro");
  if (!reduced.matches && "IntersectionObserver" in window) {
    intro.classList.add("pre");
    const introObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { intro.classList.remove("pre"); introObserver.disconnect(); }
    }, { threshold: 0.25 });
    introObserver.observe(intro);
  }

  /* Opening wordmark, shown once per visit */
  function ready() {
    if (body.classList.contains("ready")) return;
    body.classList.remove("intro");
    body.classList.add("ready");
    setTimeout(() => { const m = document.getElementById("introMark"); if (m) m.remove(); }, 1200);
    place();
    paint();
  }

  place();
  paint();
  start();

  let seen = false;
  try { seen = sessionStorage.getItem("ke-intro") === "1"; sessionStorage.setItem("ke-intro", "1"); } catch (e) { /* storage unavailable */ }
  if (reduced.matches || seen) ready();
  else {
    setTimeout(ready, 1400);
    document.getElementById("introMark").addEventListener("click", ready);
  }
})();
