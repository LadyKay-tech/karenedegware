/* Shared helpers: paths, the zipped folder drawing, and the extraction sequence */
(function () {
  "use strict";

  const root = document.documentElement.dataset.root || "";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const escapeHTML = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const slugify = (s) =>
    String(s)
      .toLowerCase()
      .normalize("NFKD").replace(/[̀-ͯ]/g, "")
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);

  /* The zipped glass folder. Each call gets its own gradient ids. */
  let uid = 0;
  function folderSVG() {
    const u = "f" + uid++;
    const teethL = [];
    const teethR = [];
    for (let y = 64; y < 158; y += 6) {
      teethL.push(`<rect x="103.5" y="${y}" width="6.5" height="3.2" rx="1.2" fill="url(#${u}m)"/>`);
      teethR.push(`<rect x="110" y="${y + 3}" width="6.5" height="3.2" rx="1.2" fill="url(#${u}m)"/>`);
    }
    const front = "M12 76q1-14 15-15l83-3v108H26q-14 0-14-14z";
    const frontR = "M110 58l83 3q14 1 15 15v76q0 14-14 14h-84z";
    return `<svg class="fsvg" viewBox="0 0 220 184" aria-hidden="true"><defs>
<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".03"/></linearGradient>
<linearGradient id="${u}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a5a62" stop-opacity=".72"/><stop offset=".24" stop-color="#2c2c31" stop-opacity=".78"/><stop offset="1" stop-color="#111114" stop-opacity=".88"/></linearGradient>
<linearGradient id="${u}e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient>
<linearGradient id="${u}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f1ea"/><stop offset="1" stop-color="#8d8980"/></linearGradient>
<linearGradient id="${u}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f3ec"/><stop offset="1" stop-color="#d9d4ca"/></linearGradient>
<radialGradient id="${u}sh"><stop offset="0" stop-color="#000" stop-opacity=".9"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="110" cy="172" rx="104" ry="11" fill="url(#${u}sh)"/>
<path d="M12 36q0-14 14-14h52q7 0 11 5l7 8h98q14 0 14 14v100q0 14-14 14H26q-14 0-14-14z" fill="url(#${u}b)" stroke="rgba(255,255,255,.2)"/>
<g class="paper p3"><rect x="32" y="34" width="156" height="110" rx="5" fill="#9e998f" transform="rotate(1.6 110 90)"/></g>
<g class="paper p2"><rect x="27" y="30" width="166" height="112" rx="5" fill="#cdc8be" transform="rotate(-1.4 110 86)"/></g>
<g class="paper p1"><rect x="22" y="26" width="176" height="116" rx="5" fill="url(#${u}p)"/><rect x="38" y="40" width="64" height="4" rx="2" fill="#b3ada2"/><rect x="38" y="50" width="104" height="3" rx="1.5" fill="#cbc5ba"/><rect x="38" y="58" width="88" height="3" rx="1.5" fill="#cbc5ba"/></g>
<g class="fl"><path d="${front}" fill="url(#${u}f)" stroke="url(#${u}e)"/><path d="${front}" fill="url(#${u}s)"/><path d="M15 70q3-8 12-9l83-3" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.4"/><rect x="103" y="58" width="7" height="108" fill="rgba(0,0,0,.35)"/>${teethL.join("")}</g>
<g class="fr"><path d="${frontR}" fill="url(#${u}f)" stroke="url(#${u}e)"/><path d="${frontR}" fill="url(#${u}s)"/><path d="M110 58l83 3q9 1 12 9" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.4"/><rect x="110" y="58" width="7" height="108" fill="rgba(0,0,0,.35)"/>${teethR.join("")}<text x="194" y="155" text-anchor="end" font-family="Montserrat,sans-serif" font-size="8.5" font-weight="600" fill="rgba(255,255,255,.6)" letter-spacing="1.5">ZIP</text></g>
<g class="tab"><rect x="102.5" y="52" width="15" height="11" rx="3" fill="url(#${u}m)"/><rect x="105.5" y="61" width="9" height="19" rx="4.5" fill="url(#${u}m)"/><rect x="107.8" y="64" width="4.4" height="12" rx="2.2" fill="#1a1a1c"/></g></svg>`;
  }

  /* File names shown in the extraction log for a folder */
  function folderLog(id) {
    const data = window.KE_DATA || {};
    if (id === "product-design") return (data.principles || []).map((p) => slugify(p.title) + ".md");
    if (id === "p3mo") {
      return (data.p3mo || []).map((f) =>
        f.type === "note" ? slugify(f.text).split("-").slice(0, 4).join("-") + ".md" : slugify(f.name) + ".pdf"
      );
    }
    return [];
  }

  /*
    Plays the unzip sequence. `from` is the element the folder flies out of;
    without it the folder grows from the middle of the screen.
  */
  async function extract({ zip, files = [], from = null }) {
    if (reduced.matches) return;

    const overlay = document.createElement("div");
    overlay.className = "extract";
    overlay.setAttribute("aria-live", "polite");
    overlay.innerHTML =
      `<div class="bigf">${folderSVG()}</div>` +
      `<div class="log"><p class="ttl">Extracting ${escapeHTML(zip)}</p><div class="bar"><i></i></div><ol></ol></div>`;
    document.body.appendChild(overlay);
    document.body.classList.add("locked");

    const big = overlay.querySelector(".bigf");
    const bar = overlay.querySelector(".bar i");
    const list = overlay.querySelector("ol");
    const title = overlay.querySelector(".ttl");

    big.style.transform = "translate(-50%,-50%)";
    const dst = big.getBoundingClientRect();
    let start = "translate(-50%,-50%) scale(.55)";
    if (from) {
      const src = from.getBoundingClientRect();
      const s = src.width / dst.width;
      const dx = src.left + src.width / 2 - (dst.left + dst.width / 2);
      const dy = src.top + src.height / 2 - (dst.top + dst.height / 2);
      start = `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${s})`;
    }
    big.style.transform = start;
    void big.offsetWidth;
    overlay.classList.add("on");
    big.style.transition = "transform .42s cubic-bezier(.2,.8,.2,1)";
    big.style.transform = "translate(-50%,-50%)";

    await wait(420);
    big.querySelector(".fsvg").classList.add("open");
    await wait(560);

    const box = big.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height * 0.35;
    const reach = Math.min(innerWidth, innerHeight) * 0.42;

    for (let i = 0; i < files.length; i++) {
      const li = document.createElement("li");
      li.innerHTML = `<b>${escapeHTML(files[i])}</b><span>${((i * 37 + 13) % 180) + 12} KB</span>`;
      list.appendChild(li);
      bar.style.width = ((i + 1) / files.length) * 100 + "%";

      const flyer = document.createElement("div");
      flyer.className = "flyer";
      flyer.style.transform = `translate(${cx - 27}px,${cy - 34}px) scale(.6)`;
      overlay.appendChild(flyer);
      void flyer.offsetWidth;
      const a = (files.length > 1 ? i / (files.length - 1) - 0.5 : 0) * 2.4;
      flyer.style.transform = `translate(${cx - 27 + Math.sin(a) * reach}px,${cy - 34 - Math.cos(a) * reach * 0.8}px) rotate(${a * 20}deg)`;
      flyer.style.opacity = "0";
      setTimeout(() => flyer.remove(), 800);
      await wait(70);
    }

    title.textContent = `Extracted ${files.length} files`;
    await wait(220);
    return {
      /* Fades the overlay out once the next view is in place */
      close: async () => {
        overlay.classList.remove("on");
        await wait(240);
        overlay.remove();
        document.body.classList.remove("locked");
      }
    };
  }

  /* Opens a folder page: plays extraction where the folder was clicked, then navigates */
  async function openFolder(folder, fromEl) {
    const run = await extract({ zip: folder.zip, files: folderLog(folder.id), from: fromEl });
    try { sessionStorage.setItem("ke-extracted", folder.id); } catch (e) { /* storage unavailable */ }
    window.location.href = root + folder.path;
    return run;
  }

  /* On a folder page: extract first unless we've just come from the home page */
  async function enterFolder(id) {
    const folder = (window.KE_DATA.folders || []).find((f) => f.id === id);
    const content = document.querySelector("[data-reveal]");
    let came = null;
    try { came = sessionStorage.getItem("ke-extracted"); sessionStorage.removeItem("ke-extracted"); } catch (e) { /* storage unavailable */ }
    let run = null;
    if (folder && came !== id) run = await extract({ zip: folder.zip, files: folderLog(id) });
    if (content) requestAnimationFrame(() => requestAnimationFrame(() => content.classList.add("on")));
    if (run) await run.close();
  }

  /* Coming back with the browser's back button restores the old page; clear any leftover overlay */
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    document.querySelectorAll(".extract").forEach((o) => o.remove());
    document.body.classList.remove("locked");
  });

  window.KE = { root, reduced, wait, escapeHTML, slugify, folderSVG, folderLog, extract, openFolder, enterFolder };
})();
