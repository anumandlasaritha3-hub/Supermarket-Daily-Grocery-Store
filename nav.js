/* ==========================================
   DAILYKART - COMPLETE HEADER JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // 1. SELECT ELEMENTS
  // ========================================

  const homeDropdown = document.getElementById("homeDropdown");
  const homeBtn = document.getElementById("homeBtn");

  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");

  const rtlBtn = document.getElementById("rtlBtn");
  const rtlText = document.getElementById("rtlText");

  const navigation = document.getElementById("navigation");
  const menuBtn = document.getElementById("menuBtn");
  const menuIcon = document.getElementById("menuIcon");

  // Stop if the header does not exist
  if (
    !homeDropdown ||
    !homeBtn ||
    !themeBtn ||
    !themeIcon ||
    !rtlBtn ||
    !rtlText ||
    !navigation ||
    !menuBtn ||
    !menuIcon
  ) {
    return;
  }


  // ========================================
  // 2. LOCAL STORAGE HELPERS
  // ========================================

  function getSavedPreference(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Continue without local storage
    }
  }


  // ========================================
  // 3. HOME DROPDOWN
  // ========================================

  function closeDropdown() {
    homeDropdown.classList.remove("open");
    homeBtn.setAttribute("aria-expanded", "false");
  }

  homeBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen = homeDropdown.classList.toggle("open");

    homeBtn.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });


  // ========================================
  // 4. LIGHT / DARK THEME
  // ========================================

  function setTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark", isDark);

    themeIcon.className = isDark
      ? "bi bi-moon-stars-fill"
      : "bi bi-sun";

    const label = isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

    themeBtn.setAttribute("aria-label", label);
    themeBtn.setAttribute("aria-pressed", String(isDark));
    themeBtn.title = label;

    savePreference("dailykart-theme", theme);
  }

  const savedTheme = getSavedPreference(
    "dailykart-theme",
    "light"
  );

  setTheme(savedTheme);

  themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");

    setTheme(isDark ? "light" : "dark");
  });


  // ========================================
  // 5. RTL / LTR TOGGLE
  // ========================================

  function setDirection(direction) {
    const isRTL = direction === "rtl";

    document.documentElement.setAttribute(
      "dir",
      isRTL ? "rtl" : "ltr"
    );

    rtlText.textContent = isRTL ? "LTR" : "RTL";

    rtlBtn.setAttribute(
      "aria-label",
      isRTL
        ? "Switch to left-to-right layout"
        : "Switch to right-to-left layout"
    );

    rtlBtn.setAttribute(
      "aria-pressed",
      String(isRTL)
    );

    savePreference(
      "dailykart-direction",
      isRTL ? "rtl" : "ltr"
    );
  }

  const savedDirection = getSavedPreference(
    "dailykart-direction",
    "ltr"
  );

  setDirection(savedDirection);

  rtlBtn.addEventListener("click", () => {
    const currentDirection =
      document.documentElement.getAttribute("dir");

    setDirection(
      currentDirection === "rtl" ? "ltr" : "rtl"
    );
  });


  // ========================================
  // 6. MOBILE MENU
  // ========================================

  function setMobileMenu(isOpen) {
    navigation.classList.toggle("show", isOpen);

    menuIcon.className = isOpen
      ? "bi bi-x-lg"
      : "bi bi-list";

    menuBtn.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );

    if (!isOpen) {
      closeDropdown();
    }
  }

  function closeMobileMenu() {
    setMobileMenu(false);
  }

  menuBtn.addEventListener("click", () => {
    const isOpen = navigation.classList.contains("show");

    setMobileMenu(!isOpen);
  });


  // ========================================
  // 7. AUTOMATIC ACTIVE NAVIGATION
  // ========================================

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  const navLinks = navigation.querySelectorAll(
    ":scope > a"
  );

  const homeLinks = homeDropdown.querySelectorAll(
    ".dropdown-menu a"
  );

  // Remove all previous active states
  homeBtn.classList.remove("active");
  homeBtn.removeAttribute("aria-current");

  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });

  homeLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });

  // Home 1 and Home 2
  const isHomePage =
    currentPage === "index.html" ||
    currentPage === "home2.html";

  if (isHomePage) {

    // Activate Home button only
    homeBtn.classList.add("active");

    homeLinks.forEach((link) => {
      const linkPage =
        new URL(link.href, window.location.href)
          .pathname.split("/").pop();

      if (linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

  } else {

    // Activate only the matching page
    navLinks.forEach((link) => {
      const linkPage =
        new URL(link.href, window.location.href)
          .pathname.split("/").pop();

      if (linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

  }

  // Close mobile menu after selecting a link
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });


  // ========================================
  // 8. CLOSE ON OUTSIDE CLICK
  // ========================================

  document.addEventListener("click", (event) => {

    if (!homeDropdown.contains(event.target)) {
      closeDropdown();
    }

    if (
      window.innerWidth <= 1100 &&
      navigation.classList.contains("show") &&
      !navigation.contains(event.target) &&
      !menuBtn.contains(event.target)
    ) {
      closeMobileMenu();
    }

  });


  // ========================================
  // 9. ESCAPE KEY
  // ========================================

  document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") {
      return;
    }

    const dropdownWasOpen =
      homeDropdown.classList.contains("open");

    const menuWasOpen =
      navigation.classList.contains("show");

    closeDropdown();

    if (menuWasOpen) {
      closeMobileMenu();
      menuBtn.focus();
    } else if (dropdownWasOpen) {
      homeBtn.focus();
    }

  });


  // ========================================
  // 10. RESPONSIVE RESIZE
  // ========================================

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      closeMobileMenu();
    }
  });

});
