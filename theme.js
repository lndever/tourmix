/**
 * TOURMIX — tema claro / escuro (site inteiro)
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
  }

  apply(preferred());

  function injectCss() {
    if (document.getElementById('tourmix-theme-css')) return;
    var style = document.createElement('style');
    style.id = 'tourmix-theme-css';
    style.textContent = [
      /* BOTÃO — mobile: canto inferior ESQUERDO (não cobre o menu) */
      '#theme-toggle{position:fixed!important;left:16px!important;right:auto!important;',
      'bottom:20px!important;top:auto!important;z-index:9997!important;',
      'width:46px!important;height:46px!important;border-radius:50%!important;border:none!important;',
      'background:#0e7490!important;color:#fff!important;font-size:1.2rem!important;cursor:pointer!important;',
      'display:flex!important;align-items:center!important;justify-content:center!important;',
      'box-shadow:0 8px 22px rgba(0,0,0,.28)!important;line-height:1!important;padding:0!important;}',
      '@media(min-width:900px){#theme-toggle{top:18px!important;bottom:auto!important;left:auto!important;right:18px!important;}}',
      '#theme-toggle:hover{transform:scale(1.06);}',
      '[data-theme="dark"] #theme-toggle{background:#eab308!important;color:#0f172a!important;}',

      /* ===== MODO ESCURO — SITE INTEIRO ===== */
      '[data-theme="dark"]{color-scheme:dark;}',
      '[data-theme="dark"] body{background:#0b1220!important;color:#e5e7eb!important;}',
      '[data-theme="dark"] .header,[data-theme="dark"] .topbar,[data-theme="dark"] header{',
      'background:rgba(11,18,32,.94)!important;border-color:#1f2937!important;color:#e5e7eb!important;}',
      '[data-theme="dark"] .header.scrolled{background:rgba(11,18,32,.97)!important;}',
      '[data-theme="dark"] .nav a,[data-theme="dark"] .nav-link,[data-theme="dark"] .top-links a{color:#e5e7eb!important;}',
      '[data-theme="dark"] .mobile-nav,[data-theme="dark"] .nav-mobile,[data-theme="dark"] .menu-mobile{',
      'background:#111827!important;border-color:#1f2937!important;}',

      '[data-theme="dark"] section,[data-theme="dark"] .section,[data-theme="dark"] main{background:transparent!important;color:#e5e7eb!important;}',
      '[data-theme="dark"] .hero,[data-theme="dark"] .hero-content{color:#f8fafc!important;}',

      '[data-theme="dark"] .card,[data-theme="dark"] .package-card,[data-theme="dark"] .destino-card,',
      '[data-theme="dark"] .excursao-card,[data-theme="dark"] .info-box,[data-theme="dark"] .side-block,',
      '[data-theme="dark"] .result-section,[data-theme="dark"] .portfolio-item,[data-theme="dark"] .testimonial,',
      '[data-theme="dark"] .depoimento,[data-theme="dark"] .grid > div,[data-theme="dark"] article{',
      'background:#111827!important;color:#e5e7eb!important;border-color:#1f2937!important;}',

      '[data-theme="dark"] .section-header h2,[data-theme="dark"] h1,[data-theme="dark"] h2,[data-theme="dark"] h3,',
      '[data-theme="dark"] h4,[data-theme="dark"] .logo-text,[data-theme="dark"] strong{color:#f1f5f9!important;}',
      '[data-theme="dark"] p,[data-theme="dark"] .lead,[data-theme="dark"] .sub,[data-theme="dark"] li,',
      '[data-theme="dark"] span,[data-theme="dark"] .muted{color:#94a3b8!important;}',

      '[data-theme="dark"] .footer, [data-theme="dark"] footer{',
      'background:#070b14!important;color:#cbd5e1!important;border-color:#1f2937!important;}',
      '[data-theme="dark"] .footer a,[data-theme="dark"] footer a{color:#e2e8f0!important;}',

      '[data-theme="dark"] input,[data-theme="dark"] textarea,[data-theme="dark"] select{',
      'background:#0f172a!important;color:#e5e7eb!important;border-color:#334155!important;}',

      '[data-theme="dark"] .btn-outline,[data-theme="dark"] .btn-secondary{',
      'border-color:#22d3ee!important;color:#22d3ee!important;background:transparent!important;}',

      '[data-theme="dark"] .msg.bot{background:#111827!important;color:#e5e7eb!important;border-color:#1f2937!important;}',
      '[data-theme="dark"] .composer{background:#0f172a!important;border-color:#1f2937!important;}',
      '[data-theme="dark"] .sugestoes button{background:#111827!important;color:#22d3ee!important;border-color:#164e63!important;}',

      /* blocos que costumam ficar brancos no site */
      '[data-theme="dark"] .destinos,[data-theme="dark"] .pacotes,[data-theme="dark"] .sobre,',
      '[data-theme="dark"] .contato,[data-theme="dark"] .testimonials,[data-theme="dark"] .cta,',
      '[data-theme="dark"] .white-bg,[data-theme="dark"] .bg-white{background:#0b1220!important;}',

      '[data-theme="dark"] .package-price,[data-theme="dark"] .price{color:#fbbf24!important;}'
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
