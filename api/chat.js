// api/chat.js — TOURMIX Assistente via Groq
// Vercel → Environment Variables → GROQ_API_KEY
// Chave: https://console.groq.com/keys

const CATALOGO = `
CATÁLOGO OFICIAL TOURMIX (use estes dados para preço/data/hotel — NÃO invente):

EMPRESA
- WhatsApp: (11) 91484-1404 — https://wa.me/5511914841404
- Instagram: @tourmixbr
- CNPJ/CADASTUR / PIX: 65.063.425/0001-95
- Atendimento: seg–sex 9h–18h

PACOTES E EXCURSÕES
1) Holambra — Excursão 1 dia — 25/out (domingo) — R$ 159,90 à vista ou 2x R$ 80 PIX (reserva 30%) — micro-ônibus, guia, seguro, kit — /holambra
2) Foz do Iguaçu — 4 noites — a partir de 12x R$ 115 · 3% off à vista — Hotel San Juan (café), aéreo SP, transfer, seguro — taxas de embarque não inclusas — /foz-iguacu
3) Balneário Camboriú — 4 noites — a partir de 12x R$ 115 · 3% off à vista — Hotel Rosenbrock (café), aéreo SP, transfer, seguro — /balneario-camboriu
4) Gramado — 4 noites — a partir de 12x R$ 115 · 3% off à vista — Life Hotel Infinity (café), aéreo SP, transfer, seguro — /gramado
5) Bonito — 5 noites — a partir de 12x R$ 167 · 3% off à vista — Bonito Ecotel (café), aéreo SP, transfer, seguro — /bonito
6) Caldas Novas — 5 noites — a partir de 12x R$ 145 · 3% off à vista — Resort (café e jantar), aéreo SP, transfer, seguro — /caldas-novas
7) Santiago do Chile — RÉVEILLON 2026/2027 — 4 noites — saída 30/DEZ de São Paulo — a partir de 10x R$ 397 /pessoa · 3% off à vista — Hotel Panamericano (café da manhã), aéreo SP, transfer, city tour, seguro viagem — taxas de embarque não inclusas — página /santiago-chile
8) Buenos Aires — RÉVEILLON 2026/2027 — 4 noites — saída 30/DEZ de São Paulo — a partir de 10x R$ 374 /pessoa · 3% off à vista — Hotel El Conquistador (café da manhã), aéreo SP, transfer, city tour, seguro viagem — taxas de embarque não inclusas — página /buenos-aires

Quando falarem de Chile, Santiago, Réveillon no Chile → ofereça o pacote Santiago do Chile com link /santiago-chile.
Quando falarem de Argentina, Buenos Aires, Réveillon na Argentina → ofereça Buenos Aires com link /buenos-aires.
Quando falarem de Réveillon / Ano Novo / 31 de dezembro no exterior → mencione OS DOIS (Santiago e Buenos Aires) com preços.
`;

function systemPrompt(perfil) {
  return `Você é o assistente da TOURMIX (Tourmix Br), agência de viagens brasileira.
Fale em português do Brasil, natural e simpático (3 a 12 linhas).
Pode responder QUALQUER pergunta: viagem, dicas, curiosidades, conversa.
Para PREÇO, DATA, HOTEL ou inclusões da TOURMIX use APENAS o catálogo. Não invente.
Se pedirem Santiago, Chile, Buenos Aires, Argentina ou Réveillon, use os pacotes 7 e 8 do catálogo (eles EXISTEM no site).
Se faltar detalhe, indique WhatsApp (11) 91484-1404.
Perfil do usuário: ${perfil || "não definido"}
${CATALOGO}`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, msg: "API TOURMIX (Groq) no ar. Use POST com { message }." });
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: "GROQ_API_KEY ausente no Vercel",
      fallback: true
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const message = String(body.message || "").slice(0, 3000);
    const perfil = String(body.perfil || "").slice(0, 500);
    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];

    if (!message.trim()) return res.status(400).json({ error: "Mensagem vazia" });

    const messages = [{ role: "system", content: systemPrompt(perfil) }];
    history.forEach(function (h) {
      if (!h || !h.text) return;
      messages.push({
        role: h.role === "user" ? "user" : "assistant",
        content: String(h.text).slice(0, 2000)
      });
    });
    messages.push({ role: "user", content: message });

    const models = [
      "llama-3.1-8b-instant",
      "openai/gpt-oss-20b",
      "llama-3.3-70b-versatile",
      "meta-llama/llama-4-scout-17b-16e-instruct"
    ];

    let lastError = null;

    for (const model of models) {
      const controller = new AbortController();
      const timer = setTimeout(function () { controller.abort(); }, 20000);
      let r;
      try {
        r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + key
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.8,
            max_tokens: 900
          })
        });
      } catch (e) {
        clearTimeout(timer);
        lastError = e.name === "AbortError" ? "Timeout" : (e.message || "Falha de rede");
        continue;
      }
      clearTimeout(timer);

      const data = await r.json();
      if (!r.ok) {
        lastError = (data.error && data.error.message) || ("Erro " + r.status + " em " + model);
        continue;
      }

      const text =
        data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content;

      if (text && String(text).trim()) {
        return res.status(200).json({ reply: String(text).trim(), model: model });
      }
      lastError = "Resposta vazia em " + model;
    }

    return res.status(500).json({
      error: lastError || "Nenhum modelo Groq disponível",
      fallback: true
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Falha", fallback: true });
  }
}
