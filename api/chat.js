// api/chat.js — TOURMIX Assistente via Groq
// Vercel → Environment Variables → GROQ_API_KEY
// Chave: https://console.groq.com/keys

const CATALOGO = `
DADOS TOURMIX:
WhatsApp (11) 91484-1404 | PIX/CNPJ 65.063.425/0001-95 | @tourmixbr
Pacotes: Holambra 1 dia R$159,90; Foz/Camboriú/Gramado 12x R$115; Bonito 12x R$167; Caldas 12x R$145;
Santiago Réveillon 10x R$397; Buenos Aires Réveillon 10x R$374.
Não invente preço/data/hotel da TOURMIX. Confirme no WhatsApp se faltar detalhe.
`;

function systemPrompt(perfil) {
  return `Você é o assistente da TOURMIX (Tourmix Br), agência de viagens brasileira.
Fale em português do Brasil, natural e simpático (3 a 12 linhas).
Pode responder QUALQUER pergunta: viagem, dicas, curiosidades, conversa casual.
Para PREÇO, DATA, HOTEL ou inclusões da TOURMIX use APENAS o catálogo. Não invente.
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

    // tenta vários modelos (free tier varia por conta)
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
