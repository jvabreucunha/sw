// Apresentação: três telas de boas-vindas.
const SLIDES = [
  { title: 'Sua viagem inteira em um só lugar', text: 'Restaurantes, passeios e hospedagem organizados no mapa.',
    art: '<svg viewBox="0 0 240 220" fill="none" stroke="#1C1C1E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 50 L85 30 L155 50 L220 30 L220 170 L155 190 L85 170 L20 190 Z" fill="#fff"/><path d="M85 30 V170 M155 50 V190" stroke="#C7C7CC"/><path d="M60 140 C 90 120 120 130 140 100 S 175 80 190 70" stroke-dasharray="4 7" stroke="#8E8E93"/><circle cx="60" cy="140" r="9" fill="#1C1C1E"/><path d="M190 48 c-11 0 -18 8 -18 17 c0 13 18 28 18 28 s18 -15 18 -28 c0 -9 -7 -17 -18 -17z" fill="#1C1C1E"/><circle cx="190" cy="65" r="5" fill="#fff" stroke="none"/></svg>' },
  { title: 'Datas e orçamento sob controle', text: 'Defina quando vai e quanto quer gastar. As sugestões respeitam seu limite.',
    art: '<svg viewBox="0 0 240 220" fill="none" stroke="#1C1C1E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="40" y="36" width="160" height="150" rx="20" fill="#fff"/><path d="M40 74 H200 M82 24 V48 M158 24 V48"/><rect x="62" y="116" width="116" height="26" rx="13" fill="#E4E4E8" stroke="none"/><circle cx="75" cy="129" r="13" fill="#1C1C1E" stroke="none"/><circle cx="165" cy="129" r="13" fill="#1C1C1E" stroke="none"/><g fill="#C7C7CC" stroke="none"><circle cx="75" cy="96" r="3.5"/><circle cx="105" cy="96" r="3.5"/><circle cx="135" cy="96" r="3.5"/><circle cx="165" cy="96" r="3.5"/><circle cx="75" cy="162" r="3.5"/><circle cx="105" cy="162" r="3.5"/><circle cx="135" cy="162" r="3.5"/><circle cx="165" cy="162" r="3.5"/></g></svg>' },
  { title: 'Monte o roteiro deslizando', text: 'Escolha os lugares com um gesto e depois organize tudo numa linha do tempo, dia a dia.',
    art: '<svg viewBox="0 0 240 220" fill="none" stroke="#1C1C1E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="64" y="38" width="112" height="150" rx="16" fill="#fff" stroke="#C7C7CC" transform="rotate(-6 120 113)"/><g class="swipe-card"><rect x="64" y="30" width="112" height="150" rx="16" fill="#fff"/><rect x="76" y="42" width="88" height="68" rx="10" fill="#E4E4E8" stroke="none"/><path d="M84 96l16-18 12 12 8-8 16 14" stroke="#AEAEB4"/><path d="M76 128h56M76 144h36" stroke="#C7C7CC"/><rect x="76" y="156" width="42" height="14" rx="7" fill="#F2F2F5" stroke="none"/></g><circle cx="30" cy="110" r="17" fill="#fff"/><path d="M24 104l12 12M36 104l-12 12"/><circle cx="210" cy="110" r="17" fill="#1C1C1E" stroke="none"/><path d="M203 110l5 5 9-10" stroke="#fff"/></svg>' }
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
}
$('introNext').onclick = () => { if (S.slide < 2) { S.slide++; renderIntro(); } else go('dest'); };
$('skip').onclick = () => go('dest');
