# Pitch em vídeo do Partiu

Vídeo de até 1 minuto (1920×1080, 30 fps) com narração, trilha e efeitos, gerado a partir de páginas HTML renderizadas quadro a quadro no Chrome.

Versão atual: `partiu-pitch-v4.mp4` (60 s), com a dor do viajante no centro: o gancho mostra as três dúvidas (onde comer, o que fazer, quanto gastar), cada passo do app responde a uma delas e o fim fecha com as respostas. As anteriores (`v1` a `v3`) ficam de referência.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `timeline4.js` | v4: tempos de cada cena, fala, legenda e efeito sonoro (fonte única de sincronia) |
| `video4.html`, `video4.js` | v4: o vídeo. Abra no Chrome para a prévia em tempo real; `?t=30` começa do segundo 30 |
| `timeline.js` | v2 e v3: tempos de cada cena, fala, legenda e efeito |
| `video2.html` | v2 e v3: o vídeo |
| `audio.html` | Música e efeitos sintetizados com Web Audio |
| `narration.py` | Gera a narração com o Piper (v4: `audio/voice4/`, `narration4.json`, `narration4.js`; v2: sem o 4) |
| `capture.py` | Captura as telas do app (`shots/`) com fotos reais no lugar das ilustrações |
| `photos.py` | Busca e escolhe fotos no Wikimedia Commons (`photos/`, `photos/credits.json`) |
| `render.py` | Renderiza o vídeo (`stills` para quadros soltos, `video` para o MP4 mudo) |
| `mix.py` | Gera música e efeitos, mixa com a voz e junta ao vídeo |
| `cdp.py` | Cliente mínimo do Chrome DevTools Protocol (só biblioteca padrão do Python) |
| `CREDITOS.md` | Autores e licenças das fotos |

## Como gerar de novo

Precisa de Python 3, Google Chrome e ffmpeg.

```bash
tts/download.sh                                   # Piper e vozes (uma vez, ~250 MB)
python3 -I narration.py faber 0.9 v4              # narração
python3 -m http.server 8000 --directory .. &      # serve o app para a captura
python3 -I capture.py                             # telas do app
PAGE=video4.html OUT=video4-mudo.mp4 python3 -I render.py video
TL=timeline4.js python3 -I mix.py video4-mudo.mp4 partiu-pitch-v4.mp4
```

Os blocos do mapa em `../tiles/` são imagens de aviso (o CARTO passou a exigir chave). Só na captura, `capture.py` troca por blocos do OpenStreetMap em escala de cinza.
