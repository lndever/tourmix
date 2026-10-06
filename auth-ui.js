/**
 * TOURMIX — menu de conta no header
 * Mobile: botão fora da nav + menu clicável (acima do fundo)
 */
(function () {
  if (window.__tourmixAuthUi) return;
  window.__tourmixAuthUi = true;

  function injectCss() {
    if (document.getElementById('tourmix-auth-ui-css')) return;
    var s = document.createElement('style');
    s.id = 'tourmix-auth-ui-css';
    s.textContent = [
      '.header,.header-inner,.header .container{overflow:visible!important;}',
      /* quando o menu abre, o header fica ACIMA do fundo escuro */
      'body.auth-menu-open .header{z-index:1300!important;}',
      '.auth-slot{display:flex;align-items:center;margin-left:0.55rem;flex-shrink:0;position:relative;z-index:1100;}',
      '.auth-btn-entrar{display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;',
      'padding:0.5rem 1rem;min-height:40px;border-radius:50px;font-family:inherit;font-size:0.82rem;',
      'font-weight:700;text-decoration:none;background:#eab308;color:#0f172a;border:none;cursor:pointer;',
      'white-space:nowrap;-webkit-tap-highlight-color:transparent;}',
      '.auth-user{position:relative;}',
      '.auth-user-btn{display:inline-flex;align-items:center;gap:0.45rem;padding:0.28rem 0.55rem 0.28rem 0.28rem;',
      'min-height:40px;min-width:40px;border-radius:50px;border:1px solid rgba(226,232,240,.9);',
      'background:rgba(255,255,255,.97);cursor:pointer;font-family:inherit;',
      '-webkit-tap-highlight-color:transparent;touch-action:manipulation;}',
      '.auth-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#0e7490,#0a2e38);',
      'color:#fff;font-size:0.78rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;pointer-events:none;}',
      '.auth-user-name{font-size:0.8rem;font-weight:600;color:#0f172a;max-width:110px;overflow:hidden;',
      'text-overflow:ellipsis;white-space:nowrap;pointer-events:none;}',
      '.auth-caret{font-size:0.65rem;color:#64748b;pointer-events:none;}',
      '.auth-menu{display:none;position:absolute;right:0;top:calc(100% + 8px);min-width:230px;',
      'background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 16px 40px rgba(15,23,42,.16);',
      'padding:0.45rem;z-index:1400;}',
      '.auth-user.open .auth-menu{display:block;}',
      /* fundo abaixo do menu */
      '.auth-backdrop{display:none;position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:1250;}',
      'body.auth-menu-open .auth-backdrop{display:block;}',
      '.auth-menu a,.auth-menu button{display:flex;align-items:center;gap:0.55rem;width:100%;text-align:left;',
      'padding:0.85rem 0.9rem;min-height:44px;border:none;background:transparent;border-radius:10px;',
      'font-family:inherit;font-size:0.9rem;font-weight:600;color:#0f172a;text-decoration:none;cursor:pointer;',
      'position:relative;z-index:1401;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}',
      '.auth-menu a:active,.auth-menu button:active{background:#e0f2fe;}',
      '.auth-menu a:hover,.auth-menu button:hover{background:#f0f9ff;color:#0e7490;}',
      '.auth-menu .auth-email{display:block;padding:0.55rem 0.9rem 0.7rem;font-size:0.72rem;font-weight:500;',
      'color:#64748b;border-bottom:1px solid #f1f5f9;margin-bottom:0.25rem;word-break:break-all;}',
      '.auth-menu .auth-sair{color:#b91c1c;}',
      '.header:not(.scrolled) .auth-user-btn{background:rgba(255,255,255,.97);}',
      '[data-theme="dark"] .auth-user-btn{background:#1e293b;border-color:#334155;}',
      '[data-theme="dark"] .auth-user-name{color:#f1f5f9;}',
      '[data-theme="dark"] .auth-menu{background:#1e293b;border-color:#334155;}',
      '[data-theme="dark"] .auth-menu a,[data-theme="dark"] .auth-menu button{color:#f1f5f9;}',
      '[data-theme="dark"] .auth-menu a:hover,[data-theme="dark"] .auth-menu button:hover{background:#0f172a;color:#67e8f9;}',
      '[data-theme="dark"] .auth-menu .auth-email{color:#94a3b8;border-bottom-color:#334155;}',
      '[data-theme="dark"] .auth-backdrop{background:rgba(0,0,0,.5);}',
      '@media(max-width:768px){',
      '.auth-user-name{display:none;}',
      '.auth-caret{display:none;}',
      '.auth-user-btn{padding:0.2rem;border-radius:50%;}',
      '.auth-btn-entrar{padding:0.45rem 0.8rem;font-size:0.75rem;min-height:38px;}',
      /* menu fixo no body visualmente — acima de tudo */
      '.auth-menu{position:fixed!important;top:62px!important;right:10px!important;left:10px!important;',
      'min-width:0!important;width:auto!important;z-index:1400!important;}',
      '.nav{max-width:calc(100% - 120px)!important;}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  function initials(name) {
    var p = (name || 'U').trim().split(/\s+/);
    if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
    return (p[0][0] || 'U').toUpperCase();
  }

  function ensureBackdrop() {
    var el = document.getElementById('auth-backdrop');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'auth-backdrop';
    el.className = 'auth-backdrop';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
    return el;
  }

  function closeMenu() {
    var wrap = document.getElementById('auth-user');
    var btn = document.getElementById('auth-user-btn');
    if (wrap) wrap.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('auth-menu-open');
  }

  function openMenu() {
    var wrap = document.getElementById('auth-user');
    var btn = document.getElementById('auth-user-btn');
    if (wrap) wrap.classList.add('open');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('auth-menu-open');
    ensureBackdrop();
  }

  function toggleMenu(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var wrap = document.getElementById('auth-user');
    if (!wrap) return;
    if (wrap.classList.contains('open')) closeMenu();
    else openMenu();
  }

  function ensureSlot() {
    var slot = document.getElementById('auth-slot');
    var headerInner = document.querySelector('.header-inner') || document.querySelector('header');

    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'auth-slot';
      slot.className = 'auth-slot';
    }

    if (headerInner) {
      if (slot.parentElement !== headerInner) headerInner.appendChild(slot);
    } else if (!slot.parentElement) {
      slot.style.cssText = 'position:fixed;top:12px;right:12px;z-index:1100;';
      document.body.appendChild(slot);
    }
    return slot;
  }

  function renderLoggedOut(slot) {
    slot.innerHTML = '<a class="auth-btn-entrar" href="/login">Entrar</a>';
  }

  function renderLoggedIn(slot, user) {
    var name = window.TourmixAuth.displayName(user);
    var email = user.email || '';
    slot.innerHTML =
      '<div class="auth-user" id="auth-user">' +
        '<button type="button" class="auth-user-btn" id="auth-user-btn" aria-haspopup="true" aria-expanded="false" aria-label="Abrir menu da conta">' +
          '<span class="auth-avatar">' + initials(name) + '</span>' +
          '<span class="auth-user-name">' + name.replace(/</g, '&lt;') + '</span>' +
          '<span class="auth-caret">▾</span>' +
        '</button>' +
        '<div class="auth-menu" role="menu" id="auth-menu">' +
          '<div class="auth-email">' + email.replace(/</g, '&lt;') + '</div>' +
          '<a href="/minha-conta" role="menuitem" class="auth-link">Minha conta</a>' +
          '<a href="/meu-perfil" role="menuitem" class="auth-link">Meu perfil de viajante</a>' +
          '<a href="/assistente" role="menuitem" class="auth-link">Assistente</a>' +
          '<a href="/#pacotes" role="menuitem" class="auth-link">Ver pacotes</a>' +
          '<button type="button" class="auth-sair" id="auth-sair" role="menuitem">Sair</button>' +
        '</div>' +
      '</div>';

    ensureBackdrop();
    var btn = document.getElementById('auth-user-btn');
    var menu = document.getElementById('auth-menu');

    btn.addEventListener('click', toggleMenu);

    // links navegam de verdade (não bloquear)
    menu.querySelectorAll('a.auth-link').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.stopPropagation();
        // deixa o navegador seguir o href
        closeMenu();
      });
    });

    document.getElementById('auth-sair').addEventListener('click', async function (e) {
      e.preventDefault();
      e.stopPropagation();
      try { await window.TourmixAuth.signOut(); } catch (err) {}
      window.location.href = '/';
    });
  }

  async function boot() {
    injectCss();
    var slot = ensureSlot();

    if (!window.TourmixAuth || !window.TourmixAuth.configOk) {
      renderLoggedOut(slot);
      return;
    }
    if (!window.TourmixAuth.configOk()) {
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
