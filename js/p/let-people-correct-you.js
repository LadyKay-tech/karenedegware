/* Let people correct what you think you know: Bayo's feed after buying a gift */
(function () {
  "use strict";
  const { go, ghost, btns } = KEProto.h;

  const BABY = [
    { n: "Cotton baby blanket", p: "£18", c: "baby" }, { n: "Wooden rattle", p: "£9", c: "baby" },
    { n: "Muslin squares, 6 pack", p: "£14", c: "baby" }, { n: "Baby sleepsuit set", p: "£22", c: "baby" },
    { n: "Nappy changing bag", p: "£35", c: "baby" }, { n: "Soft play mat", p: "£28", c: "baby" },
    { n: "Night light", p: "£16", c: "baby" }, { n: "Bath toys", p: "£11", c: "baby" }
  ];
  const HIS = [
    { n: "Trail running shoes", p: "£84", c: "run" }, { n: "Pour over coffee kit", p: "£32", c: "coffee" },
    { n: "Laptop stand", p: "£39", c: "desk" }, { n: "Running belt", p: "£15", c: "run" },
    { n: "Single origin beans", p: "£12", c: "coffee" }, { n: "Desk lamp", p: "£45", c: "desk" },
    { n: "Merino running socks", p: "£14", c: "run" }, { n: "Noise cancelling earbuds", p: "£79", c: "desk" }
  ];
  const HIS_TAGS = ["run", "coffee", "desk"];
  const relevant = (feed) => feed.filter((x) => HIS_TAGS.includes(x.c)).length;

  function view(ui, p) {
    const s = ui.s;
    const banner = p === "A"
      ? '<div class="xbanner"><span>Because you bought a <b>cotton baby blanket</b></span></div>'
      : s.gift == null
        ? '<div class="xbanner"><span>You bought a <b>cotton baby blanket</b>. Was it a gift?</span>' + btns(ghost("Yes, a gift", "gift"), ghost("It’s for me", "mine")) + "</div>"
        : `<div class="xbanner"><span>${s.gift ? "Got it. Gifts won’t shape your picks." : "Thanks. We’ll keep it in mind."}</span></div>`;
    const tiles = s.feed.map((x, i) =>
      `<div class="xtile${x.fresh ? " fresh" : ""}"><span class="xsw xsw-${x.c}"></span><b>${x.n}</b><span>${x.p}</span>` +
      (p === "B" ? `<button type="button" class="xnot" data-act="not" data-i="${i}">Not for me</button>` : "") + "</div>").join("");
    return banner + `<div class="xtiles">${tiles}</div>` +
      (p === "A" ? btns(go("Refresh picks", "refresh")) : s.gift != null || s.edits ? btns(go("Looks right", "finish")) : "");
  }

  function setFeed(ui, feed) {
    ui.s.feed = feed;
    ui.metric("rel", `${relevant(feed)} of 6`);
  }

  KEProto({
    names: { A: "Guess and stick", B: "Let him correct it" },
    hints: {
      A: "Bayo bought a gift for his sister’s baby. Look at his picks",
      B: "Same shop, same purchase. This time Bayo can set it straight",
      after: "Now try it the other way"
    },
    metrics: [
      { k: "rel", label: "Picks he’d actually buy", zero: "0 of 6" },
      { k: "taps", label: "Taps", zero: "0" }
    ],
    compare: {
      label: "Picks Bayo would buy",
      value: (r) => r.rel,
      text: (r) => `${r.rel} of 6 after ${r.taps} ${r.taps === 1 ? "tap" : "taps"}`
    },
    start(p, ui) {
      ui.s.gift = null;
      ui.s.edits = 0;
      ui.s.pool = HIS.slice();
      ui.s.round = 0;
      setFeed(ui, [BABY[0], BABY[1], HIS[0], BABY[2], BABY[3], BABY[4]].map((x) => Object.assign({}, x)));
      ui.s.pool = HIS.slice(1);
      ui.screen(view(ui, p));
    },
    act(name, el, ui, p) {
      const s = ui.s;
      ui.metric("taps", ui.clicks);
      if (name === "refresh") {
        s.round++;
        const shift = s.round * 2;
        const baby = BABY.slice(shift % BABY.length).concat(BABY).slice(0, 4);
        setFeed(ui, [baby[0], HIS[s.round], baby[1], baby[2], baby[3], BABY[(shift + 5) % BABY.length]].map((x) => Object.assign({}, x)));
        ui.screen(view(ui, p));
        if (s.round >= 2) {
          ui.done({ rel: relevant(s.feed), taps: ui.clicks, toast: "Two refreshes and it’s still nappies. One gift taught the shop the wrong thing about Bayo." });
          ui.update(view(ui, p).replace(/<div class="xbtns">[\s\S]*<\/div>$/, ""));
        }
        return;
      }
      if (name === "gift" || name === "mine") {
        s.gift = name === "gift";
        if (s.gift) {
          setFeed(ui, s.feed.map((x) => (x.c === "baby" ? Object.assign({ fresh: true }, s.pool.shift()) : Object.assign({}, x, { fresh: false }))));
        }
        ui.screen(view(ui, p));
        return;
      }
      if (name === "not") {
        s.edits = (s.edits || 0) + 1;
        const i = +el.dataset.i;
        const next = s.pool.shift() || HIS[i];
        s.feed = s.feed.map((x, j) => (j === i ? Object.assign({ fresh: true }, next) : Object.assign({}, x, { fresh: false })));
        setFeed(ui, s.feed);
        ui.update(view(ui, p));
        return;
      }
      const rel = relevant(s.feed);
      ui.done({ rel, taps: ui.clicks, toast: rel >= 5 ? `${rel} of 6 picks he’d buy, after ${ui.clicks} ${ui.clicks === 1 ? "tap" : "taps"}. The shop knows him again.` : `${rel} of 6 picks he’d buy. One “gift” tap would have fixed the rest.` });
    }
  });
})();
