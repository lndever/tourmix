/**
 * TOURMIX — botão flutuante da Assistente + rastreio de perfil
 * Coloque antes de </body> em todas as páginas:
 * <script src="assistente-widget.js"></script>
 */
(function () {
  if (window.__tourmixAssistenteWidget) return;
  window.__tourmixAssistenteWidget = true;

  // Não mostra o botão dentro da própria página do assistente
  var path = (location.pathname || '').toLowerCase();
  if (path.indexOf('assistente') !== -1) return;

  var PERFIL_KEY = 'tourmix_perfil_quiz';
  var SCORES_KEY = 'tourmix_perfil_scores';
  var INTERESSES_KEY = 'tourmix_interesses';
  var HISTORICO_KEY = 'tourmix_historico_nav';

  var PAGE_SIGNALS = {
    '/holambra': { romantico: 3, cultural: 1, tags: ['flores', 'holambra', 'romantico'] },
    '/holambra.html': { romantico: 3, cultural: 1, tags: ['flores', 'holambra', 'romantico'] },
    '/gramado': { romantico: 2, cultural: 2, relax: 1, tags: ['serra', 'gramado', 'romantico'] },
    '/gramado.html': { romantico: 2, cultural: 2, relax: 1, tags: ['serra', 'gramado', 'romantico'] },
    '/bonito': { natureza: 3, tags: ['natureza', 'bonito', 'aventura'] },
    '/bonito.html': { natureza: 3, tags: ['natureza', 'bonito', 'aventura'] },
    '/foz-iguacu': { natureza: 2, cultural: 1, tags: ['natureza', 'foz', 'cataratas'] },
    '/foz-iguacu.html': { natureza: 2, cultural: 1, tags: ['natureza', 'foz', 'cataratas'] },
    '/balneario-camboriu': { praia: 3, tags: ['praia', 'camboriu', 'litoral'] },
    '/balneario-camboriu.html': { praia: 3, tags: ['praia', 'camboriu', 'litoral'] },
    '/caldas-novas': { relax: 3, tags: ['termas', 'caldas', 'relax'] },
    '/caldas-novas.html': { relax: 3, tags: ['termas', 'caldas', 'relax'] },
    '/excursoes': { romantico: 1, tags: ['excursoes'] },
    '/excursoes.html': { romantico: 1, tags: ['excursoes'] },
    '/descubra-perfil': { tags: ['quiz'] },
    '/descubra-perfil.html': { tags: ['quiz'] },
    '/meu-perfil': { tags: ['perfil'] },
    '/meu-perfil.html': { tags: ['perfil'] }
  };

  function loadScores() {
    try { return JSON.parse(localStorage.getItem(SCORES_KEY) || '{}'); }
    catch (e) { return {}; }
  }

  function saveScores(s) {
    localStorage.setItem(SCORES_KEY, JSON.stringify(s));
    var best = null, max = -1;
    Object.keys(s).forEach(function (k) {
      if (s[k] > max) { max = s[k]; best = k; }
    });
    if (best && max > 0) localStorage.setItem(PERFIL_KEY, JSON.stringify(best));
  }

  function addInteresses(tags) {
    var list;
    try { list = JSON.parse(localStorage.getItem(INTERESSES_KEY) || '[]'); }
    catch (e) { list = []; }
    (tags || []).forEach(function (t) {
      if (list.indexOf(t) === -1) list.push(t);
    });
    localStorage.setItem(INTERESSES_KEY, JSON.stringify(list.slice(-40)));
  }

  function trackPage() {
    var p = (location.pathname || '/').toLowerCase();
    var sig = PAGE_SIGNALS[p];
    if (!sig) return;
    var scores = loadScores();
    Object.keys(sig).forEach(function (k) {
      if (k === 'tags') return;
      scores[k] = (scores[k] || 0) + sig[k];
    });
    saveScores(scores);
    if (sig.tags) addInteresses(sig.tags);
    try {
      var hist = JSON.parse(localStorage.getItem(HISTORICO_KEY) || '[]');
      hist.unshift({ path: p, at: Date.now() });
      localStorage.setItem(HISTORICO_KEY, JSON.stringify(hist.slice(0, 30)));
    } catch (e) {}
  }

  try { trackPage(); } catch (e) {}

  // ---- UI: botão flutuante com contorno RGB animado ----
  var css = document.createElement('style');
  css.textContent = [
    '#tourmix-fab-wrap{position:fixed;right:20px;bottom:92px;z-index:99980;',
    'font-family:Montserrat,system-ui,sans-serif}',
    '#tourmix-fab{',
    'position:relative;width:60px;height:60px;border-radius:50%;border:none;',
    'padding:0;cursor:pointer;display:grid;place-items:center;',
    'background:transparent;isolation:isolate;',
    '-webkit-tap-highlight-color:transparent;',
    'transition:transform .22s ease}',
    '#tourmix-fab::before{',
    'content:"";position:absolute;inset:-1.5px;border-radius:50%;z-index:-2;',
    'background:conic-gradient(from var(--tmx-angle,0deg),',
    '#eab308,#22d3ee,#0e7490,#67e8f9,#fbbf24,#0e7490,#eab308);',
    'animation:tmxRgbSpin 3.5s linear infinite}',
    '#tourmix-fab::after{',
    'content:"";position:absolute;inset:1px;border-radius:50%;z-index:-1;',
    'background:rgba(15,23,42,.88);',
    'backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);',
    'border:1px solid rgba(255,255,255,.08);',
    'box-shadow:0 10px 28px rgba(0,0,0,.28)}',
    '#tourmix-fab:hover{transform:scale(1.08)}',
    '#tourmix-fab:hover::before{filter:brightness(1.15)}',
    '#tourmix-fab img{',
    'width:30px;height:30px;object-fit:contain;border-radius:8px;',
    'position:relative;z-index:1;pointer-events:none}',
    '#tourmix-fab .fab-fallback{',
    'position:relative;z-index:1;color:#eab308;font-weight:800;',
    'font-size:14px;letter-spacing:-.5px}',
    '#tourmix-fab-tip{',
    'position:absolute;right:72px;top:50%;transform:translateY(-50%);',
    'background:rgba(15,23,42,.92);color:#fff;font-size:.75rem;font-weight:700;',
    'padding:.45rem .75rem;border-radius:10px;white-space:nowrap;',
    'opacity:0;pointer-events:none;transition:opacity .2s;',
    'border:1px solid rgba(255,255,255,.1);',
    'box-shadow:0 8px 20px rgba(0,0,0,.25)}',
    '#tourmix-fab-wrap:hover #tourmix-fab-tip{opacity:1}',
    '#tourmix-fab-tip::after{',
    'content:"";position:absolute;right:-6px;top:50%;transform:translateY(-50%);',
    'border:6px solid transparent;border-left-color:rgba(15,23,42,.92)}',
    '#tourmix-fab-dot{',
    'position:absolute;top:3px;right:3px;width:11px;height:11px;border-radius:50%;',
    'background:#eab308;border:2px solid rgba(15,23,42,.9);z-index:2;',
    'box-shadow:0 0 0 0 rgba(234,179,8,.5);animation:tourmixPulse 2s infinite}',
    '@property --tmx-angle{syntax:"<angle>";inherits:false;initial-value:0deg}',
    '@keyframes tmxRgbSpin{to{--tmx-angle:360deg}}',
    /* fallback se @property não existir: gira o gradiente via transform no pseudo */
    '@supports not (background: conic-gradient(from var(--a), red, blue)){',
    '#tourmix-fab::before{animation:tmxRgbRotate 3s linear infinite}}',
    '@keyframes tmxRgbRotate{to{transform:rotate(360deg)}}',
    '@keyframes tourmixPulse{',
    '0%{box-shadow:0 0 0 0 rgba(234,179,8,.55)}',
    '70%{box-shadow:0 0 0 10px rgba(234,179,8,0)}',
    '100%{box-shadow:0 0 0 0 rgba(234,179,8,0)}}',
    '@media (max-width:600px){',
    '#tourmix-fab{width:54px;height:54px}',
    '#tourmix-fab img{width:26px;height:26px}',
    '#tourmix-fab-tip{display:none}}',
    '@media (prefers-reduced-motion:reduce){',
    '#tourmix-fab::before{animation:none}',
    '#tourmix-fab-dot{animation:none}}'
  ].join('');
  document.head.appendChild(css);

  var wrap = document.createElement('div');
  wrap.id = 'tourmix-fab-wrap';
  wrap.innerHTML =
    '<div id="tourmix-fab-tip">Assistente TOURMIX</div>' +
    '<button type="button" id="tourmix-fab" aria-label="Abrir Assistente TOURMIX">' +
      '<span id="tourmix-fab-dot" aria-hidden="true"></span>' +
      '<img src="LOGO-05.png" alt="TOURMIX" id="tourmix-fab-img">' +
    '</button>';
  document.body.appendChild(wrap);

  document.getElementById('tourmix-fab').addEventListener('click', function () {
    window.location.href = '/assistente';
  });

  var img = document.getElementById('tourmix-fab-img');
  img.onerror = function () {
    img.style.display = 'none';
    var span = document.createElement('span');
    span.className = 'fab-fallback';
    span.textContent = 'IA';
    document.getElementById('tourmix-fab').appendChild(span);
  };

  // Fallback animação RGB em browsers sem @property
  if (typeof CSS === 'undefined' || !CSS.registerProperty) {
    var fab = document.getElementById('tourmix-fab');
    var angle = 0;
    setInterval(function () {
      angle = (angle + 3) % 360;
      fab.style.setProperty('--tmx-angle', angle + 'deg');
    }, 30);
  }
})();
