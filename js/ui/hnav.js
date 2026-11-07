// Rolagem lateral com setas e roda do mouse.
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
