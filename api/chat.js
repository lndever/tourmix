// api/chat.js — TOURMIX Assistente (Gemini)

const CATALOGO = `
DADOS TOURMIX:
WhatsApp (11) 91484-1404 | PIX/CNPJ 65.063.425/0001-95 | @tourmixbr
Pacotes: Holambra 1 dia R$159,90; Foz/Camboriú/Gramado 12x R$115; Bonito 12x R$167; Caldas 12x R$145;
Santiago Réveillon 10x R$397; Buenos Aires Réveillon 10x R$374.
Não invente preço/data/hotel da TOURMIX. Confirme no WhatsApp se faltar detalhe.
`;

function systemPrompt(perfil) {
  return `Você é o assistente da TOURMIX. Português do Brasil, natural e simpático.
Pode responder QUALQUER pergunta (viagem, dicas, conversa, geral, curiosidades).
Para preço/data/hotel TOURMIX use só o catálogo. Não invente valores da agência.
Perfil do usuário: ${perfil || "não definido"}
${CATALOGO}`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, msg: "API TOURMIX no ar. Use POST com { message }." });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "GEMINI_API_KEY ausente", fallback: true });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const message = String(body.message || "").slice(0, 3000);
    const perfil = String(body.perfil || "").slice(0, 500);
    if (!message.trim()) return res.status(400).json({ error: "Mensagem vazia" });

    // modelos atuais (tenta em ordem se um falhar)
    const models = [
      "gemini-3.8-flash",
      "gemini-2.5-flash",
      "gemini-flash-latest",
      "gemini-2.0-flash-001"
    ];

    let lastError = null;

    for (const model of models) {
      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/" +
        model +
        ":generateContent?key=" +
        encodeURIComponent(key);

      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt(perfil) }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 1200 }
        })
      });

      const data = await r.json();
      if (!r.ok) {
        lastError = (data.error && data.error.message) || ("Erro " + r.status + " em " + model);
        continue;
      }

      const text =
        (data.candidates &&
          data.candidates[0] &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts.map((p) => p.text || "").join("")) ||
        "";

      if (text.trim()) {
        return res.status(200).json({ reply: text, model: model });
      }
      lastError = "Resposta vazia em " + model;
    }

    return res.status(500).json({
      error: lastError || "Falha na IA",
      fallback: true
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Falha", fallback: true });
  }
}
