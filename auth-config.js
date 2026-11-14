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
  // COLE AQUI a chave "anon" "public" (começa com eyJ... e no JWT tem "role":"anon")
  supabaseAnonKey: 'COLE_AQUI_A_CHAVE_ANON_PUBLIC',
  /** URL pública do site (sem barra no final) */
  siteUrl: 'https://tourmix.vercel.app'
};
