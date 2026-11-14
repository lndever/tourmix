/**
 * TOURMIX — Configuração Supabase (apenas chave ANON)
 *
 * 1. https://supabase.com → seu projeto
 * 2. Settings → API
 * 3. Project URL  → supabaseUrl
 * 4. anon public  → supabaseAnonKey  (NÃO use service_role)
 *
 * A service_role NUNCA pode ficar no site (é secreta e quebra o login seguro).
 */
window.TOURMIX_AUTH = {
  supabaseUrl: 'https://hzxkugznxopvtazmuypo.supabase.co',
  supabaseAnonKey: 'sb_publishable_F-bVAnC9WXSPbZADpyFm6A_mnHVN8Bc',
  siteUrl: 'https://tourmix.vercel.app'
};
