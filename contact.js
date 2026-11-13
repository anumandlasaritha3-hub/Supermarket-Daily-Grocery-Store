 /* ==========================================
   CONTACT PAGE
========================================== */

(function () {
  "use strict";

  // ----------------------------------------
  // 1. FAQ ACCORDION (one open at a time)
  // ----------------------------------------
  var faq = document.getElementById("ctFaq");

  if (faq) {
    faq.addEventListener("click", function (event) {
      var button = event.target.closest(".dk-ct-faq-q");
      if (!button) return;

      var item = button.closest(".dk-ct-faq-item");
      var willOpen = !item.classList.contains("is-open");

      faq.querySelectorAll(".dk-ct-faq-item").forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".dk-ct-faq-q").setAttribute("aria-expanded", "false");
      });

      if (willOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  }

  // ----------------------------------------
  // 2. TOPIC CARDS FILL THE FORM
  // ----------------------------------------
  var form = document.getElementById("ctForm");
  var topicSelect = document.getElementById("ctTopic");
  var formSection = document.getElementById("contact-form");

  document.querySelectorAll(".dk-ct-topic").forEach(function (card) {
    card.addEventListener("click", function () {
      if (!topicSelect || !formSection) return;

      var wanted = card.dataset.topic;
      Array.prototype.forEach.call(topicSelect.options, function (option) {
        if (option.textContent.trim() === wanted) {
          topicSelect.value = option.value || option.textContent;
        }
      });

      formSection.scrollIntoView({ behavior: "smooth", block: "start" });

      setTimeout(function () {
        var nameField = document.getElementById("ctName");
        if (nameField) nameField.focus({ preventScroll: true });
      }, 500);
    });
  });

  // ----------------------------------------
  // 3. FORM CHECKS
  // ----------------------------------------
  if (!form) return;

  var status = document.getElementById("ctStatus");
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^[+()\d\s-]{7,16}$/;

  function setError(id, message) {
    var field = document.getElementById(id);
    var error = form.querySelector('[data-error-for="' + id + '"]');

    if (error) error.textContent = message;

    if (field) {
      if (message) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
    }

    return !message;
  }

  function checkName() {
    var value = document.getElementById("ctName").value.trim();
    return setError("ctName", value.length < 2 ? "Please enter your name." : "");
  }

  function checkEmail() {
    var value = document.getElementById("ctEmail").value.trim();
    return setError("ctEmail", EMAIL.test(value) ? "" : "Please enter a valid email address.");
  }

  function checkPhone() {
    var value = document.getElementById("ctPhone").value.trim();
    return setError("ctPhone", !value || PHONE.test(value) ? "" : "Please enter a valid phone number.");
  }

  function checkTopic() {
    var value = document.getElementById("ctTopic").value;
    return setError("ctTopic", value ? "" : "Please choose a topic.");
  }

  function checkMessage() {
    var value = document.getElementById("ctMessage").value.trim();
    return setError("ctMessage", value.length < 10 ? "Please write at least 10 characters." : "");
  }

  function checkConsent() {
    var ok = document.getElementById("ctConsent").checked;
    return setError("ctConsent", ok ? "" : "Please tick the box so we can reply to you.");
  }

  var checks = {
    ctName: checkName,
    ctEmail: checkEmail,
    ctPhone: checkPhone,
    ctTopic: checkTopic,
    ctMessage: checkMessage,
    ctConsent: checkConsent
  };

  // Check a field when the visitor leaves it, then clear the message once it is fixed
  Object.keys(checks).forEach(function (id) {
    var field = document.getElementById(id);
    if (!field) return;

    field.addEventListener("blur", checks[id]);
    field.addEventListener(field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input", function () {
      if (field.getAttribute("aria-invalid") === "true") checks[id]();
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    status.className = "dk-ct-status";
    status.textContent = "";

    var results = Object.keys(checks).map(function (id) { return checks[id](); });
    var firstBad = Object.keys(checks).find(function (id, index) { return !results[index]; });

    if (firstBad) {
      document.getElementById(firstBad).focus();
      return;
    }

    /* This form does not send anything yet.
       To receive the messages, connect it to your backend or a form
       service here (for example with fetch()), then show the success
       message after the request works. */

    status.className = "dk-ct-status is-success";
    status.textContent = "Thank you! Your message is ready. We will reply to your email soon.";
    form.reset();
  });
})();
