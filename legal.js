/* DailyKart legal pages: theme + RTL (same storage keys as nav.js) */
(function () {
  "use strict";

  var themeBtn = document.getElementById("themeBtn");
  var themeIcon = document.getElementById("themeIcon");
  var rtlBtn = document.getElementById("rtlBtn");
  var rtlText = document.getElementById("rtlText");

  function get(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
  }
  function set(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage optional */ }
  }

  function setTheme(theme) {
    var dark = theme === "dark";
    document.body.classList.toggle("dark", dark);
    themeIcon.className = dark ? "bi bi-moon-stars-fill" : "bi bi-sun";
    var label = dark ? "Switch to light mode" : "Switch to dark mode";
    themeBtn.setAttribute("aria-label", label);
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.title = label;
    set("dailykart-theme", theme);
  }

  function setDirection(dir) {
    var rtl = dir === "rtl";
    document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
    rtlText.textContent = rtl ? "LTR" : "RTL";
    rtlBtn.setAttribute("aria-label", rtl ? "Switch to left-to-right layout" : "Switch to right-to-left layout");
    rtlBtn.setAttribute("aria-pressed", String(rtl));
    set("dailykart-direction", rtl ? "rtl" : "ltr");
  }

  setTheme(get("dailykart-theme", "light"));
  setDirection(get("dailykart-direction", "ltr"));

  themeBtn.addEventListener("click", function () {
    setTheme(document.body.classList.contains("dark") ? "light" : "dark");
  });
  rtlBtn.addEventListener("click", function () {
    setDirection(document.documentElement.getAttribute("dir") === "rtl" ? "ltr" : "rtl");
  });

  // Highlight the current section in the contents list
  var links = Array.prototype.slice.call(document.querySelectorAll(".legal-toc-links a"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(function (s) { if (s) io.observe(s); });
  }
})();
