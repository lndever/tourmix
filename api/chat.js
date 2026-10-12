// api/chat.js — TOURMIX Assistente via Groq
// Vercel → Environment Variables → GROQ_API_KEY
// Chave em: https://console.groq.com/keys

const CATALOGO = `
DADOS TOURMIX:
WhatsApp (11) 91484-1404 | PIX/CNPJ 65.063.425/0001-95 | @tourmixbr
Pacotes: Holambra 1 dia R$159,90; Foz/Camboriú/Gramado 12x R$115; Bonito 12x R$167; Caldas 12x R$145;
Santiago Réveillon 10x R$397; Buenos Aires Réveillon 10x R$374.
Não invente preço/data/hotel da TOURMIX. Confirme no WhatsApp se faltar detalhe.
`;

function systemPrompt(perfil) {
  return `Você é o assistente da TOURMIX (Tourmix Br), agência de viagens brasileira.
Fale em português do Brasil, de forma natural, simpática e objetiva (3 a 12 linhas).
Pode responder QUALQUER pergunta: viagem, dicas, curiosidades, conversa casual, etc.
Para PREÇO, DATA, HOTEL ou O QUE ESTÁ INCLUSO da TOURMIX, use APENAS o catálogo abaixo. Não invente.
Se faltar detalhe oficial, diga para confirmar no WhatsApp (11) 91484-1404.
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
      error: "GROQ_API_KEY ausente no Vercel. Crie em https://console.groq.com/keys",
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

    // modelo rápido e com boa cota no free tier da Groq
    const model = "llama-3.3-70b-versatile";

    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 25000);

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
    } finally {
      clearTimeout(timer);
    }

    const data = await r.json();
    if (!r.ok) {
      return res.status(500).json({
        error: (data.error && data.error.message) || ("Erro Groq " + r.status),
        fallback: true
      });
    }

    const text =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content;

    if (!text || !String(text).trim()) {
      return res.status(500).json({ error: "Resposta vazia da Groq", fallback: true });
    }

    return res.status(200).json({ reply: String(text).trim(), model: model });
  } catch (e) {
    const msg = e.name === "AbortError" ? "Timeout na IA" : (e.message || "Falha");
    return res.status(500).json({ error: msg, fallback: true });
  }
}
