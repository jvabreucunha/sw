"""Renderiza video.html quadro a quadro.

  python3 -I render.py stills 3 12 30      -> PNGs nesses segundos (para revisar)
  python3 -I render.py video [fps]         -> partiu-pitch.mp4 (precisa do ffmpeg)
"""
import os, shutil, subprocess, sys, time
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from cdp import Chrome

PAGE = os.environ.get('PAGE', 'video.html')
URL = 'file://' + os.path.join(HERE, PAGE) + '?capture'


def open_page():
    c = Chrome(1920, 1080, 1)
    c.goto(URL)
    c.js('ready')
    time.sleep(0.5)
    return c


def stills(times):
    c = open_page()
    os.makedirs(os.path.join(HERE, 'stills'), exist_ok=True)
    for t in times:
        c.js(f'render({float(t)})')
        p = os.path.join(HERE, 'stills', PAGE.split('.')[0] + f'-{float(t):05.1f}.png')
        open(p, 'wb').write(c.shot())
        print(p)
    c.close()


def video(fps=30):
    ffmpeg = shutil.which('ffmpeg')
    if not ffmpeg:
        sys.exit('ffmpeg não encontrado: sudo apt install -y ffmpeg')
    c = open_page()
    dur = c.js('DURATION')
    n = int(dur * fps)
    out = os.path.join(HERE, os.environ.get('OUT', 'partiu-pitch.mp4'))
    ff = subprocess.Popen([ffmpeg, '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(fps), '-c:v', 'mjpeg', '-i', '-',
                           '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
                          stdin=subprocess.PIPE)
    t0 = time.time()
    for i in range(n):
        c.js(f'render({i / fps})')
        ff.stdin.write(c.shot('jpeg', quality=95))
        if i % (fps * 5) == 0:
            print(f'{i / fps:5.1f}s / {dur}s  ({time.time() - t0:.0f}s)', flush=True)
    ff.stdin.close()
    ff.wait()
    c.close()
    print(out)


if __name__ == '__main__':
    if sys.argv[1] == 'stills':
        stills(sys.argv[2:])
    else:
        video(int(sys.argv[2]) if len(sys.argv) > 2 else 30)
