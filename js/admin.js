/*
  Private notes editor.
  Publishes straight to the GitHub repository behind the site, in one commit per change.
  Drafts are kept in this browser only until they are published.
*/
(function () {
  "use strict";
  const { slugify, escapeHTML } = window.KE;

  const REPO = { owner: "LadyKay-tech", name: "karenedegware", branch: "main" };
  const SITE = "https://karenedegware.com/";
  const API = "https://api.github.com";
  const TOKEN_KEY = "ke-cms-token";
  const DRAFTS_KEY = "ke-cms-drafts";
  const MAX_SIDE = 2400;
  const NO_WRITE = "This token can read your site but can’t publish to it. On GitHub, edit the token: under Repository access make sure <b>karenedegware</b> is selected, and under Repository permissions set <b>Contents</b> to <b>Read and write</b>. Then sign in again."; /* longest side of an uploaded picture, in pixels */

  const $ = (id) => document.getElementById(id);
  const views = { signin: $("viewSignin"), list: $("viewList"), editor: $("viewEditor") };

  let token = "";
  try { token = localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { /* storage unavailable */ }

  /* Editor state */
  let posts = [];          /* published notes, from content/notes/index.json */
  let current = null;      /* the note being edited */
  let image = null;        /* { base64, preview, ext } for a newly chosen picture */
  let slugTouched = false;
  let confirmTimer = 0;

  /* ---------- small helpers ---------- */

  function show(name) {
    Object.entries(views).forEach(([key, el]) => { el.hidden = key !== name; });
    $("session").hidden = name === "signin";
    window.scrollTo(0, 0);
  }

  let statusTimer = 0;
  function status(html, { error = false, sticky = false } = {}) {
    const el = $("status");
    el.innerHTML = html;
    el.classList.toggle("error", error);
    el.hidden = false;
    clearTimeout(statusTimer);
    if (!sticky) statusTimer = setTimeout(() => { el.hidden = true; }, error ? 9000 : 5000);
  }

  const today = () => {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };

  const toBase64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin);
  };
  const fromBase64 = (b64) => {
    const bin = atob(b64.replace(/\n/g, ""));
    return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  };

  function busy(on) {
    ["publish", "saveDraft", "unpublish", "newNote"].forEach((id) => { const b = $(id); if (b) b.disabled = on; });
  }

  /* ---------- GitHub ---------- */

  async function gh(path, options = {}) {
    const res = await fetch(API + path, {
      ...options,
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(options.body ? { "Content-Type": "application/json" } : {})
      }
    });
    if (res.status === 401) { signOut("Your access token has expired or is no longer valid. Please sign in again."); throw new Error("unauthorised"); }
    if (!res.ok) {
      let message = res.statusText;
      try { message = (await res.json()).message || message; } catch (e) { /* no body */ }
      const err = new Error(message);
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  const repoPath = (p) => `/repos/${REPO.owner}/${REPO.name}${p}`;

  async function readText(path) {
    try {
      const file = await gh(repoPath(`/contents/${path}?ref=${REPO.branch}&t=${Date.now()}`));
      return fromBase64(file.content);
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }

  async function readIndex() {
    const text = await readText("content/notes/index.json");
    if (!text) return [];
    try { return JSON.parse(text).posts || []; } catch (e) { return []; }
  }

  /* One commit containing every change. changes: [{ path, text } | { path, base64 } | { path, remove: true }] */
  async function commit(message, changes) {
    const ref = await gh(repoPath(`/git/ref/heads/${REPO.branch}`));
    const head = await gh(repoPath(`/git/commits/${ref.object.sha}`));
    const tree = [];
    for (const c of changes) {
      if (c.remove) { tree.push({ path: c.path, mode: "100644", type: "blob", sha: null }); continue; }
      const blob = await gh(repoPath("/git/blobs"), {
        method: "POST",
        body: JSON.stringify(c.base64 != null ? { content: c.base64, encoding: "base64" } : { content: toBase64(c.text), encoding: "base64" })
      });
      tree.push({ path: c.path, mode: "100644", type: "blob", sha: blob.sha });
    }
    const newTree = await gh(repoPath("/git/trees"), { method: "POST", body: JSON.stringify({ base_tree: head.tree.sha, tree }) });
    const newCommit = await gh(repoPath("/git/commits"), {
      method: "POST",
      body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] })
    });
    await gh(repoPath(`/git/refs/heads/${REPO.branch}`), { method: "PATCH", body: JSON.stringify({ sha: newCommit.sha }) });
  }

  /* ---------- drafts (this browser only) ---------- */

  function readDrafts() {
    try { return JSON.parse(localStorage.getItem(DRAFTS_KEY) || "{}"); } catch (e) { return {}; }
  }
  function writeDrafts(drafts) {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  }

  /* ---------- sign in ---------- */

  async function signIn(value) {
    token = value.trim();
    status("Checking your token…", { sticky: true });
    try {
      await gh(repoPath(""));
      await readIndex();
      /* The repository is public, so reading proves nothing. Writing a small unused blob checks the token can publish. */
      await gh(repoPath("/git/blobs"), { method: "POST", body: JSON.stringify({ content: "check", encoding: "utf-8" }) });
      try { localStorage.setItem(TOKEN_KEY, token); } catch (e) { /* storage unavailable */ }
      $("status").hidden = true;
      await openList();
    } catch (e) {
      if (e.message === "unauthorised") return;
      token = "";
      status(e.status === 403 || e.status === 404
        ? NO_WRITE
        : "Couldn’t sign in: " + escapeHTML(e.message), { error: true });
    }
  }

  function signOut(message) {
    token = "";
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* storage unavailable */ }
    $("token").value = "";
    show("signin");
    if (message) status(escapeHTML(message), { error: true });
  }

  /* ---------- list ---------- */

  async function openList() {
    show("list");
    loadCV();
    $("postList").innerHTML = '<p class="aempty">Loading…</p>';
    try {
      posts = await readIndex();
    } catch (e) {
      $("postList").innerHTML = `<p class="aempty">Couldn’t load your notes: ${escapeHTML(e.message)}</p>`;
      return;
    }
    renderList();
  }

  function renderList() {
    const drafts = readDrafts();
    const rows = [];
    Object.values(drafts).forEach((d) => {
      rows.push({ key: "draft:" + d.slug, title: d.title || "Untitled", date: d.date, live: posts.some((p) => p.slug === d.slug), draft: true });
    });
    posts.forEach((p) => {
      if (!drafts[p.slug]) rows.push({ key: "post:" + p.slug, title: p.title, date: p.date, live: true, draft: false });
    });
    rows.sort((a, b) => ((a.date || "") < (b.date || "") ? 1 : -1));

    if (!rows.length) {
      $("postList").innerHTML = '<p class="aempty">No notes yet. Start with <b>New note</b>.</p>';
      return;
    }
    $("postList").innerHTML = `<ul class="alist">${rows
      .map((r) => `<li>
  <div><div class="t">${escapeHTML(r.title)}</div>
  <div class="m"><span>${escapeHTML(r.date || "")}</span>
  ${r.live ? '<span class="badge live">On the site</span>' : ""}
  ${r.draft ? '<span class="badge">Unpublished changes</span>' : ""}</div></div>
  <button class="pill" type="button" data-open="${escapeHTML(r.key)}">Edit</button>
</li>`)
      .join("")}</ul>`;
  }

  $("postList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (!btn) return;
    const [kind, slug] = btn.dataset.open.split(":");
    openEditor(kind === "draft" ? readDrafts()[slug] : posts.find((p) => p.slug === slug), kind === "draft");
  });


  /* ---------- CV ---------- */

  const CV_FILE = "assets/cv/karen-edegware-cv.pdf";
  const CV_INFO = "content/cv.json";
  let cvInfo = null;
  let cvConfirm = 0;

  const prettyDate = (iso) => {
    try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return iso; }
  };

  function renderCV() {
    const state = $("cvState");
    if (cvInfo && cvInfo.file) {
      state.textContent = `On the site, updated ${prettyDate(cvInfo.updated)}. Visitors can download it from the footer of every page.`;
      $("cvView").href = SITE + cvInfo.file + "?v=" + encodeURIComponent(cvInfo.updated || "");
      $("cvView").hidden = false;
      $("cvRemove").hidden = false;
      $("cvPick").textContent = "Replace CV";
    } else {
      state.textContent = "Nothing uploaded yet. Once you upload a PDF, a Download CV link appears next to Notes in the footer.";
      $("cvView").hidden = true;
      $("cvRemove").hidden = true;
      $("cvPick").textContent = "Upload CV";
    }
  }

  async function loadCV() {
    try {
      const text = await readText(CV_INFO);
      cvInfo = text ? JSON.parse(text) : null;
    } catch (e) { cvInfo = null; }
    renderCV();
  }

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("Couldn’t read that file."));
    reader.readAsDataURL(file);
  });

  $("cvFile").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") { status("Please choose a PDF. Word files open differently on every device, a PDF looks the same everywhere.", { error: true }); return; }
    if (file.size > 15 * 1024 * 1024) { status("That PDF is over 15 MB. Try exporting it again with smaller images.", { error: true }); return; }
    $("cvPick").classList.add("busy");
    status("Uploading your CV…", { sticky: true });
    try {
      const base64 = await fileToBase64(file);
      const info = { file: CV_FILE, name: "Karen-Edegware-CV.pdf", updated: new Date().toISOString() };
      await commit("Update CV", [
        { path: CV_FILE, base64 },
        { path: CV_INFO, text: JSON.stringify(info, null, 2) + "\n" }
      ]);
      cvInfo = info;
      renderCV();
      status("Done. Your new CV will be live on the site in a minute or two.");
    } catch (err) {
      if (err.status === 403 || err.status === 404) status(NO_WRITE, { error: true, sticky: true });
      else if (err.message !== "unauthorised") status(`The upload didn’t go through: ${escapeHTML(err.message)}`, { error: true });
    } finally {
      $("cvPick").classList.remove("busy");
    }
  });

  $("cvRemove").addEventListener("click", async () => {
    const btn = $("cvRemove");
    if (!btn.dataset.armed) {
      btn.dataset.armed = "1";
      btn.textContent = "Click again to take it down";
      clearTimeout(cvConfirm);
      cvConfirm = setTimeout(() => { delete btn.dataset.armed; btn.textContent = "Take down"; }, 4000);
      return;
    }
    clearTimeout(cvConfirm);
    delete btn.dataset.armed;
    btn.textContent = "Take down";
    status("Taking your CV down…", { sticky: true });
    try {
      await commit("Remove CV", [{ path: CV_FILE, remove: true }, { path: CV_INFO, remove: true }]);
      cvInfo = null;
      renderCV();
      status("Your CV is off the site. The footer link disappears in a minute or two.");
    } catch (err) {
      if (err.message !== "unauthorised") status(`That didn’t work: ${escapeHTML(err.message)}`, { error: true });
    }
  });

  /* ---------- editor ---------- */

  const field = {
    title: $("fTitle"), slug: $("fSlug"), date: $("fDate"), summary: $("fSummary"),
    alt: $("fAlt"), caption: $("fCaption"), body: $("fBody")
  };

  async function openEditor(note, fromDraft) {
    clearTimeout(confirmTimer);
    image = null;
    const live = note ? posts.find((p) => p.slug === note.slug) : null;
    current = {
      slug: note ? note.slug : "",
      isLive: Boolean(live),
      liveImage: live ? live.image || "" : "",
      image: note ? note.image || "" : "",
      draftImage: fromDraft && note.draftImage ? note.draftImage : null
    };

    field.title.value = note ? note.title || "" : "";
    field.slug.value = current.slug;
    field.date.value = note ? note.date || today() : today();
    field.summary.value = note ? note.summary || "" : "";
    field.alt.value = note ? note.alt || "" : "";
    field.caption.value = note ? note.caption || "" : "";
    field.body.value = fromDraft ? note.body || "" : "";
    slugTouched = Boolean(note);
    field.slug.readOnly = current.isLive; /* a published link stays put */

    if (current.draftImage) image = current.draftImage;
    setWriteMode(true);
    renderImage();
    updateCount();
    $("dangerZone").hidden = !current.isLive;
    $("publish").textContent = current.isLive ? "Update" : "Publish";
    show("editor");

    if (note && !fromDraft && current.isLive) {
      field.body.value = "Loading…";
      field.body.disabled = true;
      try {
        field.body.value = (await readText(`content/notes/${note.slug}.md`)) || "";
      } catch (e) {
        field.body.value = "";
        status("Couldn’t load the text of this note: " + escapeHTML(e.message), { error: true });
      }
      field.body.disabled = false;
    }
    if (!note) field.title.focus();
  }

  field.title.addEventListener("input", () => {
    if (!slugTouched && !current.isLive) field.slug.value = slugify(field.title.value);
  });
  field.slug.addEventListener("input", () => {
    slugTouched = true;
    field.slug.value = field.slug.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  });
  const updateCount = () => { $("sumCount").textContent = field.summary.value.length ? `${field.summary.value.length}/200` : ""; };
  field.summary.addEventListener("input", updateCount);

  /* Picture: choose, drop, resize */
  function renderImage() {
    const src = image ? image.preview : current.localPreview || (current.image ? "../" + current.image : "");
    const img = $("imgPreview");
    img.hidden = !src;
    if (src) img.src = src;
    $("dropMsg").hidden = Boolean(src);
    $("imgActions").hidden = !src;
    $("imgFields").hidden = !src;
  }

  async function takeImage(file) {
    if (!file || !file.type.startsWith("image/")) { status("Please choose a picture file.", { error: true }); return; }
    status("Preparing your picture…", { sticky: true });
    try {
      const bitmap = await loadBitmap(file);
      const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#0c0c0c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      let quality = 0.86;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      while (dataUrl.length > 4.5e6 && quality > 0.5) { quality -= 0.08; dataUrl = canvas.toDataURL("image/jpeg", quality); }
      image = { base64: dataUrl.split(",")[1], preview: dataUrl, ext: "jpg" };
      renderImage();
      $("status").hidden = true;
      if (!field.alt.value) field.alt.focus();
    } catch (e) {
      status("That picture couldn’t be opened. Try a JPEG or PNG.", { error: true });
    }
  }

  function loadBitmap(file) {
    if ("createImageBitmap" in window) return createImageBitmap(file);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  $("fImage").addEventListener("change", (e) => { takeImage(e.target.files[0]); e.target.value = ""; });
  const drop = $("drop");
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => takeImage(e.dataTransfer.files[0]));
  $("removeImage").addEventListener("click", () => { image = null; current.image = ""; current.localPreview = null; field.alt.value = ""; field.caption.value = ""; renderImage(); });

  /* Write and preview */
  function setWriteMode(write) {
    $("tabWrite").setAttribute("aria-selected", write);
    $("tabPreview").setAttribute("aria-selected", !write);
    field.body.hidden = !write;
    $("tools").hidden = !write;
    $("preview").hidden = write;
    if (!write) {
      const src = image ? image.preview : current.localPreview || (current.image ? "../" + current.image : "");
      $("preview").innerHTML =
        `<header class="nhead"><span class="cap dim">${escapeHTML(field.date.value)}</span><h1>${escapeHTML(field.title.value || "Untitled")}</h1></header>` +
        (src ? `<figure class="nhero"><img src="${src}" alt="">${field.caption.value ? `<figcaption>${escapeHTML(field.caption.value)}</figcaption>` : ""}</figure>` : "") +
        `<div class="nbody">${window.KEMarkdown.render(field.body.value)}</div>`;
    }
  }
  $("tabWrite").addEventListener("click", () => setWriteMode(true));
  $("tabPreview").addEventListener("click", () => setWriteMode(false));

  /* Formatting buttons */
  $("tools").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-md]");
    if (!btn) return;
    const t = field.body;
    const start = t.selectionStart, end = t.selectionEnd;
    const sel = t.value.slice(start, end);
    const lineStart = t.value.lastIndexOf("\n", start - 1) + 1;
    let before = t.value.slice(0, start), after = t.value.slice(end), insert = sel, caret = null;
    switch (btn.dataset.md) {
      case "bold": insert = `**${sel || "bold text"}**`; break;
      case "italic": insert = `*${sel || "italic text"}*`; break;
      case "link": insert = `[${sel || "link text"}](https://)`; caret = start + insert.length - 1; break;
      case "divider": insert = `\n\n---\n\n`; break;
      case "heading": case "quote": case "list": {
        const mark = { heading: "## ", quote: "> ", list: "- " }[btn.dataset.md];
        before = t.value.slice(0, lineStart);
        insert = mark + t.value.slice(lineStart, end);
        break;
      }
    }
    t.value = before + insert + after;
    const pos = caret != null ? caret : before.length + insert.length;
    t.focus();
    t.setSelectionRange(pos, pos);
  });

  /* Gather what's on screen */
  function collect() {
    return {
      slug: field.slug.value.trim().replace(/^-+|-+$/g, ""),
      title: field.title.value.trim(),
      date: field.date.value || today(),
      summary: field.summary.value.trim(),
      alt: field.alt.value.trim(),
      caption: field.caption.value.trim(),
      body: field.body.value
    };
  }

  /* Save draft in this browser */
  $("saveDraft").addEventListener("click", () => {
    const note = collect();
    if (!note.slug) note.slug = slugify(note.title) || "untitled-" + Date.now();
    field.slug.value = note.slug;
    const drafts = readDrafts();
    const entry = { ...note, image: current.image, draftImage: image };
    drafts[note.slug] = entry;
    try {
      writeDrafts(drafts);
      status("Draft saved on this device. It isn’t on your site until you publish.");
    } catch (e) {
      drafts[note.slug] = { ...entry, draftImage: null };
      try { writeDrafts(drafts); status("Draft saved on this device, without the new picture, which is too large to keep in the browser.", { error: true }); }
      catch (e2) { status("This browser couldn’t save the draft. Copy your text somewhere safe before leaving.", { error: true }); }
    }
  });

  /* Build the page file for a note from the template in the repository */
  async function notePage(note, imagePath) {
    const template = await readText("notes/_template.html");
    if (!template) throw new Error("The note template (notes/_template.html) is missing from the repository.");
    const description = note.summary || note.body.replace(/[#>*_`[\]()!-]/g, "").replace(/\s+/g, " ").trim().slice(0, 155);
    const values = {
      slug: note.slug,
      title: escapeHTML(note.title),
      description: escapeHTML(description),
      image: escapeHTML(SITE + (imagePath || "assets/karen.webp"))
    };
    return template.replace(/\{\{(\w+)\}\}/g, (m, key) => (key in values ? values[key] : m));
  }

  /* Publish or update */
  $("publish").addEventListener("click", async () => {
    const note = collect();
    if (!note.title) { status("Give the note a title first.", { error: true }); field.title.focus(); return; }
    if (!note.slug) note.slug = slugify(note.title);
    if (!/^[a-z0-9-]+$/.test(note.slug)) { status("The link can only use lowercase letters, numbers and hyphens.", { error: true }); field.slug.focus(); return; }
    if (!note.body.trim()) { status("Write something before publishing.", { error: true }); field.body.focus(); return; }
    const hasImage = Boolean(image || current.image);
    if (hasImage && !note.alt) { status("Please describe the picture in a few words before publishing.", { error: true }); field.alt.focus(); return; }

    busy(true);
    status(current.isLive ? "Updating your note…" : "Publishing your note…", { sticky: true });
    try {
      const latest = await readIndex();
      if (!current.isLive && latest.some((p) => p.slug === note.slug)) {
        throw new Error("There’s already a note at that link. Change the link and try again.");
      }
      const changes = [];
      let imagePath = hasImage ? current.image : "";
      if (image) {
        imagePath = `images/notes/${note.slug}-${Date.now().toString(36)}.${image.ext}`;
        changes.push({ path: imagePath, base64: image.base64 });
      }
      const oldImage = current.liveImage;
      if (oldImage && oldImage !== imagePath) changes.push({ path: oldImage, remove: true });

      const entry = {
        slug: note.slug, title: note.title, date: note.date, summary: note.summary,
        image: imagePath || "", alt: imagePath ? note.alt : "", caption: imagePath ? note.caption : "",
        updated: new Date().toISOString()
      };
      const next = latest.filter((p) => p.slug !== note.slug).concat(entry).sort((a, b) => (a.date < b.date ? 1 : -1));

      changes.push({ path: `content/notes/${note.slug}.md`, text: note.body.replace(/\s+$/, "") + "\n" });
      changes.push({ path: "content/notes/index.json", text: JSON.stringify({ posts: next }, null, 2) + "\n" });
      changes.push({ path: `notes/${note.slug}/index.html`, text: await notePage(note, imagePath) });

      await commit(`${current.isLive ? "Update" : "Publish"} note: ${note.title}`, changes);

      const drafts = readDrafts();
      delete drafts[note.slug];
      try { writeDrafts(drafts); } catch (e) { /* storage unavailable */ }
      posts = next;
      current = { slug: note.slug, isLive: true, liveImage: imagePath, image: imagePath, draftImage: null, localPreview: image ? image.preview : current.localPreview };
      image = null;
      field.slug.readOnly = true;
      $("publish").textContent = "Update";
      $("dangerZone").hidden = false;
      renderImage();
      const url = `${SITE}notes/${note.slug}/`;
      status(`Done. Your note will be live in about a minute at <a href="${url}" target="_blank" rel="noopener">${escapeHTML(url)}</a>`, { sticky: true });
    } catch (e) {
      if (e.message !== "unauthorised") status(e.status === 403 ? NO_WRITE : "Couldn’t publish: " + escapeHTML(e.message), { error: true });
    } finally {
      busy(false);
    }
  });

  /* Remove from the site (asks twice) */
  $("unpublish").addEventListener("click", async () => {
    const btn = $("unpublish");
    if (!btn.dataset.armed) {
      btn.dataset.armed = "1";
      btn.textContent = "Click again to remove it from the site";
      clearTimeout(confirmTimer);
      confirmTimer = setTimeout(() => { delete btn.dataset.armed; btn.textContent = "Remove this note from the site"; }, 5000);
      return;
    }
    clearTimeout(confirmTimer);
    delete btn.dataset.armed;
    btn.textContent = "Remove this note from the site";
    busy(true);
    status("Removing the note…", { sticky: true });
    try {
      const slug = current.slug;
      const latest = await readIndex();
      const entry = latest.find((p) => p.slug === slug);
      const changes = [
        { path: `content/notes/${slug}.md`, remove: true },
        { path: `notes/${slug}/index.html`, remove: true },
        { path: "content/notes/index.json", text: JSON.stringify({ posts: latest.filter((p) => p.slug !== slug) }, null, 2) + "\n" }
      ];
      if (entry && entry.image) changes.push({ path: entry.image, remove: true });
      await commit(`Remove note: ${entry ? entry.title : slug}`, changes);
      status("The note has been removed from the site.");
      await openList();
    } catch (e) {
      if (e.message !== "unauthorised") status(e.status === 403 ? NO_WRITE : "Couldn’t remove it: " + escapeHTML(e.message), { error: true });
    } finally {
      busy(false);
    }
  });

  /* ---------- navigation ---------- */

  $("signinForm").addEventListener("submit", (e) => { e.preventDefault(); signIn($("token").value); });
  $("signOut").addEventListener("click", () => signOut());
  $("newNote").addEventListener("click", () => openEditor(null, false));
  $("backToList").addEventListener("click", () => { $("status").hidden = true; openList(); });

  if (token) openList().catch(() => {});
  else show("signin");
})();
