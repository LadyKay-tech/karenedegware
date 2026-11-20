/*
  A small, safe Markdown renderer for notes.
  Supports headings, paragraphs, bold, italic, links, images, inline code,
  quotes, bulleted and numbered lists, and dividers. Raw HTML is escaped.
*/
(function () {
  "use strict";

  const escapeHTML = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  /* Only allow web, mail and relative links */
  const safeUrl = (url) => (/^\s*(javascript|data|vbscript):/i.test(url) ? "#" : url);

  function inline(text) {
    let s = text;
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, src) => `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy">`);
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => {
      const external = /^https?:\/\//i.test(href);
      return `<a href="${safeUrl(href)}"${external ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>");
    s = s.replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, "$1<em>$2</em>");
    return s;
  }

  function render(source) {
    const lines = escapeHTML(String(source || "").replace(/\r\n?/g, "\n")).split("\n");
    const out = [];
    let para = [];
    let list = null; /* { tag, items } */
    let quote = [];

    const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
    const flushList = () => {
      if (list) { out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`); list = null; }
    };
    const flushQuote = () => { if (quote.length) { out.push(`<blockquote><p>${inline(quote.join(" "))}</p></blockquote>`); quote = []; } };
    const flushAll = () => { flushPara(); flushList(); flushQuote(); };

    for (const raw of lines) {
      const line = raw.trimEnd();
      let m;
      if (!line.trim()) { flushAll(); continue; }
      if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
        flushAll();
        const level = m[1].length === 3 ? 3 : 2; /* the page title is the only h1 */
        out.push(`<h${level}>${inline(m[2])}</h${level}>`);
        continue;
      }
      if (/^(-{3,}|\*{3,})$/.test(line.trim())) { flushAll(); out.push("<hr>"); continue; }
      if ((m = line.match(/^&gt;\s?(.*)$/))) { flushPara(); flushList(); quote.push(m[1]); continue; }
      if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
        flushPara(); flushQuote();
        if (!list || list.tag !== "ul") { flushList(); list = { tag: "ul", items: [] }; }
        list.items.push(m[1]);
        continue;
      }
      if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
        flushPara(); flushQuote();
        if (!list || list.tag !== "ol") { flushList(); list = { tag: "ol", items: [] }; }
        list.items.push(m[1]);
        continue;
      }
      if ((m = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/))) {
        flushAll();
        out.push(`<figure><img src="${safeUrl(m[2])}" alt="${m[1]}" loading="lazy">${m[1] ? `<figcaption>${m[1]}</figcaption>` : ""}</figure>`);
        continue;
      }
      flushList(); flushQuote();
      para.push(line.trim());
    }
    flushAll();
    return out.join("\n");
  }

  window.KEMarkdown = { render };
})();
