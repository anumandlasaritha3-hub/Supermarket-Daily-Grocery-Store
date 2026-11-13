/* ==========================================
   DAILYKART - CUSTOMER DASHBOARD
   Views: Overview, Shopping Lists, Place an Order,
   Track Delivery, Order History, My Account
   Demo data lives in localStorage ("dailykart-dash").
   Replace load()/save() with API calls when you
   connect a backend.
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const uid = () => Math.random().toString(36).slice(2, 9);
  const initials = (n) => n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "U";

  const pref = {
    get(k, d) { try { return localStorage.getItem(k) || d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }
  };

  /* ---------- catalogue (matches products-data.js) ---------- */
  const PRODUCTS = [
    { id: "apples", name: "Fresh Red Apples", cat: "fruits", unit: "1 kg", price: 149, old: 189, img: "images/pick-apples.png" },
    { id: "bananas", name: "Sweet Bananas", cat: "fruits", unit: "6 pcs", price: 59, old: 75, img: "images/pick-bananas.png" },
    { id: "milk", name: "Fresh Whole Milk", cat: "dairy", unit: "1 L", price: 68, old: 79, img: "images/pick-milk.png" },
    { id: "bread", name: "Soft Wheat Bread", cat: "bakery", unit: "400 g", price: 49, old: 59, img: "images/pick-bread.png" },
    { id: "rice", name: "Premium Basmati Rice", cat: "pantry", unit: "1 kg", price: 169, old: 199, img: "images/pick-rice.png" },
    { id: "juice", name: "Mixed Fruit Juice", cat: "beverages", unit: "1 L", price: 99, old: 129, img: "images/pick-juice.png" },
    { id: "veg-box", name: "Farm Veggie Box", cat: "vegetables", unit: "2 kg", price: 199, old: 0, img: "images/category-vegetables.png" },
    { id: "fruit-box", name: "Seasonal Fruit Box", cat: "fruits", unit: "2 kg", price: 279, old: 0, img: "images/category-fruits.png" },
    { id: "dairy-pack", name: "Dairy Basics Pack", cat: "dairy", unit: "3 items", price: 189, old: 0, img: "images/category-dairy.png" },
    { id: "bakery-box", name: "Bakery Treats Box", cat: "bakery", unit: "6 pcs", price: 149, old: 0, img: "images/category-bakery.png" },
    { id: "pantry-kit", name: "Pantry Staples Kit", cat: "pantry", unit: "5 items", price: 449, old: 0, img: "images/category-pantry.png" },
    { id: "bev-pack", name: "Beverage Party Pack", cat: "beverages", unit: "6 bottles", price: 329, old: 0, img: "images/category-beverages.png" }
  ];
  const CATS = ["all", "fruits", "vegetables", "dairy", "bakery", "pantry", "beverages"];
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const findByName = (n) => PRODUCTS.find((p) => p.name.toLowerCase() === n.trim().toLowerCase());

  const FREE_DELIVERY_AT = 499, DELIVERY_FEE = 40;
  const STATUS = {
    placed: { label: "Order placed", pct: 20 },
    packed: { label: "Packed", pct: 50 },
    out: { label: "Out for delivery", pct: 80 },
    delivered: { label: "Delivered", pct: 100 },
    cancelled: { label: "Cancelled", pct: 0 }
  };
  const isActive = (o) => ["placed", "packed", "out"].includes(o.status);

  /* ---------- state ---------- */
  const KEY = "dailykart-dash";
  const ago = (min) => new Date(Date.now() - min * 60000).toISOString();
  const line = (id, qty) => { const p = byId(id); return { pid: id, name: p.name, unit: p.unit, price: p.price, img: p.img, qty }; };
  const calc = (items) => { const sub = items.reduce((s, i) => s + i.price * i.qty, 0); const fee = sub >= FREE_DELIVERY_AT || !sub ? 0 : DELIVERY_FEE; return { sub, fee, total: sub + fee }; };

  function seed() {
    const mk = (id, min, status, entries, slot, pay) => {
      const items = entries.map(([p, q]) => line(p, q));
      return { id, date: ago(min), items, total: calc(items).total, status, slot, address: "Flat 402, Lotus Heights, Madhapur, Hyderabad 500081", pay, note: "" };
    };
    return {
      user: { name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43210", dob: "" },
      addresses: [
        { id: uid(), text: "Flat 402, Lotus Heights, Madhapur, Hyderabad 500081", tag: "Home" },
        { id: uid(), text: "3rd Floor, Orbit Towers, Gachibowli, Hyderabad 500032", tag: "Work" }
      ],
      lists: [
        { id: uid(), name: "Weekly essentials", items: [
          { id: uid(), name: "Fresh Whole Milk", qty: 2, done: false },
          { id: uid(), name: "Soft Wheat Bread", qty: 1, done: false },
          { id: uid(), name: "Sweet Bananas", qty: 2, done: true },
          { id: uid(), name: "Premium Basmati Rice", qty: 1, done: false }] },
        { id: uid(), name: "Weekend party", items: [
          { id: uid(), name: "Beverage Party Pack", qty: 1, done: false },
          { id: uid(), name: "Bakery Treats Box", qty: 2, done: false },
          { id: uid(), name: "Paper napkins", qty: 1, done: false }] }
      ],
      orders: [
        mk("DK-10248", 35, "out", [["milk", 2], ["bread", 1], ["bananas", 2]], "Today, 6 PM – 8 PM", "UPI"),
        mk("DK-10231", 60 * 24 * 6, "delivered", [["apples", 2], ["juice", 1], ["rice", 1]], "Tomorrow, 8 AM – 10 AM", "Card"),
        mk("DK-10207", 60 * 24 * 15, "delivered", [["veg-box", 1], ["dairy-pack", 1]], "Tomorrow, 12 PM – 2 PM", "UPI"),
        mk("DK-10176", 60 * 24 * 27, "cancelled", [["pantry-kit", 1]], "Tomorrow, 6 PM – 8 PM", "Cash on Delivery")
      ],
      notifs: [
        { id: uid(), icon: "truck", text: "Order DK-10248 is out for delivery.", time: "10 min ago", unread: true },
        { id: uid(), icon: "tag", text: "Weekend offer: up to 25% off on fruits.", time: "2 hours ago", unread: true },
        { id: uid(), icon: "receipt", text: "Order DK-10231 was delivered. Rate your experience.", time: "6 days ago", unread: true }
      ],
      prefs: { orderUpdates: true, offers: true, listReminders: false, sms: true },
      cart: {},
      selList: null,
      tracked: "DK-10248"
    };
  }

  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch { /* ignore */ }
    return seed();
  }
  let S = load();
  if (!S.selList && S.lists[0]) S.selList = S.lists[0].id;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* ignore */ } };

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ==========================================
     HEADER CONTROLS: theme, RTL (same keys as nav.js)
  ========================================== */
  const themeBtn = $("themeBtn"), themeIcon = $("themeIcon"), rtlBtn = $("rtlBtn"), rtlText = $("rtlText");

  function setTheme(theme) {
    const dark = theme === "dark";
    document.body.classList.toggle("dark", dark);
    themeIcon.className = dark ? "bi bi-moon-stars-fill" : "bi bi-sun";
    const label = dark ? "Switch to light mode" : "Switch to dark mode";
    themeBtn.setAttribute("aria-label", label);
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.title = label;
    pref.set("dailykart-theme", theme);
  }
  setTheme(pref.get("dailykart-theme", "light"));
  themeBtn.addEventListener("click", () => setTheme(document.body.classList.contains("dark") ? "light" : "dark"));

  function setDirection(dir) {
    const rtl = dir === "rtl";
    document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
    rtlText.textContent = rtl ? "LTR" : "RTL";
    rtlBtn.setAttribute("aria-label", rtl ? "Switch to left-to-right layout" : "Switch to right-to-left layout");
    rtlBtn.setAttribute("aria-pressed", String(rtl));
    pref.set("dailykart-direction", rtl ? "rtl" : "ltr");
  }
  setDirection(pref.get("dailykart-direction", "ltr"));
  rtlBtn.addEventListener("click", () => setDirection(document.documentElement.getAttribute("dir") === "rtl" ? "ltr" : "rtl"));

  /* ---------- dropdowns (notifications + profile) ---------- */
  const dds = [$("notifDd"), $("profileDd")];
  function closeDds(except) {
    dds.forEach((d) => {
      if (d !== except) {
        d.classList.remove("open");
        const b = d.querySelector("button[aria-expanded]");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });
  }
  [["notifBtn", "notifDd"], ["profileBtn", "profileDd"]].forEach(([b, d]) => {
    $(b).addEventListener("click", (e) => {
      e.stopPropagation();
      const dd = $(d);
      closeDds(dd);
      const open = dd.classList.toggle("open");
      $(b).setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".dd")) closeDds(); });

  /* ---------- notifications ---------- */
  function renderNotifs() {
    const unread = S.notifs.filter((n) => n.unread).length;
    $("notifDot").textContent = unread;
    $("notifDot").hidden = unread === 0;
    $("notifList").innerHTML = S.notifs.length
      ? S.notifs.map((n) => `<div class="notif-item ${n.unread ? "unread" : ""}"><span class="notif-ic"><i class="bi bi-${esc(n.icon)}"></i></span><div><p>${esc(n.text)}</p><small>${esc(n.time)}</small></div></div>`).join("")
      : '<p class="empty">You are all caught up.</p>';
  }
  $("markRead").addEventListener("click", () => { S.notifs.forEach((n) => (n.unread = false)); save(); renderNotifs(); });
  function notify(icon, text) { S.notifs.unshift({ id: uid(), icon, text, time: "Just now", unread: true }); S.notifs = S.notifs.slice(0, 12); }

  /* ---------- profile display ---------- */
  function renderUser() {
    const u = S.user, ini = initials(u.name);
    ["avatarTop", "avatarMenu", "avatarBig"].forEach((id) => ($(id).textContent = ini));
    ["nameTop", "nameMenu", "accName"].forEach((id) => ($(id).textContent = u.name));
    $("emailMenu").textContent = u.email;
    $("helloName").textContent = u.name.split(" ")[0];
  }

  /* ==========================================
     NAVIGATION BETWEEN VIEWS
  ========================================== */
  const TITLES = {
    overview: ["Overview", "Your shopping at a glance"],
    lists: ["Shopping Lists", "Plan your groceries before you shop"],
    order: ["Place an Order", "Pick fresh items and get them delivered"],
    track: ["Track Delivery", "Follow your order in real time"],
    history: ["Order History", "All your past and current orders"],
    account: ["My Account", "Manage your profile and preferences"]
  };
  const sidebar = $("sidebar"), overlay = $("sidebarOverlay"), menuBtn = $("menuBtn");

  function setSidebar(open) {
    sidebar.classList.toggle("open", open);
    overlay.classList.toggle("show", open);
    $("menuIcon").className = open ? "bi bi-x-lg" : "bi bi-list";
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", () => setSidebar(!sidebar.classList.contains("open")));
  overlay.addEventListener("click", () => setSidebar(false));
  window.addEventListener("resize", () => { if (window.innerWidth > 1100) setSidebar(false); });

  const RENDER = {};
  function show(view, push = true) {
    if (!TITLES[view]) view = "overview";
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    $$(".side-link").forEach((a) => {
      const on = a.dataset.view === view;
      a.classList.toggle("active", on);
      on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
    });
    $("pageTitle").textContent = TITLES[view][0];
    $("pageSub").textContent = TITLES[view][1];
    document.title = TITLES[view][0] + " | DailyKart";
    if (push && location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
    RENDER[view] && RENDER[view]();
    setSidebar(false);
    closeDds();
    window.scrollTo({ top: 0 });
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-view]");
    if (a) { e.preventDefault(); show(a.dataset.view); return; }
    const g = e.target.closest("[data-go]");
    if (g) show(g.dataset.go);
  });
  window.addEventListener("hashchange", () => show(location.hash.slice(1), false));

  /* ==========================================
     OVERVIEW
  ========================================== */
  const pill = (s) => `<span class="pill ${s}">${STATUS[s].label}</span>`;
  const itemCount = (o) => o.items.reduce((s, i) => s + i.qty, 0);

  RENDER.overview = () => {
    const active = S.orders.filter(isActive);
    const done = S.orders.filter((o) => o.status === "delivered");
    $("stActive").textContent = active.length;
    $("stLists").textContent = S.lists.length;
    $("stOrders").textContent = S.orders.length;
    $("stSpent").textContent = money(done.reduce((s, o) => s + o.total, 0));

    const live = active[0];
    $("ovLive").innerHTML = live
      ? `<div class="live-box"><h4>Order ${esc(live.id)}</h4><p>${itemCount(live)} items · ${esc(live.slot)}</p>
          <div class="live-row">${pill(live.status)}<strong>${money(live.total)}</strong></div>
          <div class="progress" aria-label="Delivery progress"><span style="width:${STATUS[live.status].pct}%"></span></div>
          <p style="margin:12px 0 0">Arriving in the slot above. <button class="link-btn" data-track="${esc(live.id)}">Track order</button></p></div>`
      : '<p class="empty">No active deliveries right now.<br><button class="link-btn" data-go="order">Place an order</button></p>';

    $("ovLists").innerHTML = S.lists.length
      ? `<div class="mini-list">${S.lists.slice(0, 3).map((l) => `<div class="mini-item" data-openlist="${l.id}"><div><strong>${esc(l.name)}</strong><small>${l.items.filter((i) => !i.done).length} left of ${l.items.length} items</small></div><i class="bi bi-chevron-${document.documentElement.dir === "rtl" ? "left" : "right"}"></i></div>`).join("")}</div>`
      : '<p class="empty">No lists yet. Create your first one.</p>';

    $("ovOrders").innerHTML = S.orders.slice(0, 4).map((o) => `<tr style="cursor:pointer" data-order="${esc(o.id)}"><td class="id">${esc(o.id)}</td><td>${fmtDate(o.date)}</td><td>${itemCount(o)}</td><td>${money(o.total)}</td><td>${pill(o.status)}</td></tr>`).join("");
  };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-track]");
    if (t) { S.tracked = t.dataset.track; save(); show("track"); return; }
    const l = e.target.closest("[data-openlist]");
    if (l) { S.selList = l.dataset.openlist; save(); show("lists"); return; }
    const o = e.target.closest("[data-order]");
    if (o) openOrder(o.dataset.order);
  });

  /* ==========================================
     SHOPPING LISTS
  ========================================== */
  const curList = () => S.lists.find((l) => l.id === S.selList) || null;

  RENDER.lists = () => {
    $("listNav").innerHTML = S.lists.length
      ? S.lists.map((l) => `<button type="button" class="list-tab ${l.id === S.selList ? "active" : ""}" data-pick="${l.id}"><strong>${esc(l.name)}</strong><small>${l.items.length} items</small></button>`).join("")
      : '<p class="empty">No lists yet.</p>';

    const l = curList(), box = $("listDetail");
    if (!l) { box.innerHTML = '<p class="empty">Create a list on the left to start planning.</p>'; return; }

    box.innerHTML = `
      <div class="list-title"><h3>${esc(l.name)}</h3>
        <div class="btns">
          <button class="btn-secondary sm" id="clearDone"><i class="bi bi-check2-all"></i> Clear checked</button>
          <button class="btn-secondary sm" id="delList"><i class="bi bi-trash3"></i> Delete</button>
          <button class="btn-primary sm" id="listToCart"><i class="bi bi-cart-plus"></i> Add to cart</button>
        </div></div>
      <div id="itemRows">${l.items.length ? l.items.map((i) => `
        <div class="item-row ${i.done ? "done" : ""}">
          <input type="checkbox" data-chk="${i.id}" ${i.done ? "checked" : ""} aria-label="Mark ${esc(i.name)}">
          <span class="nm">${esc(i.name)}</span>
          <span class="qty"><button type="button" data-dec="${i.id}" aria-label="Decrease">−</button><span>${i.qty}</span><button type="button" data-inc="${i.id}" aria-label="Increase">+</button></span>
          <button type="button" class="icon-btn" data-rm="${i.id}" aria-label="Remove ${esc(i.name)}"><i class="bi bi-x-lg"></i></button>
        </div>`).join("") : '<p class="empty">This list is empty. Add your first item below.</p>'}</div>
      <form class="add-row" id="addItemForm">
        <input type="text" id="addItemName" list="prodNames" placeholder="Add an item (e.g. Fresh Whole Milk)" maxlength="60" required>
        <button class="btn-primary sm" type="submit"><i class="bi bi-plus-lg"></i> Add item</button>
        <datalist id="prodNames">${PRODUCTS.map((p) => `<option value="${esc(p.name)}">`).join("")}</datalist>
      </form>`;
  };

  $("newListForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("newListName").value.trim();
    if (!name) return;
    const l = { id: uid(), name, items: [] };
    S.lists.unshift(l); S.selList = l.id; save();
    $("newListName").value = "";
    RENDER.lists(); toast("List created");
  });

  $("view-lists").addEventListener("click", (e) => {
    const l = curList(), t = e.target;
    const pick = t.closest("[data-pick]");
    if (pick) { S.selList = pick.dataset.pick; save(); RENDER.lists(); return; }
    if (!l) return;
    const it = (id) => l.items.find((i) => i.id === id);
    let el;
    if ((el = t.closest("[data-inc]"))) it(el.dataset.inc).qty++;
    else if ((el = t.closest("[data-dec]"))) { const i = it(el.dataset.dec); i.qty = Math.max(1, i.qty - 1); }
    else if ((el = t.closest("[data-rm]"))) l.items = l.items.filter((i) => i.id !== el.dataset.rm);
    else if (t.closest("#clearDone")) l.items = l.items.filter((i) => !i.done);
    else if (t.closest("#delList")) {
      if (!confirm('Delete "' + l.name + '"?')) return;
      S.lists = S.lists.filter((x) => x.id !== l.id); S.selList = S.lists[0] ? S.lists[0].id : null; toast("List deleted");
    } else if (t.closest("#listToCart")) {
      let added = 0, skipped = 0;
      l.items.filter((i) => !i.done).forEach((i) => { const p = findByName(i.name); if (p) { S.cart[p.id] = (S.cart[p.id] || 0) + i.qty; added++; } else skipped++; });
      save(); renderCartBadge();
      toast(added ? `${added} item(s) added to cart` + (skipped ? `, ${skipped} not in store` : "") : "No store items found in this list");
      if (added) show("order");
      return;
    } else return;
    save(); RENDER.lists();
  });

  $("view-lists").addEventListener("change", (e) => {
    const c = e.target.closest("[data-chk]"), l = curList();
    if (c && l) { l.items.find((i) => i.id === c.dataset.chk).done = c.checked; save(); RENDER.lists(); }
  });

  $("view-lists").addEventListener("submit", (e) => {
    if (e.target.id !== "addItemForm") return;
    e.preventDefault();
    const l = curList(), inp = $("addItemName"), name = inp.value.trim();
    if (!l || !name) return;
    const same = l.items.find((i) => i.name.toLowerCase() === name.toLowerCase());
    same ? same.qty++ : l.items.push({ id: uid(), name, qty: 1, done: false });
    save(); RENDER.lists(); $("addItemName").focus();
  });

  /* ==========================================
     PLACE AN ORDER
  ========================================== */
  let cat = "all", q = "";
  const cartItems = () => Object.entries(S.cart).filter(([id, n]) => n > 0 && byId(id)).map(([id, n]) => line(id, n));
  function renderCartBadge() {
    const n = cartItems().reduce((s, i) => s + i.qty, 0);
    $("cartBadge").textContent = n; $("cartBadge").hidden = n === 0;
  }

  function renderProducts() {
    $("catChips").innerHTML = CATS.map((c) => `<button type="button" class="chip ${c === cat ? "active" : ""}" data-cat="${c}">${c[0].toUpperCase() + c.slice(1)}</button>`).join("");
    const list = PRODUCTS.filter((p) => (cat === "all" || p.cat === cat) && p.name.toLowerCase().includes(q));
    $("prodGrid").innerHTML = list.length ? list.map((p) => `
      <article class="prod"><img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">
        <div class="prod-body"><h6>${esc(p.name)}</h6><small>${esc(p.unit)}</small>
          <div class="prod-foot"><span class="price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</span>
          <button type="button" class="add-btn" data-add="${p.id}"><i class="bi bi-plus-lg"></i> Add</button></div></div></article>`).join("")
      : '<p class="empty" style="grid-column:1/-1">No products found.</p>';
  }

  function renderCart() {
    const items = cartItems(), t = calc(items);
    renderCartBadge();
    $("cartItems").innerHTML = items.length ? items.map((i) => `
      <div class="cart-line"><img src="${esc(i.img)}" alt="">
        <div class="info"><strong>${esc(i.name)}</strong><small>${esc(i.unit)} · ${money(i.price)}</small></div>
        <span class="qty"><button type="button" data-cdec="${i.pid}" aria-label="Decrease">−</button><span>${i.qty}</span><button type="button" data-cinc="${i.pid}" aria-label="Increase">+</button></span>
      </div>`).join("") : '<p class="empty">Your cart is empty.<br>Add items from the left.</p>';

    const need = FREE_DELIVERY_AT - t.sub;
    $("cartTotals").innerHTML = `
      <div class="row"><span>Subtotal</span><span>${money(t.sub)}</span></div>
      <div class="row"><span>Delivery</span><span class="${t.fee || !t.sub ? "" : "ok"}">${t.sub ? (t.fee ? money(t.fee) : "Free") : "—"}</span></div>
      <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
      ${t.sub && need > 0 ? `<div class="row" style="color:var(--muted)">Add ${money(need)} more for free delivery</div>` : ""}`;
    $("placeOrder").disabled = !items.length;
    $("placeOrder").style.opacity = items.length ? 1 : .55;
  }

  RENDER.order = () => {
    renderProducts(); renderCart();
    $("addrSel").innerHTML = S.addresses.map((a) => `<option value="${a.id}">${esc(a.tag)} – ${esc(a.text)}</option>`).join("") || "<option value=''>Add an address in My Account</option>";
  };

  $("prodSearch").addEventListener("input", (e) => { q = e.target.value.trim().toLowerCase(); renderProducts(); });
  $("view-order").addEventListener("click", (e) => {
    let el;
    if ((el = e.target.closest("[data-cat]"))) { cat = el.dataset.cat; renderProducts(); return; }
    if ((el = e.target.closest("[data-add]"))) { S.cart[el.dataset.add] = (S.cart[el.dataset.add] || 0) + 1; toast(byId(el.dataset.add).name + " added"); }
    else if ((el = e.target.closest("[data-cinc]"))) S.cart[el.dataset.cinc]++;
    else if ((el = e.target.closest("[data-cdec]"))) { S.cart[el.dataset.cdec]--; if (S.cart[el.dataset.cdec] <= 0) delete S.cart[el.dataset.cdec]; }
    else if (e.target.closest("#clearCart")) S.cart = {};
    else return;
    save(); renderCart();
  });

  $("placeOrder").addEventListener("click", () => {
    const items = cartItems();
    if (!items.length) return toast("Your cart is empty");
    const addr = S.addresses.find((a) => a.id === $("addrSel").value);
    if (!addr) return toast("Please add a delivery address in My Account");
    const num = Math.max(...S.orders.map((o) => parseInt(o.id.replace(/\D/g, ""), 10)), 10000) + 1;
    const order = {
      id: "DK-" + num, date: new Date().toISOString(), items, total: calc(items).total, status: "placed",
      slot: $("slotSel").value, address: addr.text, pay: (document.querySelector('input[name="pay"]:checked') || {}).value || "UPI",
      note: $("orderNote").value.trim()
    };
    S.orders.unshift(order); S.cart = {}; S.tracked = order.id;
    notify("bag-check", `Order ${order.id} placed. We will confirm it shortly.`);
    $("orderNote").value = "";
    save(); renderNotifs(); renderCartBadge(); toast("Order placed successfully");
    show("track");
  });

  /* ==========================================
     TRACK DELIVERY
  ========================================== */
  const STEPS = [
    { key: "placed", title: "Order placed", icon: "bag-check", text: "We have received your order." },
    { key: "packed", title: "Packed & ready", icon: "box-seam", text: "Your items are fresh and packed." },
    { key: "out", title: "Out for delivery", icon: "truck", text: "Your delivery partner is on the way." },
    { key: "delivered", title: "Delivered", icon: "house-check", text: "Enjoy your groceries!" }
  ];
  const ORDER = ["placed", "packed", "out", "delivered"];

  RENDER.track = () => {
    const w = $("trackWrap");
    const active = S.orders.filter(isActive);
    const o = S.orders.find((x) => x.id === S.tracked) || active[0] || S.orders[0];
    if (!o) {
      w.innerHTML = '<div class="card"><p class="empty">You have no orders to track yet.<br><button class="link-btn" data-go="order">Place your first order</button></p></div>';
      return;
    }

    const idx = ORDER.indexOf(o.status), cancelled = o.status === "cancelled";
    const base = new Date(o.date).getTime();
    const times = [0, 20, 50, 95].map((m) => new Date(base + m * 60000).toISOString());
    const t = calc(o.items);

    const pick = S.orders.filter((x) => isActive(x) || x.id === o.id).map((x) => `<button type="button" class="chip ${x.id === o.id ? "active" : ""}" data-track="${esc(x.id)}">${esc(x.id)}</button>`).join("");

    w.innerHTML = `
      <div class="track-pick">${pick}</div>
      <div class="track-grid">
        <div class="card">
          <div class="eta"><div><small>${cancelled ? "Status" : o.status === "delivered" ? "Delivered" : "Estimated arrival"}</small><strong>${cancelled ? "Order cancelled" : o.status === "delivered" ? fmtDate(o.date) : esc(o.slot)}</strong></div><i class="bi bi-${cancelled ? "x-circle" : "clock-history"}"></i></div>
          ${cancelled ? '<p class="empty">This order was cancelled. You can reorder it from Order History.</p>' : `
          <ol class="steps">${STEPS.map((s, i) => `
            <li class="step ${i < idx ? "done" : ""} ${i === idx ? (o.status === "delivered" ? "done" : "now") : ""}">
              <span class="dot"><i class="bi bi-${i < idx || o.status === "delivered" ? "check-lg" : s.icon}"></i></span>
              <div><h6>${s.title}</h6><p>${s.text}${i <= idx ? " · " + fmtTime(times[i]) : ""}</p></div>
            </li>`).join("")}</ol>`}
        </div>

        <div>
          <div class="card">
            <div class="card-head"><h3>Order ${esc(o.id)}</h3>${pill(o.status)}</div>
            ${o.status === "out" ? `<div class="driver"><span class="avatar">RK</span><div><strong>Ravi Kumar</strong><br><small style="color:var(--muted)">Your delivery partner</small></div><a class="btn-secondary sm" href="tel:+910000000000"><i class="bi bi-telephone"></i> Call</a></div>` : ""}
            ${o.items.map((i) => `<div class="sum-line"><span>${esc(i.name)} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join("")}
            <div class="sum-line"><span>Delivery</span><span>${t.fee ? money(t.fee) : "Free"}</span></div>
            <div class="row total"><span>Total</span><span>${money(o.total)}</span></div>
            <p style="margin:14px 0 0;font-size:var(--font-small);color:var(--muted)"><i class="bi bi-geo-alt"></i> ${esc(o.address)}<br><i class="bi bi-wallet2"></i> ${esc(o.pay)}${o.note ? `<br><i class="bi bi-chat-left-text"></i> ${esc(o.note)}` : ""}</p>
            ${o.status === "placed" ? '<button class="btn-secondary block" id="cancelOrder" style="margin-top:14px"><i class="bi bi-x-circle"></i> Cancel order</button>' : ""}
          </div>
        </div>
      </div>`;
  };

  $("view-track").addEventListener("click", (e) => {
    if (!e.target.closest("#cancelOrder")) return;
    const o = S.orders.find((x) => x.id === S.tracked);
    if (!o || !confirm("Cancel order " + o.id + "?")) return;
    o.status = "cancelled"; notify("x-circle", `Order ${o.id} was cancelled.`);
    save(); renderNotifs(); RENDER.track(); toast("Order cancelled");
  });

  /* ==========================================
     ORDER HISTORY
  ========================================== */
  let hFilter = "all", hQ = "";
  const HFILTERS = [["all", "All"], ["active", "Active"], ["delivered", "Delivered"], ["cancelled", "Cancelled"]];

  RENDER.history = () => {
    $("histChips").innerHTML = HFILTERS.map(([k, l]) => `<button type="button" class="chip ${k === hFilter ? "active" : ""}" data-hf="${k}">${l}</button>`).join("");
    const rows = S.orders.filter((o) => {
      const okF = hFilter === "all" || (hFilter === "active" ? isActive(o) : o.status === hFilter);
      const okQ = !hQ || o.id.toLowerCase().includes(hQ) || o.items.some((i) => i.name.toLowerCase().includes(hQ));
      return okF && okQ;
    });
    $("histBody").innerHTML = rows.map((o) => `
      <tr><td class="id">${esc(o.id)}</td><td>${fmtDate(o.date)}</td>
      <td>${esc(o.items.slice(0, 2).map((i) => i.name).join(", "))}${o.items.length > 2 ? ` +${o.items.length - 2}` : ""}</td>
      <td>${money(o.total)}</td><td>${pill(o.status)}</td>
      <td class="actions-td"><button class="icon-btn" data-order="${esc(o.id)}" title="View details" aria-label="View details"><i class="bi bi-eye"></i></button>
      <button class="icon-btn" data-reorder="${esc(o.id)}" title="Reorder" aria-label="Reorder"><i class="bi bi-arrow-repeat"></i></button></td></tr>`).join("");
    $("histEmpty").hidden = rows.length > 0;
  };
  $("histSearch").addEventListener("input", (e) => { hQ = e.target.value.trim().toLowerCase(); RENDER.history(); });
  $("view-history").addEventListener("click", (e) => {
    const f = e.target.closest("[data-hf]");
    if (f) { hFilter = f.dataset.hf; RENDER.history(); }
  });

  function reorder(id) {
    const o = S.orders.find((x) => x.id === id);
    if (!o) return;
    o.items.forEach((i) => { if (byId(i.pid)) S.cart[i.pid] = (S.cart[i.pid] || 0) + i.qty; });
    save(); closeModal(); toast("Items added to your cart"); show("order");
  }
  document.addEventListener("click", (e) => { const r = e.target.closest("[data-reorder]"); if (r) reorder(r.dataset.reorder); });

  /* ---------- order modal ---------- */
  const modal = $("modal");
  let lastFocus = null;
  function openOrder(id) {
    const o = S.orders.find((x) => x.id === id);
    if (!o) return;
    const t = calc(o.items);
    $("modalBody").innerHTML = `
      <h3 id="modalTitle">Order ${esc(o.id)}</h3>
      <p style="color:var(--muted);margin:0 0 14px;font-size:var(--font-small)">${fmtDate(o.date)} · ${fmtTime(o.date)} &nbsp; ${pill(o.status)}</p>
      ${o.items.map((i) => `<div class="cart-line"><img src="${esc(i.img)}" alt=""><div class="info"><strong>${esc(i.name)}</strong><small>${esc(i.unit)} × ${i.qty}</small></div><strong>${money(i.price * i.qty)}</strong></div>`).join("")}
      <div class="cart-totals"><div class="row"><span>Subtotal</span><span>${money(t.sub)}</span></div><div class="row"><span>Delivery</span><span>${t.fee ? money(t.fee) : "Free"}</span></div><div class="row total"><span>Total</span><span>${money(o.total)}</span></div></div>
      <p style="font-size:var(--font-small);color:var(--muted);margin:0"><i class="bi bi-geo-alt"></i> ${esc(o.address)}<br><i class="bi bi-wallet2"></i> ${esc(o.pay)} · ${esc(o.slot)}</p>
      <div class="btns"><button class="btn-primary" data-reorder="${esc(o.id)}"><i class="bi bi-arrow-repeat"></i> Reorder</button>
      ${isActive(o) ? `<button class="btn-secondary" id="modalTrack" data-id="${esc(o.id)}"><i class="bi bi-truck"></i> Track</button>` : ""}</div>`;
    lastFocus = document.activeElement;
    modal.hidden = false;
    $("modalX").focus();
  }
  function closeModal() { if (modal.hidden) return; modal.hidden = true; lastFocus && lastFocus.focus && lastFocus.focus(); }
  $("modalX").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
    const tr = e.target.closest("#modalTrack");
    if (tr) { S.tracked = tr.dataset.id; save(); closeModal(); show("track"); }
  });

  /* ==========================================
     MY ACCOUNT
  ========================================== */
  const PREFS = [
    ["orderUpdates", "Order updates", "Status changes for your deliveries"],
    ["offers", "Offers & deals", "Weekly discounts and coupons"],
    ["listReminders", "Shopping list reminders", "A nudge before your usual shop day"],
    ["sms", "SMS alerts", "Delivery alerts on your phone number"]
  ];

  RENDER.account = () => {
    const u = S.user;
    $("fName").value = u.name; $("fEmail").value = u.email; $("fPhone").value = u.phone; $("fDob").value = u.dob || "";
    $("addrList").innerHTML = S.addresses.length ? S.addresses.map((a, i) => `
      <div class="addr"><i class="bi bi-geo-alt"></i><div class="tx">${esc(a.text)}<span class="tag">${i === 0 ? "Default · " : ""}${esc(a.tag)}</span></div>
      ${i !== 0 ? `<button class="icon-btn" data-default="${a.id}" title="Make default" aria-label="Make default"><i class="bi bi-star"></i></button>` : ""}
      <button class="icon-btn" data-deladdr="${a.id}" title="Remove" aria-label="Remove address"><i class="bi bi-trash3"></i></button></div>`).join("")
      : '<p class="empty">No saved addresses.</p>';
    $("prefList").innerHTML = PREFS.map(([k, t, d]) => `<div class="pref"><div><strong>${t}</strong><small>${d}</small></div><label class="switch"><input type="checkbox" data-pref="${k}" ${S.prefs[k] ? "checked" : ""} aria-label="${t}"><span></span></label></div>`).join("");
  };

  $("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    S.user = { name: $("fName").value.trim(), email: $("fEmail").value.trim(), phone: $("fPhone").value.trim(), dob: $("fDob").value };
    save(); renderUser(); toast("Profile updated");
  });

  $("addrForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = $("addrInput").value.trim();
    if (!text) return;
    S.addresses.push({ id: uid(), text, tag: "Other" });
    $("addrInput").value = ""; save(); RENDER.account(); toast("Address added");
  });

  $("view-account").addEventListener("click", (e) => {
    let el;
    if ((el = e.target.closest("[data-deladdr]"))) S.addresses = S.addresses.filter((a) => a.id !== el.dataset.deladdr);
    else if ((el = e.target.closest("[data-default]"))) { const a = S.addresses.find((x) => x.id === el.dataset.default); S.addresses = [a, ...S.addresses.filter((x) => x !== a)]; }
    else return;
    save(); RENDER.account();
  });
  $("view-account").addEventListener("change", (e) => {
    const p = e.target.closest("[data-pref]");
    if (p) { S.prefs[p.dataset.pref] = p.checked; save(); toast("Preference saved"); }
  });

  $("passForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("pNew").value !== $("pCon").value) return toast("New passwords do not match");
    // Front-end demo only: send this to your server in a real login system.
    e.target.reset(); toast("Password updated");
  });

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeModal(); closeDds();
    if (sidebar.classList.contains("open")) { setSidebar(false); menuBtn.focus(); }
  });

  /* ---------- init ---------- */
  renderUser(); renderNotifs(); renderCartBadge();
  show(location.hash.slice(1) || "overview", false);
});
