// Partiu — lógica do protótipo: onboarding, perguntas, roteiro e mapa.
const $ = (id) => document.getElementById(id);
const ICON = {
  comer: '<path d="M7 3v18M4 3v5a3 3 0 0 0 6 0V3M17 21V3c-2.2 1-3.5 3.8-3.5 7.5V13H17"/>',
  ver: '<path d="M3 9.5L12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18"/>',
  dormir: '<path d="M3 5v15M3 15h18M21 20v-6.5A3.5 3.5 0 0 0 17.5 10H11v5"/><circle cx="7" cy="11.5" r="1.8"/>',
  pin: '<path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  chevL: '<path d="M15 5l-7 7 7 7"/>', chevR: '<path d="M9 5l7 7-7 7"/>', chevU: '<path d="M5 15l7-7 7 7"/>', chevD: '<path d="M5 9l7 7 7-7"/>',
  minus: '<path d="M5 12h14"/>', plus: '<path d="M5 12h14M12 5v14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
  move: '<path d="M7 8l5-5 5 5M7 16l5 5 5-5M12 3v18"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  praia: '<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v7a2 2 0 0 0 4 0"/>',
  natureza: '<path d="M2.5 20l6.5-11 4.5 7 2.5-3.5 5.5 7.5z"/>',
  noite: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  compras: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  aventura: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  relax: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3"/>',
};
const svg = (name, size = 20, sw = 2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;

// Dados de exemplo. Coordenadas aproximadas; restaurantes e hotéis são fictícios.
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const MON = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const QUIZ = ['dest', 'dates', 'budget', 'prefs'];
const TODAY = 20261106;
// Categorias do orçamento: ícone, nome e o tom usado na barra de distribuição.
const ALLOC = [['dormir', 'Hospedagem', '#1C1C1E', '#FFFFFF'], ['comer', 'Alimentação', '#6C6C72', '#FFFFFF'], ['ver', 'Passeios', '#B4B4BA', '#1C1C1E']];
const DEFAULT_SPLIT = [0.4, 0.35, 0.25];
// [chave, nome, como aparece no texto de carregamento]
const INTERESTS = [
  ['praia', 'Praia', 'praias'], ['noite', 'Vida noturna', 'bares'], ['comida', 'Gastronomia', 'restaurantes'],
  ['compras', 'Compras', 'lojas'], ['cultura', 'História', 'lugares históricos'], ['natureza', 'Natureza', 'mirantes'],
  ['aventura', 'Aventura', 'aventuras'], ['relax', 'Descanso', 'cafés e spas']
];
const WAVE = (y, x0 = 0) => `M${x0} ${y} q10 -5 20 0` + ' t20 0'.repeat(12);
// Prédios separados: [esquerda, direita, topo]; janelas em grade regular.
const TOWERS = [[2, 20, 62], [24, 42, 46], [46, 62, 60], [66, 82, 40], [86, 102, 64], [106, 122, 52], [126, 140, 68]];
const WINDOWS = TOWERS.flatMap(([a, b, top]) => {
  const cols = b - a >= 18 ? [a + 4, b - 7] : [(a + b) / 2 - 1.5];
  const out = [];
  for (let y = top + 7; y <= 82; y += 9) cols.forEach((x) => out.push([x, y]));
  return out;
});
// estrela de quatro pontas com lados curvos
const SPARK = (x, y, r, d) => `<path class="st" style="animation-delay:${d}s" d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z"/>`;
// pinheiro em gota, com tronco
const PINE = (x, y, h) => `<path class="mtn" d="M${x - 5} ${y} C ${x - 5} ${y - h * 0.45}, ${x - 1.5} ${y - h * 0.8}, ${x} ${y - h} C ${x + 1.5} ${y - h * 0.8}, ${x + 5} ${y - h * 0.45}, ${x + 5} ${y} Z"/><path d="M${x} ${y}v3"/>`;
const BENTO = {
  // pôr do sol no horizonte, gaivotas e mar em movimento
  praia: { cls: 'wide', d: 'Orlas e ilhas', art: `<svg class="art" style="right:14px;top:8px" width="190" height="52" viewBox="0 0 190 52" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <defs><clipPath id="seaClip"><rect x="0" y="28" width="190" height="24"/></clipPath></defs>
    <g class="gull"><path d="M58 14 q4 -4 8 0 q4 -4 8 0"/></g>
    <g class="gull" style="animation-delay:.5s"><path d="M86 22 q3 -3 6 0 q3 -3 6 0"/></g>
    <g class="rays"><path d="M150 9v-5M139 13l-3-3M161 13l3-3M134 21l-4-1M166 21l4-1"/></g>
    <path d="M136 26a14 14 0 0 1 28 0"/>
    <path d="M4 26H190"/>
    <g clip-path="url(#seaClip)"><g class="w"><path d="${WAVE(35)}" stroke-opacity=".8"/><path d="${WAVE(44, -10)}" stroke-opacity=".4"/></g></g>
  </svg>` },
  // prédios separados com telhados variados, janelas alinhadas, lua e estrelas
  noite: { cls: 'tall', d: 'Bares e baladas', art: `<svg class="art" style="right:12px;top:10px" width="131" height="86" viewBox="0 0 140 92" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
    <path transform="translate(94 0) scale(1.5)" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke-width="1.2"/>
    <g fill="currentColor" stroke="none">${SPARK(16, 14, 4, 0)}${SPARK(52, 24, 3, 0.6)}${SPARK(84, 10, 2.5, 1.1)}${SPARK(36, 36, 2.2, 0.3)}${SPARK(132, 50, 2.5, 0.9)}</g>
    <rect class="mtn" x="2" y="62" width="18" height="32" rx="2"/>
    <rect class="mtn" x="24" y="46" width="18" height="48" rx="2"/><path d="M33 46 V39"/>
    <path class="mtn" d="M46 94 V60 L54 52 L62 60 V94 Z"/>
    <rect class="mtn" x="66" y="40" width="16" height="54" rx="2"/><path d="M74 40 V32"/>
    <path class="mtn" d="M86 94 V64 A8 8 0 0 1 102 64 V94 Z"/>
    <rect class="mtn" x="106" y="52" width="16" height="42" rx="2"/>
    <rect class="mtn" x="126" y="68" width="14" height="26" rx="2"/>
    <g fill="currentColor" stroke="none">${WINDOWS.map(([x, y], i) => `<rect class="win" x="${x}" y="${y}" width="3" height="3.4" rx=".6" style="animation-delay:${(i * 0.43) % 3}s"/>`).join('')}</g>
    <path d="M0 90 H140"/>
  </svg>` },
  comida: { d: 'Frutos do mar e mais', art: `<span class="art wiggle" style="right:14px;top:12px">${svg('comer', 26, 1.8)}</span>` },
  compras: { d: 'Lojas e feirinhas', art: `<span class="art bounce" style="right:14px;top:12px">${svg('compras', 26, 1.8)}</span>` },
  cultura: { d: 'Centros históricos', art: `<svg class="art" style="right:12px;top:8px" width="40" height="36" viewBox="0 0 40 36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 3V11"/><path class="flag" d="M20 3h9l-2.5 2.6L29 8.2h-9z" fill="currentColor"/><path d="M5 17L20 11L35 17Z"/><path d="M8 19V29M14 19V29M20 19V29M26 19V29M32 19V29"/><path d="M5 31H35M3 34H37"/></svg>` },
  // duas montanhas com pico arredondado e neve, colina com pinheiros e o sol nascendo atrás
  natureza: { cls: 'tall', d: 'Mirantes e parques', art: `<svg class="art" style="left:0;right:0;top:12px;margin:auto" width="140" height="84" viewBox="0 0 140 84" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
    <circle class="sun" cx="110" cy="22" r="9"/><g class="moonc"><path transform="translate(99 11)" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></g>
    <path class="mtn" d="M50 92 L80 52 Q92 36 104 52 L146 92 Z" stroke-opacity=".5"/>
    <path class="mtn" d="M-6 92 L30 40 Q44 18 58 40 L96 92 Z"/>
    <path d="M25.8 46 L30 40 Q44 18 58 40 L62.4 46 L56 42.5 L50 47 L44 42.5 L38 47 L32 42.5 Z"/>
    <path class="mtn" d="M-4 94 C 30 74, 64 78, 90 82 C 108 76, 126 72, 146 78 V94 Z"/>
    ${PINE(8, 89, 14)}${PINE(19, 86, 18)}${PINE(103, 80, 17)}${PINE(114, 78, 23)}${PINE(125, 76, 18)}${PINE(135, 77, 21)}
  </svg>` },
  aventura: { d: 'Esportes radicais', art: `<svg class="art" style="right:14px;top:12px" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path class="needle" d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>` },
  relax: { cls: 'wide', d: 'Spas e cafés', art: `<svg class="art" style="right:18px;top:8px" width="56" height="54" viewBox="0 0 56 54" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="stm" d="M18 16 q-4 -5 0 -10"/><path class="stm" d="M26 16 q-4 -5 0 -10" style="animation-delay:.5s"/><path class="stm" d="M34 16 q-4 -5 0 -10" style="animation-delay:1s"/><path d="M8 22h32v10a12 12 0 0 1 -12 12h-8a12 12 0 0 1 -12 -12z"/><path d="M40 26h4a5 5 0 0 1 0 10h-4"/></svg>` }
};
const SLIDES = [
  { title: 'Sua viagem inteira em um só lugar', text: 'Restaurantes, passeios e hospedagem organizados no mapa.',
    art: '<svg viewBox="0 0 240 220" fill="none" stroke="#1C1C1E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 50 L85 30 L155 50 L220 30 L220 170 L155 190 L85 170 L20 190 Z" fill="#fff"/><path d="M85 30 V170 M155 50 V190" stroke="#C7C7CC"/><path d="M60 140 C 90 120 120 130 140 100 S 175 80 190 70" stroke-dasharray="4 7" stroke="#8E8E93"/><circle cx="60" cy="140" r="9" fill="#1C1C1E"/><path d="M190 48 c-11 0 -18 8 -18 17 c0 13 18 28 18 28 s18 -15 18 -28 c0 -9 -7 -17 -18 -17z" fill="#1C1C1E"/><circle cx="190" cy="65" r="5" fill="#fff" stroke="none"/></svg>' },
  { title: 'Datas e orçamento sob controle', text: 'Defina quando vai e quanto quer gastar. As sugestões respeitam seu limite.',
    art: '<svg viewBox="0 0 240 220" fill="none" stroke="#1C1C1E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="40" y="36" width="160" height="150" rx="20" fill="#fff"/><path d="M40 74 H200 M82 24 V48 M158 24 V48"/><rect x="62" y="116" width="116" height="26" rx="13" fill="#E4E4E8" stroke="none"/><circle cx="75" cy="129" r="13" fill="#1C1C1E" stroke="none"/><circle cx="165" cy="129" r="13" fill="#1C1C1E" stroke="none"/><g fill="#C7C7CC" stroke="none"><circle cx="75" cy="96" r="3.5"/><circle cx="105" cy="96" r="3.5"/><circle cx="135" cy="96" r="3.5"/><circle cx="165" cy="96" r="3.5"/><circle cx="75" cy="162" r="3.5"/><circle cx="105" cy="162" r="3.5"/><circle cx="135" cy="162" r="3.5"/><circle cx="165" cy="162" r="3.5"/></g></svg>' },
  { title: 'Monte o roteiro deslizando', text: 'Escolha os lugares com um gesto e depois organize tudo numa linha do tempo, dia a dia.',
    art: '<svg viewBox="0 0 240 220" fill="none" stroke="#1C1C1E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="64" y="38" width="112" height="150" rx="16" fill="#fff" stroke="#C7C7CC" transform="rotate(-6 120 113)"/><g class="swipe-card"><rect x="64" y="30" width="112" height="150" rx="16" fill="#fff"/><rect x="76" y="42" width="88" height="68" rx="10" fill="#E4E4E8" stroke="none"/><path d="M84 96l16-18 12 12 8-8 16 14" stroke="#AEAEB4"/><path d="M76 128h56M76 144h36" stroke="#C7C7CC"/><rect x="76" y="156" width="42" height="14" rx="7" fill="#F2F2F5" stroke="none"/></g><circle cx="30" cy="110" r="17" fill="#fff"/><path d="M24 104l12 12M36 104l-12 12"/><circle cx="210" cy="110" r="17" fill="#1C1C1E" stroke="none"/><path d="M203 110l5 5 9-10" stroke="#fff"/></svg>' }
];

const S = {
  step: 'intro', slide: 0, city: 'bc', query: 'Balneário Camboriú', monthOff: 0,
  start: 20261112, end: 20261118, budget: 4000, alloc: [1600, 1400, 1000], maxStep: 0,
  interests: new Set(['praia', 'comida']),
  filter: 'all', sel: null
};

const keyOf = (y, m, d) => y * 10000 + (m + 1) * 100 + d;
const dateOf = (k) => new Date(Math.floor(k / 10000), Math.floor(k / 100) % 100 - 1, k % 100);
const shortDate = (k) => { const d = dateOf(k); return d.getDate() + ' ' + MON[d.getMonth()]; };
const money = (n) => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const nights = () => (S.start && S.end ? Math.round((dateOf(S.end) - dateOf(S.start)) / 864e5) : 0);
const perDay = () => S.budget / Math.max(1, nights());
const city = () => CITIES.find((c) => c.id === S.city) || CITIES[0];
const rangeLabel = () => {
  if (!S.start || !S.end) return '';
  const a = dateOf(S.start), z = dateOf(S.end);
  return a.getMonth() === z.getMonth() ? `${a.getDate()}–${z.getDate()} ${MON[z.getMonth()]}` : `${shortDate(S.start)} – ${shortDate(S.end)}`;
};
const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);

