/* ==========================================
   PRODUCTS PAGE  (products-page.js)
   Edit names, prices, images in PRODUCTS below.
========================================== */
(function () {
  "use strict";
  try { if (localStorage.getItem("dailykart-theme") === "dark") document.body.classList.add("dark"); } catch (e) {}

  var PRODUCTS = [
    { id: "apples",     name: "Fresh Red Apples",     cat: "fruits",     unit: "1 kg",      price: 149, old: 189, img: "images/pick-apples.png",        page: "product-apples.html",     r: 4.8, tag: "Best seller" },
    { id: "bananas",    name: "Sweet Bananas",        cat: "fruits",     unit: "6 pcs",     price: 59,  old: 75,  img: "images/pick-bananas.png",       page: "product-bananas.html",    r: 4.7 },
    { id: "milk",       name: "Fresh Whole Milk",     cat: "dairy",      unit: "1 L",       price: 68,  old: 79,  img: "images/pick-milk.png",          page: "product-milk.html",       r: 4.9, tag: "Fresh" },
    { id: "bread",      name: "Soft Wheat Bread",     cat: "bakery",     unit: "400 g",     price: 49,  old: 59,  img: "images/pick-bread.png",         page: "product-bread.html",      r: 4.6 },
    { id: "rice",       name: "Premium Basmati Rice", cat: "pantry",     unit: "1 kg",      price: 169, old: 199, img: "images/pick-rice.png",          page: "product-rice.html",       r: 4.8 },
    { id: "juice",      name: "Mixed Fruit Juice",    cat: "beverages",  unit: "1 L",       price: 99,  old: 129, img: "images/pick-juice.png",         page: "product-juice.html",      r: 4.5 },
    { id: "veg-box",    name: "Farm Veggie Box",      cat: "vegetables", unit: "2 kg",      price: 199, old: 249, img: "images/category-vegetables.png", page: "product-veg-box.html",   r: 4.8, tag: "New" },
    { id: "fruit-box",  name: "Seasonal Fruit Box",   cat: "fruits",     unit: "2 kg",      price: 279, old: 349, img: "images/category-fruits.png",     page: "product-fruit-box.html", r: 4.9, tag: "Best seller" },
    { id: "dairy-pack", name: "Dairy Basics Pack",    cat: "dairy",      unit: "3 items",   price: 189, old: 229, img: "images/category-dairy.png",      page: "product-dairy-pack.html", r: 4.7 },
    { id: "bakery-box", name: "Bakery Treats Box",    cat: "bakery",     unit: "6 pcs",     price: 149, old: 179, img: "images/category-bakery.png",     page: "product-bakery-box.html", r: 4.6, tag: "New" },
    { id: "pantry-kit", name: "Pantry Staples Kit",   cat: "pantry",     unit: "5 items",   price: 449, old: 549, img: "images/category-pantry.png",     page: "product-pantry-kit.html", r: 4.8 },
    { id: "bev-pack",   name: "Beverage Party Pack",  cat: "beverages",  unit: "6 bottles", price: 329, old: 399, img: "images/category-beverages.png",  page: "product-bev-pack.html",   r: 4.5 }
  ];
  var CATS = { fruits: "Fruits", vegetables: "Vegetables", dairy: "Dairy", bakery: "Bakery", pantry: "Pantry", beverages: "Beverages" };
  var FREE_AT = 499, FEE = 39;

  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return "\u20B9" + n.toLocaleString("en-IN"); };
  var off = function (p) { return Math.round((1 - p.price / p.old) * 100); };
  var byId = function (id) { return PRODUCTS.find(function (p) { return p.id === id; }); };

  var state = { cat: "all", q: "", sort: "featured", price: "any" };
  var cart = {}, wish = {};
  try { cart = JSON.parse(localStorage.getItem("dk-pp-cart")) || {}; } catch (e) {}

  /* toast */
  var tt;
  function toast(msg) { var t = $("ppToast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("show"); }, 2200); }

  /* ---------- product grid ---------- */
  function cardControl(p) {
    var q = cart[p.id];
    return q ? '<div class="dk-pp-qty"><button type="button" data-dec="' + p.id + '" aria-label="Less">&minus;</button><span>' + q + '</span><button type="button" data-inc="' + p.id + '" aria-label="More">+</button></div>'
             : '<button type="button" class="dk-pp-add" data-add="' + p.id + '"><i class="bi bi-plus-lg"></i><span>Add</span></button>';
  }
  function card(p) {
    return '<article class="dk-pp-card" data-reveal>' +
      '<span class="dk-pp-off">' + off(p) + '% off</span>' + (p.tag ? '<span class="dk-pp-new">' + p.tag + '</span>' : '') +
      '<button type="button" class="dk-pp-heart' + (wish[p.id] ? ' on' : '') + '" data-wish="' + p.id + '" aria-label="Save"><i class="bi bi-heart' + (wish[p.id] ? '-fill' : '') + '"></i></button>' +
      '<a class="dk-pp-img" href="products.html?cat=' + p.cat + '#shop"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></a>' +
      '<small>' + CATS[p.cat] + ' &middot; ' + p.unit + '</small>' +
      '<h3><a href="products.html?cat=' + p.cat + '#shop">' + p.name + '</a></h3>' +
      '<div class="dk-pp-rate"><i class="bi bi-star-fill"></i> ' + p.r.toFixed(1) + '</div>' +
      '<div class="dk-pp-foot"><div class="dk-pp-price"><strong>' + money(p.price) + '</strong><del>' + money(p.old) + '</del></div><div data-ctl="' + p.id + '">' + cardControl(p) + '</div></div></article>';
  }
  function list() {
    var q = state.q.trim().toLowerCase();
    var l = PRODUCTS.filter(function (p) {
      if (state.cat !== "all" && p.cat !== state.cat) return false;
      if (q && (p.name + " " + CATS[p.cat]).toLowerCase().indexOf(q) < 0) return false;
      if (state.price === "u100" && p.price >= 100) return false;
      if (state.price === "mid" && (p.price < 100 || p.price > 250)) return false;
      if (state.price === "o250" && p.price <= 250) return false;
      return true;
    });
    var s = { low: function (a, b) { return a.price - b.price; }, high: function (a, b) { return b.price - a.price; }, discount: function (a, b) { return off(b) - off(a); }, rating: function (a, b) { return b.r - a.r; } }[state.sort];
    return s ? l.sort(s) : l;
  }
  function render() {
    var l = list();
    $("ppGrid").innerHTML = l.map(card).join("");
    $("ppEmpty").style.display = l.length ? "none" : "block";
    $("ppCount").innerHTML = 'Showing <strong>' + l.length + '</strong> of ' + PRODUCTS.length + ' products';
    document.querySelectorAll(".dk-pp-pill").forEach(function (b) { b.classList.toggle("on", b.dataset.cat === state.cat); });
    reveal();
  }

  /* ---------- basket ---------- */
  function save() { try { localStorage.setItem("dk-pp-cart", JSON.stringify(cart)); } catch (e) {} }
  function totals() {
    var n = 0, sub = 0;
    Object.keys(cart).forEach(function (id) { n += cart[id]; sub += cart[id] * byId(id).price; });
    return { n: n, sub: sub, fee: sub >= FREE_AT || !n ? 0 : FEE };
  }
  function drawer() {
    var ids = Object.keys(cart), t = totals();
    $("ppItems").innerHTML = ids.length ? ids.map(function (id) {
      var p = byId(id);
      return '<div class="dk-pp-row"><img src="' + p.img + '" alt=""><div><strong>' + p.name + '</strong><small>' + p.unit + ' &middot; ' + money(p.price) + '</small>' +
        '<div class="dk-pp-qty"><button type="button" data-dec="' + id + '">&minus;</button><span>' + cart[id] + '</span><button type="button" data-inc="' + id + '">+</button></div></div><b>' + money(p.price * cart[id]) + '</b></div>';
    }).join("") : '<div class="dk-pp-noitems"><i class="bi bi-basket" style="font-size:40px;color:var(--pink)"></i><p>Your basket is empty.</p></div>';
    $("ppSub").textContent = money(t.sub); $("ppFee").textContent = t.fee ? money(t.fee) : "Free"; $("ppTot").textContent = money(t.sub + t.fee);
  }
  function bar() {
    var t = totals(), b = $("ppBasket");
    b.classList.toggle("show", t.n > 0);
    $("ppBn").textContent = t.n + (t.n === 1 ? " item" : " items") + " \u00B7 " + money(t.sub);
    $("ppBm").textContent = t.sub >= FREE_AT ? "You have unlocked free delivery!" : "Add " + money(FREE_AT - t.sub) + " more for free delivery";
    $("ppMeter").style.width = Math.min(100, t.sub / FREE_AT * 100) + "%";
    drawer();
  }
  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = Math.min(q, 20);
    save(); bar();
    document.querySelectorAll('[data-ctl="' + id + '"]').forEach(function (c) { c.innerHTML = cardControl(byId(id)); });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-add],[data-inc],[data-dec],[data-wish]");
    if (!a) return;
    if (a.dataset.add) { setQty(a.dataset.add, 1); toast(byId(a.dataset.add).name + " added to basket"); }
    else if (a.dataset.inc) setQty(a.dataset.inc, (cart[a.dataset.inc] || 0) + 1);
    else if (a.dataset.dec) setQty(a.dataset.dec, (cart[a.dataset.dec] || 0) - 1);
    else if (a.dataset.wish) { var id = a.dataset.wish; wish[id] = !wish[id]; a.classList.toggle("on", wish[id]); a.innerHTML = '<i class="bi bi-heart' + (wish[id] ? '-fill' : '') + '"></i>'; toast(wish[id] ? "Saved to wishlist" : "Removed from wishlist"); }
  });
  $("ppOpen").addEventListener("click", function () { $("ppDrawer").classList.add("open"); });
  $("ppClose").addEventListener("click", function () { $("ppDrawer").classList.remove("open"); });
  $("ppDrawer").addEventListener("click", function (e) { if (e.target === this) this.classList.remove("open"); });
  $("ppCheckout").addEventListener("click", function () {
    if (!Object.keys(cart).length) { toast("Your basket is empty"); return; }
    toast("Taking you to checkout...");
    setTimeout(function () { window.location.href = "dashboard.html#order"; }, 600);
  });

  /* ---------- filters ---------- */
  function go(cat) { state.cat = cat; render(); $("shop").scrollIntoView({ behavior: "smooth" }); }
  document.querySelectorAll("[data-cat]").forEach(function (b) { b.addEventListener("click", function (e) { if (b.tagName === "A") e.preventDefault(); go(b.dataset.cat); }); });
  $("ppSearch").addEventListener("input", function () { state.q = this.value; $("ppHeroSearch").value = this.value; render(); });
  $("ppHeroForm").addEventListener("submit", function (e) { e.preventDefault(); state.q = $("ppHeroSearch").value; $("ppSearch").value = state.q; render(); $("shop").scrollIntoView({ behavior: "smooth" }); });
  $("ppSort").addEventListener("change", function () { state.sort = this.value; render(); });
  $("ppPrice").addEventListener("change", function () { state.price = this.value; render(); });
  $("ppReset").addEventListener("click", function () { state = { cat: "all", q: "", sort: "featured", price: "any" }; $("ppSearch").value = $("ppHeroSearch").value = ""; $("ppSort").value = "featured"; $("ppPrice").value = "any"; render(); });

  /* category counts */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    el.textContent = PRODUCTS.filter(function (p) { return p.cat === el.dataset.count; }).length + " products";
  });

  /* ---------- reveal ---------- */
  function reveal() {
    var els = document.querySelectorAll("[data-reveal]:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .1 });
    els.forEach(function (e) { io.observe(e); });
  }

  var qs = new URLSearchParams(location.search);
  var fromUrl = qs.get("cat") || qs.get("category");
  if (fromUrl && CATS[fromUrl]) state.cat = fromUrl;
  render(); bar();
})();
