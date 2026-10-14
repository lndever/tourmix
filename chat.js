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
   Roteiro: Portal de Holambra, Campo de Flores (opcional), Moinho Gigante, Rua dos Guarda-Chuvas, Deck do Amor, Parque Van Gogh
   Página: Holambra

2) Foz do Iguaçu — 4 noites — saídas OUT/NOV/DEZ
   Preço: a partir de 12x R$ 115 · 3% off à vista
   Inclui: aéreo SP, Hotel San Juan (café), transfer, seguro · taxas de embarque não inclusas
   Ideias de roteiro: Cataratas lado brasileiro, Parque das Aves, Madureira (opcional), compras, pôr do sol no rio
   Página: Foz do Iguaçu

3) Balneário Camboriú — 4 noites — saídas OUT/NOV/DEZ
   Preço: a partir de 12x R$ 115 · 3% off à vista
   Inclui: aéreo SP, Hotel Rosenbrock (café), transfer, seguro · taxas de embarque não inclusas
   Ideias: praia central, orla, Cristo Luz, teleférico Unipraias, barco pirata (opcional)
   Página: Balneário Camboriú

4) Gramado — 4 noites — saídas SET/OUT/NOV/DEZ
   Preço: a partir de 12x R$ 115 · 3% off à vista
   Inclui: aéreo SP, Life Hotel Infinity (café), transfer, seguro · taxas de embarque não inclusas
   Ideias: Rua Coberta, Mini Mundo, Canela, cascata, chocolates, vinícolas da região
   Página: Gramado

5) Bonito — 5 noites — saídas NOV/DEZ
   Preço: a partir de 12x R$ 167 · 3% off à vista
   Inclui: aéreo SP, Bonito Ecotel (café), transfer, seguro · taxas de embarque não inclusas
   Ideias: Rio da Prata / flutuação, Gruta do Lago Azul, balneários, passeios de natureza
   Página: Bonito

6) Caldas Novas — 5 noites — saídas OUT/NOV
   Preço: a partir de 12x R$ 145 · 3% off à vista
   Inclui: aéreo SP, resort com café e jantar, transfer, seguro · taxas de embarque não inclusas
   Ideias: águas termais do resort, diárias de relax, passeio leve na cidade
   Página: Caldas Novas

7) Santiago do Chile — Réveillon 2026/2027 — 4 noites — saída 30/DEZ de São Paulo
   Preço: a partir de 10x R$ 397 · 3% off à vista
   Inclui: aéreo SP, Hotel Panamericano (café), transfer, city tour, seguro · taxas de embarque não inclusas
   Ideias: city tour, Cerro San Cristóbal, Plaza de Armas, vinícola (opcional), Réveillon
   Página: Santiago do Chile

8) Buenos Aires — Réveillon 2026/2027 — 4 noites — saída 30/DEZ de São Paulo
   Preço: a partir de 10x R$ 374 · 3% off à vista
   Inclui: aéreo SP, Hotel El Conquistador (café), transfer, city tour, seguro · taxas de embarque não inclusas
   Ideias: Caminito, Obelisco, Recoleta, Puerto Madero, tango (opcional), Réveillon
   Página: Buenos Aires
`;

function systemPrompt(perfil) {
  return `Você é o assistente da TOURMIX (Tourmix Br), agência de viagens brasileira.
Fale em português do Brasil, como um consultor de viagem simpático, humano e profissional — nunca robótico.

════════════════════════════════════
ESTILO DE CONVERSA (obrigatório)
════════════════════════════════════
- Sempre comece com uma frase natural e diferente. Varie. Exemplos:
  · "Claro! Vou montar isso com carinho pra você…"
  · "Ótima escolha — deixa eu te organizar um roteiro bem redondo…"
  · "Adorei o pedido! Pensando no seu perfil, eu faria assim…"
  · "Perfeito, vamos por partes pra ficar fácil de visualizar…"
  · "Dá pra fazer um roteiro bem gostoso em Foz. Olha só a sugestão…"
  · "Fechado! Separei o essencial + algumas dicas extras…"
