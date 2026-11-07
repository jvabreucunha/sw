"""Gera música e efeitos (audio.html), mixa com a narração e junta ao vídeo.

  python3 -I mix.py [video.mp4] [saida.mp4]
  TL=timeline4.js python3 -I mix.py ...      (v4: usa timeline4.js, narration4.json e audio/voice4/)
"""
import base64, json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from cdp import Chrome

AUD = os.path.join(HERE, 'audio')
TLFILE = os.environ.get('TL', 'timeline.js')
SUF = '4' if TLFILE == 'timeline4.js' else ''
voice = json.load(open(os.path.join(HERE, f'narration{SUF}.json')))['durations']

c = Chrome(400, 300, 1)
c.goto('file://' + os.path.join(HERE, 'audio.html') + '?tl=' + TLFILE)
TL = c.js('TL')
for name, call in [('music', f'buildMusic({json.dumps(voice)})'), ('sfx', 'buildSfx()')]:
    n = c.js(f'(async () => {{ window.OUT = await {call}; return OUT.length; }})()')
    b64 = ''.join(c.js(f'OUT.slice({i}, {i + 4_000_000})') for i in range(0, n, 4_000_000))
    open(os.path.join(AUD, name + '.wav'), 'wb').write(base64.b64decode(b64))
    print('ok', name)
c.close()

# mixagem: voz tratada e posicionada, música e efeitos por baixo, loudness de -14 LUFS
dur = TL['duration']
inputs = ['-i', os.path.join(AUD, 'music.wav'), '-i', os.path.join(AUD, 'sfx.wav')]
chains, labels = [], []
for i, (k, t0) in enumerate(TL['voice'].items()):
    inputs += ['-i', os.path.join(AUD, 'voice' + SUF, k + '.wav')]
    ms = int(t0 * 1000)
    chains.append(f'[{i + 2}:a]aresample=48000,pan=stereo|c0=c0|c1=c0,highpass=f=80,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3500:t=q:w=1.2:g=3,'
                  f'acompressor=threshold=-22dB:ratio=3:attack=4:release=90:makeup=2,adelay={ms}|{ms}[v{i}]')
    labels.append(f'[v{i}]')
fc = ';'.join(chains)
fc += f';{"".join(labels)}amix=inputs={len(labels)}:normalize=0,volume=1.0[voz]'
fc += ';[0:a]volume=0.55[mus];[1:a]volume=0.75[fx]'
fc += f';[voz][mus][fx]amix=inputs=3:normalize=0,atrim=0:{dur},loudnorm=I=-14:TP=-1.5:LRA=11[out]'
mixwav = os.path.join(AUD, 'mix.wav')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', fc, '-map', '[out]', '-ar', '48000', mixwav], check=True)
print('ok mix', mixwav)

if len(sys.argv) > 2:
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', sys.argv[1], '-i', mixwav, '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', sys.argv[2]], check=True)
    print('ok', sys.argv[2])
