/* Footer: show "Download CV" once a CV has been uploaded from the admin page */
(function () {
  "use strict";
  var foot = document.querySelector(".foot");
  if (!foot || !window.fetch) return;
  var root = document.documentElement.getAttribute("data-root") || "";
  fetch(root + "content/cv.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (cv) {
      if (!cv || !cv.file) return;
      var a = document.createElement("a");
      a.href = root + cv.file + "?v=" + encodeURIComponent(cv.updated || "");
      a.textContent = "Download CV";
      a.setAttribute("download", cv.name || "Karen-Edegware-CV.pdf");
      foot.appendChild(a);
    })
    .catch(function () { /* no CV yet */ });
})();
