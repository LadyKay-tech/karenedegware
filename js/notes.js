/* Notes: the list at /notes/ and a single note at /notes/<slug>/ */
(function () {
  "use strict";
  const { root, escapeHTML } = window.KE;
  const view = document.body.dataset.view;
  const main = document.getElementById("notes");
  const fresh = () => "?t=" + Date.now(); /* skip stale caches right after publishing */

  const formatDate = (iso) => {
    const d = new Date(iso + "T00:00:00");
    return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  async function loadIndex() {
    const res = await fetch(root + "content/notes/index.json" + fresh());
    if (!res.ok) throw new Error("index");
    const data = await res.json();
    return (data.posts || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  async function list() {
    try {
      const posts = await loadIndex();
      if (!posts.length) {
        main.insertAdjacentHTML("beforeend", '<p class="nempty">The first note is on its way.</p>');
        return;
      }
      main.insertAdjacentHTML(
        "beforeend",
        `<ol class="nlist">${posts
          .map(
            (p) => `<li><a class="nitem" href="${encodeURIComponent(p.slug)}/">
  <span class="ntext">
    <span class="cap dim">${formatDate(p.date)}</span>
    <span class="ntitle">${escapeHTML(p.title)}</span>
    ${p.summary ? `<span class="nsum">${escapeHTML(p.summary)}</span>` : ""}
  </span>
  ${p.image ? `<span class="nthumb"><img src="${root + p.image}" alt="" loading="lazy"></span>` : ""}
</a></li>`
          )
          .join("")}</ol>`
      );
    } catch (e) {
      main.insertAdjacentHTML("beforeend", '<p class="nempty">Notes couldn’t load just now. Please try again in a moment.</p>');
    }
  }

  async function post() {
    const slug = document.documentElement.dataset.slug;
    try {
      const [posts, res] = await Promise.all([loadIndex(), fetch(root + "content/notes/" + slug + ".md" + fresh())]);
      const meta = posts.find((p) => p.slug === slug);
      if (!meta || !res.ok) throw new Error("missing");
      const body = await res.text();
      document.title = meta.title + " | Karen Edegware";
      main.innerHTML = `
<header class="nhead">
  <span class="cap dim">${formatDate(meta.date)}</span>
  <h1>${escapeHTML(meta.title)}</h1>
</header>
${meta.image ? `<figure class="nhero"><img src="${root + meta.image}" alt="${escapeHTML(meta.alt || "")}">${meta.caption ? `<figcaption>${escapeHTML(meta.caption)}</figcaption>` : ""}</figure>` : ""}
<div class="nbody">${window.KEMarkdown.render(body)}</div>
<p class="nback"><a class="pill" href="../">All notes</a></p>`;
    } catch (e) {
      main.innerHTML = '<p class="nempty">This note isn’t available. <a href="../">See all notes</a>.</p>';
    }
    main.classList.add("on");
  }

  if (view === "list") list().then(() => main.classList.add("on"));
  if (view === "post") post();
})();