/* ---------- navegação ---------- */
let loadTimer, loadRaf;
function go(step) {
  clearTimeout(loadTimer);
  cancelAnimationFrame(loadRaf);
  S.step = step;
  ['intro', 'quiz', 'loading', 'plan', 'main'].forEach((id) => { $(id).hidden = true; });
  if (step === 'intro') { $('intro').hidden = false; renderIntro(); }
  else if (QUIZ.includes(step)) { S.maxStep = Math.max(S.maxStep, QUIZ.indexOf(step)); $('quiz').hidden = false; renderQuiz(); }
  else if (step === 'loading') {
    $('loading').hidden = false;
    startLoading();
  } else if (step === 'plan') { $('plan').hidden = false; ensurePlan(); renderPlan(); }
  else { $('main').hidden = false; showMain(); }
}

/* ---------- onboarding ---------- */
function renderIntro() {
  const s = SLIDES[S.slide];
  $('illus').innerHTML = s.art;
  $('introTitle').textContent = s.title;
  $('introText').textContent = s.text;
  [...$('dots').children].forEach((d, i) => d.classList.toggle('on', i === S.slide));
  $('introNext').textContent = S.slide < 2 ? 'Continuar' : 'Começar';
  $('skip').style.visibility = S.slide < 2 ? 'visible' : 'hidden';
}
$('introNext').onclick = () => { if (S.slide < 2) { S.slide++; renderIntro(); } else go('dest'); };
$('skip').onclick = () => go('dest');

