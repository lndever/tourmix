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
    if (list.length > 16) list = list.slice(-16);
    localStorage.setItem(INTERESSES_KEY, JSON.stringify(list));
  }

  function trackPage() {
    var p = location.pathname || '/';
    var sig = PAGE_SIGNALS[p] || PAGE_SIGNALS[p.replace(/\/$/, '')];
    if (sig) {
      var scores = loadScores();
      Object.keys(sig).forEach(function (k) {
        if (k === 'tags') return;
        scores[k] = (scores[k] || 0) + sig[k];
      });
      saveScores(scores);
      if (sig.tags) addInteresses(sig.tags);
    }
    try {
      var hist = JSON.parse(localStorage.getItem(HISTORICO_KEY) || '[]');
      hist.push({ path: p, at: Date.now() });
      if (hist.length > 40) hist = hist.slice(-40);
      localStorage.setItem(HISTORICO_KEY, JSON.stringify(hist));
    } catch (e) {}
  }

  trackPage();

  // CSS do botão — acima do WhatsApp
  var css = document.createElement('style');
  css.id = 'tourmix-fab-css';
  css.textContent = [
    '#tourmix-fab-wrap{position:fixed;right:20px;bottom:92px;z-index:9998;font-family:Montserrat,system-ui,sans-serif}',
    '#tourmix-fab{width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;padding:0;',
    'display:flex;align-items:center;justify-content:center;',
    'background:linear-gradient(145deg,#0e7490 0%,#0a2e38 100%);',
    'box-shadow:0 10px 28px rgba(14,116,144,.45);transition:transform .2s,box-shadow .2s;',
    '-webkit-tap-highlight-color:transparent}',
    '#tourmix-fab:hover{transform:scale(1.07);box-shadow:0 14px 32px rgba(14,116,144,.55)}',
    '#tourmix-fab img{width:32px;height:32px;object-fit:contain;border-radius:8px;background:#fff;padding:3px}',
    '#tourmix-fab .fab-fallback{color:#eab308;font-weight:800;font-size:14px;letter-spacing:-.5px}',
    '#tourmix-fab-tip{position:absolute;right:68px;top:50%;transform:translateY(-50%);',
    'background:#0a2e38;color:#fff;font-size:.75rem;font-weight:700;padding:.45rem .7rem;border-radius:10px;',
    'white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s;box-shadow:0 6px 16px rgba(0,0,0,.2)}',
    '#tourmix-fab-wrap:hover #tourmix-fab-tip{opacity:1}',
    '#tourmix-fab-tip::after{content:"";position:absolute;right:-6px;top:50%;transform:translateY(-50%);',
    'border:6px solid transparent;border-left-color:#0a2e38}',
    '#tourmix-fab-dot{position:absolute;top:2px;right:2px;width:12px;height:12px;border-radius:50%;',
    'background:#eab308;border:2px solid #0a2e38;box-shadow:0 0 0 0 rgba(234,179,8,.5);animation:tourmixPulse 2s infinite}',
    '@keyframes tourmixPulse{0%{box-shadow:0 0 0 0 rgba(234,179,8,.55)}70%{box-shadow:0 0 0 10px rgba(234,179,8,0)}100%{box-shadow:0 0 0 0 rgba(234,179,8,0)}}',
    '@media (max-width:600px){#tourmix-fab{width:54px;height:54px}#tourmix-fab img{width:28px;height:28px}#tourmix-fab-tip{display:none}}'
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
})();
