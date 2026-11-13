/* ==========================================
   OFFERS PAGE
========================================== */

(function () {
  "use strict";

  // ----------------------------------------
  // PRODUCT DATA (edit names, prices and images here)
  // ----------------------------------------
  var PRODUCTS = [
    { id: "apples",     name: "Fresh Red Apples",     cat: "fruits",     unit: "1 kg",      price: 149, old: 189, img: "images/pick-apples.png" },
    { id: "bananas",    name: "Sweet Bananas",        cat: "fruits",     unit: "6 pcs",     price: 59,  old: 75,  img: "images/pick-bananas.png" },
    { id: "milk",       name: "Fresh Whole Milk",     cat: "dairy",      unit: "1 L",       price: 68,  old: 79,  img: "images/pick-milk.png" },
    { id: "bread",      name: "Soft Wheat Bread",     cat: "bakery",     unit: "400 g",     price: 49,  old: 59,  img: "images/pick-bread.png" },
    { id: "rice",       name: "Premium Basmati Rice", cat: "pantry",     unit: "1 kg",      price: 169, old: 199, img: "images/pick-rice.png" },
    { id: "juice",      name: "Mixed Fruit Juice",    cat: "beverages",  unit: "1 L",       price: 99,  old: 129, img: "images/pick-juice.png" },
    { id: "veg-box",    name: "Farm Veggie Box",      cat: "vegetables", unit: "2 kg",      price: 199, old: 249, img: "images/category-vegetables.png" },
    { id: "fruit-box",  name: "Seasonal Fruit Box",   cat: "fruits",     unit: "2 kg",      price: 279, old: 349, img: "images/category-fruits.png" },
    { id: "dairy-pack", name: "Dairy Basics Pack",    cat: "dairy",      unit: "3 items",   price: 189, old: 229, img: "images/category-dairy.png" },
    { id: "bakery-box", name: "Bakery Treats Box",    cat: "bakery",     unit: "6 pcs",     price: 149, old: 179, img: "images/category-bakery.png" },
    { id: "pantry-kit", name: "Pantry Staples Kit",   cat: "pantry",     unit: "5 items",   price: 449, old: 549, img: "images/category-pantry.png" },
    { id: "bev-pack",   name: "Beverage Party Pack",  cat: "beverages",  unit: "6 bottles", price: 329, old: 399, img: "images/category-beverages.png" }
  ];

  var CATEGORIES = [
    { key: "fruits",     name: "Fruits",     img: "images/category-fruits.png" },
    { key: "vegetables", name: "Vegetables", img: "images/category-vegetables.png" },
    { key: "dairy",      name: "Dairy",      img: "images/category-dairy.png" },
    { key: "bakery",     name: "Bakery",     img: "images/category-bakery.png" },
    { key: "pantry",     name: "Pantry",     img: "images/category-pantry.png" },
    { key: "beverages",  name: "Beverages",  img: "images/category-beverages.png" }
  ];

  var CAT_NAMES = {};
  CATEGORIES.forEach(function (c) { CAT_NAMES[c.key] = c.name; });

  function percentOff(p) {
    return Math.round((1 - p.price / p.old) * 100);
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ----------------------------------------
  // TOAST
  // ----------------------------------------
  var toast = document.getElementById("ofToast");
  var toastText = document.getElementById("ofToastText");
  var toastTimer;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }

  // ----------------------------------------
  // 1. DEALS OF THE DAY (8 biggest discounts)
  // ----------------------------------------
  var grid = document.getElementById("ofGrid");

  if (grid) {
    var deals = PRODUCTS.slice()
      .sort(function (a, b) { return percentOff(b) - percentOff(a); })
      .slice(0, 8);

    grid.innerHTML = deals.map(function (p) {
      return (
        '<article class="dk-of-prod">' +
          '<span class="dk-of-prod-badge">' + percentOff(p) + '% off</span>' +
          '<div class="dk-of-prod-img"><img src="' + p.img + '" alt="' + escapeHtml(p.name) + '" loading="lazy"></div>' +
          '<small>' + CAT_NAMES[p.cat] + ' &middot; ' + escapeHtml(p.unit) + '</small>' +
          '<h3>' + escapeHtml(p.name) + '</h3>' +
          '<div class="dk-of-prod-foot">' +
            '<div class="dk-of-price"><strong>&#8377;' + p.price + '</strong><del>&#8377;' + p.old + '</del></div>' +
            '<button type="button" class="dk-of-btn" data-add="' + p.id + '"><i class="bi bi-plus-lg"></i><span>Add</span></button>' +
          '</div>' +
        '</article>'
      );
    }).join("");

    grid.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-add]");
      if (!btn) return;
      var product = PRODUCTS.find(function (p) { return p.id === btn.dataset.add; });
      if (product) showToast(product.name + " added to your basket");
    });
  }

  // ----------------------------------------
  // 2. COUNTDOWN (to the end of today)
  // ----------------------------------------
  var hoursEl = document.getElementById("ofHours");
  var minutesEl = document.getElementById("ofMinutes");
  var secondsEl = document.getElementById("ofSeconds");

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function tick() {
    var now = new Date();
    var end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    var left = Math.max(0, Math.floor((end - now) / 1000));

    hoursEl.textContent = pad(Math.floor(left / 3600));
    minutesEl.textContent = pad(Math.floor((left % 3600) / 60));
    secondsEl.textContent = pad(left % 60);
  }

  if (hoursEl && minutesEl && secondsEl) {
    tick();
    setInterval(tick, 1000);
  }

  // ----------------------------------------
  // 3. OFFERS BY CATEGORY
  // ----------------------------------------
  var cats = document.getElementById("ofCats");

  if (cats) {
    cats.innerHTML = CATEGORIES.map(function (c) {
      var items = PRODUCTS.filter(function (p) { return p.cat === c.key; });
      var best = items.reduce(function (max, p) { return Math.max(max, percentOff(p)); }, 0);

      return (
        '<a class="dk-of-cat" href="products.html?category=' + c.key + '">' +
          '<span class="dk-of-cat-img"><img src="' + c.img + '" alt="" loading="lazy"></span>' +
          '<span>' +
            '<span class="dk-of-cat-off">Up to ' + best + '% off</span>' +
            '<h3>' + c.name + '</h3>' +
            '<p>' + items.length + (items.length === 1 ? ' item' : ' items') + ' on offer</p>' +
          '</span>' +
          '<span class="dk-of-cat-arrow"><i class="bi bi-arrow-right"></i></span>' +
        '</a>'
      );
    }).join("");
  }

  // ----------------------------------------
  // 4. COPY COUPON CODE
  // ----------------------------------------
  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(area);
    return ok;
  }

  document.querySelectorAll(".dk-of-copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var code = btn.dataset.code;
      var label = btn.querySelector("span");

      function done(ok) {
        showToast(ok ? "Code " + code + " copied" : "Please copy the code: " + code);
        if (ok && label) {
          label.textContent = "Copied";
          setTimeout(function () { label.textContent = "Copy"; }, 1800);
        }
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).then(
          function () { done(true); },
          function () { done(fallbackCopy(code)); }
        );
      } else {
        done(fallbackCopy(code));
      }
    });
  });
})();
