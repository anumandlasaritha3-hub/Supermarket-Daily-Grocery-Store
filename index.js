
/* ==========================================
   DAILYKART HOME 1 BANNER JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const banner = document.querySelector(".dk-banner");

  if (!banner) return;

  const cards = [
    ...banner.querySelectorAll(".dk-banner-promo")
  ];

  const dots = [
    ...banner.querySelectorAll(".dk-banner-dots button")
  ];

  if (!cards.length) return;

  const mobile = window.matchMedia("(max-width: 700px)");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const promoContainer = banner.querySelector(
    ".dk-banner-promotions"
  );

  let current = 0;
  let interval = null;

  /* SHOW PROMOTION */

  function showPromotion(index) {

    current = (index + cards.length) % cards.length;

    cards.forEach((card, i) => {

      const active = i === current;

      card.classList.toggle(
        "dk-banner-promo-active",
        active
      );

      const hidden = mobile.matches && !active;

      card.setAttribute(
        "aria-hidden",
        String(hidden)
      );

      card.tabIndex = hidden ? -1 : 0;

    });

    dots.forEach((dot, i) => {

      const active = i === current;

      dot.classList.toggle("active", active);

      dot.setAttribute(
        "aria-pressed",
        String(active)
      );

    });

  }

  /* STOP AUTOPLAY */

  function stopAutoplay() {

    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }

  }

  /* START AUTOPLAY */

  function startAutoplay() {

    stopAutoplay();

    if (
      !mobile.matches ||
      reducedMotion.matches ||
      document.hidden ||
      cards.length < 2
    ) {
      return;
    }

    interval = setInterval(() => {

      showPromotion(current + 1);

    }, 4500);

  }

  /* DOT CLICK */

  dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

      showPromotion(index);
      startAutoplay();

    });

  });

  /* PAUSE ON INTERACTION */

  if (promoContainer) {

    promoContainer.addEventListener(
      "mouseenter",
      stopAutoplay
    );

    promoContainer.addEventListener(
      "mouseleave",
      startAutoplay
    );

    promoContainer.addEventListener(
      "focusin",
      stopAutoplay
    );

    promoContainer.addEventListener(
      "focusout",
      (event) => {

        if (!promoContainer.contains(event.relatedTarget)) {
          startAutoplay();
        }

      }
    );

  }

  /* HANDLE RESIZE */

  function updateBanner() {
    showPromotion(current);
    startAutoplay();
  }

  mobile.addEventListener("change", updateBanner);

  reducedMotion.addEventListener(
    "change",
    updateBanner
  );

  /* PAUSE IN BACKGROUND TAB */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }

    }
  );

  /* INITIALIZE */

  updateBanner();

});























/* ==========================================
   DAILYKART - CATEGORY SCROLL REVEAL
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const categoryCards = document.querySelectorAll(
    ".dk-category-card"
  );

  if (!categoryCards.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const card = entry.target;
        const index = Number(card.dataset.revealIndex || 0);

        card.animate(
          [
            { opacity: 0, transform: "translateY(22px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          {
            duration: 550,
            delay: Math.min(index * 70, 350),
            easing: "ease-out"
          }
        );

        observer.unobserve(card);
      });
    },
    { threshold: 0.12 }
  );

  categoryCards.forEach((card, index) => {
    card.dataset.revealIndex = index;
    observer.observe(card);
  });
});
















/* ==========================================
   DAILYKART - FEATURED PRODUCTS INTERACTIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".dk-featured");

  if (!section) return;

  const status = section.querySelector(".dk-featured-status");

  section.querySelectorAll(".dk-featured-card").forEach(card => {
    const wishlist = card.querySelector(".dk-featured-wishlist");
    const addButton = card.querySelector(".dk-featured-add");

    const productName = card.querySelector("h3").textContent.trim();
    const productId = card.dataset.id;

    wishlist.addEventListener("click", () => {
      const active = wishlist.classList.toggle("active");

      wishlist.setAttribute("aria-pressed", String(active));
      wishlist.setAttribute(
        "aria-label",
        `${active ? "Remove" : "Add"} ${productName} ${active ? "from" : "to"} wishlist`
      );

      wishlist.querySelector("i").className =
        active ? "bi bi-heart-fill" : "bi bi-heart";

      status.textContent = active
        ? `${productName} added to wishlist`
        : `${productName} removed from wishlist`;

      section.dispatchEvent(new CustomEvent("dailykart:wishlist-change", {
        bubbles: true,
        detail: {
          id: productId,
          name: productName,
          added: active
        }
      }));
    });

    addButton.addEventListener("click", () => {
      section.dispatchEvent(new CustomEvent("dailykart:add-to-cart", {
        bubbles: true,
        detail: {
          id: productId,
          name: productName,
          quantity: 1
        }
      }));

      status.textContent = `${productName} selected for cart`;
    });
  });
});




























/* ==========================================
   HOME 1 - WHY CHOOSE DAILYKART
   SCROLL REVEAL ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const whyCards = document.querySelectorAll(
    ".dk-why-card.dk-why-reveal"
  );

  if (!whyCards.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    whyCards.forEach((card) => {
      card.classList.add("dk-why-visible");
    });
    return;
  }

  const whyObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          entry.target.classList.add(
            "dk-why-visible"
          );

          observer.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  whyCards.forEach((card) => {
    whyObserver.observe(card);
  });

});

















 
/* ==========================================
   HOME 1 - EVERYDAY FAVORITES
   FILTERS & ADD TO CART
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const section = document.querySelector(".dk-picks");

  if (!section) return;

  const filters = [
    ...section.querySelectorAll(".dk-pick-filter")
  ];

  const products = [
    ...section.querySelectorAll(".dk-pick")
  ];

  const status = section.querySelector("#dkBasketStatus");

  /* CATEGORY FILTER */

  filters.forEach(button => {

    button.addEventListener("click", () => {

      const selected = button.dataset.filter;

      filters.forEach(filter => {

        const active = filter === button;

        filter.classList.toggle("is-active", active);

        filter.setAttribute(
          "aria-pressed",
          String(active)
        );

      });

      products.forEach(product => {

        product.hidden =
          selected !== "all" &&
          product.dataset.category !== selected;

      });

    });

  });

  /* ADD TO CART */

  section.querySelectorAll(".dk-pick-add").forEach(button => {

    button.addEventListener("click", () => {

      const card = button.closest(".dk-pick");

      if (!card) return;

      const name = card.querySelector("h3").textContent.trim();

      const productId = card.dataset.product;

      /* Dispatch event for cart integration */

      section.dispatchEvent(
        new CustomEvent("dailykart:add-to-cart", {
          bubbles: true,
          detail: {
            id: productId,
            name: name,
            quantity: 1
          }
        })
      );

      /* Status message */

      if (status) {
        status.textContent =
          `${name} selected for cart`;
      }

    });

  });

});

















