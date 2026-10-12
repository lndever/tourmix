// api/chat.js — TOURMIX Assistente (Gemini 3.8, resposta rápida)

const CATALOGO = `
DADOS TOURMIX:
WhatsApp (11) 91484-1404 | PIX/CNPJ 65.063.425/0001-95 | @tourmixbr
Pacotes: Holambra 1 dia R$159,90; Foz/Camboriú/Gramado 12x R$115; Bonito 12x R$167; Caldas 12x R$145;
Santiago Réveillon 10x R$397; Buenos Aires Réveillon 10x R$374.
Não invente preço/data/hotel da TOURMIX. Confirme no WhatsApp se faltar detalhe.
`;

function buildPrompt(perfil, message) {
  return `Você é o assistente da TOURMIX. Português do Brasil, natural e simpático.
Responda de forma direta (3 a 12 linhas). Pode falar de qualquer assunto.
Para preço/data/hotel TOURMIX use só o catálogo. Não invente valores da agência.
Perfil: ${perfil || "não definido"}
${CATALOGO}

Pergunta: ${message}`;
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
    const message = String(body.message || "").slice(0, 2000);
    const perfil = String(body.perfil || "").slice(0, 400);
    if (!message.trim()) return res.status(400).json({ error: "Mensagem vazia" });

    const model = "gemini-3.8-flash";
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model +
      ":generateContent?key=" +
      encodeURIComponent(key);

    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 20000);

    let r;
    try {
      r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: buildPrompt(perfil, message) }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 800,
            // reduz "thinking" pesado que estoura timeout no Vercel Hobby
            thinkingConfig: { thinkingBudget: 0 }
          }
        })
      });
    } finally {
      clearTimeout(timer);
    }

    const data = await r.json();
    if (!r.ok) {
      return res.status(500).json({
        error: (data.error && data.error.message) || ("Erro " + r.status),
        fallback: true
      });
    }

    const parts =
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts;

    let text = "";
    if (parts) {
      text = parts
        .filter(function (p) { return p.text; })
        .map(function (p) { return p.text; })
        .join("");
    }

    if (!text.trim()) {
      return res.status(500).json({ error: "Resposta vazia da IA", fallback: true });
    }

    return res.status(200).json({ reply: text.trim(), model: model });
  } catch (e) {
    const msg = e.name === "AbortError" ? "Timeout na IA" : (e.message || "Falha");
    return res.status(500).json({ error: msg, fallback: true });
  }
}
