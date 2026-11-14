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
        // fallback: domínio atual (produção) — nunca força localhost
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
        client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                flowType: 'pkce',
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

    /** Processa tokens do link de confirmação (hash ou query) */
    async function handleEmailConfirmation() {
        var sb = getClient();
        if (!sb) return { ok: false, error: 'Auth não configurado' };

        // 1) query ?code= (PKCE)
        try {
            var params = new URLSearchParams(window.location.search || '');
            var code = params.get('code');
            if (code) {
                var res = await sb.auth.exchangeCodeForSession(code);
                if (res.error) return { ok: false, error: res.error.message };
                return { ok: true, session: res.data.session, user: res.data.user || (res.data.session && res.data.session.user) };
            }
        } catch (e) {
            return { ok: false, error: (e && e.message) || 'Falha ao validar código' };
        }

        // 2) hash #access_token=...&type=signup (fluxo antigo)
        try {
            var hash = (window.location.hash || '').replace(/^#/, '');
            if (hash && hash.indexOf('access_token') !== -1) {
                var hp = new URLSearchParams(hash);
                var access_token = hp.get('access_token');
                var refresh_token = hp.get('refresh_token');
                if (access_token && refresh_token) {
                    var set = await sb.auth.setSession({ access_token: access_token, refresh_token: refresh_token });
                    if (set.error) return { ok: false, error: set.error.message };
                    return { ok: true, session: set.data.session, user: set.data.user || (set.data.session && set.data.session.user) };
                }
            }
        } catch (e2) {
            return { ok: false, error: (e2 && e2.message) || 'Falha ao ler token' };
        }

        // 3) já logado
        var session = await getSession();
        if (session && session.user) {
            return { ok: true, session: session, user: session.user, already: true };
        }
        return { ok: false, error: 'Link inválido ou expirado. Solicite um novo e-mail de confirmação.' };
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
