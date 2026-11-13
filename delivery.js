/* ==========================================
   DELIVERY INFO PAGE  (delivery.js)
========================================== */
(function () {
  "use strict";

  /* Keep the light / dark theme the visitor already chose (same key as nav.js) */
  try { if (localStorage.getItem("dailykart-theme") === "dark") document.body.classList.add("dark"); } catch (e) {}

  /* Fade-in on scroll */
  var els = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  } else {
    els.forEach(function (e) { e.classList.add("in"); });
  }

  /* Pincode checker */
  /* Demo pincode list: replace with your real serviceable pincodes */
  var SERVICEABLE = ["500001", "500002", "500003", "500004", "500016", "500034", "500081", "500032"];

  var form = document.getElementById("pinForm"),
      input = document.getElementById("pin"),
      result = document.getElementById("pinResult");
  if (!form) return;

  function show(type, icon, msg) {
    result.className = "dk-sv-result " + type;
    result.innerHTML = '<i class="bi ' + icon + '"></i> ' + msg;
  }

  input.addEventListener("input", function () { input.value = input.value.replace(/\D/g, ""); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (v.length !== 6) return show("no", "bi-exclamation-circle-fill", "Please enter a valid 6-digit pincode.");
    if (SERVICEABLE.indexOf(v) > -1) show("ok", "bi-check-circle-fill", "Great news! We deliver to " + v + ".");
    else show("no", "bi-info-circle-fill", "We do not deliver to " + v + " yet. Contact us and we will let you know when we do.");
  });
})();
