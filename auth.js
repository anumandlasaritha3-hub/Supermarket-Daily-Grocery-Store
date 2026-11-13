// DailyKart login and signup frontend interactions.
// Authentication requires a secure backend; no passwords are stored here.
document.addEventListener('DOMContentLoaded', () => {
  const byId = (id) => document.getElementById(id);
  const getPreference = (key, fallback) => {
    try { return localStorage.getItem(key) || fallback; }
    catch { return fallback; }
  };
  const savePreference = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* Storage optional */ }
  };

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark', isDark);
    const button = byId('authTheme');
    if (button) {
      button.innerHTML = isDark
        ? '<i class="bi bi-moon-stars" aria-hidden="true"></i>'
        : '<i class="bi bi-sun" aria-hidden="true"></i>';
      button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    savePreference('dailykart-theme', theme);
  }

  function applyDirection(direction) {
    document.documentElement.dir = direction;
    const button = byId('authDirection');
    if (button) button.textContent = direction === 'rtl' ? 'LTR' : 'RTL';
    savePreference('dailykart-direction', direction);
  }

  applyTheme(getPreference('dailykart-theme', 'light'));
  applyDirection(getPreference('dailykart-direction', 'ltr'));

  byId('authTheme')?.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
  });
  byId('authDirection')?.addEventListener('click', () => {
    applyDirection(document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl');
  });

  document.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = byId(button.dataset.togglePassword);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.innerHTML = show
        ? '<i class="bi bi-eye-slash" aria-hidden="true"></i>'
        : '<i class="bi bi-eye" aria-hidden="true"></i>';
      button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const setError = (id, message) => {
    const element = byId(`${id}Error`);
    if (element) element.textContent = message;
  };

  const rememberedEmail = getPreference('dailykart-remember-email', '');
  if (byId('loginEmail') && rememberedEmail) {
    byId('loginEmail').value = rememberedEmail;
    byId('rememberEmail').checked = true;
  }

  byId('loginForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = byId('loginEmail').value.trim();
    const password = byId('loginPassword').value;
    const emailOk = validEmail(email);
    const passwordOk = password.length >= 8;
    setError('loginEmail', emailOk ? '' : 'Enter a valid email address.');
    setError('loginPassword', passwordOk ? '' : 'Enter a password of at least 8 characters.');
    byId('loginStatus').textContent = '';
    if (!emailOk || !passwordOk) return;
    if (byId('rememberEmail').checked) {
      savePreference('dailykart-remember-email', email);
    } else {
      try { localStorage.removeItem('dailykart-remember-email'); } catch { /* Optional */ }
    }
    byId('loginStatus').textContent = 'Form validated. Connect a secure authentication backend to log in.';
  });

  byId('signupForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const first = byId('firstName').value.trim();
    const last = byId('lastName').value.trim();
    const email = byId('signupEmail').value.trim();
    const phone = byId('phone').value.replace(/\D/g, '');
    const password = byId('signupPassword').value;
    const confirmation = byId('confirmPassword').value;
    const terms = byId('acceptTerms').checked;
    const checks = [
      ['firstName', first.length >= 2, 'Enter your first name.'],
      ['lastName', last.length >= 2, 'Enter your last name.'],
      ['signupEmail', validEmail(email), 'Enter a valid email address.'],
      ['phone', phone.length >= 10 && phone.length <= 15, 'Enter a valid mobile number.'],
      ['signupPassword', password.length >= 8, 'Use at least 8 characters.'],
      ['confirmPassword', confirmation === password && confirmation.length > 0, 'Passwords do not match.'],
      ['acceptTerms', terms, 'Please agree before continuing.']
    ];
    checks.forEach(([id, ok, message]) => setError(id, ok ? '' : message));
    byId('signupStatus').textContent = '';
    if (checks.some(([, ok]) => !ok)) return;
    byId('signupStatus').textContent = 'Form validated. Connect a secure registration backend to create an account.';
  });
});
