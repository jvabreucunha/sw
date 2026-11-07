// Roteiro: escolher lugares por categoria e organizar na linha do tempo.
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
