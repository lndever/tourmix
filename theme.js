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
  }

  apply(preferred());

  function injectCss() {
    if (document.getElementById('tourmix-theme-css')) return;
    var style = document.createElement('style');
    style.id = 'tourmix-theme-css';
    style.textContent = [
      /* Botão: mobile canto inferior esquerdo */
      '#theme-toggle{position:fixed!important;left:16px!important;right:auto!important;',
      'bottom:20px!important;top:auto!important;z-index:9997!important;',
      'width:46px!important;height:46px!important;border-radius:50%!important;border:none!important;',
      'background:#0e7490!important;color:#fff!important;font-size:1.2rem!important;cursor:pointer!important;',
      'display:flex!important;align-items:center!important;justify-content:center!important;',
      'box-shadow:0 8px 22px rgba(0,0,0,.28)!important;line-height:1!important;padding:0!important;}',
      '@media(min-width:900px){#theme-toggle{top:18px!important;bottom:auto!important;left:auto!important;right:18px!important;}}',
      '[data-theme="dark"] #theme-toggle{background:#eab308!important;color:#0f172a!important;}',

      /* Base escura */
      '[data-theme="dark"]{color-scheme:dark;}',
      '[data-theme="dark"] body{background:#0b1220!important;color:#f1f5f9!important;}',

      /* Header / nav */
      '[data-theme="dark"] .header,[data-theme="dark"] .topbar,[data-theme="dark"] header{',
      'background:rgba(11,18,32,.96)!important;border-color:#1f2937!important;color:#f1f5f9!important;}',
      '[data-theme="dark"] .nav a,[data-theme="dark"] .nav-link{color:#f1f5f9!important;}',

      /* Títulos e textos legíveis */
      '[data-theme="dark"] h1,[data-theme="dark"] h2,[data-theme="dark"] h3,[data-theme="dark"] h4,',
      '[data-theme="dark"] h5,[data-theme="dark"] strong,[data-theme="dark"] b{color:#f8fafc!important;}',
      '[data-theme="dark"] p,[data-theme="dark"] li,[data-theme="dark"] td,[data-theme="dark"] label,',
      '[data-theme="dark"] .lead,[data-theme="dark"] .sub,[data-theme="dark"] .desc{color:#e2e8f0!important;}',
      '[data-theme="dark"] span{color:inherit;}',

      /* Cards / caixas (inclui roteiro dia a dia) */
      '[data-theme="dark"] .card,[data-theme="dark"] .package-card,[data-theme="dark"] .destino-card,',
      '[data-theme="dark"] .excursao-card,[data-theme="dark"] .info-box,[data-theme="dark"] .side-block,',
      '[data-theme="dark"] .result-section,[data-theme="dark"] .timeline-item,[data-theme="dark"] .roteiro-item,',
      '[data-theme="dark"] .day-card,[data-theme="dark"] .day-item,[data-theme="dark"] .itinerary-item,',
      '[data-theme="dark"] .step,[data-theme="dark"] .step-card,[data-theme="dark"] .detail-card,',
      '[data-theme="dark"] .price-box,[data-theme="dark"] .sidebar-card,[data-theme="dark"] .pkg-box,',
      '[data-theme="dark"] article,[data-theme="dark"] .white-box{',
      'background:#1e293b!important;color:#f1f5f9!important;border-color:#334155!important;}',

      /* Qualquer div com fundo branco inline residual */
      '[data-theme="dark"] .roteiro-sugerido > div,',
      '[data-theme="dark"] .roteiro > div,',
      '[data-theme="dark"] .itinerary > div,',
      '[data-theme="dark"] .days > div{',
      'background:#1e293b!important;color:#f1f5f9!important;border-color:#334155!important;}',

      '[data-theme="dark"] .roteiro-sugerido h4,[data-theme="dark"] .roteiro-sugerido strong,',
      '[data-theme="dark"] .timeline-item strong,[data-theme="dark"] .timeline-item h4,',
      '[data-theme="dark"] .day-card strong,[data-theme="dark"] .day-item strong{color:#f8fafc!important;}',
      '[data-theme="dark"] .roteiro-sugerido p,[data-theme="dark"] .timeline-item p,',
      '[data-theme="dark"] .day-card p,[data-theme="dark"] .day-item p{color:#e2e8f0!important;}',

      /* Seções */
      '[data-theme="dark"] section,[data-theme="dark"] main{background:#0b1220!important;color:#f1f5f9!important;}',
      '[data-theme="dark"] footer,[data-theme="dark"] .footer{background:#070b14!important;color:#e2e8f0!important;}',
      '[data-theme="dark"] footer a,[data-theme="dark"] .footer a{color:#f1f5f9!important;}',

      /* Preço e destaques */
      '[data-theme="dark"] .price,[data-theme="dark"] .package-price{color:#fbbf24!important;}',

      /* Inputs */
      '[data-theme="dark"] input,[data-theme="dark"] textarea,[data-theme="dark"] select{',
      'background:#0f172a!important;color:#f1f5f9!important;border-color:#334155!important;}',

      /* ===== NÃO escurecer imagens / vídeos / ícones de foto ===== */
      '[data-theme="dark"] img,[data-theme="dark"] video,[data-theme="dark"] picture,',
      '[data-theme="dark"] .hero img,[data-theme="dark"] .card img,[data-theme="dark"] .package-card img,',
      '[data-theme="dark"] .destino-card img,[data-theme="dark"] .excursao-card img{',
      'filter:none!important;opacity:1!important;mix-blend-mode:normal!important;}',
      '[data-theme="dark"] .card img,[data-theme="dark"] .package-card img{background:transparent!important;}'
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

  /* Corrige caixas brancas do roteiro mesmo sem classe específica */
  function fixWhiteBoxes() {
    if (document.documentElement.getAttribute('data-theme') !== 'dark') return;
    var nodes = document.querySelectorAll('div, article, li, section');
    nodes.forEach(function (el) {
      if (el.id === 'theme-toggle') return;
      if (el.closest('img, picture, video, a.btn, button')) return;
      var st = window.getComputedStyle(el);
      var bg = st.backgroundColor || '';
      // rgb branco / quase branco
      var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return;
      var r = +m[1], g = +m[2], b = +m[3];
      if (r > 240 && g > 240 && b > 240) {
        el.style.setProperty('background-color', '#1e293b', 'important');
        el.style.setProperty('color', '#f1f5f9', 'important');
      }
      var color = st.color || '';
      var mc = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (mc) {
        var cr = +mc[1], cg = +mc[2], cb = +mc[3];
        // texto cinza claro demais / branco apagado sobre fundo claro antigo
        if (cr > 180 && cg > 180 && cb > 180 && r > 240) {
          el.style.setProperty('color', '#f1f5f9', 'important');
        }
      }
    });
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

  // Reaplica quando mudar o tema
  var obs = new MutationObserver(function () {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      setTimeout(fixWhiteBoxes, 50);
    }
  });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
