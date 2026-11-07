// Linha do tempo única do pitch v2: usada pelo vídeo (video2.html), pela trilha (audio.html) e pela mixagem (mix.py).
const TL = {
  duration: 58,
  bpm: 100,
  // início de cada cena (s)
  scenes: { hook: 0, chaos: 3.4, n1: 9.4, n2: 14.0, n3: 17.3, reveal: 22.4, app: 27.0, end: 51.0 },
  // telas do app (s, absoluto)
  app: { dest: 27.8, dates: 29.0, budget: 30.2, prefs: 31.4, loading: 32.6, discover: 35.8, sw1: 37.2, sw2: 38.5, sw3: 39.8, organize: 41.4, main: 46.0 },
  // início de cada fala da narração (s)
  voice: { hook: 0.4, chaos: 3.6, n1: 9.6, n2: 14.2, n3: 17.5, reveal: 22.9, quiz: 27.6, load: 32.9, swipe: 36.0, plan: 41.6, map: 46.2, end: 51.6 },
  // legendas (texto escrito de cada fala; '|' separa os trechos mostrados um de cada vez)
  captions: {
    hook: 'Viajar é fácil.|Planejar, não.',
    chaos: 'Posts salvos, dezenas de abas,|planilha, grupo da viagem.|E o roteiro nunca sai.',
    n1: 'Antes de reservar,|visitamos 277 páginas.',
    n2: 'Quase metade planeja|pelas redes sociais.',
    n3: 'E o litoral catarinense recebeu|60% mais turistas estrangeiros.',
    reveal: 'Conheça o Partiu.|Sua viagem inteira, em um só lugar.',
    quiz: 'Responda quatro perguntas.',
    load: 'O Partiu encontra lugares|que cabem no seu bolso.',
    swipe: 'Deslize para escolher.',
    plan: 'Organize tudo, dia a dia.',
    map: 'E veja a viagem inteira no mapa.',
    end: 'Partiu.|Planeje menos. Viaje mais.',
  },
  // efeitos sonoros: [tempo, tipo, intensidade 0..1]
  sfx: [
    [0.25, 'whoosh', .5], [1.55, 'whoosh', .6], [3.05, 'swoosh', .8],
    // fragmentos do caos (pops) e notificações
    ...[3.7, 3.9, 4.1, 4.35, 4.55, 4.8, 5.0, 5.2, 5.45, 5.65, 5.85, 6.1, 6.3, 6.5].map((t, i) => [t, 'pop', .35 + (i % 3) * .1]),
    [4.9, 'notif', .5], [6.0, 'notif', .45], [7.55, 'whoosh', .4],
    [9.0, 'suck', .9], [9.35, 'thump', .8],
    // números: contadores e trocas
    [9.5, 'ticks', 1.4], [13.9, 'swoosh', .6], [14.1, 'ticks', 1.0], [17.2, 'swoosh', .6], [17.4, 'ticks', 1.1],
    [20.3, 'riser', 2.2], [22.5, 'impact', 1], [22.55, 'shimmer', .8],
    // app
    [26.4, 'whoosh', .6], [27.0, 'swoosh', .9],
    [27.8, 'tap', .6], [28.1, 'pop', .4], [29.0, 'tap', .6], [29.3, 'pop', .4], [30.2, 'tap', .6], [30.5, 'pop', .4], [31.4, 'tap', .6], [31.7, 'pop', .4],
    [32.6, 'whoosh', .5], [33.0, 'blip', .4], [33.6, 'blip', .45], [34.2, 'blip', .5], [34.8, 'success', .6],
    [35.8, 'whoosh', .5], [37.2, 'swipe', .8], [37.35, 'check', .5], [38.5, 'swipe', .8], [38.65, 'check', .5], [39.8, 'swipe', .8], [39.95, 'check', .5],
    [41.4, 'swoosh', .7], [42.2, 'pop', .45], [42.6, 'pop', .45], [43.0, 'pop', .45],
    [46.0, 'swoosh', .7], ...[46.6, 46.8, 47.0, 47.2, 47.4, 47.6].map((t) => [t, 'pop', .35]), [48.2, 'pop', .5],
    [50.8, 'swoosh', .9], [51.9, 'whoosh', .5], [52.7, 'whoosh', .5], [53.5, 'impact', .7], [53.55, 'shimmer', 1],
  ],
};
if (typeof module !== 'undefined') module.exports = TL;
