/* Full screen for the prototype on phones. Back button and Escape close it. */
(function () {
  "use strict";
  const btn = document.getElementById("fsBtn");
  const win = document.querySelector(".ow");
  if (!btn || !win) return;
  let open = false;

  function enter() {
    if (open) return;
    open = true;
    win.classList.add("fs");
    document.documentElement.classList.add("ke-fs");
    btn.setAttribute("aria-label", "Close full screen");
    btn.setAttribute("aria-pressed", "true");
    try { history.pushState({ keFs: true }, ""); } catch (e) { /* ignore */ }
    const req = win.requestFullscreen || win.webkitRequestFullscreen;
    if (req && !/iPhone|iPad/.test(navigator.userAgent)) {
      try { const r = req.call(win); if (r && r.catch) r.catch(() => {}); } catch (e) { /* ignore */ }
    }
  }

  function exit(fromHistory) {
    if (!open) return;
    open = false;
    win.classList.remove("fs");
    document.documentElement.classList.remove("ke-fs");
    btn.setAttribute("aria-label", "Full screen");
    btn.setAttribute("aria-pressed", "false");
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    if (!fromHistory && history.state && history.state.keFs) history.back();
    win.scrollIntoView({ block: "start" });
  }

  btn.addEventListener("click", () => (open ? exit(false) : enter()));
  window.addEventListener("popstate", () => exit(true));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) { e.stopPropagation(); exit(false); } }, true);
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && open) exit(false); });
})();
