/* Folder pages: build the file view, then play the extraction before showing it */
(function () {
  "use strict";
  const { escapeHTML, slugify, enterFolder, root } = window.KE;
  const id = document.body.dataset.folder;
  const data = window.KE_DATA;

  const ICON = {
    note: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3.5 1.5h6l3 3v10h-9z"/><path d="M5.5 7.5h5M5.5 10h5M5.5 12.5h3"/></svg>',
    doc: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3.5 1.5h6l3 3v10h-9z"/><path d="M9.5 1.5v3h3"/></svg>'
  };

  function productDesign() {
    const grid = document.getElementById("files");
    const count = document.getElementById("count");
    const open = data.principles.filter((p) => p.status === "open").length;
    count.textContent = `${data.principles.length} files, ${open} open`;

    grid.innerHTML = data.principles
      .map((p) => {
        const isOpen = p.status === "open";
        const sheet =
          `<span class="sheet" aria-hidden="true"><i></i><i></i><i></i><i></i>` +
          (isOpen ? `<span class="mini"><b style="height:40%"></b><b style="height:58%"></b><b style="height:50%"></b><b style="height:72%"></b><b style="height:95%"></b></span>` : "") +
          `</span>`;
        const label =
          `<span><span class="dname">${escapeHTML(p.title)}</span><span class="dfile">${escapeHTML(slugify(p.title))}.md</span></span>` +
          `<span class="dstate cap">${isOpen ? "Open" : "In progress"}</span>`;
        return isOpen
          ? `<li><a class="doc open" href="${p.href}">${sheet}${label}</a></li>`
          : `<li><div class="doc" aria-disabled="true">${sheet}${label}</div></li>`;
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

  if (id === "product-design") productDesign();
  if (id === "p3mo") p3mo();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.location.href = root || "./";
  });

  enterFolder(id);
})();
