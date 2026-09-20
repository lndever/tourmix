/**
 * TOURMIX — botão flutuante do Assistente
 * Cole antes de </body> em qualquer página:
 * <script src="assistente-widget.js"></script>
 */
(function () {
    if (window.__tourmixAssistenteWidget) return;
    window.__tourmixAssistenteWidget = true;

    // Não mostra na própria página do assistente
    var path = (window.location.pathname || '').toLowerCase();
    if (path.indexOf('assistente') !== -1) return;

    var css = document.createElement('style');
    css.textContent = [
        '#tourmix-fab-wrap{position:fixed;right:18px;bottom:90px;z-index:9998;font-family:Montserrat,system-ui,sans-serif}',
        '#tourmix-fab{width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;padding:0;',
        'background:linear-gradient(145deg,#0e7490,#0a2e38);box-shadow:0 8px 24px rgba(14,116,144,.35);',
        'display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s}',
        '#tourmix-fab:hover{transform:scale(1.06);box-shadow:0 12px 28px rgba(14,116,144,.45)}',
        '#tourmix-fab img{width:34px;height:34px;object-fit:contain;border-radius:8px;background:#fff;padding:3px}',
        '#tourmix-fab .fab-fallback{color:#eab308;font-weight:800;font-size:13px;letter-spacing:-.5px;line-height:1}',
        '#tourmix-fab-tip{position:absolute;right:70px;top:50%;transform:translateY(-50%);',
        'background:#0a2e38;color:#fff;font-size:12px;font-weight:600;padding:8px 12px;border-radius:10px;',
        'white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s;box-shadow:0 4px 14px rgba(0,0,0,.15)}',
        '#tourmix-fab-wrap:hover #tourmix-fab-tip{opacity:1}',
        '#tourmix-fab-tip::after{content:"";position:absolute;right:-6px;top:50%;transform:translateY(-50%);',
        'border:6px solid transparent;border-left-color:#0a2e38}',
        '@media (max-width:600px){#tourmix-fab{width:54px;height:54px}#tourmix-fab img{width:30px;height:30px}#tourmix-fab-tip{display:none}}'
    ].join('');
    document.head.appendChild(css);

    var wrap = document.createElement('div');
    wrap.id = 'tourmix-fab-wrap';
    wrap.innerHTML =
        '<div id="tourmix-fab-tip">Assistente TOURMIX</div>' +
        '<button type="button" id="tourmix-fab" aria-label="Abrir Assistente TOURMIX">' +
        '<img src="LOGO-05.png" alt="TOURMIX" id="tourmix-fab-img">' +
        '</button>';

    function go() {
        window.location.href = '/assistente';
    }

    document.body.appendChild(wrap);
    document.getElementById('tourmix-fab').addEventListener('click', go);

    var img = document.getElementById('tourmix-fab-img');
    img.onerror = function () {
        img.style.display = 'none';
        var span = document.createElement('span');
        span.className = 'fab-fallback';
        span.innerHTML = 'T<span style="color:#fff">M</span>';
        document.getElementById('tourmix-fab').appendChild(span);
    };
})();
