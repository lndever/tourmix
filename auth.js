/**
 * TOURMIX Auth — cliente seguro via Supabase
 * Senhas NÃO ficam no código nem no localStorage.
 * O Supabase guarda hash da senha no servidor e emite sessão JWT.
 */
(function () {
    'use strict';

    var cfg = window.TOURMIX_AUTH || {};
    var client = null;

    function configOk() {
        return cfg.supabaseUrl &&
            cfg.supabaseAnonKey &&
            cfg.supabaseUrl.indexOf('http') === 0 &&
            cfg.supabaseAnonKey.length > 20 &&
            cfg.supabaseUrl.indexOf('COLE_AQUI') === -1;
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
                data: { nome: (nome || '').trim() }
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
            window.location.href = redirectTo || 'login.html';
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

    window.TourmixAuth = {
        configOk: configOk,
        signUp: signUp,
        signIn: signIn,
        signOut: signOut,
        getSession: getSession,
        getUser: getUser,
        requireAuth: requireAuth,
        displayName: displayName
    };
})();
