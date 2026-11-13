(function () {
  "use strict";
  var S = window.DK_SERVICES || [], $ = function (id) { return document.getElementById(id); };
  var url = function (s) { return "service-" + s.id + ".html"; };
  function reveal() {
    var els = document.querySelectorAll("[data-reveal]:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }
  function counters() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var end = parseFloat(el.dataset.count), suf = el.dataset.suffix || "", dec = el.dataset.count.indexOf(".") > -1 ? 1 : 0;
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return; io.disconnect(); var t0 = performance.now();
        (function tick(t) { var p = Math.min((t - t0) / 1200, 1); el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
      }); io.observe(el);
    });
  }
  function card(s) {
    return '<article class="dk-sv-card" data-cat="' + s.cat + '" data-reveal><div class="dk-sv-card-img"><img src="' + s.img + '" alt="' + s.name + '" loading="lazy"><span class="dk-sv-tag">' + s.tag + '</span><span class="dk-sv-badge"><i class="bi ' + s.icon + '"></i></span></div>' +
      '<div class="dk-sv-card-body"><h3>' + s.name + '</h3><p>' + s.short + '</p><ul class="dk-sv-ticks">' + s.includes.slice(0, 3).map(function (t) { return '<li><i class="bi bi-check-circle-fill"></i>' + t + '</li>'; }).join("") + '</ul>' +
      '<div class="dk-sv-card-foot"><div><small>Starting at</small><strong>' + s.price + '</strong></div><a class="dk-sv-link" href="' + url(s) + '">View details <i class="bi bi-arrow-right"></i></a></div></div></article>';
  }
  var grid = $("svGrid");
  if (grid) {
    var draw = function (c) { grid.innerHTML = S.filter(function (s) { return c === "all" || s.cat === c; }).map(card).join(""); reveal(); };
    draw("all");
    document.querySelectorAll(".dk-sv-tab").forEach(function (b) { b.addEventListener("click", function () { document.querySelectorAll(".dk-sv-tab").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); draw(b.dataset.cat); }); });
    $("svTable").innerHTML = S.map(function (s) { return '<tr><td><span class="dk-sv-icon"><i class="bi ' + s.icon + '"></i></span>' + s.name + '</td><td>' + s.price + '</td><td>' + s.time + '</td><td><span class="dk-sv-pill">' + s.best + '</span></td><td><a class="dk-sv-link" href="' + url(s) + '">Details <i class="bi bi-arrow-right"></i></a></td></tr>'; }).join("");
  }
  var book = $("svBook");
  if (book) book.addEventListener("click", function () { var t = $("svToast"); t.textContent = "Great choice! Taking you to our contact form..."; t.classList.add("show"); setTimeout(function () { t.classList.remove("show"); }, 2800); setTimeout(function () { window.location.href = "contact.html#contact-form"; }, 1400); });
  reveal(); counters();
})();