/* ---------- perguntas ---------- */
function canNext() {
  if (S.step === 'dest') return !!S.city;
  if (S.step === 'dates') return !!(S.start && S.end);
  if (S.step === 'budget') return S.budget >= 100;
  if (S.step === 'prefs') return S.interests.size > 0;
  return true;
}
function updateFoot() {
  const n = nights();
  let note = '';
  if (S.step === 'dates') note = S.start && S.end ? `${shortDate(S.start)} – ${shortDate(S.end)} · ${plural(n, 'noite', 'noites')}` : S.start ? 'Agora escolha a volta' : 'Escolha a data de ida';
  if (S.step === 'prefs' && !S.interests.size) note = 'Escolha pelo menos um interesse';
  $('qNote').hidden = !note;
  $('qNote').textContent = note;
  $('qNext').disabled = !canNext();
  $('qNext').textContent = S.step === 'prefs' ? 'Ver meu roteiro' : 'Continuar';
}
function renderQuiz() {
  const i = QUIZ.indexOf(S.step);
  $('qStep').textContent = `Etapa ${i + 1} de 4`;
  $('qProg').innerHTML = QUIZ.map((q, j) => `<button data-step="${j}" class="${j <= i ? 'on' : ''}" ${j > S.maxStep ? 'disabled' : ''} aria-label="Ir para a etapa ${j + 1}"${j === i ? ' aria-current="step"' : ''}><i></i></button>`).join('');
  const b = $('qBody');
  b.scrollTop = 0;
  if (S.step === 'dest') {
    b.innerHTML = `
      <div class="q-title"><h1>Para onde você vai?</h1><p class="sub">Cidades do litoral catarinense.</p></div>
      <div class="group">
        <label class="label" for="destInput">Destino</label>
        <div class="search">${svg('search', 20, 2.2)}<input id="destInput" type="text" autocomplete="off" placeholder="Buscar cidade" value="${S.query}"></div>
      </div>
      <div class="group"><span class="label">Sugestões</span><div class="rows" id="destList"></div></div>`;
    renderDestList();
  } else if (S.step === 'dates') {
    b.innerHTML = `
      <div class="q-title"><h1>Quando é a viagem?</h1><p class="sub">Toque na ida e depois na volta.</p></div>
      <div class="group" id="cal"></div>`;
    renderCal();
  } else if (S.step === 'budget') {
    b.innerHTML = `
      <div class="q-title"><h1>Qual o seu orçamento?</h1><p class="sub">Sem contar as passagens.</p></div>
      <div class="ring">
        <svg viewBox="0 0 200 200" aria-hidden="true"><circle class="trk" cx="100" cy="100" r="86"/>${ALLOC.map((a) => `<circle class="seg" cx="100" cy="100" r="86" stroke="${a[2]}"/>`).join('')}</svg>
        <div class="ring-center">
          <label class="amount-field" for="budgetInput"><span>R$</span><input id="budgetInput" type="text" inputmode="numeric" autocomplete="off" aria-label="Orçamento total em reais"></label>
          <small id="budgetDay"></small>
        </div>
      </div>
      <p class="free" id="free"></p>
      <div class="cat-rows">${ALLOC.map(([k, l, bg], i) => `
        <div class="cat-row" data-i="${i}">
          <i style="background:${bg}"></i><b>${l}</b>
          <button class="icon-btn" data-act="catMinus" data-i="${i}" aria-label="Diminuir ${l.toLowerCase()} em R$ 100">${svg('minus', 16, 2.4)}</button>
          <input class="cat-in" data-cat="${i}" type="text" inputmode="numeric" autocomplete="off" aria-label="Valor para ${l.toLowerCase()}">
          <button class="icon-btn" data-act="catPlus" data-i="${i}" aria-label="Aumentar ${l.toLowerCase()} em R$ 100">${svg('plus', 16, 2.4)}</button>
        </div>`).join('')}
      </div>
`;
    renderBudget(true);
  } else if (S.step === 'prefs') {
    b.innerHTML = `
      <div class="q-title"><h1>O que você curte?</h1><p class="sub">Escolha quantos quiser.</p></div>
      <div class="group">
        <div class="group-head"><span class="label">Interesses</span><span class="label" id="intCount"></span></div>
        <div class="bento">${INTERESTS.map(([k, l]) => `
          <button class="b ${BENTO[k].cls || ''}" data-act="interest" data-k="${k}" aria-pressed="${S.interests.has(k)}">${BENTO[k].art}<b>${l}</b><small>${BENTO[k].d}</small></button>`).join('')}
        </div>
      </div>`;
    renderPrefs();
  }
  updateFoot();
}

function renderDestList() {
  const q = norm(S.query);
  const exact = CITIES.find((c) => norm(c.name) === q);
  const list = exact || !q ? CITIES : CITIES.filter((c) => norm(c.name).includes(q));
  $('destList').innerHTML = list.length ? list.map((c) => `
    <button class="row-btn" data-act="city" data-id="${c.id}" aria-pressed="${c.id === S.city}">
      <span class="ic">${svg('pin', 18)}</span>
      <span class="tx"><strong>${c.name}</strong><small>Santa Catarina</small></span>
      ${c.id === S.city ? svg('check', 20, 2.5) : ''}
    </button>`).join('') : '<p class="empty">Ainda não temos esse destino. Tente uma das cidades do litoral catarinense.</p>';
}

function renderCal() {
  const base = new Date(2026, 10 + S.monthOff, 1);
  const y = base.getFullYear(), m = base.getMonth();
  const first = base.getDay(), dim = new Date(y, m + 1, 0).getDate();
  const both = S.start && S.end;
  let cells = '';
  for (let i = 0; i < first; i++) cells += '<span></span>';
  for (let d = 1; d <= dim; d++) {
    const k = keyOf(y, m, d);
    const cls = ['day', k === S.start && 's', k === S.end && 'e', both && 'both', both && k > S.start && k < S.end && 'in'].filter(Boolean).join(' ');
    const extra = k === S.start ? ', ida' : k === S.end ? ', volta' : '';
    cells += `<button class="${cls}" data-act="day" data-k="${k}" ${k < TODAY ? 'disabled' : ''} aria-label="${d} de ${MONTHS[m]}${extra}"><span>${d}</span></button>`;
  }
  $('cal').innerHTML = `
    <div class="cal-head">
      <strong>${MONTHS[m][0].toUpperCase() + MONTHS[m].slice(1)} de ${y}</strong>
      <div style="display:flex;gap:4px">
        <button class="icon-btn" data-act="prevMonth" aria-label="Mês anterior">${svg('chevL', 18, 2.4)}</button>
        <button class="icon-btn" data-act="nextMonth" aria-label="Próximo mês">${svg('chevR', 18, 2.4)}</button>
      </div>
    </div>
    <div class="cal-week" aria-hidden="true"><span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span></div>
    <div class="cal-grid">${cells}</div>`;
}

function renderBudget(syncInput) {
  const input = $('budgetInput');
  if (syncInput) input.value = S.budget.toLocaleString('pt-BR');
  input.style.width = Math.max(2, input.value.length) + 'ch';
  $('budgetDay').textContent = `${money(perDay())} por dia · ${plural(nights(), 'noite', 'noites')}`;
  renderCats();
  updateFoot();
}

// Anel: cada categoria é um arco; o trecho vazio é o que ainda está livre.
// Uma categoria nunca passa do que sobra do total.
const RING_C = 2 * Math.PI * 86;
function renderCats() {
  const total = S.budget, free = Math.max(0, total - S.alloc.reduce((a, b) => a + b, 0));
  $('free').textContent = free ? `${money(free)} ainda livres` : 'Tudo distribuído';
  let start = 0;
  document.querySelectorAll('.ring .seg').forEach((s, i) => {
    const len = total ? S.alloc[i] / total * RING_C : 0, vis = Math.max(0, len - 14);
    s.style.strokeDasharray = `${vis} ${RING_C}`;
    s.style.strokeDashoffset = -(start + 7);
    s.style.opacity = vis > 0 ? 1 : 0;
    start += len;
  });
  document.querySelectorAll('.cat-row').forEach((row) => {
    const i = +row.dataset.i, inp = row.querySelector('.cat-in');
    if (document.activeElement !== inp) inp.value = money(S.alloc[i]);
    row.querySelector('[data-act="catPlus"]').disabled = free <= 0;
    row.querySelector('[data-act="catMinus"]').disabled = S.alloc[i] <= 0;
  });
}
function setAlloc(i, v) {
  const others = S.alloc.reduce((a, b) => a + b, 0) - S.alloc[i];
  S.alloc[i] = Math.max(0, Math.min(S.budget - others, Math.round(v)));
  renderCats();
}
// Quando o total muda, as categorias acompanham na mesma proporção.
function rescale(old) {
  if (old > 0 && S.alloc.some(Boolean)) S.alloc = S.alloc.map((a) => Math.floor(a * S.budget / old / 10) * 10);
  else S.alloc = DEFAULT_SPLIT.map((p) => Math.floor(S.budget * p / 10) * 10);
}
function setBudget(v) {
  const old = S.budget;
  S.budget = Math.max(100, Math.min(100000, Math.round(v)));
  rescale(old);
  renderBudget(true);
}

// Atualiza os cartões no lugar, para as transições de seleção rodarem.
function renderPrefs() {
  const b = $('qBody');
  b.querySelectorAll('[data-act="interest"]').forEach((t) => t.setAttribute('aria-pressed', S.interests.has(t.dataset.k)));
  $('intCount').textContent = S.interests.size ? plural(S.interests.size, 'selecionado', 'selecionados') : '';
  updateFoot();
}

