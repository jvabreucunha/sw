// Linha do tempo do pitch v5 (roteiro com os dados da pesquisa de rua). Usada por video5.html, audio.html?tl=timeline5.js e mix.py.
const TL = (() => {
  const S = { hook: 0, chaos: 8.5, n1: 15.6, n2: 22.0, reveal: 28.2, app: 31.7, market: 47.9, end: 52.8 };
  const app = { dest: 32.3, dates: 33.2, budget: 34.1, prefs: 35.0, loading: 35.9, discover: 38.6, sw1: 39.7, sw2: 40.6, sw3: 41.5, organize: 42.3, main: 44.9 };
  // momentos-chave dentro das cenas
  const K = {
    q1: 5.45, q2: 6.2, q3: 7.05,           // "onde comer", "o que fazer", "quanto vai gastar"
    lose: 13.2,                             // "e o dia passa enquanto você decide"
    hours: 17.2,                            // "vinte e nove viajantes"
    srcs: 26.9,                             // "várias fontes"
    gaps: [26.9, 26.9, 26.9],               // mantido por compatibilidade com o código do v4
    impact: 28.6,                           // revelação do logo
    a1: 54.8, a2: 55.6, a3: 56.35,          // respostas no fim
    logo: 57.6,
  };
  const pops = (t0, n, gap) => Array.from({ length: n }, (_, i) => [+(t0 + i * gap).toFixed(2), 'pop', .35 + (i % 3) * .1]);
  return {
    duration: 60,
    bpm: 100,
    scenes: S, app, K,
    audio: { drop: K.impact, riser: K.impact - 2.2, outro: S.end - .2, final: K.logo },
    voice: { hook: .3, hook2: 3.45, chaos: 8.6, chaos2: 13.2, n1: 15.7, n2: 22.1, reveal: 28.9, quiz: 32.2, load: 36.0, swipe: 38.7, plan: 42.4, map: 45.0, market: 48.1, end: 53.0 },
    captions: {
      hook: 'Sábado de manhã.|Você acabou de chegar no litoral.',
      hook2: 'A hospedagem está garantida. Mas onde comer,|o que fazer, e quanto vai gastar?',
      chaos: 'Aí começa a busca: Google, Instagram,|a dica do amigo, o grupo da viagem.',
      chaos2: 'E o dia passa enquanto você decide.',
      n1: 'Fomos para a rua e ouvimos 29 viajantes.|Para 68%, reservar foi fácil.',
      n2: 'O problema é decidir. 59% tiveram imprevistos,|mesmo pesquisando em várias fontes.',
      reveal: 'Conheça o Partiu.',
      quiz: 'Diga quanto quer gastar e o que você curte.',
      load: 'O Partiu mostra só o que cabe no seu bolso.',
      swipe: 'Deslize e escolha o que vale a pena.',
      plan: 'O roteiro sai pronto, dia a dia.',
      map: 'Com o gasto de cada dia, no mapa.',
      market: 'E o litoral catarinense recebeu|60% mais turistas estrangeiros.',
      end: 'Com o Partiu, você chega sabendo o que fazer,|onde comer e quanto vai gastar.',
    },
    sfx: [
      [.25, 'whoosh', .5], [1.6, 'whoosh', .5],
      [K.q1, 'pop', .7], [K.q2, 'pop', .7], [K.q3, 'pop', .8], [S.chaos - .3, 'swoosh', .8],
      ...pops(S.chaos + .2, 14, .18), [S.chaos + 1.3, 'notif', .5], [S.chaos + 2.3, 'notif', .45],
      [K.lose - .1, 'whoosh', .4], [S.n1 - .5, 'suck', .9], [S.n1 - .15, 'thump', .8],
      [S.n1 + .1, 'ticks', 1.4], [K.hours, 'pop', .6], [S.n2 - .1, 'swoosh', .6], [S.n2 + .2, 'ticks', 1.0],
      [K.srcs, 'tap', .7],
      [K.impact - 2.2, 'riser', 2.2], [K.impact, 'impact', 1], [K.impact + .05, 'shimmer', .8],
      [S.app - .6, 'whoosh', .6], [S.app, 'swoosh', .9],
      [app.dest, 'tap', .6], [app.dest + .3, 'pop', .4], [app.dates, 'tap', .6], [app.dates + .3, 'pop', .4],
      [app.budget, 'tap', .6], [app.budget + .3, 'pop', .4], [app.prefs, 'tap', .6], [app.prefs + .3, 'pop', .4],
      [app.loading, 'whoosh', .5], [app.loading + .4, 'blip', .4], [app.loading + 1.0, 'blip', .45], [app.loading + 1.6, 'blip', .5], [app.loading + 2.2, 'success', .6],
      [app.discover, 'whoosh', .5], [app.sw1, 'swipe', .8], [app.sw1 + .15, 'check', .5], [app.sw2, 'swipe', .8], [app.sw2 + .15, 'check', .5], [app.sw3, 'swipe', .8], [app.sw3 + .15, 'check', .5],
      [app.organize, 'swoosh', .7], [app.organize + .8, 'pop', .45], [app.organize + 1.2, 'pop', .45], [app.organize + 1.6, 'pop', .45],
      [app.main, 'swoosh', .7], ...[.6, .8, 1.0, 1.2, 1.4, 1.6].map((d) => [app.main + d, 'pop', .35]), [app.main + 2.2, 'pop', .5],
      [S.market - .2, 'swoosh', .9], [S.market + .3, 'ticks', 1.2],
      [S.end - .3, 'swoosh', .8], [K.a1, 'check', .6], [K.a2, 'check', .6], [K.a3, 'check', .7],
      [K.logo, 'impact', .7], [K.logo + .05, 'shimmer', 1],
    ],
  };
})();
if (typeof module !== 'undefined') module.exports = TL;
