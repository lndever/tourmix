// ============================================
// CONFIGURAÇÃO DO SUPABASE (TOURMIX)
// ============================================
// 1. Crie conta grátis em: https://supabase.com
// 2. New Project → escolha nome e senha do banco
// 3. Vá em Settings → API
// 4. Copie "Project URL" e "anon public" key
// 5. Cole abaixo (a chave anon é pública por design;
//    a segurança vem das regras do Supabase, não de esconder essa chave)
//
// NUNCA coloque a service_role key aqui (essa sim é secreta).

window.TOURMIX_AUTH = {
    supabaseUrl: 'COLE_AQUI_A_PROJECT_URL',
    supabaseAnonKey: 'COLE_AQUI_A_ANON_KEY'
};
