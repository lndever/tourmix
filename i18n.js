/**
 * TOURMIX — tradução completa PT / EN / ES
 * Preços (12x, R$) não traduzem.
 * Volta para PT limpa cookies do Google e recarrega a página original.
 * <script src="i18n.js"></script> antes de </body>
 */
(function () {
  if (window.__tourmixI18nFull) return;
  window.__tourmixI18nFull = true;

  var KEY = 'tourmix_lang';
  var lang = 'pt';
  try {
    var s = localStorage.getItem(KEY);
    if (s === 'pt' || s === 'en' || s === 'es') lang = s;
  } catch (e) {}

  /** Limpa TODAS as variações do cookie googtrans (causa do bug de não voltar ao PT) */
  function clearGoogTransCookies() {
    var host = window.location.hostname;
    var parts = host.split('.');
    var domains = ['', host];
    // .tourmix.vercel.app / .vercel.app etc.
    if (parts.length >= 2) {
      domains.push('.' + parts.slice(-2).join('.'));
    }
    if (parts.length >= 3) {
      domains.push('.' + parts.slice(-3).join('.'));
    }
    domains.push('.' + host);

    var names = ['googtrans', 'googtrans'.toUpperCase()];
    names.forEach(function (name) {
      domains.forEach(function (domain) {
        var base = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; max-age=0';
        document.cookie = base;
        if (domain) {
          document.cookie = base + '; domain=' + domain;
        }
      });
      // valores “vazios” que alguns browsers ainda leem
      document.cookie = name + '=/pt/pt; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; max-age=0';
      document.cookie = name + '=; path=/; max-age=0';
    });
  }

  function setGoogTrans(value) {
    // value ex: /pt/en
    document.cookie = 'googtrans=' + value + '; path=/; max-age=31536000';
    var host = window.location.hostname;
    document.cookie = 'googtrans=' + value + '; path=/; domain=' + host + '; max-age=31536000';
    var parts = host.split('.');
    if (parts.length >= 2) {
      document.cookie = 'googtrans=' + value + '; path=/; domain=.' + parts.slice(-2).join('.') + '; max-age=31536000';
    }
  }

  function protectPrices() {
    var selectors = [
      '.price', '.package-price', '.pacote-footer', '.pacote-footer strong',
      '.preco', '.valor', '[class*="price"]', '[class*="preco"]'
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('notranslate');
        el.setAttribute('translate', 'no');
      });
    });

    var re = /(\d+\s*x\b|\bR\$\s*\d|\b12x\b|\b10x\b|\b6x\b|\b4x\b|\b3x\b|\b2x\b)/i;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    var toProtect = [];
    while ((node = walker.nextNode())) {
      var t = node.nodeValue || '';
      if (re.test(t)) {
        var el = node.parentElement;
        if (el && el.closest && !el.closest('script,style')) toProtect.push(el);
      }
    }
    toProtect.forEach(function (el) {
      el.classList.add('notranslate');
      el.setAttribute('translate', 'no');
    });
  }

  /** Remove resíduos visuais do Google Translate */
  function stripGoogleUi() {
    try {
      document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
      document.body.style.top = '0';
      document.body.classList.remove('translated-ltr', 'translated-rtl');
      var banner = document.querySelector('.goog-te-banner-frame');
      if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
      document.querySelectorAll('iframe.skiptranslate, .goog-te-spinner-pos').forEach(function (el) {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    } catch (e) {}
  }

  function applyLang(next) {
    if (next !== 'pt' && next !== 'en' && next !== 'es') return;

    try { localStorage.setItem(KEY, next); } catch (e) {}
    lang = next;

    if (next === 'pt') {
      // reset total → página original em português
      clearGoogTransCookies();
      stripGoogleUi();
      // recarrega URL limpa (sem hash do translate)
      var url = window.location.pathname + window.location.search;
      window.location.replace(url || '/');
      return;
    }

    // EN ou ES
    clearGoogTransCookies();
    setGoogTrans('/pt/' + next);
    window.location.reload();
  }

  function injectUI() {
    if (document.getElementById('lang-switcher')) return;

    var style = document.createElement('style');
    style.id = 'tourmix-i18n-css';
    style.textContent = [
      '.goog-te-banner-frame,.goog-te-balloon-frame,#goog-gt-tt,.goog-tooltip,',
      '.goog-te-spinner-pos,.goog-te-gadget-icon,iframe.skiptranslate,.skiptranslate{display:none!important;}',
      'body{top:0!important;}',
      '#google_translate_element{display:none!important;}',

      '#lang-switcher{position:fixed;z-index:9998;left:16px;bottom:76px;}',
      '#lang-toggle{width:46px;height:46px;border-radius:50%;border:none;',
      'background:#0e7490;color:#fff;font-size:1.2rem;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 8px 22px rgba(0,0,0,.28);}',
      '#lang-menu{display:none;position:absolute;bottom:54px;left:0;',
      'background:rgba(15,23,42,.95);border-radius:14px;padding:6px;',
      'box-shadow:0 10px 28px rgba(0,0,0,.35);min-width:130px;}',
      '#lang-switcher.open #lang-menu{display:block;}',
      '#lang-menu button{display:block;width:100%;border:none;background:transparent;',
      'color:#e2e8f0;font-family:Montserrat,system-ui,sans-serif;font-size:0.8rem;',
      'font-weight:700;text-align:left;padding:0.55rem 0.85rem;border-radius:10px;cursor:pointer;}',
      '#lang-menu button.active{background:#eab308;color:#0f172a;}',
      '#lang-menu button:hover:not(.active){background:rgba(255,255,255,.1);}',

      /* sempre canto inferior esquerdo — não cobre menu nem WhatsApp */
      '#lang-switcher{left:16px!important;bottom:76px!important;right:auto!important;top:auto!important;}',
      '#lang-toggle{display:flex!important;}',
      '@media(min-width:900px){',
      '#lang-switcher{left:16px!important;bottom:76px!important;right:auto!important;top:auto!important;}',
      '#lang-menu{left:0;right:auto;}',
      '}'
    ].join('');
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.id = 'lang-switcher';

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = 'lang-toggle';
    toggle.title = 'Idioma / Language';
    toggle.setAttribute('aria-label', 'Idioma');
    toggle.textContent = '🌐';
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      box.classList.toggle('open');
    });

    var menu = document.createElement('div');
    menu.id = 'lang-menu';
    var labels = { pt: 'Português', en: 'English', es: 'Español' };
    ['pt', 'en', 'es'].forEach(function (code) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-lang', code);
      b.textContent = labels[code];
      if (code === lang) b.classList.add('active');
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        applyLang(code);
      });
      menu.appendChild(b);
    });

    box.appendChild(toggle);
    box.appendChild(menu);
    document.body.appendChild(box);

    document.addEventListener('click', function () {
      box.classList.remove('open');
    });

    if (!document.getElementById('google_translate_element')) {
      var g = document.createElement('div');
      g.id = 'google_translate_element';
      document.body.appendChild(g);
    }
  }

  window.googleTranslateElementInit = function () {
    // Só inicializa se NÃO estiver em português
    if (lang === 'pt') return;
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'en,es',
        autoDisplay: false
      }, 'google_translate_element');
    } catch (e) {}

    setTimeout(function () {
      var sel = document.querySelector('select.goog-te-combo');
      if (sel) {
        sel.value = lang;
        sel.dispatchEvent(new Event('change'));
      }
    }, 600);
  };

  function loadGoogle() {
    // Em PT não carrega o Google → evita conflito e garante original
    if (lang === 'pt') return;
    if (document.getElementById('tourmix-gt-script')) return;
    var s = document.createElement('script');
    s.id = 'tourmix-gt-script';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
  }

  function boot() {
    // Se o usuário escolheu PT, limpa qualquer cookie antigo residual
    if (lang === 'pt') {
      clearGoogTransCookies();
      stripGoogleUi();
    } else {
      setGoogTrans('/pt/' + lang);
    }

    protectPrices();
    injectUI();
    loadGoogle();
    setTimeout(protectPrices, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
