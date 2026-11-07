// Linha do tempo do pitch v4 (dor mais definida). Usada por video4.html, audio.html?tl=timeline4.js e mix.py.
const TL = (() => {
  const S = { hook: 0, chaos: 8.0, n1: 15.5, n2: 21.5, reveal: 26.9, app: 30.4, market: 46.6, end: 51.5 };
  const app = { dest: 31.0, dates: 31.9, budget: 32.8, prefs: 33.7, loading: 34.6, discover: 37.3, sw1: 38.4, sw2: 39.3, sw3: 40.2, organize: 41.0, main: 43.6 };
  // momentos-chave dentro das cenas
  const K = {
    q1: 4.85, q2: 5.7, q3: 6.75,           // "onde comer?", "o que fazer?", "quanto vou gastar?"
    lose: 12.4,                             // "e chegando lá, você perde o dia decidindo"
    hours: 19.9,                            // "cinco horas de pesquisa"
    gaps: [25.15, 25.6, 26.35],            // preço, distância, horário
    impact: 27.3,                           // revelação do logo
    a1: 53.5, a2: 54.3, a3: 55.05,          // respostas no fim
    logo: 56.3,
  };
  const pops = (t0, n, gap) => Array.from({ length: n }, (_, i) => [+(t0 + i * gap).toFixed(2), 'pop', .35 + (i % 3) * .1]);
  return {
    duration: 60,
    bpm: 100,
    scenes: S, app, K,
    // parâmetros da trilha (audio.html)
    audio: { drop: K.impact, riser: K.impact - 2.2, outro: S.end - .2, final: K.logo },
    voice: { hook: .3, hook2: 3.6, chaos: 8.1, chaos2: 12.4, n1: 15.6, n2: 21.6, reveal: 27.6, quiz: 30.9, load: 34.7, swipe: 37.4, plan: 41.1, map: 43.7, market: 46.8, end: 51.7 },
    captions: {
      hook: 'Sexta à noite.|A viagem pro litoral é amanhã.',
      hook2: 'E você ainda não sabe onde vai comer,|o que fazer, nem quanto vai gastar.',
      chaos: 'Aí começam as abas, os posts salvos,|a planilha, o grupo da viagem.',
      chaos2: 'E chegando lá, você perde o dia decidindo.',
      n1: 'Antes de reservar, visitamos 277 páginas.|São 5 horas de pesquisa.',
      n2: 'E quase metade planeja pelas redes sociais,|que não mostram preço, distância nem horário.',
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
      [K.q1, 'pop', .7], [K.q2, 'pop', .7], [K.q3, 'pop', .8], [7.7, 'swoosh', .8],
      ...pops(8.2, 14, .18), [9.3, 'notif', .5], [10.3, 'notif', .45],
      [K.lose - .1, 'whoosh', .4], [15.0, 'suck', .9], [15.35, 'thump', .8],
      [15.6, 'ticks', 1.4], [K.hours, 'pop', .6], [21.4, 'swoosh', .6], [21.7, 'ticks', 1.0],
      ...K.gaps.map((t) => [t, 'tap', .7]),
      [K.impact - 2.2, 'riser', 2.2], [K.impact, 'impact', 1], [K.impact + .05, 'shimmer', .8],
      [29.8, 'whoosh', .6], [30.4, 'swoosh', .9],
      [app.dest, 'tap', .6], [app.dest + .3, 'pop', .4], [app.dates, 'tap', .6], [app.dates + .3, 'pop', .4],
      [app.budget, 'tap', .6], [app.budget + .3, 'pop', .4], [app.prefs, 'tap', .6], [app.prefs + .3, 'pop', .4],
      [app.loading, 'whoosh', .5], [35.0, 'blip', .4], [35.6, 'blip', .45], [36.2, 'blip', .5], [36.8, 'success', .6],
      [app.discover, 'whoosh', .5], [app.sw1, 'swipe', .8], [app.sw1 + .15, 'check', .5], [app.sw2, 'swipe', .8], [app.sw2 + .15, 'check', .5], [app.sw3, 'swipe', .8], [app.sw3 + .15, 'check', .5],
      [app.organize, 'swoosh', .7], [41.8, 'pop', .45], [42.2, 'pop', .45], [42.6, 'pop', .45],
      [app.main, 'swoosh', .7], ...[44.2, 44.4, 44.6, 44.8, 45.0, 45.2].map((t) => [t, 'pop', .35]), [45.8, 'pop', .5],
      [S.market - .2, 'swoosh', .9], [46.9, 'ticks', 1.2],
      [S.end - .3, 'swoosh', .8], [K.a1, 'check', .6], [K.a2, 'check', .6], [K.a3, 'check', .7],
      [K.logo, 'impact', .7], [K.logo + .05, 'shimmer', 1],
    ],
  };
})();
if (typeof module !== 'undefined') module.exports = TL;
