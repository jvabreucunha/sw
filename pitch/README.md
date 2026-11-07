# Pitch em vídeo do Partiu

Vídeo de até 1 minuto (1920×1080, 30 fps) com narração, trilha e efeitos, gerado a partir de páginas HTML renderizadas quadro a quadro no Chrome.

Versão atual: `partiu-pitch-v3.mp4`. As anteriores (`v1`, `v2`) ficam de referência.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `timeline.js` | Tempos de cada cena, fala, legenda e efeito sonoro (fonte única de sincronia) |
| `video2.html` | O vídeo (v2 e v3). Abra no Chrome para ver a prévia em tempo real; `?t=27` começa do segundo 27 |
| `audio.html` | Música e efeitos sintetizados com Web Audio |
| `narration.py` | Gera a narração com o Piper (`audio/voice/`, `narration.json`, `narration.js`) |
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
python3 -I narration.py faber                     # narração
python3 -m http.server 8000 --directory .. &      # serve o app para a captura
python3 -I capture.py                             # telas do app
PAGE=video2.html OUT=video3-mudo.mp4 python3 -I render.py video
python3 -I mix.py video3-mudo.mp4 partiu-pitch-v3.mp4
```

Os blocos do mapa em `../tiles/` são imagens de aviso (o CARTO passou a exigir chave). Só na captura, `capture.py` troca por blocos do OpenStreetMap em escala de cinza.