function startLoading() {
  const c = city(), n = plural(nights(), 'noite', 'noites');
  const liked = INTERESTS.filter(([k]) => S.interests.has(k)).map((x) => x[2]);
  const likes = liked.length > 2 ? `${liked[0]}, ${liked[1]} e mais` : liked.join(' e ');
  ensurePlan();
  const found = S.plan.sugg.length;
  // [enquanto roda, quando termina]
  const steps = [
    [`Buscando ${likes} em ${c.name}`, `${c.places.length - 1} lugares encontrados`],
    ['Comparando avaliações e distâncias', 'Os mais bem avaliados separados'],
    ['Filtrando pelo seu orçamento', `Tudo dentro de ${money(perDay())} por dia`],
    ['Separando as melhores opções', `${found} sugestões prontas para você`]
  ];
  // Cada etapa leva entre 0,7 s e 1,5 s, para não parecer mecânico.
  const durs = steps.map(() => 700 + Math.random() * 800);
  const total = durs.reduce((a, b) => a + b, 0);
  $('loadTitle').textContent = 'Encontrando lugares';
  $('loadMeta').textContent = `${c.name} · ${rangeLabel()}`;
  $('loadSteps').innerHTML = steps.map((s) => `<li><span class="st">${svg('check', 12, 3)}</span><span>${s[0]}</span></li>`).join('');
  const items = [...$('loadSteps').children];
  const arc = $('loadArc'), C = 2 * Math.PI * 50;
  arc.style.strokeDasharray = C;
  arc.style.strokeDashoffset = C;
  const t0 = performance.now();
  const frame = (t) => {
    const el = t - t0, k = Math.min(1, el / total);
    const e = 1 - Math.pow(1 - k, 1.6);
    arc.style.strokeDashoffset = C * (1 - e);
    $('loadPct').textContent = Math.round(e * 100) + '%';
    let idx = steps.length, acc = 0;
    for (let i = 0; i < durs.length; i++) { if (el < acc + durs[i]) { idx = i; break; } acc += durs[i]; }
    items.forEach((li, i) => {
      const st = i < idx ? 'done' : i === idx ? 'active' : '';
      if (li.className !== st) { li.className = st; li.lastChild.textContent = steps[i][st === 'done' ? 1 : 0]; }
    });
    if (k < 1) { loadRaf = requestAnimationFrame(frame); return; }
    $('loadTitle').textContent = `Encontramos ${found} sugestões`;
    loadTimer = setTimeout(() => { go('plan'); if (!S.plan.days.some((d) => Object.keys(d).length) && !S.plan.picked.length) openDiscover(); }, 700 + Math.random() * 300);
  };
  loadRaf = requestAnimationFrame(frame);
}

$('qBody').addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]');
  if (!t || t.disabled) return;
  const act = t.dataset.act;
  if (act === 'city') { const c = CITIES.find((x) => x.id === t.dataset.id); S.city = c.id; S.query = c.name; $('destInput').value = c.name; renderDestList(); updateFoot(); }
  if (act === 'day') {
    const k = +t.dataset.k;
    if (!S.start || S.end) { S.start = k; S.end = null; } else if (k <= S.start) S.start = k; else S.end = k;
    renderCal(); updateFoot();
  }
  if (act === 'prevMonth') { S.monthOff--; renderCal(); }
  if (act === 'nextMonth') { S.monthOff++; renderCal(); }
  if (act === 'minus') setBudget(S.budget - 100);
  if (act === 'plus') setBudget(S.budget + 100);
  if (act === 'catMinus') setAlloc(+t.dataset.i, S.alloc[+t.dataset.i] - 100);
  if (act === 'catPlus') setAlloc(+t.dataset.i, S.alloc[+t.dataset.i] + 100);
  if (act === 'interest') { const k = t.dataset.k; S.interests.has(k) ? S.interests.delete(k) : S.interests.add(k); renderPrefs(); }
});
$('qBody').addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'destInput') {
    S.query = t.value;
    const exact = CITIES.find((c) => norm(c.name) === norm(t.value));
    S.city = exact ? exact.id : null;
    renderDestList(); updateFoot();
  }
  if (t.id === 'budgetInput') {
    const n = Math.min(100000, +t.value.replace(/\D/g, '') || 0);
    const old = S.budget;
    S.budget = n;
    rescale(old);
    t.value = n ? n.toLocaleString('pt-BR') : '';
    renderBudget(false);
  }
  if (t.classList.contains('cat-in')) {
    const i = +t.dataset.cat, raw = t.value.replace(/\D/g, '');
    setAlloc(i, raw ? +raw : 0);
    t.value = raw ? S.alloc[i].toLocaleString('pt-BR') : '';
  }
});
$('qBody').addEventListener('change', (e) => { if (e.target.id === 'budgetInput') setBudget(S.budget); });
$('qBody').addEventListener('keydown', (e) => { if ((e.target.id === 'budgetInput' || e.target.classList.contains('cat-in')) && e.key === 'Enter') e.target.blur(); });
$('qBody').addEventListener('focusin', (e) => { if (e.target.id === 'budgetInput' || e.target.classList.contains('cat-in')) setTimeout(() => e.target.select(), 0); });
$('qBody').addEventListener('focusout', (e) => { if (e.target.classList.contains('cat-in')) setTimeout(renderCats, 0); });

$('qNext').onclick = () => {
  if (!canNext()) return;
  const i = QUIZ.indexOf(S.step);
  go(i < 3 ? QUIZ[i + 1] : 'loading');
};
$('qProg').onclick = (e) => {
  const b = e.target.closest('button');
  if (!b || b.disabled) return;
  const j = +b.dataset.step;
  if (j > QUIZ.indexOf(S.step) && !canNext()) return;
  go(QUIZ[j]);
};
$('qBack').onclick = () => {
  const i = QUIZ.indexOf(S.step);
  if (i === 0) { S.slide = 2; go('intro'); } else go(QUIZ[i - 1]);
};

