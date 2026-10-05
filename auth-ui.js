/**
 * TOURMIX — menu de conta no header (estilo CVC / ViajaNet)
 * Inclua nas páginas (depois de auth-config.js e auth.js):
 * <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 * <script src="auth-config.js"></script>
 * <script src="auth.js"></script>
 * <script src="auth-ui.js"></script>
 */
(function () {
  if (window.__tourmixAuthUi) return;
  window.__tourmixAuthUi = true;

  function injectCss() {
    if (document.getElementById('tourmix-auth-ui-css')) return;
    var s = document.createElement('style');
    s.id = 'tourmix-auth-ui-css';
    s.textContent = [
      '.auth-slot{display:flex;align-items:center;margin-left:0.5rem;}',
      '.auth-btn-entrar{display:inline-flex;align-items:center;gap:0.4rem;padding:0.45rem 0.95rem;',
      'border-radius:50px;font-family:inherit;font-size:0.82rem;font-weight:700;',
      'text-decoration:none;background:#eab308;color:#0f172a;border:none;cursor:pointer;',
      'white-space:nowrap;transition:0.15s;}',
      '.auth-btn-entrar:hover{background:#ca8a04;transform:translateY(-1px);}',
      '.auth-user{position:relative;}',
      '.auth-user-btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.3rem 0.55rem 0.3rem 0.3rem;',
      'border-radius:50px;border:1px solid rgba(226,232,240,0.9);background:rgba(255,255,255,0.95);',
      'cursor:pointer;font-family:inherit;max-width:200px;}',
      '.auth-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#0e7490,#0a2e38);',
      'color:#fff;font-size:0.78rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
      '.auth-user-name{font-size:0.8rem;font-weight:600;color:#0f172a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      '.auth-caret{font-size:0.65rem;color:#64748b;margin-right:0.15rem;}',
      '.auth-menu{display:none;position:absolute;right:0;top:calc(100% + 8px);min-width:220px;',
      'background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 16px 40px rgba(15,23,42,0.12);',
      'padding:0.45rem;z-index:200;}',
      '.auth-user.open .auth-menu{display:block;}',
      '.auth-menu a,.auth-menu button{display:flex;align-items:center;gap:0.55rem;width:100%;text-align:left;',
      'padding:0.7rem 0.85rem;border:none;background:transparent;border-radius:10px;font-family:inherit;',
      'font-size:0.85rem;font-weight:600;color:#0f172a;text-decoration:none;cursor:pointer;}',
      '.auth-menu a:hover,.auth-menu button:hover{background:#f0f9ff;color:#0e7490;}',
      '.auth-menu .auth-email{display:block;padding:0.5rem 0.85rem 0.65rem;font-size:0.72rem;font-weight:500;',
      'color:#64748b;border-bottom:1px solid #f1f5f9;margin-bottom:0.25rem;word-break:break-all;}',
      '.auth-menu .auth-sair{color:#b91c1c;}',
      '.auth-menu .auth-sair:hover{background:#fef2f2;color:#b91c1c;}',
      /* header sobre o hero (texto claro) */
      '.header:not(.scrolled) .auth-user-btn{background:rgba(255,255,255,0.95);border-color:rgba(255,255,255,0.5);}',
      '.header:not(.scrolled) .auth-btn-entrar{box-shadow:0 4px 14px rgba(0,0,0,0.15);}',
      /* dark */
      '[data-theme="dark"] .auth-user-btn{background:#1e293b;border-color:#334155;}',
      '[data-theme="dark"] .auth-user-name{color:#f1f5f9;}',
      '[data-theme="dark"] .auth-menu{background:#1e293b;border-color:#334155;}',
      '[data-theme="dark"] .auth-menu a,[data-theme="dark"] .auth-menu button{color:#f1f5f9;}',
      '[data-theme="dark"] .auth-menu a:hover,[data-theme="dark"] .auth-menu button:hover{background:#0f172a;color:#67e8f9;}',
      '[data-theme="dark"] .auth-menu .auth-email{color:#94a3b8;border-bottom-color:#334155;}',
      '@media(max-width:768px){',
      '.auth-user-name{display:none;}',
      '.auth-user-btn{padding:0.25rem;}',
      '.auth-btn-entrar{padding:0.4rem 0.75rem;font-size:0.75rem;}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  function initials(name) {
    var p = (name || 'U').trim().split(/\s+/);
    if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
    return (p[0][0] || 'U').toUpperCase();
  }

  function ensureSlot() {
    var slot = document.getElementById('auth-slot');
    if (slot) return slot;

    // tenta encaixar na nav / header
    var nav = document.querySelector('.nav') || document.querySelector('nav');
    var headerInner = document.querySelector('.header-inner') || document.querySelector('header');
    slot = document.createElement('div');
    slot.id = 'auth-slot';
    slot.className = 'auth-slot';

    if (nav) {
      nav.appendChild(slot);
    } else if (headerInner) {
      headerInner.appendChild(slot);
    } else {
      slot.style.cssText = 'position:fixed;top:14px;right:70px;z-index:9990;';
      document.body.appendChild(slot);
    }
    return slot;
  }

  function renderLoggedOut(slot) {
    slot.innerHTML =
      '<a class="auth-btn-entrar" href="/login">Entrar</a>';
  }

  function renderLoggedIn(slot, user) {
    var name = window.TourmixAuth.displayName(user);
    var email = user.email || '';
    slot.innerHTML =
      '<div class="auth-user" id="auth-user">' +
        '<button type="button" class="auth-user-btn" id="auth-user-btn" aria-haspopup="true" aria-expanded="false">' +
          '<span class="auth-avatar">' + initials(name) + '</span>' +
          '<span class="auth-user-name">' + name.replace(/</g, '&lt;') + '</span>' +
          '<span class="auth-caret">▾</span>' +
        '</button>' +
        '<div class="auth-menu" role="menu">' +
          '<div class="auth-email">' + email.replace(/</g, '&lt;') + '</div>' +
          '<a href="/minha-conta" role="menuitem">👤 Minha conta</a>' +
          '<a href="/descubra-perfil" role="menuitem">✨ Meu perfil de viajante</a>' +
          '<a href="/assistente" role="menuitem">💬 Assistente</a>' +
          '<a href="/#pacotes" role="menuitem">🎒 Ver pacotes</a>' +
          '<button type="button" class="auth-sair" id="auth-sair" role="menuitem">Sair</button>' +
        '</div>' +
      '</div>';

    var wrap = document.getElementById('auth-user');
    var btn = document.getElementById('auth-user-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', wrap.classList.contains('open') ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      wrap.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
    document.getElementById('auth-sair').addEventListener('click', async function () {
      try {
        await window.TourmixAuth.signOut();
      } catch (e) {}
      window.location.href = '/';
    });
  }

  async function boot() {
    injectCss();
    var slot = ensureSlot();

    if (!window.TourmixAuth) {
      renderLoggedOut(slot);
      return;
    }

    if (!window.TourmixAuth.configOk()) {
      // ainda mostra Entrar; login vai avisar se não configurou
      renderLoggedOut(slot);
      return;
    }

    try {
      var user = await window.TourmixAuth.getUser();
      if (user) renderLoggedIn(slot, user);
      else renderLoggedOut(slot);
    } catch (e) {
      renderLoggedOut(slot);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
