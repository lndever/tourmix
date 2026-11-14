/**
 * TOURMIX Auth — cliente seguro via Supabase
 * Senhas NÃO ficam no código nem no localStorage.
 * O Supabase guarda hash da senha no servidor e emite sessão JWT.
 */
(function () {
    'use strict';

    var cfg = window.TOURMIX_AUTH || {};
    var client = null;

    function siteUrl() {
        if (cfg.siteUrl && String(cfg.siteUrl).indexOf('http') === 0) {
            return String(cfg.siteUrl).replace(/\/$/, '');
        }
        try {
            if (location.hostname && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
                return location.origin;
            }
        } catch (e) {}
        return 'https://tourmix.vercel.app';
    }

    function confirmRedirectUrl() {
        return siteUrl() + '/confirmar-email';
    }

    function configOk() {
        return cfg.supabaseUrl &&
            cfg.supabaseAnonKey &&
            cfg.supabaseUrl.indexOf('http') === 0 &&
            cfg.supabaseAnonKey.length > 20 &&
            cfg.supabaseUrl.indexOf('COLE_AQUI') === -1 &&
            String(cfg.supabaseAnonKey).indexOf('COLE_AQUI') === -1;
    }

    function getClient() {
        if (client) return client;
        if (!configOk()) return null;
        if (typeof window.supabase === 'undefined') return null;
        // NÃO usar flowType PKCE no site estático:
        // o link do e-mail abre em outro aparelho e o code_verifier some.
        client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storage: window.localStorage
            }
        });
        return client;
    }

    async function signUp(email, password, nome) {
        var sb = getClient();
        if (!sb) throw new Error('Auth não configurado. Edite auth-config.js com a URL e a chave do Supabase.');
        var { data, error } = await sb.auth.signUp({
            email: email.trim().toLowerCase(),
            password: password,
            options: {
                data: { nome: (nome || '').trim() },
                emailRedirectTo: confirmRedirectUrl()
            }
        });
        if (error) throw error;
        return data;
    }

    async function signIn(email, password) {
        var sb = getClient();
        if (!sb) throw new Error('Auth não configurado. Edite auth-config.js com a URL e a chave do Supabase.');
        var { data, error } = await sb.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: password
        });
        if (error) throw error;
        return data;
    }

    async function signOut() {
        var sb = getClient();
        if (!sb) return;
        await sb.auth.signOut();
    }

    async function getSession() {
        var sb = getClient();
        if (!sb) return null;
        var { data, error } = await sb.auth.getSession();
        if (error) return null;
        return data.session;
    }

    async function getUser() {
        var session = await getSession();
        return session ? session.user : null;
    }

    async function requireAuth(redirectTo) {
        var user = await getUser();
        if (!user) {
            window.location.href = redirectTo || '/login';
            return null;
        }
        return user;
    }

    function displayName(user) {
        if (!user) return 'Usuário';
        if (user.user_metadata && user.user_metadata.nome) return user.user_metadata.nome;
        if (user.email) return user.email.split('@')[0];
        return 'Usuário';
    }

    /**
     * Processa o link de confirmação de e-mail.
     * Suporta:
     * - ?token_hash=...&type=signup|email (recomendado, funciona em qualquer aparelho)
     * - #access_token=...&refresh_token=... (fluxo implícito)
     * - ?code=... (PKCE — só funciona no mesmo navegador do cadastro)
     */
    async function handleEmailConfirmation() {
        var sb = getClient();
        if (!sb) return { ok: false, error: 'Auth não configurado' };

        var search = new URLSearchParams(window.location.search || '');
        var hashRaw = (window.location.hash || '').replace(/^#/, '');
        var hash = hashRaw ? new URLSearchParams(hashRaw) : null;

        // 1) token_hash + type (melhor para e-mail em outro celular)
        var token_hash = search.get('token_hash') || (hash && hash.get('token_hash'));
        var type = search.get('type') || (hash && hash.get('type')) || 'signup';
        if (token_hash) {
            try {
                var verified = await sb.auth.verifyOtp({
                    token_hash: token_hash,
                    type: type
                });
                if (verified.error) {
                    return { ok: false, error: friendlyError(verified.error.message) };
                }
                return {
                    ok: true,
                    session: verified.data.session,
                    user: verified.data.user || (verified.data.session && verified.data.session.user)
                };
            } catch (e) {
                return { ok: false, error: friendlyError((e && e.message) || 'Falha ao validar e-mail') };
            }
        }

        // 2) tokens no hash (implicit)
        var access_token = hash && hash.get('access_token');
        var refresh_token = hash && hash.get('refresh_token');
        if (access_token && refresh_token) {
            try {
                var set = await sb.auth.setSession({
                    access_token: access_token,
                    refresh_token: refresh_token
                });
                if (set.error) return { ok: false, error: friendlyError(set.error.message) };
                return {
                    ok: true,
                    session: set.data.session,
                    user: set.data.user || (set.data.session && set.data.session.user)
                };
            } catch (e2) {
                return { ok: false, error: friendlyError((e2 && e2.message) || 'Falha ao ativar sessão') };
            }
        }

        // 3) PKCE code (só mesmo navegador)
        var code = search.get('code');
        if (code) {
            try {
                var res = await sb.auth.exchangeCodeForSession(code);
                if (res.error) {
                    return { ok: false, error: friendlyError(res.error.message) };
                }
                return {
                    ok: true,
                    session: res.data.session,
                    user: res.data.user || (res.data.session && res.data.session.user)
                };
            } catch (e3) {
                return { ok: false, error: friendlyError((e3 && e3.message) || 'Falha no código PKCE') };
            }
        }

        // 4) detectSessionInUrl / já logado
        try {
            // dá um tempo para o supabase-js processar a URL
            await new Promise(function (r) { setTimeout(r, 150); });
            var session = await getSession();
            if (session && session.user) {
                return { ok: true, session: session, user: session.user, already: true };
            }
        } catch (e4) {}

        return {
            ok: false,
            error: 'Link inválido ou expirado. Abra o e-mail mais recente de confirmação ou faça login se a conta já estiver ativa.'
        };
    }

    function friendlyError(msg) {
        var t = String(msg || '');
        if (/PKCE code verifier/i.test(t)) {
            return 'Este link precisa ser aberto no mesmo navegador em que a conta foi criada, ou use o e-mail de confirmação mais recente. Se a conta já foi confirmada, vá em Entrar.';
        }
        if (/expired|otp_expired|token has expired/i.test(t)) {
            return 'O link expirou. Crie a conta de novo ou peça um novo e-mail de confirmação.';
        }
        if (/invalid|not found/i.test(t)) {
            return 'Link inválido. Use o botão mais recente do e-mail da TOURMIX.';
        }
        return t;
    }

    window.TourmixAuth = {
        configOk: configOk,
        getClient: getClient,
        siteUrl: siteUrl,
        confirmRedirectUrl: confirmRedirectUrl,
        signUp: signUp,
        signIn: signIn,
        signOut: signOut,
        getSession: getSession,
        getUser: getUser,
        requireAuth: requireAuth,
        displayName: displayName,
        handleEmailConfirmation: handleEmailConfirmation
    };
})();
