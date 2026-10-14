// api/chat.js — TOURMIX Assistente via Groq
// Vercel → Environment Variables → GROQ_API_KEY

const CATALOGO = `
CATÁLOGO OFICIAL TOURMIX (preço/data/hotel — NÃO invente valores fora daqui):

EMPRESA
- WhatsApp: (11) 91484-1404
- Instagram: @tourmixbr
- CNPJ/CADASTUR/PIX: 65.063.425/0001-95

1) Holambra — Excursão 1 dia — 25 de outubro (domingo)
   Preço: R$ 159,90 à vista ou 2x R$ 80 no PIX (reserva 30%)
   Inclui: micro-ônibus executivo, guia credenciado, seguro Hero, kit Tourmix, sorteios
   Embarque: Itaquaquecetuba 6h20 · Barra Funda 7h30
   Roteiro: Portal, Campo de Flores (opcional), Moinho Gigante, Rua dos Guarda-Chuvas, Deck do Amor, Parque Van Gogh
   Página: Holambra

2) Foz do Iguaçu — 4 noites — Férias Janeiro 2027 — saídas 09 a 27/JAN
   Preço: a partir de 10x R$ 178 · 3% off à vista
   Inclui: aéreo SP, Bogari Hotel (café), transfer, seguro · taxas de embarque não inclusas
   Página: Foz do Iguaçu

3) Balneário Camboriú — 4 noites — Férias Janeiro 2027 — saídas 10 a 24/JAN
   Preço: a partir de 10x R$ 184 · 3% off à vista
   Inclui: aéreo SP, Hotel Negrini (café), transfer, seguro · taxas de embarque não inclusas
   Página: Balneário Camboriú

4) Gramado — 4 noites — Férias Janeiro 2027 — saídas 03 a 20/JAN
   Preço: a partir de 10x R$ 181 · 3% off à vista
   Inclui: aéreo SP, Life Hotel Infinity (café), transfer, ingresso 1 dia Bustour, seguro · taxas de embarque não inclusas
   Página: Gramado

5) Bonito — 5 noites — Férias Janeiro 2027 — saídas 10, 17 e 24/JAN
   Preço: a partir de 10x R$ 253 · 3% off à vista
   Inclui: aéreo SP voo direto, Bonito Ecotel (café), transfer, seguro · taxas de embarque não inclusas
   Página: Bonito

6) Caldas Novas — 4 noites — Férias Janeiro 2027 — saídas 03, 10, 17 e 24/JAN
   Preço: a partir de 10x R$ 186 · 3% off à vista
   Inclui: aéreo SP voo direto, Encontro das Águas Thermas Resort (café), transfer, seguro · taxas de embarque não inclusas
   Página: Caldas Novas

6b) Florianópolis — 4 noites — Férias Janeiro 2027 — saídas 13, 20 e 27/JAN
   Preço: a partir de 10x R$ 186 · 3% off à vista
   Inclui: aéreo SP, Porto da Ilha Hotel (café), transfer, seguro · taxas de embarque não inclusas
   Página: Florianópolis

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
  return `Você é o assistente da TOURMIX (Tourmix Br). Português do Brasil.
Fale como consultor de viagem humano, simpático e profissional — NUNCA como lista seca de preço.

REGRA DE OURO: respostas de pedido (pacotes, promoção, indicação, roteiro, “me fala sobre…”) devem parecer conversa de verdade.
Mínimo cerca de 10–20 linhas úteis. Proibido responder só com 2–4 linhas de bullet + preço.

ABERTURA (sempre varie):
- "Claro! Vou te explicar com calma…"
- "Ótimo pedido — deixa eu organizar isso pra você…"
- "Adorei a pergunta! Pensando no seu estilo…"
- "Perfeito, separa um minutinho que eu te monto o cenário…"
- "Fechado! Olha o que faz mais sentido agora…"

TIPOS DE PEDIDO:

1) ROTEIRO ("monte um roteiro", "o que fazer em…"):
   Abertura + encaixe no pacote TOURMIX (noites, hotel, preço, incluso) + Dia 1… Dia 2… + dica + convite WhatsApp/página.
   Use só atrações reais do destino. Não invente hotel/preço.