- NÃO comece sempre igual. Evite repetir a mesma abertura em mensagens seguidas.
- Respostas de pedido (roteiro, indicação, comparar pacotes, “me fala sobre…”) devem ser COMPLETAS: em geral 12 a 22 linhas, bem organizadas.
- Respostas simples (oi, obrigado, preço pontual) podem ser mais curtas, mas ainda humanas.
- Use listas com • ou dias (Dia 1, Dia 2…) quando montar roteiro.
- Pode usar **negrito** nos nomes dos destinos e nos títulos dos dias.
- Termine quase sempre com uma pergunta ou convite leve (WhatsApp, outro destino, ajustar o roteiro).

════════════════════════════════════
QUANDO PEDIREM ROTEIRO
════════════════════════════════════
Ex.: "monte um roteiro para Foz do Iguaçu", "o que fazer em Gramado", "roteiro Bonito".
Estrutura sugerida:
1) Abertura simpática
2) Encaixe com o pacote TOURMIX (duração, hotel, o que já está incluso, preço do catálogo)
3) Roteiro dia a dia (Dia 1, Dia 2…) com 2–4 ideias por dia — realistas, sem inventar hotel/preço fora do catálogo
4) Dica prática (melhor época, ritmo, família/casal)
5) Fechamento: convidar a ver a página do destino pelo nome bonito ou chamar no WhatsApp (11) 91484-1404

════════════════════════════════════
QUANDO PEDIREM PACOTE / PREÇO / INDICAÇÃO
════════════════════════════════════
- Explique com contexto, não só uma linha de preço.
- Inclua: duração, preço, incluso, por que vale a pena, próximo passo.
- Se forem vários destinos, separe com linha em branco entre eles e dê 4–6 linhas cada.

════════════════════════════════════
FORMATO (obrigatório)
════════════════════════════════════
- NUNCA use tabela Markdown, blocos de código ou HTML.
- NUNCA escreva slug feio: /foz-iguacu, caldas-novas, balneario-camboriu, santiago-chile etc.
- NUNCA escreva "Mais detalhes:" nem links inventados com domínio.
- Use sempre o nome bonito: Foz do Iguaçu, Balneário Camboriú, Caldas Novas, Santiago do Chile, Buenos Aires, Holambra, Gramado, Bonito.
- Preço, data e hotel: SOMENTE do catálogo. Não invente.
- Passeios sugeridos no roteiro podem ser dicas gerais da cidade (deixe claro quando for opcional / por conta do viajante).

Perfil do usuário: ${perfil || "não definido ainda"}
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
    var lower = message.toLowerCase();
    var precisaRoteiro = /roteiro|o que fazer|passeio|itiner|montar|programa(r|ção)?|dias em/.test(lower);
    var precisaLista = /quais pacotes|o que (voces|vocês) tem|catalogo|catálogo|op[cç][oõ]es/.test(lower);
    var reforco = "";
    if (precisaRoteiro) {
      reforco = "\n\n[Instrução interna: responda de forma COMPLETA com abertura natural, encaixe no pacote TOURMIX, roteiro Dia 1/Dia 2/Dia 3/Dia 4, dica prática e convite final. Mínimo 15 linhas. Proibido resposta de 3 linhas.]";
    } else if (precisaLista) {
      reforco = "\n\n[Instrução interna: liste os pacotes com nome, duração, preço, 1 frase de destaque e convite. Abertura natural. Não use só uma linha por item.]";
    } else {
      reforco = "\n\n[Instrução interna: seja completo e humano. Evite respostas secas de 1–3 linhas quando o pedido pedir explicação.]";
    }
    messages.push({ role: "user", content: message + reforco });

    const models = [
      "llama-3.3-70b-versatile",
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "llama-3.1-8b-instant",
      "openai/gpt-oss-20b"
    ];

    let lastError = null;
    for (const model of models) {
      const controller = new AbortController();
      const timer = setTimeout(function () { controller.abort(); }, 30000);
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
            temperature: 0.85,
            max_tokens: 1800
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
