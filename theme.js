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
      var s = localStorage.getItem(KEY);
      if (s === 'light' || s === 'dark') return s;
    } catch (e) {}
    return 'light';
  }

  function apply(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem(KEY, 'dark'); } catch (e) {}
    } else {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem(KEY, 'light'); } catch (e) {}
    }
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Tema claro' : 'Tema escuro');
    }
  }

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
      'box-shadow:0 8px 22px rgba(0,0,0,.28)!important;}',
      '@media(min-width:900px){#theme-toggle{top:18px!important;bottom:auto!important;left:auto!important;right:18px!important;}}',
      '[data-theme="dark"] #theme-toggle{background:#eab308!important;color:#0f172a!important;}',

      /* menu claro */
      'html:not([data-theme="dark"]) .nav a{color:#0f172a!important;}',

      /* ===== TEXTOS QUE DEVEM SER BRANCOS (claro e escuro) ===== */
      '.hero-eyebrow,.hero-subtitle,.hero-content h1,.hero-content > p{',
      'color:#ffffff!important;opacity:1!important;}',
      '.destino-info,.destino-info h3,.destino-info p,.destino-info span{',
      'color:#ffffff!important;opacity:1!important;}',
      /* meta do pacote (ex: 5 noites · Baixa Temporada) em páginas escuras */
      'body.pacote-page p[style*="opacity"],.pacote-hero p,.pkg-meta,.pacote-meta-line{',
      'color:#ffffff!important;opacity:1!important;}',

      /* ===== ESCURO ===== */
      '[data-theme="dark"] body{background-color:#0b1220!important;color:#f1f5f9!important;}',
      '[data-theme="dark"] .header,[data-theme="dark"] .header.scrolled{background-color:rgba(11,18,32,.96)!important;}',
      '[data-theme="dark"] .nav a{color:#f1f5f9!important;}',
      '[data-theme="dark"] h1,[data-theme="dark"] h2,[data-theme="dark"] h3{color:#f8fafc!important;}',
      '[data-theme="dark"] p,[data-theme="dark"] li,[data-theme="dark"] label{color:#e2e8f0!important;}',

      '[data-theme="dark"] .pacotes,[data-theme="dark"] .sobre,[data-theme="dark"] .depoimentos,',
      '[data-theme="dark"] .contato,[data-theme="dark"] .diferenciais,[data-theme="dark"] .destinos{background-color:#0b1220!important;}',

      '[data-theme="dark"] .pacote-card{background-color:#1e293b!important;border-color:#334155!important;}',
      '[data-theme="dark"] .pacote-body,[data-theme="dark"] .pacote-footer{background-color:#1e293b!important;color:#f1f5f9!important;}',
      '[data-theme="dark"] .pacote-body h3,[data-theme="dark"] .pacote-body p{color:#e2e8f0!important;}',
      '[data-theme="dark"] .pacote-img img,[data-theme="dark"] .destino-card img{filter:none!important;opacity:1!important;}',

      '[data-theme="dark"] .destino-info{background:linear-gradient(transparent,rgba(0,0,0,.82))!important;}',
      '[data-theme="dark"] .destino-info h3,[data-theme="dark"] .destino-info p{color:#fff!important;}',

      '[data-theme="dark"] .roteiro-dia{background-color:#1e293b!important;}',
      '[data-theme="dark"] .roteiro-dia h4{color:#67e8f9!important;}',
      '[data-theme="dark"] .roteiro-dia p{color:#e2e8f0!important;}',
      '[data-theme="dark"] .depoimento,[data-theme="dark"] .dif-card{background-color:#1e293b!important;color:#f1f5f9!important;}',
      '[data-theme="dark"] .depoimento p{color:#e2e8f0!important;}',

      '[data-theme="dark"] form{background-color:#1e293b!important;}',
      '[data-theme="dark"] input,[data-theme="dark"] textarea,[data-theme="dark"] select{background-color:#0f172a!important;color:#f8fafc!important;}',
      '[data-theme="dark"] .footer,[data-theme="dark"] footer{background-color:#070b14!important;color:#e2e8f0!important;}',
      '[data-theme="dark"] .pacote-footer strong{color:#fbbf24!important;}'
    ].join('');
    document.head.appendChild(style);
  }

  function forceWhiteTexts() {
    var sels = [
      '.hero-eyebrow', '.hero-subtitle', '.hero-content h1',
      '.destino-info', '.destino-info h3', '.destino-info p'
    ];
    sels.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.style.setProperty('color', '#ffffff', 'important');
        el.style.setProperty('opacity', '1', 'important');
      });
    });
    // linha "X noites · Baixa Temporada" nas páginas de pacote
    document.querySelectorAll('p').forEach(function (el) {
      var t = (el.textContent || '');
      if (/noites/i.test(t) && /temporada/i.test(t)) {
        el.style.setProperty('color', '#ffffff', 'important');
        el.style.setProperty('opacity', '1', 'important');
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
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        apply(dark ? 'light' : 'dark');
        setTimeout(forceWhiteTexts, 20);
      });
    }
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = dark ? '☀️' : '🌙';
  }

  function boot() {
    apply(preferred());
    ensureButton();
    forceWhiteTexts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  setTimeout(function () { ensureButton(); forceWhiteTexts(); }, 400);
})();
