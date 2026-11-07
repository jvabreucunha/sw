"""Captura as telas do Partiu (servido em localhost:8000) como PNGs para o vídeo."""
import os, sys, threading, time
sys.path.insert(0, os.path.dirname(__file__))
from cdp import Chrome

BASE = 'http://localhost:8000/app.html'
OUT = os.path.join(os.path.dirname(__file__), 'shots')
os.makedirs(OUT, exist_ok=True)

c = Chrome(600, 900, scale=3)

# Os blocos do mapa no repo são imagens de aviso (o CARTO passou a exigir chave). Para a gravação,
# usa os blocos do OpenStreetMap em escala de cinza, para combinar com o visual monocromático.
c.send('Fetch.enable', patterns=[{'urlPattern': '*/tiles/*'}])
def on_event(msg):
    if msg.get('method') != 'Fetch.requestPaused':
        return
    p = msg['params']
    path = p['request']['url'].split('/tiles/')[1]
    url = f'https://tile.openstreetmap.org/{path}'
    threading.Thread(target=lambda: c.send('Fetch.continueRequest', requestId=p['requestId'], url=url), daemon=True).start()
c.handlers.append(on_event)

# Fotos reais (Wikimedia Commons, ver photos/credits.json) no lugar das ilustrações dos lugares.
import base64, json
PHOTO_OF = {
    'Hotel Orla Central': 'hotel', 'Praia Central': 'praia-central', 'Cristo Luz': 'cristo-luz', 'Parque Unipraias': 'unipraias',
    'Cantina da Barra': 'cantina', 'Mar & Brasa': 'mar-brasa', 'Café Atlântico': 'cafe', 'Praia de Laranjeiras': 'laranjeiras',
    'Manhã de praia': 'manha-praia', 'Pôr do sol na orla': 'por-do-sol', 'Almoço de frutos do mar': 'frutos-mar', 'Jantar no centro': 'jantar',
}
PHOTOS = {t: 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(os.path.dirname(__file__), 'photos', k + '.jpg'), 'rb').read()).decode()
          for t, k in PHOTO_OF.items()}
PHOTO_JS = '''(() => {
  const P = %s;
  const fix = () => document.querySelectorAll('.photo, .pph, .tph, .place .thumb').forEach((el) => {
    if (el.dataset.real) return;
    const t = (el.getAttribute('aria-label') || '').replace('Foto de ', '') ||
      el.closest('.dcard, .ev-card, .tcard, .fit-row, .place')?.querySelector('strong')?.textContent;
    if (!P[t]) return;
    el.dataset.real = 1;
    el.style.overflow = 'hidden';
    el.innerHTML = `<img src="${P[t]}" alt="" style="width:100%%;height:100%%;object-fit:cover;display:block">`;
  });
  fix();
  new MutationObserver(fix).observe(document.body, { childList: true, subtree: true });
})()''' % json.dumps(PHOTOS)

CSS = ".leaflet-tile-pane{filter:grayscale(1) brightness(1.12) contrast(.82)} .dev-link{display:none!important} .phone{box-shadow:none!important;border-radius:0!important}"

def phone_rect():
    return c.js("(() => { const r = document.querySelector('.phone').getBoundingClientRect(); return {x:r.x, y:r.y, width:r.width, height:r.height}; })()")

def open_route(r):
    c.goto('about:blank')
    c.js("1")
    c.goto(f'{BASE}#{r}')
    c.js(f"(() => {{ const s = document.createElement('style'); s.textContent = {CSS!r}; document.head.appendChild(s); }})()")
    c.js(PHOTO_JS)
    time.sleep(1.2)

def snap(name):
    c.js("document.fonts.ready")
    time.sleep(0.2)
    with open(os.path.join(OUT, name + '.png'), 'wb') as f:
        f.write(c.shot(clip=phone_rect()))
    print('ok', name)

def click(sel, wait=0.6):
    c.js(f"document.querySelector({sel!r}).click()")
    time.sleep(wait)

steps = sys.argv[1:] or ['intro', 'dest', 'dates', 'budget', 'prefs', 'loading', 'discover', 'organize', 'main']
for r in steps:
    open_route(r)
    if r == 'loading':
        time.sleep(0.6)
    if r == 'main':
        time.sleep(3)
        c.js("document.querySelectorAll('.leaflet-control-attribution').forEach(e => e.innerHTML = '© OpenStreetMap')")
    snap(r)
    if r == 'discover':
        for i in range(1, 4):
            click('#yesAct', 0.9)
            snap(f'discover{i}')
c.close()
