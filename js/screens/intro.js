// Apresentação: três telas de boas-vindas.
// Mensagens a partir da pesquisa de rua (nov. 2026): a dor é decidir o que fazer no destino, a informação
// está espalhada em várias fontes e muita coisa foge do plano durante a viagem. Reservar já é fácil.
const SLIDES = [
  { title: 'O que fazer, já no destino', text: 'Chegou e não sabe por onde começar? O Partiu sugere o que fazer, onde comer e onde sair perto de você.',
    art: '<svg viewBox="0 0 240 220" fill="none" stroke="#1C1C1E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 50 L85 30 L155 50 L220 30 L220 170 L155 190 L85 170 L20 190 Z" fill="#fff"/><path d="M85 30 V170 M155 50 V190" stroke="#C7C7CC"/><path d="M60 140 C 90 120 120 130 140 100 S 175 80 190 70" stroke-dasharray="4 7" stroke="#8E8E93"/><circle cx="60" cy="140" r="9" fill="#1C1C1E"/><path d="M190 48 c-11 0 -18 8 -18 17 c0 13 18 28 18 28 s18 -15 18 -28 c0 -9 -7 -17 -18 -17z" fill="#1C1C1E"/><circle cx="190" cy="65" r="5" fill="#fff" stroke="none"/></svg>' },
  { title: 'Tudo num lugar só', text: 'Sem pular entre Google, Instagram e o grupo da viagem. Escolha deslizando e o roteiro do dia sai pronto.',
    art: '<svg viewBox="0 0 240 220" fill="none" stroke="#1C1C1E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="64" y="38" width="112" height="150" rx="16" fill="#fff" stroke="#C7C7CC" transform="rotate(-6 120 113)"/><g class="swipe-card"><rect x="64" y="30" width="112" height="150" rx="16" fill="#fff"/><rect x="76" y="42" width="88" height="68" rx="10" fill="#E4E4E8" stroke="none"/><path d="M84 96l16-18 12 12 8-8 16 14" stroke="#AEAEB4"/><path d="M76 128h56M76 144h36" stroke="#C7C7CC"/><rect x="76" y="156" width="42" height="14" rx="7" fill="#F2F2F5" stroke="none"/></g><circle cx="30" cy="110" r="17" fill="#fff"/><path d="M24 104l12 12M36 104l-12 12"/><circle cx="210" cy="110" r="17" fill="#1C1C1E" stroke="none"/><path d="M203 110l5 5 9-10" stroke="#fff"/></svg>' },
  { title: 'Mudou o plano? A gente ajusta', text: 'Choveu, lotou ou fechou: o Partiu sugere outra opção perto de você, na hora.',
    art: '<svg viewBox="0 0 240 220" fill="none" stroke="#1C1C1E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="56" width="88" height="108" rx="16" fill="#fff" stroke="#C7C7CC"/><path d="M44 106h32a12 12 0 0 0 1.8-23.9A17 17 0 0 0 45 86a10 10 0 0 0-1 20z" stroke="#8E8E93"/><path d="M50 116l-4 8M62 116l-4 8M74 116l-4 8" stroke="#8E8E93"/><path d="M38 142h48" stroke="#E4E4E8"/><path d="M118 110h24M134 101l9 9-9 9"/><rect x="150" y="48" width="76" height="120" rx="16" fill="#1C1C1E" stroke="none"/><path d="M168 98h32v12a13 13 0 0 1-13 13h-6a13 13 0 0 1-13-13z" stroke="#fff"/><path d="M200 102h4a6 6 0 0 1 0 12h-4M178 88q-3-5 0-9M188 88q-3-5 0-9" stroke="#fff"/><path d="M166 144h44" stroke="#3A3A3C"/><circle cx="222" cy="52" r="13" fill="#fff"/><path d="M216 52l4 4 8-8"/></svg>' }
];

/* ---------- onboarding ---------- */
function renderIntro() {
  const s = SLIDES[S.slide];
  $('illus').innerHTML = s.art;
  $('introTitle').textContent = s.title;
  $('introText').textContent = s.text;
  [...$('dots').children].forEach((d, i) => d.classList.toggle('on', i === S.slide));
  $('introNext').textContent = S.slide < 2 ? 'Continuar' : 'Começar';
  $('skip').style.visibility = S.slide < 2 ? 'visible' : 'hidden';
  replay($('illus'), 'swap');
  replay($('introTitle').parentElement, 'swap');
}
$('introNext').onclick = () => { if (S.slide < 2) { S.slide++; renderIntro(); } else go('dest'); };
$('skip').onclick = () => go('dest');