/* ==========================================
   HOME 1 - SECTION 8: NEWSLETTER CTA
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const newsletterForm =
    document.getElementById("dkNewsletterForm");

  if (!newsletterForm) return;

  const emailInput =
    document.getElementById("dkNewsletterEmail");

  const message =
    document.getElementById("dkNewsletterMessage");

  newsletterForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();

    message.classList.remove(
      "is-error",
      "is-success"
    );

    /* EMPTY EMAIL */

    if (!email) {

      message.textContent =
        "Please enter your email address.";

      message.classList.add("is-error");

      emailInput.focus();
      return;
    }

    /* INVALID EMAIL */

    if (!emailInput.validity.valid) {

      message.textContent =
        "Please enter a valid email address.";

      message.classList.add("is-error");

      emailInput.focus();
      return;
    }

    /* VALID EMAIL - READY FOR BACKEND */

    message.textContent =
      "Email validated! Subscription service coming soon.";

    message.classList.add("is-success");

    /*
      CONNECT YOUR BACKEND HERE.

      Example:
      await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      Only show a subscription success message
      after your backend confirms the request.
    */

  });

});






















/* ==========================================
   DAILYKART HOME 1 - ALL SECTION ANIMATIONS
   ADD AT THE BOTTOM OF index.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (
    reduceMotion.matches ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  /* SECTION ELEMENTS TO ANIMATE */

  const animationGroups = [

    /* SECTION 1 - HERO BANNER */
    {
      selector: ".dk-banner-content",
      effect: "dk-from-left"
    },
    {
      selector: ".dk-banner-visual",
      effect: "dk-zoom-in"
    },
    {
      selector: ".dk-banner-promo",
      effect: "dk-from-right"
    },
    {
      selector: ".dk-banner-bottom-item",
      effect: ""
    },

    /* SECTION 2 - SHOP BY CATEGORY */
    {
      selector: ".dk-categories-heading",
      effect: ""
    },
    {
      selector: ".dk-category-card",
      effect: ""
    },

    /* SECTION 3 - WHY CHOOSE DAILYKART */
    {
      selector: ".dk-why-heading",
      effect: ""
    },
    {
      selector: ".dk-why-card",
      effect: "dk-zoom-in"
    },

    /* SECTION 4 - SPECIAL OFFERS */
    {
      selector: ".dk-offers-heading",
      effect: ""
    },
    {
      selector: ".dk-offer-featured",
      effect: "dk-from-left"
    },
    {
      selector: ".dk-offer-small",
      effect: "dk-from-right"
    },
    {
      selector: ".dk-offers-footer",
      effect: ""
    },

    /* SECTION 5 - EVERYDAY FAVORITES */
    {
      selector: ".dk-picks-heading",
      effect: ""
    },
    {
      selector: ".dk-pick",
      effect: ""
    },

    /* SECTION 6 - HOW DAILYKART WORKS */
    {
      selector: ".dk-how-heading",
      effect: ""
    },
    {
      selector: ".dk-how-card",
      effect: "dk-zoom-in"
    },

    /* SECTION 7 - TESTIMONIALS */
    {
      selector: ".dk-testimonials-heading",
      effect: ""
    },
    {
      selector: ".dk-testimonial-card",
      effect: "dk-zoom-in"
    },

    /* SECTION 8 - NEWSLETTER */
    {
      selector: ".dk-newsletter-content",
      effect: "dk-from-left"
    },
    {
      selector: ".dk-newsletter-visual",
      effect: "dk-from-right"
    }

  ];

  /* OBSERVE ELEMENTS */

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("dk-visible");

        observerInstance.unobserve(entry.target);

      });

    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  /* APPLY ANIMATIONS */

  animationGroups.forEach((group) => {

    const elements = document.querySelectorAll(
      group.selector
    );

    elements.forEach((element, index) => {

      element.classList.add("dk-animate");

      if (group.effect) {
        element.classList.add(group.effect);
      }

      /* STAGGERED ENTRANCE */
      element.style.setProperty(
        "--dk-delay",
        `${Math.min(index * 90, 360)}ms`
      );

      observer.observe(element);

    });

  });

});
