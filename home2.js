
/* ==========================================
   DAILYKART HOME 2
   SECTION 1 - HERO BANNER
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // 1. Select hero elements
  const hero = document.querySelector(".dk-h2-hero");

  if (!hero) return;

  const heroContent = hero.querySelector(".dk-h2-hero-content");
  const heroGallery = hero.querySelector(".dk-h2-hero-gallery");
  const categoryButton = hero.querySelector(
    'a[href="#home2-categories"]'
  );

  // Respect reduced-motion accessibility settings
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ========================================
  // 2. HERO ENTRANCE ANIMATION
  // ========================================

  if (!reducedMotion) {

    const animateIn = (element, delay) => {
      if (!element) return;

      element.animate(
        [
          {
            opacity: 0,
            transform: "translateY(25px)"
          },
          {
            opacity: 1,
            transform: "translateY(0)"
          }
        ],
        {
          duration: 750,
          delay: delay,
          easing: "ease-out",
          fill: "both"
        }
      );
    };

    animateIn(heroContent, 100);
    animateIn(heroGallery, 250);
  }

  // ========================================
  // 3. SMOOTH SCROLL TO CATEGORIES
  // ========================================

  if (categoryButton) {

    categoryButton.addEventListener("click", (event) => {

      const categories = document.querySelector(
        "#home2-categories"
      );

      if (!categories) return;

      event.preventDefault();

      categories.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

    });
  }

  // ========================================
  // 4. SUBTLE IMAGE GALLERY MOVEMENT
  // ========================================

  if (
    heroGallery &&
    !reducedMotion &&
    window.matchMedia("(pointer: fine)").matches
  ) {

    const photos = heroGallery.querySelectorAll(".dk-h2-photo");

    heroGallery.addEventListener("pointermove", (event) => {

      const bounds = heroGallery.getBoundingClientRect();

      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      photos.forEach((photo, index) => {

        const strength = index === 0 ? 5 : 9;

        photo.style.translate = `
          ${x * strength}px
          ${y * strength}px
        `;

      });
    });

    heroGallery.addEventListener("pointerleave", () => {

      photos.forEach((photo) => {
        photo.style.translate = "0 0";
      });

    });
  }

});



















/* ==========================================
   HOME 2 - CATEGORY REVEAL ANIMATION
========================================== */

const categoryCards = document.querySelectorAll(
  ".dk-h2-category-card"
);

const categoryReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (
  categoryCards.length &&
  !categoryReducedMotion &&
  "IntersectionObserver" in window
) {
  const categoryObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const card = entry.target;

        card.animate(
          [
            { opacity: 0, transform: "translateY(25px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          {
            duration: 600,
            easing: "ease-out",
            fill: "both"
          }
        );

        observer.unobserve(card);
      });
    },
    {
      threshold: 0.15
    }
  );

  categoryCards.forEach((card) => {
    categoryObserver.observe(card);
  });
}



















/* ==========================================
   HOME 2 - WHY CHOOSE DAILYKART ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const whySection = document.querySelector(".dk-h2-why");
  if (!whySection) return;

  const revealItems = whySection.querySelectorAll(
    ".dk-h2-why-reveal"
  );

  const connectingLine = whySection.querySelector(
    ".dk-h2-why-line"
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Show everything immediately if motion is reduced
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });

    connectingLine?.classList.add("is-visible");
    return;
  }

  whySection.classList.add("dk-h2-why-animate");

  // Scroll reveal with staggered entrance
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });

  // Draw connecting line when cards enter view
  if (connectingLine) {
    const lineObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          connectingLine.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2
      }
    );

    lineObserver.observe(whySection.querySelector(".dk-h2-why-grid"));
  }
});


























/* ==========================================
   HOME 2 - HOW IT WORKS ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#home2-how");

  if (!section) return;

  const steps = section.querySelectorAll(
    ".dk-h2-how-step"
  );

  const bottomCTA = section.querySelector(
    ".dk-h2-how-bottom"
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* No animation when reduced motion is enabled */
  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    section.classList.add("is-visible");
    return;
  }

  /* Enable scroll animations */
  section.classList.add("js-ready");

  /* Reveal each step individually */
  const stepObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  steps.forEach((step) => {
    stepObserver.observe(step);
  });

  /* Animate timeline when steps become visible */
  const timelineObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        section.classList.add("is-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2
    }
  );

  const stepsContainer = section.querySelector(
    ".dk-h2-how-steps"
  );

  if (stepsContainer) {
    timelineObserver.observe(stepsContainer);
  }

  /* Reveal bottom call-to-action */
  if (bottomCTA) {
    stepObserver.observe(bottomCTA);
  }
});



























