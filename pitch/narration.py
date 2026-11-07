"""Gera a narração (uma faixa por fala) com o Piper e grava as durações em narration.json.

  python3 -I narration.py [voz] [velocidade] [versão]   voz: faber | cadu | jeff (padrão faber); versão: v2 | v4 | v5 (padrão v5)
"""
import json, os, subprocess, sys, wave
HERE = os.path.dirname(os.path.abspath(__file__))
TTS = os.path.join(HERE, 'tts')
VOICE = sys.argv[1] if len(sys.argv) > 1 else 'faber'
SPEED = sys.argv[2] if len(sys.argv) > 2 else '0.95'   # length_scale (<1 = mais rápido)
VERSION = sys.argv[3] if len(sys.argv) > 3 else 'v5'  # v2 (usada também no v3), v4 ou v5
SUFFIX = {'v2': '', 'v4': '4', 'v5': '5'}[VERSION]

# id, texto falado (números por extenso para a pronúncia sair certa)
LINES_V4 = [
    ('hook', 'Sexta à noite. A viagem pro litoral é amanhã.'),
    ('hook2', 'E você ainda não sabe onde vai comer, o que fazer, nem quanto vai gastar.'),
    ('chaos', 'Aí começam as abas, os posts salvos, a planilha, o grupo da viagem.'),
    ('chaos2', 'E chegando lá, você perde o dia decidindo.'),
    ('n1', 'Antes de reservar, visitamos duzentas e setenta e sete páginas. São cinco horas de pesquisa.'),
    ('n2', 'E quase metade planeja pelas redes sociais, que não mostram preço, distância nem horário.'),
    ('reveal', 'Conheça o Partiu.'),
    ('quiz', 'Diga quanto quer gastar e o que você curte.'),
    ('load', 'O Partiu mostra só o que cabe no seu bolso.'),
    ('swipe', 'Deslize e escolha o que vale a pena.'),
    ('plan', 'O roteiro sai pronto, dia a dia.'),
    ('map', 'Com o gasto de cada dia, no mapa.'),
    ('market', 'E o litoral catarinense recebeu sessenta por cento mais turistas estrangeiros.'),
    ('end', 'Com o Partiu, você chega sabendo o que fazer, onde comer e quanto vai gastar.'),
]
# v5: baseada na pesquisa de rua (pesquisa/insights.md): reservar é fácil, decidir o que fazer não
LINES_V5 = [
    ('hook', 'Sábado de manhã. Você acabou de chegar no litoral.'),
    ('hook2', 'A hospedagem está garantida. Mas onde comer, o que fazer, e quanto vai gastar?'),
    ('chaos', 'Aí começa a busca: Google, Instagram, a dica do amigo, o grupo da viagem.'),
    ('chaos2', 'E o dia passa enquanto você decide.'),
    ('n1', 'Fomos para a rua e ouvimos vinte e nove viajantes. Para sessenta e oito por cento, reservar foi fácil.'),
    ('n2', 'O problema é decidir. Cinquenta e nove por cento tiveram imprevistos, mesmo pesquisando em várias fontes.'),
    ('reveal', 'Conheça o Partiu.'),
    ('quiz', 'Diga quanto quer gastar e o que você curte.'),
    ('load', 'O Partiu mostra só o que cabe no seu bolso.'),
    ('swipe', 'Deslize e escolha o que vale a pena.'),
    ('plan', 'O roteiro sai pronto, dia a dia.'),
    ('map', 'Com o gasto de cada dia, no mapa.'),
    ('market', 'E o litoral catarinense recebeu sessenta por cento mais turistas estrangeiros.'),
    ('end', 'Com o Partiu, você chega sabendo o que fazer, onde comer e quanto vai gastar.'),
]
LINES_V2 = [
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

LINES = {'v2': LINES_V2, 'v4': LINES_V4, 'v5': LINES_V5}[VERSION]
out = os.path.join(HERE, 'audio', 'voice' + SUFFIX)
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
json.dump({'voice': VOICE, 'durations': meta}, open(os.path.join(HERE, f'narration{SUFFIX}.json'), 'w'), indent=2)
open(os.path.join(HERE, f'narration{SUFFIX}.js'), 'w').write('window.NARR = ' + json.dumps(meta) + ';\n')
print('total', round(sum(meta.values()), 2))