/* ---------- tela principal ---------- */
let map, markers = {}, meMarker, routeLine, mapCity;
function haversine(a, b) {
  const R = 6371000, r = Math.PI / 180;
  const dLat = (b[0] - a[0]) * r, dLng = (b[1] - a[1]) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function distLabel(p, hotel) {
  if (p === hotel) return 'Sua base';
  const m = haversine(hotel.ll, p.ll);
  return m < 1500 ? `${Math.max(1, Math.round(m / 80))} min a pé` : `${(m / 1000).toFixed(1).replace('.', ',')} km`;
}
const pinIcon = (p, sel) => L.divIcon({
  className: '', iconSize: [44, 44], iconAnchor: [22, 22],
  html: `<div class="pin${sel ? ' sel' : ''}"><span class="pin-dot">${svg(p.cat, sel ? 20 : 18)}</span>${sel ? `<span class="pin-label">${p.name}</span>` : ''}</div>`
});

// Onde a pessoa está: GPS quando o navegador permite; senão, o Shopping Russi & Russi (Itapema).
const FALLBACK_ME = { ll: [-27.12853, -48.60103], name: 'Shopping Russi & Russi, em Itapema' };
const TRIP_CARD_H = 112; // área ocupada pelo cartão da viagem no topo do mapa
let me = null, sheetState = 'half', noteT;

function initMap() {
  if (map || !window.L) return;
  map = L.map('map', { zoomControl: false, attributionControl: true, minZoom: 11, maxZoom: 16 });
  // Blocos do mapa (CARTO Positron) publicados junto com a página; onde faltar, aparece a grade do fundo.
  L.tileLayer('tiles/{z}/{x}/{y}.png', {
    minZoom: 11, maxZoom: 16, maxNativeZoom: 15,
    errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);
  map.attributionControl.setPrefix(false);
  map.attributionControl.setPosition('bottomleft');
  meMarker = L.marker(FALLBACK_ME.ll, {
    icon: L.divIcon({ className: '', html: '<div class="me"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
    interactive: false, keyboard: false, zIndexOffset: 500
  }).addTo(map);
}

/* Painel de lugares: recolhido, metade ou tela cheia. Arraste o puxador ou use o botão. */
function sheetHeights() {
  const H = $('main').clientHeight || 844;
  return { collapsed: 150, half: Math.round(H * 0.5), full: H - TRIP_CARD_H };
}
const curSheetH = () => parseFloat($('main').style.getPropertyValue('--sheet-h')) || sheetHeights().half;
function setSheet(state) {
  sheetState = state;
  $('main').style.setProperty('--sheet-h', sheetHeights()[state] + 'px');
  $('placesSheet').classList.toggle('collapsed', state === 'collapsed');
  const full = state === 'full';
  $('sheetToggle').innerHTML = svg(full ? 'chevD' : 'chevU', 20, 2.2);
  $('sheetToggle').setAttribute('aria-label', full ? 'Minimizar a lista' : 'Maximizar a lista');
  $('grabber').setAttribute('aria-expanded', state !== 'collapsed');
}
let sd = null, justDragged = false;
$('grabber').addEventListener('pointerdown', (e) => {
  sd = { y: e.clientY, h: curSheetH(), moved: false };
  $('grabber').setPointerCapture(e.pointerId);
});
$('grabber').addEventListener('pointermove', (e) => {
  if (!sd) return;
  const dy = sd.y - e.clientY;
  if (!sd.moved && Math.abs(dy) < 5) return;
  sd.moved = true;
  const hs = sheetHeights();
  $('main').classList.add('resizing');
  $('placesSheet').classList.remove('collapsed');
  $('main').style.setProperty('--sheet-h', Math.max(hs.collapsed, Math.min(hs.full, sd.h + dy)) + 'px');
});
function endSheetDrag() {
  if (!sd) return;
  $('main').classList.remove('resizing');
  if (sd.moved) {
    const hs = sheetHeights(), h = curSheetH();
    setSheet(Object.keys(hs).sort((a, b) => Math.abs(hs[a] - h) - Math.abs(hs[b] - h))[0]);
    justDragged = true;
  }
  sd = null;
}
$('grabber').addEventListener('pointerup', endSheetDrag);
$('grabber').addEventListener('pointercancel', endSheetDrag);
$('grabber').addEventListener('click', () => {
  if (justDragged) { justDragged = false; return; }
  setSheet({ collapsed: 'half', half: 'full', full: 'collapsed' }[sheetState]);
});
$('sheetToggle').onclick = () => setSheet(sheetState === 'full' ? 'collapsed' : 'full');
window.addEventListener('resize', () => { if (!$('main').hidden) setSheet(sheetState); });

// Centraliza um ponto na parte do mapa que fica visível entre o cartão do topo e o painel.
function flyVisible(ll, zoom) {
  const z = zoom ?? map.getZoom();
  const pt = map.project(ll, z).add([0, (curSheetH() - TRIP_CARD_H) / 2]);
  map.flyTo(map.unproject(pt, z), z, { duration: 0.6 });
}

function showMain() {
  initMap();
  const c = city();
  $('tripCity').textContent = c.name;
  $('tripMeta').textContent = `${rangeLabel()} · ${plural(nights(), 'noite', 'noites')} · ${money(S.budget)}`;
  setSheet(sheetState);
  if (!map) { renderPlaces(); return; }
  map.invalidateSize();
  if (mapCity !== c.id) {
    mapCity = c.id; S.sel = null; S.filter = 'all';
    Object.values(markers).forEach((m) => m.remove()); markers = {};
    c.places.forEach((p) => {
      markers[p.id] = L.marker(p.ll, { icon: pinIcon(p, false), title: p.name, keyboard: true }).on('click', () => select(p.id, false)).addTo(map);
    });
    map.fitBounds(L.latLngBounds(c.places.map((p) => p.ll)), { paddingTopLeft: [36, TRIP_CARD_H + 12], paddingBottomRight: [36, curSheetH() + 24], maxZoom: 15 });
  }
  renderPlaces();
}

function renderPlaces() {
  const c = city(), hotel = c.places[0];
  const cats = [['all', 'Todos'], ['comer', 'Restaurantes'], ['ver', 'Passeios'], ['dormir', 'Hospedagem']];
  $('filters').innerHTML = cats.map(([k, l]) => `<button class="pill" data-k="${k}" aria-pressed="${S.filter === k}">${l}</button>`).join('');
  const visible = c.places.filter((p) => S.filter === 'all' || p.cat === S.filter);
  $('placesMeta').textContent = `${plural(visible.length, 'lugar', 'lugares')} em ${c.name} · ${money(perDay())} por dia`;
  $('list').innerHTML = visible.map((p) => `
    <button class="place" data-id="${p.id}" aria-pressed="${p.id === S.sel}">
      <span class="thumb">${svg(p.cat, 22, 1.8)}</span>
      <span class="tx">
        <strong>${p.name}</strong>
        <small>${p.sub}</small>
        <span class="meta"><svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.5l1.3-6.6L2.5 9.3l6.6-.8z" fill="currentColor"/></svg><b>${p.rating}</b><em>· ${distLabel(p, hotel)} · ${p.price}</em></span>
      </span>
      <span style="color:#C7C7CC">${svg('chevR', 16, 2.4)}</span>
    </button>`).join('');
  if (!map) return;
  c.places.forEach((p) => {
    const m = markers[p.id]; if (!m) return;
    const show = visible.includes(p);
    if (show && !map.hasLayer(m)) m.addTo(map);
    if (!show && map.hasLayer(m)) m.remove();
    m.setIcon(pinIcon(p, p.id === S.sel));
    m.setZIndexOffset(p.id === S.sel ? 1000 : 0);
  });
  if (routeLine) { routeLine.remove(); routeLine = null; }
  const sel = c.places.find((p) => p.id === S.sel);
  if (sel && sel !== hotel && visible.includes(sel)) {
    routeLine = L.polyline([hotel.ll, sel.ll], { color: '#1C1C1E', weight: 3, opacity: 0.6, dashArray: '1 8', lineCap: 'round', interactive: false }).addTo(map);
  }
}

function select(id, fromList) {
  S.sel = id;
  if (!fromList && sheetState === 'collapsed') setSheet('half');
  renderPlaces();
  const p = city().places.find((x) => x.id === id);
  if (map && fromList) flyVisible(p.ll, Math.max(map.getZoom(), 15));
  if (!fromList) { const el = $('list').querySelector(`[data-id="${id}"]`); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
}
$('list').addEventListener('click', (e) => { const t = e.target.closest('.place'); if (t) select(t.dataset.id, true); });
$('filters').addEventListener('click', (e) => { const t = e.target.closest('[data-k]'); if (t) { S.filter = t.dataset.k; renderPlaces(); } });
$('editTrip').onclick = () => go('dest');

function showNote(msg) {
  const n = $('mapNote');
  n.textContent = msg;
  n.hidden = false;
  clearTimeout(noteT);
  noteT = setTimeout(() => { n.hidden = true; }, 4000);
}
function placeMe(ll, msg) {
  me = ll;
  meMarker.setLatLng(ll);
  flyVisible(ll, 15);
  if (msg) showNote(msg);
}
$('locate').onclick = () => {
  if (!map) return;
  if (me) return flyVisible(me, 15);
  const fallback = () => placeMe(FALLBACK_ME.ll, `Sem acesso à sua localização. Mostrando o ${FALLBACK_ME.name}.`);
  if (!navigator.geolocation) return fallback();
  navigator.geolocation.getCurrentPosition((pos) => placeMe([pos.coords.latitude, pos.coords.longitude]), fallback, { timeout: 4000, maximumAge: 60000 });
};

/* ---------- rolagem lateral com setas ---------- */
function hnav(el, step) {
  const wrap = document.createElement('div');
  wrap.className = 'hnav';
  wrap.style.flex = getComputedStyle(el).flex;
  el.parentNode.insertBefore(wrap, el);
  wrap.appendChild(el);
  el.style.flex = '1 1 auto';
  const mk = (dir) => {
    const b = document.createElement('button');
    b.className = 'hnav-btn ' + dir;
    b.setAttribute('aria-label', dir === 'l' ? 'Rolar para a esquerda' : 'Rolar para a direita');
    b.innerHTML = svg(dir === 'l' ? 'chevL' : 'chevR', 16, 2.4);
    b.onclick = () => el.scrollBy({ left: (dir === 'l' ? -1 : 1) * (step || el.clientWidth * 0.8), behavior: 'smooth' });
    wrap.appendChild(b);
    return b;
  };
  const L = mk('l'), R = mk('r');
  const upd = () => { L.hidden = el.scrollLeft <= 2; R.hidden = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2; };
  el.addEventListener('scroll', upd, { passive: true });
  el.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) { e.preventDefault(); el.scrollLeft += e.deltaY; }
  }, { passive: false });
  new ResizeObserver(upd).observe(el);
  new MutationObserver(upd).observe(el, { childList: true, subtree: true });
  upd();
}

/* ---------- roteiro: escolher lugares por categoria e depois organizar ---------- */
const WEEK = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const DAYNAME = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const TL_SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
const SLOT_LABEL = { '08:00': 'Café da manhã', '10:00': 'Manhã', '12:00': 'Almoço', '14:00': 'Tarde', '16:00': 'Tarde', '18:00': 'Fim de tarde', '20:00': 'Jantar', '22:00': 'Noite' };
const MEAL_SLOTS = ['12:00', '20:00'];
// Tipos de lugar, na ordem em que a pessoa escolhe; cada um só entra nos horários que fazem sentido.
const TYPES = {
  refeicao: { stage: 'Restaurantes', hint: 'Almoço ou jantar', icon: 'comer', slots: ['12:00', '20:00'] },
  cafe: { stage: 'Cafés', hint: 'Café da manhã ou da tarde', icon: 'relax', slots: ['08:00', '16:00'] },
  praia: { stage: 'Praias', hint: 'Melhor durante o dia', icon: 'praia', slots: ['08:00', '10:00', '14:00', '16:00', '18:00'] },
  passeio: { stage: 'Pontos turísticos', hint: 'De manhã ou à tarde', icon: 'ver', slots: ['08:00', '10:00', '14:00', '16:00', '18:00'] },
  noite: { stage: 'Vida noturna', hint: 'Para a noite', icon: 'noite', slots: ['20:00', '22:00'] }
};
const STAGES = Object.keys(TYPES);
// Atividades sugeridas a partir dos interesses (exemplos): [nome, detalhe, ícone da foto, tipo]
const GENERIC = {
  praia: [['Manhã de praia', 'Praia', 'praia', 'praia'], ['Pôr do sol na orla', 'Passeio · fim de tarde', 'praia', 'praia']],
  comida: [['Almoço de frutos do mar', 'Restaurante', 'comer', 'refeicao'], ['Jantar no centro', 'Restaurante', 'comer', 'refeicao']],
  noite: [['Bar com música ao vivo', 'Vida noturna', 'noite', 'noite']],
  natureza: [['Trilha até o mirante', 'Natureza · 2 h', 'natureza', 'passeio']],
  cultura: [['Passeio pelo centro histórico', 'História · a pé', 'ver', 'passeio']],
  compras: [['Tarde de compras', 'Compras', 'compras', 'passeio']],
  aventura: [['Passeio de barco', 'Aventura · 3 h', 'aventura', 'passeio']],
  relax: [['Café da tarde', 'Descanso', 'relax', 'cafe'], ['Spa e massagem', 'Descanso · 1 h', 'relax', 'passeio']]
};
const placeType = (p) => p.cat === 'comer' ? (/caf|padaria/i.test(p.name + ' ' + p.sub) ? 'cafe' : 'refeicao') : /praia/i.test(p.sub) ? 'praia' : 'passeio';

let planSig = '', planSeq = 0, flashId = null, curDay = 0, stage = STAGES[0];
const dayDate = (d) => { const x = dateOf(S.start); x.setDate(x.getDate() + d); return x; };
const dayShort = (d) => { const x = dayDate(d); return `${WEEK[x.getDay()]}, ${x.getDate()} ${MON[x.getMonth()]}`; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const filled = (d) => Object.keys(S.plan.days[d]).length;
const chosen = () => [...S.plan.picked, ...S.plan.days.flatMap((d) => Object.values(d))];
const fits = (it, t) => TYPES[it.type].slots.includes(t);
const hotelLL = () => city().places[0].ll;
const typeIcon = (it, size = 14) => svg(TYPES[it.type].icon, size, 2);

// Distância e tempo estimado: a pé até ~2 km, de carro acima disso.
function distText(a, b) {
  const m = haversine(a, b);
  const d = m < 1000 ? `${Math.max(50, Math.round(m / 50) * 50)} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`;
  const t = m <= 2000 ? `${Math.max(1, Math.round(m / 80))} min a pé` : `${Math.max(2, Math.round(m / 450))} min de carro`;
  return `${d} · ${t}`;
}
const distTag = (it, from, label) => `<span class="dist">${typeIcon(it, 13)}${distText(from, it.ll)}${label ? ` ${label}` : ''}</span>`;

// Ilustração no lugar da foto do lugar (a foto real entra aqui quando houver).
const SCENE_KIND = { praia: 'praia', comer: 'comer', ver: 'ver', compras: 'ver', pin: 'ver', natureza: 'natureza', aventura: 'natureza', noite: 'noite', relax: 'relax', dormir: 'relax' };
function scene(icon) {
  const k = SCENE_KIND[icon] || 'ver', night = k === 'noite', bg = night ? '#3A3A3F' : '#DEDEE2', st = '#9A9AA0', fl = night ? '#2C2C30' : '#CDCDD2';
  const art = {
    praia: `<circle cx="88" cy="28" r="10" fill="${fl}"/><path d="M0 46H120" stroke="${st}"/><path d="M0 56q10-5 20 0t20 0t20 0t20 0t20 0t20 0" stroke="${st}"/><path d="M0 66q10-5 20 0t20 0t20 0t20 0t20 0t20 0" stroke="${st}" opacity=".6"/>`,
    comer: `<circle cx="60" cy="42" r="24" fill="#E9E9EC" stroke="${st}"/><circle cx="60" cy="42" r="15" stroke="${st}"/><path d="M26 22v40M22 22v10a4 4 0 0 0 8 0V22M96 62V22c-4 2-6 8-6 15v5h6" stroke="${st}"/>`,
    ver: `<path d="M30 34L60 20L90 34Z" fill="${fl}" stroke="${st}"/><path d="M36 38V62M48 38V62M60 38V62M72 38V62M84 38V62M28 66H92" stroke="${st}"/>`,
    natureza: `<circle cx="88" cy="22" r="8" fill="${fl}"/><path d="M-4 80L40 32Q48 24 56 32L100 80Z" fill="${fl}" stroke="${st}"/><path d="M50 80L80 48Q86 42 92 48L126 80Z" fill="#D5D5DA" stroke="${st}"/>`,
    noite: `<path d="M98 14a9 9 0 1 0 8 13a7 7 0 0 1-8-13z" fill="#9A9AA0"/><rect x="10" y="40" width="18" height="40" fill="${fl}"/><rect x="32" y="28" width="20" height="52" fill="${fl}"/><rect x="56" y="46" width="16" height="34" fill="${fl}"/><rect x="76" y="34" width="20" height="46" fill="${fl}"/><g fill="#8E8E94"><rect x="15" y="46" width="3" height="3"/><rect x="38" y="34" width="3" height="3"/><rect x="44" y="44" width="3" height="3"/><rect x="62" y="52" width="3" height="3"/><rect x="82" y="40" width="3" height="3"/><rect x="88" y="52" width="3" height="3"/></g>`,
    relax: `<path d="M38 36h36v12a14 14 0 0 1-14 14h-8a14 14 0 0 1-14-14z" fill="#E9E9EC" stroke="${st}"/><path d="M74 40h4a6 6 0 0 1 0 12h-4M48 30q-4-5 0-10M56 30q-4-5 0-10M64 30q-4-5 0-10" stroke="${st}"/>`
  }[k];
  return `<svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid slice" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="120" height="80" fill="${bg}"/>${art}</svg>`;
}

// Tudo o que foi encontrado começa na etapa "Escolher lugares"; os dias começam vazios.
// Atividades sem endereço próprio ficam perto de um lugar do mesmo tipo (posição aproximada).
function ensurePlan() {
  const sig = [S.city, S.start, S.end, [...S.interests].sort().join()].join('|');
  if (S.plan && planSig === sig) return;
  planSig = sig;
  const cp = city().places;
  const near = (ty, i) => {
    const same = cp.filter((p, j) => j && placeType(p) === ty), base = (same.length ? same[i % same.length] : cp[0]).ll;
    return [base[0] + 0.0012 * ((i % 3) - 1), base[1] - 0.001];
  };
  const sugg = cp.slice(1).map((p) => ({ title: p.name, sub: p.sub, icon: p.cat, type: placeType(p), ll: p.ll }));
  INTERESTS.forEach(([k]) => { if (S.interests.has(k)) (GENERIC[k] || []).forEach(([t, s, ic, ty], i) => sugg.push({ title: t, sub: s, icon: ic, type: ty, ll: near(ty, sugg.length + i) })); });
  const D = Math.max(2, Math.min(10, nights() + 1));
  S.plan = { days: Array.from({ length: D }, () => ({})), sugg: sugg.map((s) => ({ ...s, id: 'it' + planSeq++ })), skipped: [], picked: [] };
  curDay = 0;
  stage = STAGES[0];
}

function dayChipsHTML(sel, attr) {
  return S.plan.days.map((slots, d) => {
    const x = dayDate(d), n = Object.keys(slots).length;
    return `<button class="day-chip${d === sel ? ' on' : ''}" ${attr}="${d}" aria-pressed="${d === sel}" aria-label="${DAYNAME[x.getDay()]}, ${x.getDate()} de ${MONTHS[x.getMonth()]}: ${plural(n, 'atividade', 'atividades')}"><span>${WEEK[x.getDay()]}</span><b>${x.getDate()}</b><i class="${n ? 'has' : ''}">${n}</i></button>`;
  }).join('');
}

/* ---------- etapa 2: linha do tempo ---------- */
function renderPlan() {
  $('planMeta').textContent = `${city().name} · ${rangeLabel()}`;
  $('dayStrip').innerHTML = dayChipsHTML(curDay, 'data-day');
  const pk = S.plan.picked, h = hotelLL();
  $('tray').hidden = !pk.length;
  $('trayTitle').textContent = `Para organizar (${pk.length})`;
  $('trayRow').innerHTML = pk.map((it) => `
    <button class="tcard" data-pick="${it.id}" aria-label="Escolher dia e horário para ${esc(it.title)}">
      <span class="tph">${scene(it.icon)}</span><strong>${esc(it.title)}</strong>${distTag(it, h)}
    </button>`).join('');
  const x = dayDate(curDay), slots = S.plan.days[curDay];
  $('dayTitle').textContent = `${DAYNAME[x.getDay()]}, ${x.getDate()} ${MON[x.getMonth()]}`;
  $('dayCount').textContent = `${filled(curDay)}/${TL_SLOTS.length}`;
  let prev = null;
  $('timeline').innerHTML = TL_SLOTS.map((t) => {
    const it = slots[t];
    if (!it) {
      const fitTypes = [...new Set(pk.filter((p) => fits(p, t)).map((p) => p.type))];
      return `<div class="tl-row"><span class="tl-time">${t}<small>${SLOT_LABEL[t]}</small></span><button class="tl-free${fitTypes.length ? ' fit' : ''}" data-free="${t}" aria-label="${t} livre${fitTypes.length ? ': há lugares escolhidos que combinam' : ''}">${svg('plus', 14, 2.4)}${fitTypes.map((ty) => svg(TYPES[ty].icon, 16, 2)).join('')}</button></div>`;
    }
    const tag = distTag(it, prev ? prev.ll : h, prev ? 'da anterior' : 'do hotel');
    prev = it;
    return `<div class="tl-row"><span class="tl-time">${t}<small>${SLOT_LABEL[t]}</small></span>
      <div class="tl-card${it.id === flashId ? ' flash' : ''}">
        <span class="pph" role="img" aria-label="Foto de ${esc(it.title)}">${scene(it.icon)}</span>
        <span class="tx"><strong>${esc(it.title)}</strong>${tag}</span>
        <button class="rm" data-move="${t}" aria-label="Mudar dia ou horário de ${esc(it.title)}">${svg('move', 16, 2)}</button>
        <button class="rm" data-rm="${t}" aria-label="Tirar ${esc(it.title)} deste horário">${svg('x', 16, 2.2)}</button>
      </div></div>`;
  }).join('');
  flashId = null;
  const left = S.plan.sugg.length + S.plan.skipped.length;
  $('openDiscover').innerHTML = `${svg('cards', 18, 2)}Escolher${left ? `<i>${left}</i>` : ''}`;
  $('openDiscover').setAttribute('aria-label', `Escolher lugares: ${plural(left, 'sugestão', 'sugestões')}`);
}
$('dayStrip').addEventListener('click', (e) => { const c = e.target.closest('[data-day]'); if (c) { curDay = +c.dataset.day; renderPlan(); } });
$('trayRow').addEventListener('click', (e) => {
  const c = e.target.closest('[data-pick]');
  if (c) openWhen({ mode: 'place', item: S.plan.picked.find((p) => p.id === c.dataset.pick), day: curDay });
});
$('timeline').addEventListener('click', (e) => {
  const f = e.target.closest('[data-free]'), r = e.target.closest('[data-rm]'), m = e.target.closest('[data-move]');
  if (f) openWhen({ mode: 'fill', day: curDay, slot: f.dataset.free });
  if (r) unplace(curDay, r.dataset.rm);
  if (m) openWhen({ mode: 'place', item: S.plan.days[curDay][m.dataset.move], day: curDay, from: { d: curDay, t: m.dataset.move } });
});

let toastT, lastUndo = null;
function toast(msg, undo) {
  lastUndo = undo || null;
  const t = $('toast');
  t.firstElementChild.textContent = msg;
  $('undo').hidden = !undo;
  t.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => { t.hidden = true; lastUndo = null; }, 4000);
}
$('undo').onclick = () => { if (lastUndo) lastUndo(); lastUndo = null; $('toast').hidden = true; };

function placeItem(it, d, t, from) {
  if (from) delete S.plan.days[from.d][from.t];
  else S.plan.picked = S.plan.picked.filter((p) => p.id !== it.id);
  S.plan.days[d][t] = it;
  flashId = it.id;
  curDay = d;
  renderPlan();
}
// Tirar do horário devolve o lugar para "Para organizar".
function unplace(d, t) {
  const it = S.plan.days[d][t];
  delete S.plan.days[d][t];
  S.plan.picked.unshift(it);
  renderPlan();
  toast('Voltou para "Para organizar"', () => { S.plan.picked = S.plan.picked.filter((p) => p !== it); S.plan.days[d][t] = it; renderPlan(); });
}
// Distribui os escolhidos pelos dias, respeitando os horários de cada tipo e espalhando tipos iguais.
function autoOrganize() {
  const snap = { days: S.plan.days.map((o) => ({ ...o })), picked: [...S.plan.picked] };
  const left = [];
  for (const it of S.plan.picked) {
    const same = (d) => Object.values(S.plan.days[d]).filter((x) => x.type === it.type).length;
    const order = S.plan.days.map((_, d) => d).sort((a, b) => same(a) - same(b) || filled(a) - filled(b) || a - b);
    const d = order.find((dd) => TYPES[it.type].slots.some((t) => !S.plan.days[dd][t]));
    if (d == null) { left.push(it); continue; }
    S.plan.days[d][TYPES[it.type].slots.find((t) => !S.plan.days[d][t])] = it;
  }
  const placed = S.plan.picked.length - left.length;
  S.plan.picked = left;
  renderPlan();
  toast(left.length ? `${plural(placed, 'lugar organizado', 'lugares organizados')} · ${left.length} sem horário livre` : plural(placed, 'lugar organizado', 'lugares organizados'),
    () => { S.plan.days = snap.days; S.plan.picked = snap.picked; renderPlan(); });
}
$('autoPlace').onclick = autoOrganize;

/* ---------- painel: dia e horário de um lugar / o que fazer num horário ---------- */
let wh = null;
function openWhen(o) { wh = o; $('when').hidden = false; renderWhen(); }
function closeWhen() { $('when').hidden = true; wh = null; }
function renderWhen() {
  const b = $('whenBody'), h = hotelLL();
  if (wh.mode === 'fill') {
    const fit = S.plan.picked.filter((it) => fits(it, wh.slot));
    $('whenTitle').textContent = `${dayShort(wh.day)} · ${wh.slot}`;
    $('whenSub').textContent = SLOT_LABEL[wh.slot];
    b.innerHTML = (fit.length
      ? `<div class="fit-list">${fit.map((it) => `<button class="fit-row" data-fit="${it.id}"><span class="pph">${scene(it.icon)}</span><span class="tx"><strong>${esc(it.title)}</strong>${distTag(it, h, 'do hotel')}</span>${svg('plus', 18, 2.4)}</button>`).join('')}</div>`
      : '<p class="when-empty">Nenhum lugar escolhido combina com este horário.</p>') +
      '<button class="btn-out" data-more>Escolher mais lugares</button>';
    return;
  }
  const it = wh.item, slots = S.plan.days[wh.day];
  $('whenTitle').textContent = it.title;
  $('whenSub').innerHTML = `${typeIcon(it, 16)}${TYPES[it.type].hint}`;
  b.innerHTML = `<div class="day-strip" data-wdays>${dayChipsHTML(wh.day, 'data-wday')}</div>
    <div class="slot-grid">${TL_SLOTS.map((t) => {
      const occ = slots[t], self = wh.from && wh.from.d === wh.day && wh.from.t === t, ok = fits(it, t);
      const status = self ? 'Horário atual' : occ ? esc(occ.title) : ok ? 'Livre' : MEAL_SLOTS.includes(t) ? 'Só refeições' : 'Não combina';
      return `<button class="slot${ok && !occ ? ' rec' : ''}" data-slot="${t}" ${(occ && !self) || !ok ? 'disabled' : ''} ${self ? 'aria-current="true"' : ''}><b>${t}</b><small>${SLOT_LABEL[t]}</small><span>${status}</span></button>`;
    }).join('')}</div>`;
}
$('whenBody').addEventListener('click', (e) => {
  const day = e.target.closest('[data-wday]'), slot = e.target.closest('[data-slot]'), fit = e.target.closest('[data-fit]'), more = e.target.closest('[data-more]');
  if (day) { wh.day = +day.dataset.wday; renderWhen(); return; }
  if (slot && !slot.disabled) { const o = wh; closeWhen(); placeItem(o.item, o.day, slot.dataset.slot, o.from); return; }
  if (fit) { const o = wh; closeWhen(); placeItem(S.plan.picked.find((p) => p.id === fit.dataset.fit), o.day, o.slot); return; }
  if (more) { closeWhen(); openDiscover(); }
});
$('whenClose').onclick = closeWhen;
$('when').addEventListener('click', (e) => { if (e.target === $('when')) closeWhen(); });

/* ---------- etapa 1: escolher lugares, uma categoria por vez (direita = quero ir, esquerda = pular) ---------- */
let lastAct = null, busy = false;
const pendingOf = (ty) => S.plan.sugg.filter((s) => s.type === ty);
const stagesInUse = () => STAGES.filter((k) => [...S.plan.sugg, ...S.plan.skipped, ...chosen()].some((s) => s.type === k));
const nextStage = () => stagesInUse().find((k) => STAGES.indexOf(k) > STAGES.indexOf(stage) && pendingOf(k).length);
function openDiscover() {
  if (!S.plan.sugg.length && S.plan.skipped.length) { S.plan.sugg = S.plan.skipped; S.plan.skipped = []; }
  stage = stagesInUse().find((k) => pendingOf(k).length) || stagesInUse()[0] || STAGES[0];
  $('disc').hidden = false;
  renderDiscover();
}
function closeDiscover() { $('disc').hidden = true; renderPlan(); }
function cardHTML(it, cls) {
  return `<div class="dcard ${cls}" data-id="${it.id}">
    <span class="photo" role="img" aria-label="Foto de ${esc(it.title)}">${scene(it.icon)}</span>
    <span class="stamp yes">QUERO IR</span><span class="stamp no">PULAR</span>
    <div class="body">
      <span class="cicon" role="img" aria-label="${TYPES[it.type].hint}">${svg(TYPES[it.type].icon, 20, 2)}</span>
      <span class="tx"><strong>${esc(it.title)}</strong><span class="dist">${svg('dormir', 13, 2)}${distText(hotelLL(), it.ll)} do hotel</span></span>
    </div>
  </div>`;
}
function renderDiscover() {
  const queue = pendingOf(stage), picked = S.plan.picked.length, ty = TYPES[stage];
  $('discCount').textContent = queue.length ? `${ty.stage} · ${plural(queue.length, 'sugestão', 'sugestões')}` : ty.stage;
  $('stages').innerHTML = stagesInUse().map((k) => {
    const n = chosen().filter((c) => c.type === k).length, rest = pendingOf(k).length;
    return `<button class="stage${rest ? '' : ' done'}" data-stage="${k}" aria-current="${k === stage ? 'step' : 'false'}" aria-label="${TYPES[k].stage}: ${plural(n, 'escolhido', 'escolhidos')}, ${rest} para ver">${svg(TYPES[k].icon, 18, 2)}<small>${n}</small></button>`;
  }).join('');
  const [a, b] = queue;
  if (a) {
    $('stack').innerHTML = `${b ? cardHTML(b, 'next') : ''}${cardHTML(a, 'top')}`;
  } else {
    const n = chosen().filter((c) => c.type === stage).length, skippedHere = S.plan.skipped.filter((s) => s.type === stage).length, nx = nextStage();
    $('stack').innerHTML = `
      <div class="stage-done">
        <span class="cicon">${svg(ty.icon, 26, 2)}</span>
        <strong>${ty.stage}: pronto</strong>
        <p>${n ? plural(n, 'escolhido', 'escolhidos') : 'Nenhum escolhido'}</p>
        ${nx ? `<button class="btn-primary" data-next="${nx}">Próximo: ${TYPES[nx].stage}</button>`
          : picked ? `<button class="btn-primary" data-organize>Organizar ${plural(picked, 'lugar', 'lugares')}</button>`
          : '<button class="btn-primary" data-organize>Ver meu roteiro</button>'}
        ${skippedHere ? `<button class="text-btn" data-review="${stage}">Rever ${plural(skippedHere, 'pulado', 'pulados')}</button>` : ''}
      </div>`;
  }
  $('noAct').disabled = $('yesAct').disabled = !a;
  $('undoAct').disabled = !lastAct;
  $('discFoot').hidden = !picked || !a;
  $('goOrganize').textContent = `Organizar ${plural(picked, 'lugar', 'lugares')}`;
}
$('stages').addEventListener('click', (e) => { const s = e.target.closest('[data-stage]'); if (s) { stage = s.dataset.stage; renderDiscover(); } });
$('stack').addEventListener('click', (e) => {
  const nx = e.target.closest('[data-next]'), org = e.target.closest('[data-organize]'), rv = e.target.closest('[data-review]');
  if (nx) { stage = nx.dataset.next; renderDiscover(); }
  if (org) closeDiscover();
  if (rv) {
    const back = S.plan.skipped.filter((s) => s.type === rv.dataset.review);
    S.plan.skipped = S.plan.skipped.filter((s) => s.type !== rv.dataset.review);
    S.plan.sugg.push(...back);
    renderDiscover();
  }
});
function fling(dir) {
  const c = $('stack').querySelector('.dcard.top');
  if (!c) return Promise.resolve();
  c.classList.add('anim');
  c.querySelector(dir > 0 ? '.yes' : '.no').style.opacity = 1;
  c.style.transform = `translate(${dir * 480}px, 30px) rotate(${dir * 24}deg)`;
  c.style.opacity = 0;
  return new Promise((r) => setTimeout(r, 280));
}
async function decide(yes) {
  const it = pendingOf(stage)[0];
  if (!it || busy) return;
  busy = true;
  await fling(yes ? 1 : -1);
  busy = false;
  S.plan.sugg = S.plan.sugg.filter((s) => s !== it);
  (yes ? S.plan.picked : S.plan.skipped).push(it);
  lastAct = { yes, it };
  renderDiscover();
}
function undoLast() {
  const a = lastAct;
  if (!a) return;
  if (a.yes) S.plan.picked = S.plan.picked.filter((p) => p !== a.it);
  else S.plan.skipped = S.plan.skipped.filter((p) => p !== a.it);
  S.plan.sugg.unshift(a.it);
  stage = a.it.type;
  lastAct = null;
  renderDiscover();
}
$('noAct').onclick = () => decide(false);
$('yesAct').onclick = () => decide(true);
$('undoAct').onclick = undoLast;
$('discClose').onclick = closeDiscover;
$('goOrganize').onclick = closeDiscover;
$('openDiscover').onclick = openDiscover;
document.addEventListener('keydown', (e) => {
  if ($('disc').hidden || e.target.matches('input, textarea')) return;
  if (e.key === 'ArrowRight') decide(true);
  if (e.key === 'ArrowLeft') decide(false);
  if (e.key === 'Escape') closeDiscover();
});

let sw = null;
$('stack').addEventListener('pointerdown', (e) => {
  const c = e.target.closest('.dcard.top');
  if (!c || busy) return;
  sw = { c, x: e.clientX, y: e.clientY, dx: 0 };
  c.classList.remove('anim');
  c.setPointerCapture(e.pointerId);
});
$('stack').addEventListener('pointermove', (e) => {
  if (!sw) return;
  sw.dx = e.clientX - sw.x;
  sw.c.style.transform = `translate(${sw.dx}px, ${(e.clientY - sw.y) * 0.3}px) rotate(${sw.dx / 16}deg)`;
  sw.c.querySelector('.yes').style.opacity = Math.max(0, Math.min(1, sw.dx / 90));
  sw.c.querySelector('.no').style.opacity = Math.max(0, Math.min(1, -sw.dx / 90));
});
function endSwipe() {
  if (!sw) return;
  const { c, dx } = sw;
  sw = null;
  if (dx > 90) return decide(true);
  if (dx < -90) return decide(false);
  c.classList.add('anim');
  c.style.transform = '';
  c.querySelectorAll('.stamp').forEach((s) => { s.style.opacity = 0; });
}
$('stack').addEventListener('pointerup', endSwipe);
$('stack').addEventListener('pointercancel', endSwipe);

$('planGo').onclick = () => go('main');
$('planBack').onclick = () => go('prefs');
$('planClose').onclick = () => go('main');
$('tabPlan').onclick = () => go('plan');

/* ---------- navegação de desenvolvimento: abrir qualquer tela pelo endereço (#plan, #main…) ---------- */
const DEV_ROUTES = ['intro', 'dest', 'dates', 'budget', 'prefs', 'loading', 'discover', 'organize', 'main'];
// Exemplo para abrir "Organizar" já com lugares escolhidos e alguns horários preenchidos.
function seedDemo() {
  const take = (ty, n) => S.plan.sugg.filter((s) => s.type === ty).slice(0, n);
  const picks = [...take('refeicao', 2), ...take('praia', 2), ...take('passeio', 2), ...take('cafe', 1)];
  S.plan.sugg = S.plan.sugg.filter((s) => !picks.includes(s));
  S.plan.picked = picks;
  const first = picks.find((p) => p.type === 'refeicao'), beach = picks.find((p) => p.type === 'praia');
  if (first) placeItem(first, 0, '12:00');
  if (beach) placeItem(beach, 0, '10:00');
}
function route() {
  const r = location.hash.slice(1);
  if (!DEV_ROUTES.includes(r)) return go('intro');
  if (r === 'discover' || r === 'organize') {
    ensurePlan();
    if (r === 'organize' && !chosen().length) seedDemo();
    go('plan');
    if (r === 'discover') openDiscover();
    return;
  }
  go(r);
}
window.addEventListener('hashchange', route);

hnav($('dayStrip'));
hnav($('trayRow'));
$('noAct').innerHTML = svg('x', 24, 2.4);
$('yesAct').innerHTML = svg('check', 26, 2.6);
$('undoAct').innerHTML = svg('undo', 18, 2.2);
setSheet('half');

route();
