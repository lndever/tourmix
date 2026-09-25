/**
 * TOURMIX — tradução PT / EN / ES
 * Coloque antes de </body> em todas as páginas:
 * <script src="i18n.js"></script>
 */
(function () {
  if (window.__tourmixI18n) return;
  window.__tourmixI18n = true;

  var KEY = 'tourmix_lang';
  var lang = 'pt';

  try {
    var saved = localStorage.getItem(KEY);
    if (saved === 'pt' || saved === 'en' || saved === 'es') lang = saved;
  } catch (e) {}

  // Traduções: texto original em PT → { en, es }
  var dict = {
    'Início': { en: 'Home', es: 'Inicio' },
    'Destinos': { en: 'Destinations', es: 'Destinos' },
    'Pacotes': { en: 'Packages', es: 'Paquetes' },
    'Excursões': { en: 'Day trips', es: 'Excursiones' },
    'Descubra seu perfil': { en: 'Find your profile', es: 'Descubre tu perfil' },
    'Sobre nós': { en: 'About us', es: 'Sobre nosotros' },
    'Fale Conosco': { en: 'Contact us', es: 'Contáctanos' },
    'Fale conosco': { en: 'Contact us', es: 'Contáctanos' },

    'Agência de Viagens': { en: 'Travel Agency', es: 'Agencia de Viajes' },
    'Descubra o mundo com a TOURMIX': { en: 'Discover the world with TOURMIX', es: 'Descubre el mundo con TOURMIX' },
    'Roteiros exclusivos, experiências autênticas e atendimento personalizado para a viagem da sua vida.': {
      en: 'Exclusive itineraries, authentic experiences and personalized service for the trip of a lifetime.',
      es: 'Itinerarios exclusivos, experiencias auténticas y atención personalizada para el viaje de tu vida.'
    },
    'Ver Pacotes': { en: 'View packages', es: 'Ver paquetes' },
    'Falar no WhatsApp': { en: 'Chat on WhatsApp', es: 'Hablar por WhatsApp' },

    'Destinos em Destaque': { en: 'Featured destinations', es: 'Destinos destacados' },
    'Escolha entre destinos nacionais e internacionais com experiências inesquecíveis.': {
      en: 'Choose national and international destinations with unforgettable experiences.',
      es: 'Elige destinos nacionales e internacionales con experiencias inolvidables.'
    },
    'Águas cristalinas e vida marinha inesquecível': { en: 'Crystal-clear waters and unforgettable marine life', es: 'Aguas cristalinas y vida marina inolvidable' },
    'Templos e tradição milenar': { en: 'Temples and ancient tradition', es: 'Templos y tradición milenaria' },
    'Cidade perdida dos Incas': { en: 'Lost city of the Incas', es: 'Ciudad perdida de los Incas' },
    'Espiritualidade e praias': { en: 'Spirituality and beaches', es: 'Espiritualidad y playas' },
    'Cidade maravilhosa': { en: 'The marvelous city', es: 'Ciudad maravillosa' },

    'Brasil': { en: 'Brazil', es: 'Brasil' },
    'Ásia': { en: 'Asia', es: 'Asia' },
    'Peru': { en: 'Peru', es: 'Perú' },

    'Ofertas Especiais': { en: 'Special offers', es: 'Ofertas especiales' },
    'Pacotes em Destaque': { en: 'Featured packages', es: 'Paquetes destacados' },
    'Viagens pensadas de verdade': { en: 'Trips truly designed for you', es: 'Viajes pensados de verdad' },
    'Ver detalhes': { en: 'See details', es: 'Ver detalles' },
    'A partir de': { en: 'From', es: 'Desde' },
    '/pessoa': { en: '/person', es: '/persona' },
    'Em até 12x': { en: 'Up to 12 installments', es: 'Hasta 12 cuotas' },
    'Promoção': { en: 'Sale', es: 'Promoción' },
    'Ecoturismo': { en: 'Ecotourism', es: 'Ecoturismo' },

    '4 noites · Brasil': { en: '4 nights · Brazil', es: '4 noches · Brasil' },
    '5 noites · Brasil': { en: '5 nights · Brazil', es: '5 noches · Brasil' },
    '4 noites · Baixa Temporada 2026': { en: '4 nights · Low season 2026', es: '4 noches · Temporada baja 2026' },
    '5 noites · Baixa Temporada 2026': { en: '5 nights · Low season 2026', es: '5 noches · Temporada baja 2026' },

    'Hotel San Juan com café da manhã, aéreo de SP, transfer e seguro.': {
      en: 'San Juan Hotel with breakfast, flights from São Paulo, transfer and insurance.',
      es: 'Hotel San Juan con desayuno, aéreo desde SP, transfer y seguro.'
    },
    'Hotel Rosenbrock com café da manhã, aéreo de SP, transfer e seguro.': {
      en: 'Rosenbrock Hotel with breakfast, flights from São Paulo, transfer and insurance.',
      es: 'Hotel Rosenbrock con desayuno, aéreo desde SP, transfer y seguro.'
    },
    'Life Hotel Infinity com café da manhã, aéreo de SP, transfer e seguro.': {
      en: 'Life Hotel Infinity with breakfast, flights from São Paulo, transfer and insurance.',
      es: 'Life Hotel Infinity con desayuno, aéreo desde SP, transfer y seguro.'
    },
    'Hotel Bonito Ecotel com café da manhã, aéreo de SP, transfer e seguro.': {
      en: 'Bonito Ecotel with breakfast, flights from São Paulo, transfer and insurance.',
      es: 'Hotel Bonito Ecotel con desayuno, aéreo desde SP, transfer y seguro.'
    },
    'Resort com café da manhã e jantar, aéreo de SP, transfer e seguro.': {
      en: 'Resort with breakfast and dinner, flights from São Paulo, transfer and insurance.',
      es: 'Resort con desayuno y cena, aéreo desde SP, transfer y seguro.'
    },

    'Por que a TOURMIX?': { en: 'Why TOURMIX?', es: '¿Por qué TOURMIX?' },
    'Roteiros exclusivos': { en: 'Exclusive itineraries', es: 'Itinerarios exclusivos' },
    'Experiências pensadas nos detalhes, longe do turismo de massa.': {
      en: 'Experiences planned in detail, away from mass tourism.',
      es: 'Experiencias pensadas en los detalles, lejos del turismo masivo.'
    },
    'Suporte completo': { en: 'Full support', es: 'Soporte completo' },
    'Acompanhamento antes, durante e depois da sua viagem.': {
      en: 'Support before, during and after your trip.',
      es: 'Acompañamiento antes, durante y después de tu viaje.'
    },
    'Parcerias premium': { en: 'Premium partners', es: 'Alianzas premium' },
    'Hotéis e operadores selecionados para garantir qualidade.': {
      en: 'Selected hotels and operators for guaranteed quality.',
      es: 'Hoteles y operadores seleccionados para garantizar calidad.'
    },
    'Atendimento humano': { en: 'Human service', es: 'Atención humana' },
    'Consultores reais, sem robôs. WhatsApp direto com a equipe.': {
      en: 'Real consultants, no bots. Direct WhatsApp with the team.',
      es: 'Consultores reales, sin robots. WhatsApp directo con el equipo.'
    },

    'Nossa História': { en: 'Our story', es: 'Nuestra historia' },
    'Sobre nós': { en: 'About us', es: 'Sobre nosotros' },
    'O que nossos clientes dizem': { en: 'What our clients say', es: 'Lo que dicen nuestros clientes' },

    'Vamos conversar?': { en: 'Shall we talk?', es: '¿Conversamos?' },
    'Conte para nós o destino dos seus sonhos. Nossa equipe responde rápido pelo WhatsApp.': {
      en: 'Tell us about your dream destination. Our team replies quickly on WhatsApp.',
      es: 'Cuéntanos el destino de tus sueños. Nuestro equipo responde rápido por WhatsApp.'
    },
    'Nome': { en: 'Name', es: 'Nombre' },
    'Seu nome': { en: 'Your name', es: 'Tu nombre' },
    'WhatsApp': { en: 'WhatsApp', es: 'WhatsApp' },
    'Destino de interesse': { en: 'Destination of interest', es: 'Destino de interés' },
    'Selecione': { en: 'Select', es: 'Seleccione' },
    'Mensagem': { en: 'Message', es: 'Mensaje' },
    'Conte um pouco sobre a viagem...': { en: 'Tell us a bit about the trip...', es: 'Cuéntanos un poco sobre el viaje...' },
    'Enviar mensagem': { en: 'Send message', es: 'Enviar mensaje' },
    'Ou fale direto no WhatsApp: (11) 91484-1404': {
      en: 'Or message us on WhatsApp: (11) 91484-1404',
      es: 'O escribe por WhatsApp: (11) 91484-1404'
    },

    'Sobre o pacote': { en: 'About the package', es: 'Sobre el paquete' },
    'Roteiro sugerido': { en: 'Suggested itinerary', es: 'Itinerario sugerido' },
    'Datas de saída': { en: 'Departure dates', es: 'Fechas de salida' },
    'O que está incluso': { en: "What's included", es: 'Qué está incluido' },
    'Voltar para pacotes': { en: 'Back to packages', es: 'Volver a paquetes' },
    '← Voltar para pacotes': { en: '← Back to packages', es: '← Volver a paquetes' },
    'Duração:': { en: 'Duration:', es: 'Duración:' },
    'Hotel:': { en: 'Hotel:', es: 'Hotel:' },
    'Regime:': { en: 'Board:', es: 'Régimen:' },
    'Saída:': { en: 'Departure:', es: 'Salida:' },
    'Café da manhã': { en: 'Breakfast', es: 'Desayuno' },
    'São Paulo': { en: 'São Paulo', es: 'São Paulo' },
    '3% de desconto à vista': { en: '3% off for full payment', es: '3% de descuento al contado' },
    'A partir de': { en: 'From', es: 'Desde' },

    'Outubro:': { en: 'October:', es: 'Octubre:' },
    'Novembro:': { en: 'November:', es: 'Noviembre:' },
    'Dezembro:': { en: 'December:', es: 'Diciembre:' },
    'Setembro:': { en: 'September:', es: 'Septiembre:' },

    'Direitos reservados': { en: 'All rights reserved', es: 'Todos los derechos reservados' },
    'Todos os direitos reservados.': { en: 'All rights reserved.', es: 'Todos los derechos reservados.' },

    'Excursões': { en: 'Day trips', es: 'Excursiones' },
    'Portfólio': { en: 'Portfolio', es: 'Portafolio' },
    'Meu perfil': { en: 'My profile', es: 'Mi perfil' },
    'Entrar': { en: 'Sign in', es: 'Iniciar sesión' },
    'Criar conta': { en: 'Create account', es: 'Crear cuenta' },
    'Sair': { en: 'Sign out', es: 'Salir' },
    'Minha conta': { en: 'My account', es: 'Mi cuenta' },

    'Descubra seu perfil de viajante': { en: 'Discover your traveler profile', es: 'Descubre tu perfil de viajero' },
    'Assistente TOURMIX': { en: 'TOURMIX Assistant', es: 'Asistente TOURMIX' }
  };

  function tr(text) {
    if (!text || lang === 'pt') return text;
    var key = text.trim().replace(/\s+/g, ' ');
    var row = dict[key];
    if (row && row[lang]) return row[lang];
    return text;
  }

  function translateNode(node) {
    if (!node || node.nodeType !== 3) return; // text nodes only
    var parent = node.parentElement;
    if (!parent) return;
    var tag = parent.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return;
    if (parent.id === 'lang-switcher' || parent.closest && parent.closest('#lang-switcher')) return;

    var original = node.nodeValue;
    if (!original || !original.trim()) return;

    // Guarda original na 1ª vez
    if (!node.__tmxPt) node.__tmxPt = original;

    var pt = node.__tmxPt;
    var trimmed = pt.trim();
    var row = dict[trimmed];
    if (!row) {
      // tenta sem espaços extras
      row = dict[trimmed.replace(/\s+/g, ' ')];
    }
    if (!row) return;

    var translated = lang === 'pt' ? pt : (row[lang] || pt);
    // preserva espaços à esquerda/direita do original
    var lead = pt.match(/^\s*/)[0];
    var trail = pt.match(/\s*$/)[0];
    node.nodeValue = lead + translated.trim() + trail;
  }

  function walk(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) translateNode(n);
  }

  function translatePlaceholders() {
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function (el) {
      if (!el.dataset.tmxPh) el.dataset.tmxPh = el.getAttribute('placeholder') || '';
      var pt = el.dataset.tmxPh;
      el.setAttribute('placeholder', tr(pt));
    });
  }

  function translateTitle() {
    if (!document.__tmxTitle) document.__tmxTitle = document.title;
    var t = document.__tmxTitle;
    if (lang === 'pt') {
      document.title = t;
      return;
    }
    // títulos comuns
    document.title = t
      .replace('Agência de Viagens', tr('Agência de Viagens'))
      .replace('TOURMIX', 'TOURMIX');
  }

  function apply() {
    walk(document.body);
    translatePlaceholders();
    translateTitle();
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang);
    // atualiza botões do switcher
    document.querySelectorAll('#lang-switcher button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }

  function setLang(next) {
    if (next !== 'pt' && next !== 'en' && next !== 'es') return;
    lang = next;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    // recarrega para textos mistos/complexos ficarem consistentes
    apply();
  }

  function injectSwitcher() {
    if (document.getElementById('lang-switcher')) return;

    var style = document.createElement('style');
    style.textContent = [
      '#lang-switcher{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:9998;',
      'display:flex;gap:4px;background:rgba(15,23,42,.88);padding:4px;border-radius:50px;',
      'box-shadow:0 8px 24px rgba(0,0,0,.25);backdrop-filter:blur(8px);}',
      '@media(min-width:900px){#lang-switcher{left:auto;right:70px;transform:none;top:18px;}}',
      '#lang-switcher button{border:none;background:transparent;color:#e2e8f0;font-family:Montserrat,system-ui,sans-serif;',
      'font-size:0.72rem;font-weight:700;padding:0.35rem 0.65rem;border-radius:50px;cursor:pointer;letter-spacing:0.04em;}',
      '#lang-switcher button.active{background:#eab308;color:#0f172a;}',
      '#lang-switcher button:hover:not(.active){background:rgba(255,255,255,.12);}'
    ].join('');
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.id = 'lang-switcher';
    box.setAttribute('role', 'navigation');
    box.setAttribute('aria-label', 'Language');
    ['pt', 'en', 'es'].forEach(function (code) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-lang', code);
      b.textContent = code.toUpperCase();
      b.addEventListener('click', function () { setLang(code); });
      box.appendChild(b);
    });
    document.body.appendChild(box);
  }

  function boot() {
    injectSwitcher();
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  setTimeout(boot, 400);

  window.TourmixI18n = { setLang: setLang, apply: apply, getLang: function () { return lang; } };
})();
