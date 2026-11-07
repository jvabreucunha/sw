// Explorar: mapa Leaflet, painel de lugares e localização.
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
