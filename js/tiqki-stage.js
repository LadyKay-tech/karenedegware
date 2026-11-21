/* Tiqki preview: two live screens sharing one pretend database */
(function () {
  "use strict";
  var page = document.querySelector("[data-reveal]");
  requestAnimationFrame(function () { requestAnimationFrame(function () { page.classList.add("on"); }); });

  var stage = document.querySelector(".tq-stage");
  var tabs = document.querySelectorAll(".tq-seg button");
  var box = document.getElementById("tqBizBox");
  var biz = document.getElementById("tqBiz");
  var cust = document.getElementById("tqCust");

  function show(side) {
    stage.setAttribute("data-side", side);
    tabs.forEach(function (b) {
      var on = b.getAttribute("data-side") === side;
      b.setAttribute("aria-selected", on ? "true" : "false");
      if (on) b.querySelector(".tq-dot").hidden = true;
    });
    fit();
  }
  tabs.forEach(function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-side")); }); });

  // Something changed on the side you are not looking at: put a dot on its tab
  function sig(raw) {
    try { return JSON.parse(raw || "{}").queue_customers.map(function (c) { return c.id + c.status; }).join(); } catch (e) { return ""; }
  }
  var last = sig(localStorage.getItem("tiqki-preview-v1"));
  window.addEventListener("storage", function (e) {
    if (e.key !== "tiqki-preview-v1") return;
    var now = sig(e.newValue);
    if (now === last) return;
    last = now;
    if (getComputedStyle(document.querySelector(".tq-seg")).display === "none") return;
    var side = stage.getAttribute("data-side") === "cust" ? "biz" : "cust";
    var t = document.querySelector('.tq-seg [data-side="' + side + '"] .tq-dot');
    if (t) t.hidden = false;
  });

  // The front desk is a desktop layout: below its width, draw it smaller rather than squash it
  var DESK = 1200;
  function fit() {
    var w = box.clientWidth, h = box.clientHeight;
    if (w >= 640 && w < DESK) {
      var s = w / DESK;
      biz.style.width = DESK + "px";
      biz.style.height = Math.round(h / s) + "px";
      biz.style.transform = "scale(" + s + ")";
    } else {
      biz.style.width = biz.style.height = biz.style.transform = "";
    }
  }
  if (window.ResizeObserver) new ResizeObserver(fit).observe(box); else window.addEventListener("resize", fit);
  fit();

  document.getElementById("pvReset").addEventListener("click", function () {
    last = "";
    try { localStorage.removeItem("sidebarCollapsed"); localStorage.removeItem("tiqki-preview-v1"); localStorage.removeItem("tiqki-preview-session"); } catch (e) { /* ignore */ }
    var t = Date.now();
    cust.src = "app/?r=" + t + "#/join?b=7d1c2a40-5b7e-4c1a-9f3e-2b8a6c1d0e11";
    biz.src = "app/?r=" + t + "#/dashboard";
  });
})();
