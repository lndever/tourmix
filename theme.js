/**
 * TOURMIX — tema claro / escuro
 * Cole antes de </body> em todas as páginas:
 * <script src="theme.js"></script>
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
      btn.setAttribute('title', theme === 'dark' ? 'Tema claro' : 'Tema escuro');
      btn.innerHTML = theme === 'dark'
        ? '<span aria-hidden="true">☀️</span>'
        : '<span aria-hidden="true">🌙</span>';
    }
  }

  // Aplica o quanto antes para reduzir "pisca"
  apply(preferred());

  function ensureButton() {
    if (document.getElementById('theme-toggle')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle';
    btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') || 'light';
      apply(cur === 'dark' ? 'light' : 'dark');
    });

    // Tenta colocar no header / nav; senão fixo no canto
    var host =
      document.querySelector('.header-inner') ||
      document.querySelector('.topbar') ||
      document.querySelector('header') ||
      document.body;

    host.appendChild(btn);
    apply(document.documentElement.getAttribute('data-theme') || preferred());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureButton);
  } else {
    ensureButton();
  }
})();
