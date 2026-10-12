// TOURMIX — Assistente aberto (Vercel + Gemini)
// Vercel → Settings → Environment Variables → GEMINI_API_KEY

const CATALOGO = `
DADOS OFICIAIS TOURMIX (use para preços, datas, hotéis e inclusões — NÃO invente estes números):

EMPRESA
- TOURMIX / Tourmix Br — Viagens e Experiências
- WhatsApp: (11) 91484-1404 — https://wa.me/5511914841404
- Instagram: @tourmixbr
- CNPJ/CADASTUR: 65.063.425/0001-95
- PIX: 65.063.425/0001-95
- Atendimento: seg–sex 9h–18h

PACOTES / EXCURSÕES
1) Holambra — 1 dia — 25/out — R$ 159,90 à vista ou 2x R$ 80 PIX — micro-ônibus, guia, seguro, kit — /holambra
2) Foz do Iguaçu — 4 noites — a partir de 12x R$ 115 — Hotel San Juan (café), aéreo SP, transfer, seguro — /foz-iguacu
3) Balneário Camboriú — 4 noites — a partir de 12x R$ 115 — Hotel Rosenbrock (café), aéreo SP, transfer, seguro — /balneario-camboriu
4) Gramado — 4 noites — a partir de 12x R$ 115 — Life Hotel Infinity (café), aéreo SP, transfer, seguro — /gramado
5) Bonito — 5 noites — a partir de 12x R$ 167 — Bonito Ecotel (café), aéreo SP, transfer, seguro — /bonito
6) Caldas Novas — 5 noites — a partir de 12x R$ 145 — Resort (café e jantar), aéreo SP, transfer, seguro — /caldas-novas
7) Santiago do Chile — Réveillon 2026/2027 — 4 noites — saída 30/DEZ — 10x R$ 397 — Hotel Panamericano, city tour, transfer, seguro — /santiago-chile
8) Buenos Aires — Réveillon 2026/2027 — 4 noites — saída 30/DEZ — 10x R$ 374 — Hotel El Conquistador, city tour, transfer, seguro — /buenos-aires

Obs. pacotes aéreos: 3% off à vista quando promoção válida; taxas de embarque em geral não inclusas; valores por pessoa em apto. duplo, sujeitos a reajuste.
`;

function buildSystem(perfil) {
  return `Você é o assistente da TOURMIX (Tourmix Br), agência de viagens brasileira.
Fale em português do Brasil, de forma natural, simpática e conversacional — como um consultor humano no chat (nível Gemini/ChatGPT).

PERFIL DO USUÁRIO (se houver):
${perfil && String(perfil).trim() ? perfil : 'ainda não definido'}

${CATALOGO}

COMO RESPONDER (importante):
1) Você PODE responder perguntas gerais: viagem, dicas, clima, documentos, o que levar na mala, destinos do mundo, curiosidades, conversa casual ("oi", "tudo bem", piadas leves, etc.).
2) Não fique preso só ao catálogo. Se a pessoa perguntar algo amplo, responda de forma útil e completa.
3) Quando falar de PREÇO, DATA, HOTEL ou O QUE ESTÁ INCLUSO da TOURMIX, use APENAS o catálogo acima. Não invente valor ou data de pacote TOURMIX.
4) Se não souber um detalhe oficial da TOURMIX, diga que confirma no WhatsApp (11) 91484-1404.
5) Se pedirem indicação, pode sugerir destinos do catálogo e também ideias gerais de viagem, deixando claro o que é pacote TOURMIX e o que é só dica.
6) Respostas claras, com quebras de linha. Emojis com moderação. Evite textão; 4 a 15 linhas costuma bastar.
7) Não peça senha, cartão ou dados sensíveis. Não fale mal de concorrentes.
8) Pode comparar destinos, explicar visto/passaporte em linhas gerais, e ajudar a pensar roteiro — sempre com o cuidado de não inventar preço TOURMIX.
9) Se a pergunta for totalmente fora de viagem, responda educadamente de forma breve e, se fizer sentido, ofereça ajuda com viagens depois.
`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY não configurada no Vercel.',
      fallback: true
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const message = (body.message || '').toString().slice(0, 3000);
    const perfil = (body.perfil || '').toString().slice(0, 500);
    const history = Array.isArray(body.history) ? body.history.slice(-14) : [];

    if (!message.trim()) return res.status(400).json({ error: 'Mensagem vazia' });

    const contents = [];
    history.forEach(function (h) {
      if (!h || !h.text) return;
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(h.text).slice(0, 2000) }]
      });
    });
    contents.push({ role: 'user', parts: [{ text: message }] });

    const models = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest'
    ];

    let lastError = null;
    for (const model of models) {
      const url =
        'https://generativelanguage.googleapis.com/v1beta/models/' +
        model +
        ':generateContent?key=' +
        encodeURIComponent(key);

      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSystem(perfil) }] },
          contents: contents,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 1200
          }
        })
      });

      const data = await r.json();
      if (!r.ok) {
        lastError = (data.error && data.error.message) || ('Erro ' + r.status);
        continue;
      }

      const text =
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('');

      if (text && text.trim()) {
        return res.status(200).json({ reply: text, model: model });
      }
      lastError = 'Resposta vazia';
    }

    return res.status(500).json({
      error: lastError || 'Falha na IA',
      fallback: true
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Falha interna', fallback: true });
  }
};
