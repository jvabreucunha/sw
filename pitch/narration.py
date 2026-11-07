"""Gera a narração (uma faixa por fala) com o Piper e grava as durações em narration.json.

  python3 -I narration.py [voz] [velocidade]      voz: faber | cadu | jeff (padrão faber)
"""
import json, os, subprocess, sys, wave
HERE = os.path.dirname(os.path.abspath(__file__))
TTS = os.path.join(HERE, 'tts')
VOICE = sys.argv[1] if len(sys.argv) > 1 else 'faber'
SPEED = sys.argv[2] if len(sys.argv) > 2 else '0.95'   # length_scale (<1 = mais rápido)

# id, texto falado (números por extenso para a pronúncia sair certa)
LINES = [
    ('hook', 'Viajar é fácil. Planejar, não.'),
    ('chaos', 'Posts salvos, dezenas de abas, planilha, grupo da viagem. E o roteiro nunca sai.'),
    ('n1', 'Antes de reservar, visitamos duzentas e setenta e sete páginas.'),
    ('n2', 'Quase metade planeja pelas redes sociais.'),
    ('n3', 'E o litoral catarinense recebeu sessenta por cento mais turistas estrangeiros.'),
    ('reveal', 'Conheça o Partiu. Sua viagem inteira, em um só lugar.'),
    ('quiz', 'Responda quatro perguntas.'),
    ('load', 'O Partiu encontra lugares que cabem no seu bolso.'),
    ('swipe', 'Deslize para escolher.'),
    ('plan', 'Organize tudo, dia a dia.'),
    ('map', 'E veja a viagem inteira no mapa.'),
    ('end', 'Partiu. Planeje menos. Viaje mais.'),
]

out = os.path.join(HERE, 'audio', 'voice')
os.makedirs(out, exist_ok=True)
meta = {}
for key, text in LINES:
    wav = os.path.join(out, key + '.wav')
    subprocess.run([os.path.join(TTS, 'piper', 'piper'), '--model', os.path.join(TTS, f'pt_BR-{VOICE}-medium.onnx'),
                    '--length_scale', SPEED, '--sentence_silence', '0.25', '--output_file', wav],
                   input=text.encode(), check=True, stderr=subprocess.DEVNULL)
    with wave.open(wav) as w:
        meta[key] = round(w.getnframes() / w.getframerate(), 3)
    print(f'{key:7s} {meta[key]:5.2f}s  {text}')
json.dump({'voice': VOICE, 'durations': meta}, open(os.path.join(HERE, 'narration.json'), 'w'), indent=2)
open(os.path.join(HERE, 'narration.js'), 'w').write('window.NARR = ' + json.dumps(meta) + ';\n')
print('total', round(sum(meta.values()), 2))
