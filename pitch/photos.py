"""Busca fotos com licença livre no Wikimedia Commons.

  python3 -I photos.py search            -> baixa candidatas para photos/cand/<chave>/ e grava cand.json
  python3 -I photos.py pick nome=[chave:]N ...  -> copia a candidata escolhida para photos/<chave>.jpg e grava credits.json
"""
import json, os, shutil, sys, time, urllib.parse, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
DIR = os.path.join(HERE, 'photos')
UA = {'User-Agent': 'partiu-pitch-video/1.0 (prototype video render)'}

QUERIES = {
    'praia-central': 'Praia Central Balneário Camboriú',
    'cristo-luz': 'Cristo Luz Balneário Camboriú',
    'unipraias': 'Unipraias Balneário Camboriú',
    'laranjeiras': 'Praia de Laranjeiras Balneário Camboriú',
    'hotel': 'hotel room bed interior',
    'cantina': 'spaghetti',
    'mar-brasa': 'grilled fish seafood plate',
    'cafe': 'cappuccino coffee cup cafe',
    'manha-praia': 'beach umbrellas sand Brazil',
    'por-do-sol': 'sunset beach Santa Catarina Brazil',
    'frutos-mar': 'seafood platter shrimp',
    'jantar': 'restaurant dinner table',
    'bombinhas': 'Bombinhas praia',
    'porto-belo': 'Porto Belo Santa Catarina praia',
    'itapema': 'Itapema Meia Praia',
}


def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({**params, 'format': 'json'})
    return json.loads(get(url))


def get(url):
    for i in range(6):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code != 429: raise
            time.sleep(5 * (i + 1))
    raise RuntimeError('429 persistente: ' + url)


def search():
    cpath = os.path.join(DIR, 'cand.json')
    out = json.load(open(cpath)) if os.path.exists(cpath) else {}
    for key, q in QUERIES.items():
        if out.get(key):
            continue
        time.sleep(1.5)
        r = api({'action': 'query', 'generator': 'search', 'gsrsearch': f'filetype:bitmap {q}', 'gsrnamespace': 6, 'gsrlimit': 8,
                 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'iiurlwidth': 900})
        pages = sorted(r.get('query', {}).get('pages', {}).values(), key=lambda p: p['index'])
        d = os.path.join(DIR, 'cand', key); os.makedirs(d, exist_ok=True)
        out[key] = []
        for i, p in enumerate(pages):
            ii = p['imageinfo'][0]; m = ii.get('extmetadata', {})
            if ii.get('width', 0) < 800:
                continue
            lic = m.get('LicenseShortName', {}).get('value', '')
            art = m.get('Artist', {}).get('value', '')
            path = os.path.join(d, f'{len(out[key])}.jpg')
            open(path, 'wb').write(get(ii['thumburl']))
            time.sleep(.6)
            out[key].append({'file': p['title'], 'page': ii['descriptionurl'], 'license': lic, 'artist': art, 'path': path})
        print(key, len(out[key]), flush=True)
        json.dump(out, open(cpath, 'w'), indent=1, ensure_ascii=False)


def pick(args):
    cand = json.load(open(os.path.join(DIR, 'cand.json')))
    cpath = os.path.join(DIR, 'credits.json')
    credits = json.load(open(cpath)) if os.path.exists(cpath) else {}
    for a in args:
        k, n = a.split('=')
        src, n = n.split(':') if ':' in n else (k, n)
        c = cand[src][int(n)]
        shutil.copy(c['path'], os.path.join(DIR, k + '.jpg'))
        credits[k] = {x: c[x] for x in ('file', 'page', 'license', 'artist')}
    json.dump(credits, open(cpath, 'w'), indent=1, ensure_ascii=False)
    print(len(credits), 'fotos escolhidas')


if __name__ == '__main__':
    search() if sys.argv[1] == 'search' else pick(sys.argv[2:])
