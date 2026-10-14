/**
 * TOURMIX — aplica datas/preços do Supabase nos elementos do site
 * Uso no HTML:
 *   <span data-pacote="holambra" data-campo="data_texto"></span>
 *   <span data-pacote="holambra" data-campo="preco_texto"></span>
 *   <div data-pacote="holambra" data-campo="inclui"></div>
 */
(function () {
  'use strict';
  var cfg = window.TOURMIX_AUTH || {};
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase) return;

  var sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  var CACHE_KEY = 'tourmix_pacotes_cache_v1';

  function apply(rows) {
    if (!rows || !rows.length) return;
    var map = {};
    rows.forEach(function (r) { map[r.id] = r; });
    window.TOURMIX_PACOTES = map;

    document.querySelectorAll('[data-pacote][data-campo]').forEach(function (el) {
      var id = el.getAttribute('data-pacote');
      var campo = el.getAttribute('data-campo');
      var row = map[id];
      if (!row) return;
      if (row.ativo === false) {
        var card = el.closest('[data-pacote-card]');
        if (card) card.style.display = 'none';
      }
      var val = row[campo];
      if (val != null && val !== '') el.textContent = val;
    });

    // evento para outras páginas (assistente, etc.)
    try {
      window.dispatchEvent(new CustomEvent('tourmix-pacotes-loaded', { detail: map }));
    } catch (e) {}
  }

  // cache rápido
  try {
    var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && cached.rows && cached.ts && Date.now() - cached.ts < 5 * 60 * 1000) {
      apply(cached.rows);
    }
  } catch (e) {}

  sb.from('pacotes').select('*').then(function (res) {
    if (res.error || !res.data) return;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), rows: res.data }));
    } catch (e) {}
    apply(res.data);
  });
})();
