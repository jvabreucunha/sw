// Uso: node scripts/download-tiles.js
// Baixa os blocos do mapa (CARTO Positron) que cobrem as 4 cidades e o Shopping Russi & Russi.
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..');
const pts = {
  bc: [[-26.9905, -48.6330], [-26.9853, -48.6452], [-27.0052, -48.6034], [-27.0055, -48.6125], [-26.9700, -48.6370], [-26.9969, -48.5890]],
  itapema: [[-27.1240, -48.6045], [-27.1015, -48.6137], [-27.0864, -48.5963], [-27.0990, -48.6150], [-27.12853, -48.60103]],
  portobelo: [[-27.1570, -48.5500], [-27.1402, -48.5436], [-27.1587, -48.5533], [-27.1350, -48.5302]],
  tijucas: [[-27.2410, -48.6350], [-27.2452, -48.6372], [-27.2400, -48.6370]]
};
const lx = (lon, z) => Math.floor((lon + 180) / 360 * 2 ** z);
const ly = (lat, z) => { const r = lat * Math.PI / 180; return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * 2 ** z); };
const set = new Set();
function addBox(latMin, latMax, lonMin, lonMax, zs) {
  for (const z of zs) for (let x = lx(lonMin, z); x <= lx(lonMax, z); x++) for (let y = ly(latMax, z); y <= ly(latMin, z); y++) set.add(`${z}/${x}/${y}`);
}
for (const list of Object.values(pts)) {
  const lats = list.map((p) => p[0]), lons = list.map((p) => p[1]), pad = 0.012;
  addBox(Math.min(...lats) - pad, Math.max(...lats) + pad, Math.min(...lons) - pad, Math.max(...lons) + pad, [13, 14, 15]);
}
addBox(-27.27, -26.95, -48.67, -48.51, [11, 12]); // visão geral da região
const tiles = [...set];
(async () => {
  let bytes = 0, i = 0, fail = 0;
  async function worker() {
    while (i < tiles.length) {
      const t = tiles[i++], file = path.join(OUT, 'tiles', t + '.png');
      if (fs.existsSync(file)) { bytes += fs.statSync(file).size; continue; }
      const s = 'abcd'[Math.abs(t.length) % 4];
      const res = await fetch(`https://${s}.basemaps.cartocdn.com/light_all/${t}.png`, { headers: { 'User-Agent': 'partiu-mockup/1.0' } });
      if (!res.ok) { fail++; continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, buf);
      bytes += buf.length;
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  console.log(`${tiles.length} blocos, ${fail} falhas, ${(bytes / 1024).toFixed(0)} KB`);
})();
