/**
 * TOURMIX — tema claro / escuro
 * <script src="theme.js"></script> antes de </body>
 */
(function () {
  if (window.__tourmixTheme) return;
  window.__tourmixTheme = true;

  var KEY = 'tourmix_theme';

  function preferred() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  apply(preferred());

  function injectCss() {
    if (document.getElementById('tourmix-theme-css')) return;
    var style = document.createElement('style');
    style.id = 'tourmix-theme-css';
    style.textContent = [
      '#theme-toggle{position:fixed!important;top:16px!important;right:16px!important;z-index:2147483646!important;',
      'width:46px!important;height:46px!important;border-radius:50%!important;border:none!important;',
      'background:#0e7490!important;color:#fff!important;font-size:1.25rem!important;cursor:pointer!important;',
      'display:flex!important;align-items:center!important;justify-content:center!important;',
      'box-shadow:0 8px 22px rgba(0,0,0,.25)!important;line-height:1!important;padding:0!important;}',
      '#theme-toggle:hover{transform:scale(1.06);background:#0a2e38!important;}',
      '[data-theme="dark"] #theme-toggle{background:#eab308!important;color:#0f172a!important;}',
      '[data-theme="dark"] body{background:#0b1220!important;color:#e5e7eb!important;}',
      '[data-theme="dark"] .header,[data-theme="dark"] .topbar{background:rgba(15,23,42,.94)!important;}',
      '[data-theme="dark"] .card,[data-theme="dark"] .excursao-card,[data-theme="dark"] .info-box,',
      '[data-theme="dark"] .side-block,[data-theme="dark"] .msg.bot{background:#111827!important;color:#e5e7eb!important;border-color:#1f2937!important;}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensureButton() {
    injectCss();
    var btn = document.getElementById('theme-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'theme-toggle';
      btn.title = 'Alternar tema';
      document.body.appendChild(btn);
      btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme') || 'light';
        apply(cur === 'dark' ? 'light' : 'dark');
      });
    }
    apply(document.documentElement.getAttribute('data-theme') || preferred());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureButton);
  } else {
    ensureButton();
  }
  setTimeout(ensureButton, 300);
})();
