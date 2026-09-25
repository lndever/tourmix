/**
 * TOURMIX — tradução completa PT / EN / ES
 * Mobile: botão globo compacto | Desktop: PT EN ES
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

  function setCookie(name, value) {
    var host = window.location.hostname;
    document.cookie = name + '=' + value + '; path=/; max-age=31536000';
    document.cookie = name + '=' + value + '; path=/; domain=' + host + '; max-age=31536000';
  }
  function clearCookie(name) {
    var host = window.location.hostname;
    document.cookie = name + '=; path=/; max-age=0';
    document.cookie = name + '=; path=/; domain=' + host + '; max-age=0';
  }

  function applyLang(next) {
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    if (lang === 'pt') {
      clearCookie('googtrans');
      setCookie('googtrans', '/pt/pt');
    } else {
      setCookie('googtrans', '/pt/' + lang);
    }
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

      /* ===== MOBILE: só o globo, canto inferior esquerdo (acima do tema) ===== */
      '#lang-switcher{position:fixed;z-index:9998;left:16px;bottom:76px;}',
      '#lang-toggle{width:46px;height:46px;border-radius:50%;border:none;',
      'background:#0e7490;color:#fff;font-size:1.2rem;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 8px 22px rgba(0,0,0,.28);}',
      '#lang-menu{display:none;position:absolute;bottom:54px;left:0;',
      'background:rgba(15,23,42,.95);border-radius:14px;padding:6px;',
      'box-shadow:0 10px 28px rgba(0,0,0,.35);min-width:120px;}',
      '#lang-switcher.open #lang-menu{display:block;}',
      '#lang-menu button{display:block;width:100%;border:none;background:transparent;',
      'color:#e2e8f0;font-family:Montserrat,system-ui,sans-serif;font-size:0.8rem;',
      'font-weight:700;text-align:left;padding:0.55rem 0.85rem;border-radius:10px;cursor:pointer;}',
      '#lang-menu button.active{background:#eab308;color:#0f172a;}',
      '#lang-menu button:hover:not(.active){background:rgba(255,255,255,.1);}',

      /* ===== DESKTOP: barra PT EN ES no topo ===== */
      '@media(min-width:900px){',
      '#lang-switcher{left:auto;right:72px;bottom:auto;top:16px;}',
      '#lang-toggle{display:none;}',
      '#lang-menu{display:flex!important;position:static;background:rgba(15,23,42,.9);',
      'border-radius:50px;padding:4px;min-width:0;box-shadow:0 8px 24px rgba(0,0,0,.25);}',
      '#lang-menu button{width:auto;text-align:center;padding:0.38rem 0.7rem;border-radius:50px;font-size:0.72rem;}',
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
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'pt,en,es',
        autoDisplay: false
      }, 'google_translate_element');
    } catch (e) {}
    if (lang !== 'pt') {
      setTimeout(function () {
        var sel = document.querySelector('select.goog-te-combo');
        if (sel) {
          sel.value = lang;
          sel.dispatchEvent(new Event('change'));
        }
      }, 800);
    }
  };

  function loadGoogle() {
    if (document.getElementById('tourmix-gt-script')) return;
    var s = document.createElement('script');
    s.id = 'tourmix-gt-script';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
  }

  if (lang === 'pt') {
    clearCookie('googtrans');
  } else {
    setCookie('googtrans', '/pt/' + lang);
  }

  function boot() {
    injectUI();
    loadGoogle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
