// api/chat.js — TOURMIX Assistente via Groq
// Vercel → Environment Variables → GROQ_API_KEY

const CATALOGO = `
CATÁLOGO OFICIAL TOURMIX (preço/data/hotel — NÃO invente):

EMPRESA
- WhatsApp: (11) 91484-1404
- Instagram: @tourmixbr
- CNPJ/CADASTUR/PIX: 65.063.425/0001-95

1) Holambra — Excursão 1 dia — 25 de outubro (domingo)
   Preço: R$ 159,90 à vista ou 2x R$ 80 no PIX (reserva 30%)
   Inclui: micro-ônibus executivo, guia credenciado, seguro Hero, kit Tourmix, sorteios
   Embarque: Itaquaquecetuba 6h20 · Barra Funda 7h30
   Destaques: Portal, Campo de Flores, Moinho Gigante, Rua dos Guarda-Chuvas, Deck do Amor, Parque Van Gogh
   Página: Holambra

2) Foz do Iguaçu — 4 noites — saídas OUT/NOV/DEZ
   Preço: a partir de 12x R$ 115 · 3% off à vista
   Inclui: aéreo SP, Hotel San Juan (café), transfer, seguro · taxas de embarque não inclusas
   Destaques: cataratas, natureza, ideal para família
   Página: Foz do Iguaçu

3) Balneário Camboriú — 4 noites — saídas OUT/NOV/DEZ
   Preço: a partir de 12x R$ 115 · 3% off à vista
   Inclui: aéreo SP, Hotel Rosenbrock (café), transfer, seguro · taxas de embarque não inclusas
   Destaques: praia, orla, clima de cidade
   Página: Balneário Camboriú

4) Gramado — 4 noites — saídas SET/OUT/NOV/DEZ
   Preço: a partir de 12x R$ 115 · 3% off à vista
   Inclui: aéreo SP, Life Hotel Infinity (café), transfer, seguro · taxas de embarque não inclusas
   Destaques: serra, chocolate, clima romântico
   Página: Gramado

5) Bonito — 5 noites — saídas NOV/DEZ
   Preço: a partir de 12x R$ 167 · 3% off à vista
   Inclui: aéreo SP, Bonito Ecotel (café), transfer, seguro · taxas de embarque não inclusas
   Destaques: rios cristalinos, flutuação, ecoturismo
   Página: Bonito

6) Caldas Novas — 5 noites — saídas OUT/NOV
   Preço: a partir de 12x R$ 145 · 3% off à vista
   Inclui: aéreo SP, resort com café e jantar, transfer, seguro · taxas de embarque não inclusas
   Destaques: águas termais, relax total
   Página: Caldas Novas

7) Santiago do Chile — Réveillon 2026/2027 — 4 noites — saída 30/DEZ de São Paulo
   Preço: a partir de 10x R$ 397 · 3% off à vista
   Inclui: aéreo SP, Hotel Panamericano (café), transfer, city tour, seguro · taxas de embarque não inclusas
   Página: Santiago do Chile

8) Buenos Aires — Réveillon 2026/2027 — 4 noites — saída 30/DEZ de São Paulo
   Preço: a partir de 10x R$ 374 · 3% off à vista
   Inclui: aéreo SP, Hotel El Conquistador (café), transfer, city tour, seguro · taxas de embarque não inclusas
   Página: Buenos Aires
`;

function systemPrompt(perfil) {
  return `Você é o assistente comercial da TOURMIX (Tourmix Br). Português do Brasil, tom simpático, humano e profissional.

OBJETIVO: despertar interesse e ajudar a fechar viagem. Não seja seco.

QUANDO FALAREM DE PACOTE (um ou vários):
- Escreva um bloco por destino, com 5 a 8 linhas cada.
- Inclua sempre: nome, duração, preço, o que está incluso, 1 frase de desejo/destaque, e convite para ver a página ou WhatsApp.
- Modelo:

**Nome do destino** — duração
Preço: ...
Incluso: ...
Por que ir: frase curta e atrativa.
Para ver o roteiro completo e reservar, toque em Nome do destino ou chame no WhatsApp (11) 91484-1404.

FORMATO (obrigatório):
- NUNCA use tabela Markdown, código ou HTML.
- NUNCA escreva slug feio: caldas-novas, /bonito, balneario-camboriu, santiago-chile etc.
- NUNCA escreva "Mais detalhes:".
- Use sempre o nome bonito: Caldas Novas, Balneário Camboriú, Foz do Iguaçu, Santiago do Chile, Buenos Aires, Holambra, Gramado, Bonito.
- Pode usar **negrito** no nome do destino.
- Se listar vários pacotes, separe com uma linha em branco entre eles.
- Preço/data/hotel só do catálogo. Não invente.

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
    return res.status(500).json({ error: "GROQ_API_KEY ausente no Vercel", fallback: true });
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
            temperature: 0.75,
            max_tokens: 1400
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

    return res.status(500).json({ error: lastError || "Nenhum modelo Groq disponível", fallback: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Falha", fallback: true });
  }
}
