/**
 * TOURMIX — salva resultado do quiz no Supabase
 * Use depois do quiz: TourmixPerfilSync.save(key, scores, { nome, email })
 */
(function () {
  var TITULOS = {
    natureza: 'Explorador da Natureza',
    praia: 'Praiano Urbano',
    romantico: 'Romântico Fotogênico',
    relax: 'Mestre do Descanso',
    cultural: 'Viajante Cultural'
  };

  async function getClient() {
    if (!window.TourmixAuth || !window.TourmixAuth.configOk || !window.TourmixAuth.configOk()) {
      return null;
    }
    var c = window.TourmixAuth.getClient && window.TourmixAuth.getClient();
    if (c) return c;
    if (window.supabase && window.TOURMIX_AUTH) {
      return window.supabase.createClient(window.TOURMIX_AUTH.supabaseUrl, window.TOURMIX_AUTH.supabaseAnonKey);
    }
    return null;
  }

  async function save(perfilKey, scores, extra) {
    extra = extra || {};
    try {
      localStorage.setItem('tourmix_perfil_quiz', JSON.stringify(perfilKey));
      localStorage.setItem('tourmix_perfil_scores', JSON.stringify(scores || {}));
    } catch (e) {}

    var client = await getClient();
    if (!client) return { ok: false, reason: 'no-client' };

    var user = null;
    try {
      if (window.TourmixAuth.getUser) user = await window.TourmixAuth.getUser();
    } catch (e) {}

    var row = {
      user_id: user ? user.id : null,
      nome: extra.nome || (user && window.TourmixAuth.displayName ? window.TourmixAuth.displayName(user) : null) || null,
      email: extra.email || (user && user.email) || null,
      perfil_key: perfilKey,
      perfil_titulo: TITULOS[perfilKey] || perfilKey,
      scores: scores || {},
      updated_at: new Date().toISOString()
    };

    // Se logado, atualiza o registro mais recente desse user; senão só insere
    try {
      if (user && user.id) {
        var existing = await client
          .from('perfis_viajante')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (existing.data && existing.data[0]) {
          var upd = await client.from('perfis_viajante').update(row).eq('id', existing.data[0].id);
          if (upd.error) throw upd.error;
          return { ok: true, mode: 'update' };
        }
      }
      var ins = await client.from('perfis_viajante').insert(row);
      if (ins.error) throw ins.error;
      return { ok: true, mode: 'insert' };
    } catch (err) {
      console.warn('TourmixPerfilSync', err);
      return { ok: false, reason: (err && err.message) || 'error' };
    }
  }

  window.TourmixPerfilSync = { save: save, TITULOS: TITULOS };
})();
