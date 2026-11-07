"""Junta PNGs numa folha de contato: python3 -I sheet.py saida.png larg img1 img2 ..."""
import os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Chrome
out, w, imgs = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
cols = 3
html = '<body style="margin:0;background:#555;display:grid;grid-template-columns:repeat(%d,%dpx);gap:6px;padding:6px;font:14px sans-serif;color:#fff">' % (cols, w)
html += ''.join(f'<div><img src="file://{os.path.abspath(i)}" style="width:{w}px;display:block">{os.path.basename(i)}</div>' for i in imgs)
p = out + '.html'; open(p, 'w').write(html)
rows = -(-len(imgs) // cols)
c = Chrome(cols * (w + 6) + 6, rows * (int(w * 9 / 16) + 26) + 6, 1)
c.goto('file://' + os.path.abspath(p)); time.sleep(.8)
open(out, 'wb').write(c.shot()); c.close(); os.remove(p)