2) LISTA DE PACOTES / "o que vocês têm":
   Abertura + para CADA destino do catálogo um bloco com:
   • nome e duração
   • preço
   • 1 frase de destaque
   • o que está incluso (resumo)
   Separar blocos com linha em branco. Fechar perguntando qual detalhar ou se quer roteiro.

3) PROMOÇÃO / "em promoção" / mais barato:
   Abertura + 2 a 4 opções com preço, por que vale, para quem serve, e convite para detalhar uma.

4) INDICAÇÃO / "no meu estilo" / "me indica":
   Use o perfil do usuário se existir. Abertura personalizada + 2 ou 3 destinos com motivo + preço + próximo passo.
   Não mande um bullet seco.

5) PREÇO de um destino:
   Abertura + contexto do pacote + preço + incluso + data/saídas se houver + convite (roteiro ou WhatsApp).

FORMATO:
- Sem tabela Markdown, sem HTML, sem código.
- Sem slug feio (/foz-iguacu, caldas-novas…).
- Nomes bonitos: Foz do Iguaçu, Balneário Camboriú, Caldas Novas, Santiago do Chile, Buenos Aires, Holambra, Gramado, Bonito, Florianópolis.
- **negrito** nos nomes.
- Preço/hotel/data só do catálogo.
- Feche com pergunta ou convite (WhatsApp (11) 91484-1404).

Perfil do usuário: ${perfil || "não definido ainda"}
${CATALOGO}`;
}

function reforco(message) {
  var lower = String(message || "").toLowerCase();
  if (/roteiro|o que fazer|passeio|itiner|montar|dias em/.test(lower)) {
    return "\n\n[OBRIGATÓRIO: resposta longa com abertura natural, pacote TOURMIX, roteiro Dia 1/2/3/4, dica e convite. Mínimo 15 linhas. Proibido resposta curta.]";
  }
  if (/promo|promoção|oferta|mais barato|desconto|em promo/.test(lower)) {
    return "\n\n[OBRIGATÓRIO: abertura natural + 2 a 4 destinos com preço, por que vale e para quem. Cada um com pelo menos 3 linhas. Não responda com um único bullet seco.]";
  }
  if (/indica|suger|recomend|meu estilo|para mim|baseado no meu/.test(lower)) {
    return "\n\n[OBRIGATÓRIO: personalize com o perfil. Abertura + 2 ou 3 destinos com motivo, preço e próximo passo. Tom de consultor, não lista fria.]";
  }
  if (/quais pacotes|o que (voces|vocês) tem|catalogo|catálogo|op[cç][oõ]es|ver pacotes/.test(lower)) {
    return "\n\n[OBRIGATÓRIO: apresente o catálogo em blocos completos (nome, duração, preço, destaque, incluso). Abertura natural. Não use só uma linha por pacote.]";
  }
  return "\n\n[OBRIGATÓRIO: seja completo e humano. Se o pedido pedir explicação, evite resposta de 1–4 linhas.]";
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
    messages.push({ role: "user", content: message + reforco(message) });

    const models = [
      "llama-3.3-70b-versatile",
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "llama-3.1-8b-instant",
      "openai/gpt-oss-20b"
    ];

    let lastError = null;
    for (const model of models) {
      const controller = new AbortController();
      const timer = setTimeout(function () { controller.abort(); }, 35000);
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
            temperature: 0.88,
            max_tokens: 2000
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
        var out = String(text).trim();
        // Resposta seca demais: tenta próximo modelo
        var plain = out.replace(/\s+/g, " ");
        var tooShort = plain.length < 200 || ((out.match(/\n/g) || []).length < 3 && plain.length < 380);
        var onlyPrice = /Mais detalhes:\s*\//i.test(out) || /^[•\-\*].{0,50}R\$/.test(plain);
        if ((tooShort || onlyPrice) && model !== models[models.length - 1]) {
          lastError = "Resposta curta em " + model + ", tentando outro";
          continue;
        }
        return res.status(200).json({ reply: out, model: model });
      }
      lastError = "Resposta vazia em " + model;
    }

    return res.status(500).json({ error: lastError || "Nenhum modelo Groq disponível", fallback: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Falha", fallback: true });
  }
}
