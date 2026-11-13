
// ==========================================
// DAILYKART - LOGIN & SIGNUP JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // 1. ELEMENT HELPERS
  // ========================================

  const $ = (id) => document.getElementById(id);

  document.querySelectorAll(".auth-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  function getPreference(key, fallback) {
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
      // Continue without browser storage.
    }
  }

  // ========================================
  // 2. DARK / LIGHT MODE
  // ========================================

  const themeBtn = $("authThemeBtn");
  const themeIcon = $("authThemeIcon");

  function setTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark", isDark);

    if (themeIcon) {
      themeIcon.className = isDark
        ? "bi bi-moon-stars-fill"
        : "bi bi-sun";
    }

    if (themeBtn) {
      themeBtn.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }

    savePreference("dailykart-theme", theme);
  }

  setTheme(getPreference("dailykart-theme", "light"));

  themeBtn?.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });

  // ========================================
  // 3. RTL / LTR MODE
  // ========================================

  const rtlBtn = $("authRtlBtn");
  const rtlText = $("authRtlText");

  function setDirection(direction) {
    const isRTL = direction === "rtl";

    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    if (rtlText) {
      rtlText.textContent = isRTL ? "LTR" : "RTL";
    }

    savePreference(
      "dailykart-direction",
      isRTL ? "rtl" : "ltr"
    );
  }

  setDirection(
    getPreference("dailykart-direction", "ltr")
  );

  rtlBtn?.addEventListener("click", () => {
    setDirection(
      document.documentElement.dir === "rtl"
        ? "ltr"
        : "rtl"
    );
  });

  // ========================================
  // 4. SHOW / HIDE PASSWORD
  // ========================================

  document.querySelectorAll(
    ".auth-password-toggle"
  ).forEach((button) => {

    button.addEventListener("click", () => {

      const targetId = button.dataset.target;
      const input = $(targetId);

      if (!input) return;

      const showPassword = input.type === "password";

      input.type = showPassword ? "text" : "password";

      button.innerHTML = showPassword
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';

      button.setAttribute(
        "aria-label",
        showPassword ? "Hide password" : "Show password"
      );

      button.setAttribute(
        "aria-pressed",
        String(showPassword)
      );

    });

  });

  // ========================================
  // 5. VALIDATION HELPERS
  // ========================================

  function showError(id, message) {
    const element = $(id);

    if (element) {
      element.textContent = message;
    }
  }

  function validEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  }

  function clearErrors(form) {
    form.querySelectorAll(".auth-error").forEach((element) => {
      element.textContent = "";
    });
  }

  // ========================================
  // 6. LOGIN FORM
  // ========================================

  const loginForm = $("loginForm");

  if (loginForm) {

    const savedEmail = getPreference(
      "dailykart-remember-email",
      ""
    );

    if (savedEmail) {
      $("loginEmail").value = savedEmail;
      $("rememberEmail").checked = true;
    }

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      clearErrors(loginForm);

      const email = $("loginEmail").value.trim();
      const password = $("loginPassword").value;

      let isValid = true;

      if (!validEmail(email)) {
        showError(
          "loginEmailError",
          "Please enter a valid email address."
        );
        isValid = false;
      }

      if (password.length < 8) {
        showError(
          "loginPasswordError",
          "Password must contain at least 8 characters."
        );
        isValid = false;
      }

      if (!isValid) {
        $("loginStatus").textContent = "";
        return;
      }

      if ($("rememberEmail").checked) {
        savePreference("dailykart-remember-email", email);
      } else {
        try {
          localStorage.removeItem("dailykart-remember-email");
        } catch {}
      }

      // Replace with a secure backend login request.
      $("loginStatus").textContent =
        "Form validated. Connect your authentication backend to sign in.";

    });

  }

  // ========================================
  // 7. SIGNUP FORM
  // ========================================

  const signupForm = $("signupForm");

  if (signupForm) {

    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      clearErrors(signupForm);

      const firstName = $("firstName").value.trim();
      const lastName = $("lastName").value.trim();
      const email = $("signupEmail").value.trim();
      const phone = $("signupPhone").value.trim();
      const password = $("signupPassword").value;
      const confirmPassword = $("confirmPassword").value;
      const agreed = $("agreeTerms").checked;

      let isValid = true;

      if (firstName.length < 2) {
        showError(
          "firstNameError",
          "Please enter your first name."
        );
        isValid = false;
      }

      if (lastName.length < 2) {
        showError(
          "lastNameError",
          "Please enter your last name."
        );
        isValid = false;
      }

      if (!validEmail(email)) {
        showError(
          "signupEmailError",
          "Please enter a valid email address."
        );
        isValid = false;
      }

      if (!/^[0-9+()\\s-]{10,20}$/.test(phone)) {
        showError(
          "signupPhoneError",
          "Please enter a valid mobile number."
        );
        isValid = false;
      }

      if (password.length < 8) {
        showError(
          "signupPasswordError",
          "Use at least 8 characters."
        );
        isValid = false;
      }

      if (password !== confirmPassword) {
        showError(
          "confirmPasswordError",
          "Passwords do not match."
        );
        isValid = false;
      }

      if (!agreed) {
        showError(
          "termsError",
          "Please accept the terms and privacy policy."
        );
        isValid = false;
      }

      if (!isValid) {
        $("signupStatus").textContent = "";
        return;
      }

      // Replace with a secure backend registration request.
      // Never store passwords in localStorage.
      $("signupStatus").textContent =
        "Form validated. Connect your registration backend to create the account.";

    });

  }

});
