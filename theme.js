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
    return 'light';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Tema claro' : 'Tema escuro');
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
    if (theme === 'dark') setTimeout(fixWhiteBoxes, 30);
  }

  apply(preferred());

  function injectCss() {
    if (document.getElementById('tourmix-theme-css')) return;
    var style = document.createElement('style');
    style.id = 'tourmix-theme-css';
    style.textContent = [
      '#theme-toggle{position:fixed!important;left:16px!important;right:auto!important;',
      'bottom:20px!important;top:auto!important;z-index:9997!important;',
      'width:46px!important;height:46px!important;border-radius:50%!important;border:none!important;',
      'background:#0e7490!important;color:#fff!important;font-size:1.2rem!important;cursor:pointer!important;',
      'display:flex!important;align-items:center!important;justify-content:center!important;',
      'box-shadow:0 8px 22px rgba(0,0,0,.28)!important;line-height:1!important;padding:0!important;}',
      '@media(min-width:900px){#theme-toggle{top:18px!important;bottom:auto!important;left:auto!important;right:18px!important;}}',
      '[data-theme="dark"] #theme-toggle{background:#eab308!important;color:#0f172a!important;}',

      '[data-theme="dark"]{color-scheme:dark;}',
      '[data-theme="dark"] body{background:#0b1220!important;color:#f1f5f9!important;}',
      '[data-theme="dark"] .header,[data-theme="dark"] .topbar,[data-theme="dark"] header{',
      'background:rgba(11,18,32,.96)!important;border-color:#1f2937!important;color:#f1f5f9!important;}',
      '[data-theme="dark"] .nav a,[data-theme="dark"] .nav-link{color:#f1f5f9!important;}',

      '[data-theme="dark"] h1,[data-theme="dark"] h2,[data-theme="dark"] h3,[data-theme="dark"] h4,',
      '[data-theme="dark"] strong,[data-theme="dark"] b{color:#f8fafc!important;}',
      '[data-theme="dark"] p,[data-theme="dark"] li,[data-theme="dark"] label,[data-theme="dark"] .lead{color:#e2e8f0!important;}',

      /* cards de texto / formulário */
      '[data-theme="dark"] .card:not(:has(img)),',
      '[data-theme="dark"] form,[data-theme="dark"] .contact-form,[data-theme="dark"] .form-card,',
      '[data-theme="dark"] .form-box,[data-theme="dark"] .contato-form,[data-theme="dark"] .contact-card{',
      'background:#1e293b!important;color:#f1f5f9!important;border-color:#334155!important;}',

      '[data-theme="dark"] .package-card,[data-theme="dark"] .destino-card,[data-theme="dark"] .excursao-card,',
      '[data-theme="dark"] .info-box,[data-theme="dark"] .side-block,[data-theme="dark"] .detail-card,',
      '[data-theme="dark"] .price-box,[data-theme="dark"] .timeline-item,[data-theme="dark"] .roteiro-item,',
      '[data-theme="dark"] .day-card,[data-theme="dark"] .day-item,[data-theme="dark"] .step-card{',
      'background:#1e293b!important;color:#f1f5f9!important;border-color:#334155!important;}',

      /* formulário – labels e campos */
      '[data-theme="dark"] form label,[data-theme="dark"] .form-group label{color:#cbd5e1!important;}',
      '[data-theme="dark"] input,[data-theme="dark"] textarea,[data-theme="dark"] select{',
      'background:#0f172a!important;color:#f8fafc!important;border-color:#334155!important;}',
      '[data-theme="dark"] input::placeholder,[data-theme="dark"] textarea::placeholder{color:#94a3b8!important;}',
      '[data-theme="dark"] form small,[data-theme="dark"] .form-note{color:#94a3b8!important;}',

      '[data-theme="dark"] section,[data-theme="dark"] main{background:#0b1220!important;}',
      '[data-theme="dark"] footer,[data-theme="dark"] .footer{background:#070b14!important;color:#e2e8f0!important;}',
      '[data-theme="dark"] .price,[data-theme="dark"] .package-price{color:#fbbf24!important;}',

      /* NÃO mexer em imagens */
      '[data-theme="dark"] img,[data-theme="dark"] video,[data-theme="dark"] picture{',
      'filter:none!important;opacity:1!important;mix-blend-mode:normal!important;',
      'background:transparent!important;}',
      /* área da foto do card: deixa a imagem aparecer */
      '[data-theme="dark"] .card-image,[data-theme="dark"] .package-image,[data-theme="dark"] .destino-image,',
      '[data-theme="dark"] .excursao-image,[data-theme="dark"] .thumb,[data-theme="dark"] .cover{',
      'background-color:transparent!important;filter:none!important;}',
      '[data-theme="dark"] .card-image img,[data-theme="dark"] .package-card img,',
      '[data-theme="dark"] .destino-card img,[data-theme="dark"] .excursao-card img{',
      'display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;',
      'filter:none!important;opacity:1!important;}'
    ].join('');
    document.head.appendChild(style);
  }

  function hasMedia(el) {
    if (!el || !el.querySelector) return false;
    if (el.matches && el.matches('img,video,picture,svg')) return true;
    if (el.querySelector('img,video,picture')) return true;
    try {
      var bg = window.getComputedStyle(el).backgroundImage || '';
      if (bg && bg !== 'none' && bg.indexOf('url(') !== -1) return true;
    } catch (e) {}
    return false;
  }

  function fixWhiteBoxes() {
    if (document.documentElement.getAttribute('data-theme') !== 'dark') return;

    // formulários sempre
    document.querySelectorAll('form, .contact-form, .form-card, .form-box, .contato-form, .contact-card').forEach(function (el) {
      el.style.setProperty('background-color', '#1e293b', 'important');
      el.style.setProperty('color', '#f1f5f9', 'important');
    });

    var nodes = document.querySelectorAll('div, article, section, li, form');
    nodes.forEach(function (el) {
      if (el.id === 'theme-toggle') return;
      // não pintar por cima de fotos
      if (hasMedia(el)) return;
      if (el.closest && el.closest('img,picture,video,.card-image,.package-image,.thumb,.cover')) return;

      var st = window.getComputedStyle(el);
      var bg = st.backgroundColor || '';
      var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return;
      var r = +m[1], g = +m[2], b = +m[3], a = 1;
      var ma = bg.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
      if (ma) a = parseFloat(ma[4]);
      if (a < 0.5) return;
      // branco / off-white
      if (r > 235 && g > 235 && b > 235) {
        el.style.setProperty('background-color', '#1e293b', 'important');
        el.style.setProperty('color', '#f1f5f9', 'important');
      }
    });
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

  function boot() {
    ensureButton();
    fixWhiteBoxes();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  setTimeout(boot, 400);

  new MutationObserver(function () {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      setTimeout(fixWhiteBoxes, 40);
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
