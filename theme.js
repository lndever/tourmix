/**
 * TOURMIX — tema claro / escuro
 * Claro = visual original do site (sem overrides)
 * Escuro = só quando data-theme="dark"
 * <script src="theme.js"></script> antes de </body>
 */
(function () {
  if (window.__tourmixTheme) return;
  window.__tourmixTheme = true;

  var KEY = 'tourmix_theme';
  var TOUCH = 'data-tourmix-dark-touch';

  function preferred() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return 'light';
  }

  function clearDarkInline() {
    document.querySelectorAll('[' + TOUCH + ']').forEach(function (el) {
      el.style.removeProperty('background-color');
      el.style.removeProperty('color');
      el.removeAttribute(TOUCH);
    });
  }

  function apply(theme) {
    if (theme !== 'dark') {
      // volta ao CSS original do site
      document.documentElement.removeAttribute('data-theme');
      clearDarkInline();
      try { localStorage.setItem(KEY, 'light'); } catch (e) {}
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem(KEY, 'dark'); } catch (e) {}
      setTimeout(fixWhiteBoxes, 30);
    }
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      var isDark = theme === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Tema claro' : 'Tema escuro');
      btn.innerHTML = isDark ? '☀️' : '🌙';
    }
  }

  function injectCss() {
    if (document.getElementById('tourmix-theme-css')) return;
    var style = document.createElement('style');
    style.id = 'tourmix-theme-css';
    // Botão sempre; cores do site SÓ em [data-theme="dark"]
    style.textContent = [
      '#theme-toggle{position:fixed!important;left:16px!important;right:auto!important;',
      'bottom:20px!important;top:auto!important;z-index:9997!important;',
      'width:46px!important;height:46px!important;border-radius:50%!important;border:none!important;',
      'background:#0e7490!important;color:#fff!important;font-size:1.2rem!important;cursor:pointer!important;',
      'display:flex!important;align-items:center!important;justify-content:center!important;',
      'box-shadow:0 8px 22px rgba(0,0,0,.28)!important;line-height:1!important;padding:0!important;}',
      '@media(min-width:900px){#theme-toggle{top:18px!important;bottom:auto!important;left:auto!important;right:18px!important;}}',
      '[data-theme="dark"] #theme-toggle{background:#eab308!important;color:#0f172a!important;}',

      /* ===== APENAS MODO ESCURO ===== */
      '[data-theme="dark"]{color-scheme:dark;}',
      '[data-theme="dark"] body{background-color:#0b1220!important;color:#f1f5f9!important;}',
      '[data-theme="dark"] .header,[data-theme="dark"] .topbar,[data-theme="dark"] header{',
      'background-color:rgba(11,18,32,.96)!important;border-color:#1f2937!important;color:#f1f5f9!important;}',
      '[data-theme="dark"] .nav a,[data-theme="dark"] .nav-link{color:#f1f5f9!important;}',
      '[data-theme="dark"] h1,[data-theme="dark"] h2,[data-theme="dark"] h3,[data-theme="dark"] h4,',
      '[data-theme="dark"] strong,[data-theme="dark"] b{color:#f8fafc!important;}',
      '[data-theme="dark"] p,[data-theme="dark"] li,[data-theme="dark"] label,[data-theme="dark"] .lead{color:#e2e8f0!important;}',

      '[data-theme="dark"] form,[data-theme="dark"] .contact-form,[data-theme="dark"] .form-card,',
      '[data-theme="dark"] .form-box,[data-theme="dark"] .contato-form,[data-theme="dark"] .contact-card{',
      'background-color:#1e293b!important;color:#f1f5f9!important;border-color:#334155!important;}',
      '[data-theme="dark"] form label{color:#cbd5e1!important;}',
      '[data-theme="dark"] input,[data-theme="dark"] textarea,[data-theme="dark"] select{',
      'background-color:#0f172a!important;color:#f8fafc!important;border-color:#334155!important;}',
      '[data-theme="dark"] input::placeholder,[data-theme="dark"] textarea::placeholder{color:#94a3b8!important;}',

      '[data-theme="dark"] .info-box,[data-theme="dark"] .side-block,[data-theme="dark"] .detail-card,',
      '[data-theme="dark"] .price-box,[data-theme="dark"] .timeline-item,[data-theme="dark"] .roteiro-item,',
      '[data-theme="dark"] .day-card,[data-theme="dark"] .day-item,[data-theme="dark"] .step-card{',
      'background-color:#1e293b!important;color:#f1f5f9!important;border-color:#334155!important;}',
      /* cards: fundo escuro no bloco de texto; foto intacta */
      '[data-theme="dark"] .package-card,[data-theme="dark"] .destino-card,[data-theme="dark"] .excursao-card,',
      '[data-theme="dark"] .card{background-color:#1e293b!important;color:#f1f5f9!important;border-color:#334155!important;}',
      '[data-theme="dark"] .package-card > div,[data-theme="dark"] .destino-card > div,',
      '[data-theme="dark"] .excursao-card > div,[data-theme="dark"] .card > div{',
      'background-color:#1e293b!important;color:#f1f5f9!important;}',
      '[data-theme="dark"] .package-card h3,[data-theme="dark"] .package-card h2,',
      '[data-theme="dark"] .package-card h4,[data-theme="dark"] .destino-card h3,',
      '[data-theme="dark"] .excursao-card h3,[data-theme="dark"] .card h3{color:#f8fafc!important;}',
      '[data-theme="dark"] .package-card p,[data-theme="dark"] .destino-card p,',
      '[data-theme="dark"] .excursao-card p,[data-theme="dark"] .card p{color:#e2e8f0!important;}',
      '[data-theme="dark"] .package-card img,[data-theme="dark"] .destino-card img,',
      '[data-theme="dark"] .excursao-card img,[data-theme="dark"] .card img{',
      'background:transparent!important;filter:none!important;opacity:1!important;}',

      '[data-theme="dark"] section,[data-theme="dark"] main{background-color:#0b1220!important;}',
      '[data-theme="dark"] footer,[data-theme="dark"] .footer{background-color:#070b14!important;color:#e2e8f0!important;}',
      '[data-theme="dark"] .price,[data-theme="dark"] .package-price{color:#fbbf24!important;}',

      '[data-theme="dark"] img,[data-theme="dark"] video,[data-theme="dark"] picture{',
      'filter:none!important;opacity:1!important;mix-blend-mode:normal!important;}',
      '[data-theme="dark"] .card-image img,[data-theme="dark"] .package-card img,',
      '[data-theme="dark"] .destino-card img,[data-theme="dark"] .excursao-card img{',
      'filter:none!important;opacity:1!important;display:block!important;}'
    ].join('');
    document.head.appendChild(style);
  }

  function hasMedia(el) {
    if (!el || !el.querySelector) return false;
    if (el.matches && el.matches('img,video,picture')) return true;
    if (el.querySelector('img,video,picture')) return true;
    try {
      var bg = window.getComputedStyle(el).backgroundImage || '';
      if (bg && bg !== 'none' && bg.indexOf('url(') !== -1) return true;
    } catch (e) {}
    return false;
  }

  function touch(el, bg, color) {
    el.style.setProperty('background-color', bg, 'important');
    if (color) el.style.setProperty('color', color, 'important');
    el.setAttribute(TOUCH, '1');
  }

  function fixWhiteBoxes() {
    if (document.documentElement.getAttribute('data-theme') !== 'dark') return;

    document.querySelectorAll('form, .contact-form, .form-card, .form-box, .contato-form, .contact-card').forEach(function (el) {
      touch(el, '#1e293b', '#f1f5f9');
    });

    document.querySelectorAll('div, article, section, li, form').forEach(function (el) {
      if (el.id === 'theme-toggle') return;
      if (hasMedia(el)) return;
      if (el.closest && el.closest('img,picture,video,.card-image,.package-image,.thumb,.cover')) return;
      // não pintar o elemento que TEM a foto de fundo
      if (hasMedia(el)) return;

      var st = window.getComputedStyle(el);
      var bg = st.backgroundColor || '';
      var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return;
      var r = +m[1], g = +m[2], b = +m[3];
      var ma = bg.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
      if (ma && parseFloat(ma[4]) < 0.5) return;
      if (r > 235 && g > 235 && b > 235) {
        touch(el, '#1e293b', '#f1f5f9');
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
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        apply(isDark ? 'light' : 'dark');
      });
    }
    // reaplica ícone conforme tema atual
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = isDark ? '☀️' : '🌙';
  }

  function boot() {
    // aplica preferência salva (padrão: claro = original)
    apply(preferred());
    ensureButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  setTimeout(ensureButton, 300);
})();
