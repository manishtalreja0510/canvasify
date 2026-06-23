// Browser-only — uses Canvas API. Call only from client-side code.

export interface PaletteColor {
  number: number;
  hex: string;
  r: number;
  g: number;
  b: number;
  coverage: number;
}

export interface PBNResult {
  svg: string;
  palette: PaletteColor[];
  width: number;
  height: number;
  regionCount: number;
}

const MAX_CELLS = 20_000;
const MIN_REGION = 4;
const CS = 6; // SVG units per cell

async function loadPixels(src: string): Promise<{ data: Uint8ClampedArray; w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      if (!ctx) { reject(new Error("Canvas unavailable")); return; }
      ctx.drawImage(img, 0, 0);
      resolve({ data: ctx.getImageData(0, 0, c.width, c.height).data, w: c.width, h: c.height });
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

function downscale(data: Uint8ClampedArray, sw: number, sh: number): { data: Uint8ClampedArray; w: number; h: number } {
  const r = Math.sqrt(MAX_CELLS / (sw * sh));
  if (r >= 1) return { data, w: sw, h: sh };
  const dw = Math.max(1, Math.round(sw * r));
  const dh = Math.max(1, Math.round(sh * r));

  const src = document.createElement("canvas");
  src.width = sw; src.height = sh;
  const sCtx = src.getContext("2d")!;
  sCtx.putImageData(new ImageData(data.slice(), sw, sh), 0, 0);

  const dst = document.createElement("canvas");
  dst.width = dw; dst.height = dh;
  const dCtx = dst.getContext("2d")!;
  dCtx.drawImage(src, 0, 0, dw, dh);
  return { data: dCtx.getImageData(0, 0, dw, dh).data, w: dw, h: dh };
}

function d2(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
}

function kmeans(data: Uint8ClampedArray, n: number, k: number): [number, number, number][] {
  const step = Math.max(1, Math.floor(n / 4000));
  const sample: [number, number, number][] = [];
  for (let i = 0; i < n; i += step) {
    sample.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
  }
  const m = sample.length;

  // k-means++ init (deterministic: first center at 10% of sample)
  const centers: [number, number, number][] = [sample[Math.floor(m * 0.1)]];
  for (let c = 1; c < k; c++) {
    const dists = sample.map(([r, g, b]) => {
      let min = Infinity;
      for (const [cr, cg, cb] of centers) min = Math.min(min, d2(r, g, b, cr, cg, cb));
      return min;
    });
    const total = dists.reduce((a, b) => a + b, 0);
    let t = total * 0.5;
    let chosen = sample[m - 1];
    for (let i = 0; i < m; i++) { t -= dists[i]; if (t <= 0) { chosen = sample[i]; break; } }
    centers.push(chosen);
  }

  const labels = new Uint8Array(m);
  for (let iter = 0; iter < 20; iter++) {
    let moved = false;
    for (let i = 0; i < m; i++) {
      const [r, g, b] = sample[i];
      let best = 0, bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const dd = d2(r, g, b, centers[c][0], centers[c][1], centers[c][2]);
        if (dd < bestD) { bestD = dd; best = c; }
      }
      if (labels[i] !== best) { labels[i] = best; moved = true; }
    }
    if (!moved) break;

    const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
    for (let i = 0; i < m; i++) {
      const c = labels[i];
      sums[c][0] += sample[i][0]; sums[c][1] += sample[i][1];
      sums[c][2] += sample[i][2]; sums[c][3]++;
    }
    for (let c = 0; c < k; c++) {
      if (sums[c][3]) centers[c] = [
        Math.round(sums[c][0] / sums[c][3]),
        Math.round(sums[c][1] / sums[c][3]),
        Math.round(sums[c][2] / sums[c][3]),
      ];
    }
  }
  return centers;
}

function assignLabels(data: Uint8ClampedArray, n: number, palette: [number, number, number][]): Uint8Array {
  const labels = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    let best = 0, bestD = Infinity;
    for (let c = 0; c < palette.length; c++) {
      const dd = d2(r, g, b, palette[c][0], palette[c][1], palette[c][2]);
      if (dd < bestD) { bestD = dd; best = c; }
    }
    labels[i] = best;
  }
  return labels;
}

type Region = { pixels: number[]; label: number };