/* ==========================================
   HOME 2 - CUSTOMER REVIEWS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#home2-reviews");
  if (!section) return;

  const featured = section.querySelector(
    ".dk-h2-reviews-featured"
  );

  const title = section.querySelector("#dkH2ReviewTitle");
  const text = section.querySelector("#dkH2ReviewText");
  const name = section.querySelector("#dkH2ReviewName");
  const avatar = section.querySelector("#dkH2ReviewAvatar");

  const prevBtn = section.querySelector(
    ".dk-h2-reviews-prev"
  );

  const nextBtn = section.querySelector(
    ".dk-h2-reviews-next"
  );

  const dots = [
    ...section.querySelectorAll(
      ".dk-h2-reviews-dots button"
    )
  ];

  /* Demo testimonials - replace with real reviews */
  const reviews = [
    {
      title: "Shopping Feels So Much Easier!",
      text:
        "DailyKart makes grocery shopping simple and convenient. " +
        "I love being able to find everyday essentials in one " +
        "place without the usual hassle.",
      name: "Priya Sharma",
      avatar:
        "images/customer-1.png"
    },
    {
      title: "Everything I Need in One Place!",
      text:
        "From vegetables to pantry essentials, I can browse " +
        "everything easily. The shopping experience feels " +
        "organised and straightforward.",
      name: "Rahul Mehta",
      avatar:
        "images/customer-2.png"
    },
    {
      title: "A Lovely Way to Shop for Groceries!",
      text:
        "I really enjoy the simple layout and the variety of " +
        "everyday products. It makes planning my grocery " +
        "shopping much more convenient.",
      name: "Ananya Rao",
      avatar:
        "images/customer-3.png"
    }
  ];

  let currentIndex = 0;
  let autoplay = null;

  const duration = 6000;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* Update featured review */
  function showReview(index) {
    currentIndex = (
      index + reviews.length
    ) % reviews.length;

    const review = reviews[currentIndex];

    title.textContent = review.title;
    text.textContent = review.text;
    name.textContent = review.name;
    avatar.src = review.avatar;

    dots.forEach((dot, i) => {
      const active = i === currentIndex;

      dot.classList.toggle("active", active);
      dot.setAttribute("aria-pressed", String(active));
    });

    /* Restart progress animation */
    featured.classList.remove("is-playing");

    if (!reduceMotion) {
      void featured.offsetWidth;
      featured.classList.add("is-playing");
    }
  }

  /* Stop autoplay */
  function stopAutoplay() {
    if (autoplay) {
      clearInterval(autoplay);
      autoplay = null;
    }

    featured.classList.remove("is-playing");
  }

  /* Start autoplay */
  function startAutoplay() {
    stopAutoplay();

    if (reduceMotion || document.hidden) return;

    featured.classList.add("is-playing");

    autoplay = setInterval(() => {
      showReview(currentIndex + 1);
    }, duration);
  }

  /* Navigation */
  prevBtn.addEventListener("click", () => {
    showReview(currentIndex - 1);
    startAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    showReview(currentIndex + 1);
    startAutoplay();
  });

  /* Dots */
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showReview(Number(dot.dataset.review));
      startAutoplay();
    });
  });

  /* Pause on hover */
  featured.addEventListener("mouseenter", stopAutoplay);
  featured.addEventListener("mouseleave", startAutoplay);

  /* Pause when keyboard focus is inside */
  section.addEventListener("focusin", stopAutoplay);

  section.addEventListener("focusout", (event) => {
    if (!section.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  /* Pause in background tabs */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  /* Scroll reveal */
  if (
    !reduceMotion &&
    "IntersectionObserver" in window
  ) {
    const revealItems = section.querySelectorAll(
      ".dk-h2-reviews-heading, " +
      ".dk-h2-reviews-featured, " +
      ".dk-h2-reviews-small"
    );

    section.classList.add("js-ready");

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => {
      observer.observe(item);
    });
  }

  /* Initialize */
  showReview(0);
  startAutoplay();
});





















/* ==========================================
   HOME 2 - GROCERY DELIVERY CTA ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#home2-delivery");

  if (!section) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    section.classList.add("is-visible");
    return;
  }

  section.classList.add("js-ready");

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        section.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15
    }
  );

  observer.observe(section);
});


















/* ==========================================
   HOME 2 - FRESHNESS PROMISE ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#home2-fresh");
  if (!section) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    reduceMotion ||
    !("IntersectionObserver" in window)
  ) {
    section.classList.add("is-visible");
    return;
  }

  section.classList.add("js-ready");

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        section.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15
    }
  );

  observer.observe(section);
});
