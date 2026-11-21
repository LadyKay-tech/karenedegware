/* Folder pages: build the file view, then play the extraction before showing it */
(function () {
  "use strict";
  const { escapeHTML, slugify, enterFolder, root, plainFolderSVG } = window.KE;
  const id = document.body.dataset.folder;
  const data = window.KE_DATA;

  const ICON = {
    note: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3.5 1.5h6l3 3v10h-9z"/><path d="M5.5 7.5h5M5.5 10h5M5.5 12.5h3"/></svg>',
    doc: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3.5 1.5h6l3 3v10h-9z"/><path d="M9.5 1.5v3h3"/></svg>'
  };

  /* Two sheets under each file give it thickness */
  

  /* Little light previews of each prototype, drawn in HTML so they stay crisp */
  const tick = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.5 6.3l2.3 2.2 4.7-5"/></svg>';
  const PREVIEW = {
    activation:
      `<span class="pv-k">Reached first value</span><span class="pv-big">+38%</span>` +
      `<span class="pv-bars"><b style="height:34%"></b><b style="height:48%"></b><b style="height:42%"></b><b style="height:66%"></b><b class="hi" style="height:92%"></b></span>`,
    checkout:
      `<span class="pv-k">Your basket</span>` +
      `<span class="pv-row"><span>Items</span><span>£48.00</span></span>` +
      `<span class="pv-row"><span>Delivery and fees</span><span>£6.49</span></span>` +
      `<span class="pv-row pv-tot"><span>Total</span><span>£54.49</span></span>` +
      `<span class="pv-btn">Pay £54.49</span>`,
    cancel:
      `<span class="pv-h">Before you go</span>` +
      `<span class="pv-chips"><span>Too pricey</span><span class="on">Not using it</span></span>` +
      `<span class="pv-pair"><span class="pv-btn ghost">Pause</span><span class="pv-btn">Cancel</span></span>`,
    upsell:
      `<span class="pv-ok">${tick}20 payments sent</span>` +
      `<span class="pv-k">Send the next batch in one go?</span>` +
      `<span class="pv-btn">Try bulk payouts</span>`,
    status:
      `<span class="pv-tl done"><i>${tick}</i><span>Sent</span><em>09:12</em></span>` +
      `<span class="pv-tl done"><i>${tick}</i><span>Bank received</span><em>09:13</em></span>` +
      `<span class="pv-tl now"><i></i><span>Arrives by</span><em>09:40</em></span>`,
    kyc:
      `<span class="pv-k">3 of 4 done</span>` +
      `<span class="pv-ck done"><i>${tick}</i>Photo ID</span>` +
      `<span class="pv-ck done"><i>${tick}</i>Address</span>` +
      `<span class="pv-ck done"><i>${tick}</i>Selfie</span>` +
      `<span class="pv-ck now"><i></i>Bank details <em>so payouts reach you</em></span>`,
    soon: `<span class="pv-soon">In the works</span>`,
  };

  /* Product Design & Philosophy: two folders */
  function designFolders() {
    const grid = document.getElementById("files");
    document.getElementById("count").textContent = `${data.design.length} folders`;
    const counts = { products: data.products.length, philosophy: data.principles.length };
    grid.classList.add("fgrid");
    grid.innerHTML = data.design
      .map((f) => {
        const n = counts[f.id] || 0;
        return `<li><a class="fold" href="${f.path}">${plainFolderSVG(n)}<span class="dmeta"><span class="dname">${escapeHTML(f.name)}</span>` +
          `<span class="dfile">${n} ${n === 1 ? "file" : "files"} · ${escapeHTML(f.note)}</span></span></a></li>`;
      })
      .join("");
  }

  /* A grid of paper files, used for principles and products */
  function fileGrid(items, label) {
    const grid = document.getElementById("files");
    const count = document.getElementById("count");
    const open = items.filter((p) => p.status === "open").length;
    count.textContent = `${items.length} files${open ? `, ${open} open` : `, ${label}`}`;

    grid.innerHTML = items
      .map((p) => {
        const isOpen = p.status === "open";
        const pv = p.thumb
          ? `<span class="shot" aria-hidden="true"><img src="${root}${p.thumb}" alt="" loading="lazy"><i class="shine"></i></span>`
          : `<span class="shot empty" aria-hidden="true"><span>In the works</span><i class="shine"></i></span>`;
        const meta =
          `<span class="dmeta">` +
          (p.area ? `<span class="darea cap">${escapeHTML(p.area)}</span>` : "") +
          `<span class="dname">${escapeHTML(p.title)}</span>` +
          `<span class="dfile">${escapeHTML(slugify(p.title))}.md</span></span>` +
          `<span class="dstate cap">${isOpen ? (p.note || "Open file") : "Coming soon"}</span>`;
        const file = `<span class="pvw"><span class="pv-floor"></span>${pv}</span>`;
        return isOpen
          ? `<li><a class="doc open" href="${p.href}">${file}${meta}</a></li>`
          : `<li><div class="doc" aria-disabled="true">${file}${meta}</div></li>`;
      })
      .join("");
  }

  function p3mo() {
    const grid = document.getElementById("files");
    const items = data.p3mo;
    const span = items.length % 4 !== 0;
    grid.innerHTML = items
      .map((f) => {
        if (f.type === "note") {
          const name = slugify(f.text).split("-").slice(0, 4).join("-") + ".md";
          return `<article class="file note${f.lead && span ? " lead" : ""}"><span class="ftype">${ICON.note}${escapeHTML(name)}</span><p>${escapeHTML(f.text)}</p></article>`;
        }
        return `<article class="file"><span class="ftype">${ICON.doc}Document</span><h3>${escapeHTML(f.name)}</h3><span class="soon">Opens soon</span></article>`;
      })
      .join("");
  }

  /*
    Balanced rows: work out how many files fit across, then spread them evenly
    over the rows, so 8 files sit 4 and 4 rather than 6 and 2.
  */
  function balance(grid) {
    const MIN = 150, GAP = 14;
    const fit = () => {
      const n = grid.children.length;
      if (!n) return;
      const w = grid.clientWidth;
      const most = Math.max(1, Math.floor((w + GAP) / (MIN + GAP)));
      const rows = Math.ceil(n / most);
      grid.style.setProperty("--cols", Math.ceil(n / rows));
    };
    fit();
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(grid);
    else window.addEventListener("resize", fit);
  }

  if (id === "product-design") designFolders();
  if (id === "philosophy") fileGrid(data.principles, "");
  if (id === "products") fileGrid(data.products.map((p) => Object.assign({ preview: "soon" }, p)), "coming soon");
  if (id === "p3mo") p3mo();
  if (id === "philosophy" || id === "products") {
    const g = document.getElementById("files");
    g.classList.add("balanced");
    balance(g);
  }

  /* Files tilt gently toward the cursor */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", (e) => {
      const doc = e.target.closest && e.target.closest("a.fold");
      document.querySelectorAll(".tilting").forEach((d) => { if (d !== doc) { d.classList.remove("tilting"); d.style.removeProperty("--rx"); d.style.removeProperty("--ry"); } });
      if (!doc) return;
      const r = doc.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      doc.classList.add("tilting");
      doc.style.setProperty("--ry", (x * 14).toFixed(2) + "deg");
      doc.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg");
    });
  }

  /* Escape closes the folder: subfolders go up one level, top folders go home */
  const sub = id === "philosophy" || id === "products";
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || document.querySelector(".ow.fs")) return;
    window.location.href = sub ? "../" : root || "./";
  });

  enterFolder(id);
})();