function floodFill(labels: Uint8Array, w: number, h: number): Region[] {
  const n = w * h;
  const seen = new Uint8Array(n);
  const regions: Region[] = [];
  for (let start = 0; start < n; start++) {
    if (seen[start]) continue;
    const label = labels[start];
    const region: Region = { pixels: [], label };
    regions.push(region);
    const queue = [start];
    seen[start] = 1;
    let qi = 0;
    while (qi < queue.length) {
      const p = queue[qi++];
      region.pixels.push(p);
      const x = p % w, y = (p / w) | 0;
      if (x > 0 && !seen[p-1] && labels[p-1] === label) { seen[p-1] = 1; queue.push(p-1); }
      if (x < w-1 && !seen[p+1] && labels[p+1] === label) { seen[p+1] = 1; queue.push(p+1); }
      if (y > 0 && !seen[p-w] && labels[p-w] === label) { seen[p-w] = 1; queue.push(p-w); }
      if (y < h-1 && !seen[p+w] && labels[p+w] === label) { seen[p+w] = 1; queue.push(p+w); }
    }
  }
  return regions;
}

function mergeSmall(labels: Uint8Array, w: number, h: number): Uint8Array {
  const result = new Uint8Array(labels);
  for (let pass = 0; pass < 3; pass++) {
    const regions = floodFill(result, w, h);
    let anyMerged = false;
    for (const { pixels, label } of regions) {
      if (pixels.length >= MIN_REGION) continue;
      const counts = new Map<number, number>();
      for (const p of pixels) {
        const x = p % w, y = (p / w) | 0;
        if (x > 0 && result[p-1] !== label) counts.set(result[p-1], (counts.get(result[p-1])||0)+1);
        if (x < w-1 && result[p+1] !== label) counts.set(result[p+1], (counts.get(result[p+1])||0)+1);
        if (y > 0 && result[p-w] !== label) counts.set(result[p-w], (counts.get(result[p-w])||0)+1);
        if (y < h-1 && result[p+w] !== label) counts.set(result[p+w], (counts.get(result[p+w])||0)+1);
      }
      let bestLbl = label, bestCnt = 0;
      for (const [lbl, cnt] of counts) { if (cnt > bestCnt) { bestCnt = cnt; bestLbl = lbl; } }
      if (bestLbl !== label) {
        for (const p of pixels) result[p] = bestLbl;
        anyMerged = true;
      }
    }
    if (!anyMerged) break;
  }
  return result;
}

function buildEdgePaths(labels: Uint8Array, w: number, h: number): string {
  const segs: string[] = [];

  // Horizontal edges (boundary between row y and y+1)
  for (let y = 0; y < h - 1; y++) {
    let runX = -1;
    for (let x = 0; x <= w; x++) {
      const boundary = x < w && labels[y * w + x] !== labels[(y + 1) * w + x];
      if (boundary && runX < 0) {
        runX = x;
      } else if (!boundary && runX >= 0) {
        segs.push(`M${runX * CS},${(y + 1) * CS}H${x * CS}`);
        runX = -1;
      }
    }
  }

  // Vertical edges (boundary between col x and x+1)
  for (let x = 0; x < w - 1; x++) {
    let runY = -1;
    for (let y = 0; y <= h; y++) {
      const boundary = y < h && labels[y * w + x] !== labels[y * w + x + 1];
      if (boundary && runY < 0) {
        runY = y;
      } else if (!boundary && runY >= 0) {
        segs.push(`M${(x + 1) * CS},${runY * CS}V${y * CS}`);
        runY = -1;
      }
    }
  }

  return segs.join(" ");
}

function toHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}

function buildSVG(
  labels: Uint8Array,
  w: number, h: number,
  palette: [number, number, number][],
  colorNums: number[],
  regions: Region[],
  watermark: boolean,
): string {
  const imgW = w * CS;
  const imgH = h * CS;
  const LEGEND_COLS = Math.min(6, palette.length);
  const SWATCH = 14;
  const ROW_H = 22;
  const PAD = 14;
  const legendRows = Math.ceil(palette.length / LEGEND_COLS);
  const legendH = PAD * 2 + 16 + legendRows * ROW_H;
  const totalH = imgH + legendH;

  const edgePath = buildEdgePaths(labels, w, h);

  // Number labels: one per connected region, skip tiny regions
  const MIN_LABEL = 6;
  const textEls: string[] = [];
  for (const { pixels, label } of regions) {
    if (pixels.length < MIN_LABEL) continue;
    let sumX = 0, sumY = 0;
    for (const p of pixels) { sumX += p % w; sumY += (p / w) | 0; }
    const cx = Math.round(sumX / pixels.length);
    const cy = Math.round(sumY / pixels.length);
    let bestP = pixels[0], bestD = Infinity;
    for (const p of pixels) {
      const dx = (p % w) - cx, dy = ((p / w) | 0) - cy;
      const dd = dx * dx + dy * dy;
      if (dd < bestD) { bestD = dd; bestP = p; }
    }
    const tx = ((bestP % w) + 0.5) * CS;
    const ty = (((bestP / w) | 0) + 0.5) * CS;
    const fs = Math.min(10, Math.max(3, Math.sqrt(pixels.length) * 0.7));
    const num = colorNums[label];
    textEls.push(`<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="${fs.toFixed(1)}">${num}</text>`);
  }

  // Legend swatches
  const cellW = Math.floor(imgW / LEGEND_COLS);
  const legendItems: string[] = [];
  const ly0 = imgH + PAD + 16;
  for (let i = 0; i < palette.length; i++) {
    const [r, g, b] = palette[i];
    const col = i % LEGEND_COLS;
    const row = Math.floor(i / LEGEND_COLS);
    const lx = col * cellW + 4;
    const ly = ly0 + row * ROW_H;
    legendItems.push(
      `<rect x="${lx}" y="${ly}" width="${SWATCH}" height="${SWATCH}" fill="${toHex(r,g,b)}" rx="2" stroke="#aaa" stroke-width="0.5"/>`,
      `<text x="${lx + SWATCH + 3}" y="${ly + SWATCH / 2}" dominant-baseline="central" font-size="9" fill="#555">${colorNums[i]}</text>`,
    );
  }

  const wmark = watermark
    ? `<text x="${imgW/2}" y="${imgH - 5}" text-anchor="middle" font-size="7" fill="rgba(124,92,255,0.45)" font-weight="600">Canvasify Preview · canvasify.art</text>`
    : "";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${imgW} ${totalH}">`,
    `<rect width="${imgW}" height="${totalH}" fill="#fff"/>`,
    `<rect width="${imgW}" height="${imgH}" fill="#f9f9f9"/>`,
    `<path d="${edgePath}" stroke="#444" stroke-width="0.8" fill="none" stroke-linecap="square"/>`,
    `<rect x="0.75" y="0.75" width="${imgW - 1.5}" height="${imgH - 1.5}" fill="none" stroke="#111" stroke-width="1.5"/>`,
    `<g font-family="Arial,Helvetica,sans-serif" font-weight="700" fill="#111">${textEls.join("")}</g>`,
    wmark,
    `<line x1="0" y1="${imgH + 1}" x2="${imgW}" y2="${imgH + 1}" stroke="#ddd" stroke-width="1"/>`,
    `<text x="${imgW/2}" y="${imgH + PAD + 5}" text-anchor="middle" font-size="10" font-weight="700" font-family="Arial,sans-serif" fill="#666">Color Legend</text>`,
    legendItems.join(""),
    `</svg>`,
  ].join("\n");
}

export async function generatePBN(
  src: string,
  numColors: number,
  opts: { watermark?: boolean } = {},
): Promise<PBNResult> {
  const { watermark = true } = opts;

  const { data: raw, w: rw, h: rh } = await loadPixels(src);
  const { data, w, h } = downscale(raw, rw, rh);
  const n = w * h;

  const palette = kmeans(data, n, numColors);
  const rawLabels = assignLabels(data, n, palette);
  const labels = mergeSmall(rawLabels, w, h);

  const cov = new Array(numColors).fill(0);
  for (let i = 0; i < n; i++) cov[labels[i]]++;

  // Number 1 = most-used color
  const sortedIdx = Array.from({ length: numColors }, (_, i) => i).sort((a, b) => cov[b] - cov[a]);
  const colorNums = new Array(numColors).fill(0);
  sortedIdx.forEach((pi, rank) => { colorNums[pi] = rank + 1; });

  const regions = floodFill(labels, w, h);
  const svg = buildSVG(labels, w, h, palette, colorNums, regions, watermark);

  const paletteOut: PaletteColor[] = palette.map(([r, g, b], i) => ({
    number: colorNums[i],
    hex: toHex(r, g, b),
    r, g, b,
    coverage: Math.round((cov[i] / n) * 100),
  })).sort((a, b) => a.number - b.number);

  return { svg, palette: paletteOut, width: w, height: h, regionCount: regions.length };
}
