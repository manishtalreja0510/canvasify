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

const MAX_CELLS = 30_000;
const MIN_REGION = 10;   // cells — smaller blobs get merged away
const CS = 6;            // SVG units per grid cell
const NUM_FS = 8;        // fixed font-size for all numbers (SVG units)

// ── Image loading & preprocessing ─────────────────────────────────────────────

async function loadPixels(src: string): Promise<{ data: Uint8ClampedArray; w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth; c.height = img.naturalHeight;
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
  src.getContext("2d")!.putImageData(new ImageData(data.slice(), sw, sh), 0, 0);
  const dst = document.createElement("canvas");
  dst.width = dw; dst.height = dh;
  dst.getContext("2d")!.drawImage(src, 0, 0, dw, dh);
  return { data: dst.getContext("2d")!.getImageData(0, 0, dw, dh).data, w: dw, h: dh };
}

// 3×3 Gaussian blur — run multiple times to smooth region edges before quantising
function blur3x3(data: Uint8ClampedArray, w: number, h: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(data);
  const K = [1, 2, 1, 2, 4, 2, 1, 2, 1]; // /16
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let s = 0, ki = 0;
        for (let ky = -1; ky <= 1; ky++)
          for (let kx = -1; kx <= 1; kx++)
            s += data[((y + ky) * w + x + kx) * 4 + c] * K[ki++];
        out[(y * w + x) * 4 + c] = (s / 16 + 0.5) | 0;
      }
    }
  }
  return out;
}

// ── K-means colour quantisation ────────────────────────────────────────────────

function d2(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
}

function kmeans(data: Uint8ClampedArray, n: number, k: number): [number, number, number][] {
  const step = Math.max(1, (n / 5000) | 0);
  const sample: [number, number, number][] = [];
  for (let i = 0; i < n; i += step) sample.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
  const m = sample.length;

  // k-means++ (deterministic seed at 10% of sample)
  const centers: [number, number, number][] = [sample[(m * 0.1) | 0]];
  for (let c = 1; c < k; c++) {
    const dists = sample.map(([r, g, b]) => {
      let min = Infinity;
      for (const [cr, cg, cb] of centers) min = Math.min(min, d2(r, g, b, cr, cg, cb));
      return min;
    });
    const total = dists.reduce((a, b) => a + b, 0);
    let t = total * 0.5, chosen = sample[m - 1];
    for (let i = 0; i < m; i++) { t -= dists[i]; if (t <= 0) { chosen = sample[i]; break; } }
    centers.push(chosen);
  }

  const labels = new Uint8Array(m);
  for (let iter = 0; iter < 30; iter++) {
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
        (sums[c][0] / sums[c][3] + 0.5) | 0,
        (sums[c][1] / sums[c][3] + 0.5) | 0,
        (sums[c][2] / sums[c][3] + 0.5) | 0,
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

// ── Region analysis ────────────────────────────────────────────────────────────

type Region = { pixels: number[]; label: number };

function floodFill(labels: Uint8Array, w: number, h: number): Region[] {
  const n = w * h;
  const seen = new Uint8Array(n);
  const regions: Region[] = [];
  for (let start = 0; start < n; start++) {
    if (seen[start]) continue;
    const lbl = labels[start];
    const region: Region = { pixels: [], label: lbl };
    regions.push(region);
    const q = [start]; seen[start] = 1; let qi = 0;
    while (qi < q.length) {
      const p = q[qi++]; region.pixels.push(p);
      const x = p % w, y = (p / w) | 0;
      if (x > 0     && !seen[p - 1] && labels[p - 1] === lbl) { seen[p - 1] = 1; q.push(p - 1); }
      if (x < w - 1 && !seen[p + 1] && labels[p + 1] === lbl) { seen[p + 1] = 1; q.push(p + 1); }
      if (y > 0     && !seen[p - w] && labels[p - w] === lbl) { seen[p - w] = 1; q.push(p - w); }
      if (y < h - 1 && !seen[p + w] && labels[p + w] === lbl) { seen[p + w] = 1; q.push(p + w); }
    }
  }
  return regions;
}

function mergeSmall(labels: Uint8Array, w: number, h: number): Uint8Array {
  const result = new Uint8Array(labels);
  for (let pass = 0; pass < 5; pass++) {
    const regions = floodFill(result, w, h);
    let anyMerged = false;
    for (const { pixels, label } of regions) {
      if (pixels.length >= MIN_REGION) continue;
      const counts = new Map<number, number>();
      for (const p of pixels) {
        const x = p % w, y = (p / w) | 0;
        if (x > 0     && result[p - 1] !== label) counts.set(result[p - 1], (counts.get(result[p - 1]) || 0) + 1);
        if (x < w - 1 && result[p + 1] !== label) counts.set(result[p + 1], (counts.get(result[p + 1]) || 0) + 1);
        if (y > 0     && result[p - w] !== label) counts.set(result[p - w], (counts.get(result[p - w]) || 0) + 1);
        if (y < h - 1 && result[p + w] !== label) counts.set(result[p + w], (counts.get(result[p + w]) || 0) + 1);
      }
      let bestLbl = label, bestCnt = 0;
      for (const [lbl, cnt] of counts) { if (cnt > bestCnt) { bestCnt = cnt; bestLbl = lbl; } }
      if (bestLbl !== label) { for (const p of pixels) result[p] = bestLbl; anyMerged = true; }
    }
    if (!anyMerged) break;
  }
  return result;
}

// BFS distance transform → find the point furthest from any region boundary
// (pole of inaccessibility) — gives the most "inside" position for a number label
function poleOfInaccessibility(pixels: number[], w: number, h: number, inRegion: Set<number>): [number, number] {
  const dist = new Map<number, number>();
  const q: number[] = [];
  for (const p of pixels) {
    const x = p % w, y = (p / w) | 0;
    const boundary = x === 0 || x === w - 1 || y === 0 || y === h - 1 ||
      !inRegion.has(p - 1) || !inRegion.has(p + 1) || !inRegion.has(p - w) || !inRegion.has(p + w);
    if (boundary) { dist.set(p, 1); q.push(p); }
  }
  let qi = 0;
  while (qi < q.length) {
    const p = q[qi++]; const d = dist.get(p)!;
    for (const nb of [p - 1, p + 1, p - w, p + w]) {
      if (inRegion.has(nb) && !dist.has(nb)) { dist.set(nb, d + 1); q.push(nb); }
    }
  }
  let best = pixels[0], bestD = 0;
  for (const p of pixels) { const d = dist.get(p) || 0; if (d > bestD) { bestD = d; best = p; } }
  return [best % w, (best / w) | 0];
}

// ── Smooth contour tracing ─────────────────────────────────────────────────────
//
// Instead of disconnected stair-step edge segments we:
// 1. Build an adjacency graph of boundary corners
// 2. Walk each closed / open chain
// 3. Apply midpoint-quadratic-bezier smoothing to every corner
//    → replaces each hard 90° kink with a smooth curve
//
// The result looks like organic coloring-book outlines, not graph paper.

function traceContours(labels: Uint8Array, w: number, h: number): [number, number][][] {
  const W1 = w + 1; // number of corner columns
  const H1 = h + 1;
  const totalCorners = W1 * H1;

  // adj[cornerIndex] = list of neighbouring corner indices connected by a boundary edge
  const adj: number[][] = Array.from({ length: totalCorners }, () => []);

  function addEdge(cx1: number, cy1: number, cx2: number, cy2: number) {
    const a = cy1 * W1 + cx1, b = cy2 * W1 + cx2;
    adj[a].push(b); adj[b].push(a);
  }

  // Internal horizontal boundaries (between row y-1 and row y)
  for (let y = 1; y < h; y++)
    for (let x = 0; x < w; x++)
      if (labels[(y - 1) * w + x] !== labels[y * w + x]) addEdge(x, y, x + 1, y);

  // Internal vertical boundaries (between col x-1 and col x)
  for (let y = 0; y < h; y++)
    for (let x = 1; x < w; x++)
      if (labels[y * w + x - 1] !== labels[y * w + x]) addEdge(x, y, x, y + 1);

  // Image border edges (close all open paths into loops)
  for (let x = 0; x < w; x++) { addEdge(x, 0, x + 1, 0); addEdge(x, h, x + 1, h); }
  for (let y = 0; y < h; y++) { addEdge(0, y, 0, y + 1); addEdge(w, y, w, y + 1); }

  // Trace each unvisited edge as part of a contour
  // edgeKey(a,b) = min*totalCorners + max  (fits in JS safe integer for grids ≤ ~46k corners)
  const visited = new Set<number>();
  const contours: [number, number][][] = [];

  for (let start = 0; start < totalCorners; start++) {
    if (!adj[start].length) continue;
    for (const firstNext of adj[start]) {
      const ek = start < firstNext ? start * totalCorners + firstNext : firstNext * totalCorners + start;
      if (visited.has(ek)) continue;

      const pts: number[] = [];
      let prev = start, curr = firstNext;

      for (let guard = 0; guard < 300_000; guard++) {
        const k = prev < curr ? prev * totalCorners + curr : curr * totalCorners + prev;
        visited.add(k);
        pts.push(curr);
        if (curr === start && pts.length > 2) break; // closed loop

        const nb = adj[curr];
        let next = -1;
        if (nb.length === 2) {
          next = nb[0] === prev ? nb[1] : nb[0];
        } else if (nb.length > 2) {
          // Prefer straight-ahead direction to keep paths smooth at degree-4 junctions
          const px = prev % W1, py = (prev / W1) | 0;
          const cx = curr % W1, cy = (curr / W1) | 0;
          const dx = cx - px, dy = cy - py;
          let bestScore = -Infinity;
          for (const n2 of nb) {
            if (n2 === prev) continue;
            const nk = curr < n2 ? curr * totalCorners + n2 : n2 * totalCorners + curr;
            if (visited.has(nk)) continue;
            const nx = n2 % W1, ny = (n2 / W1) | 0;
            const score = dx * (nx - cx) + dy * (ny - cy);
            if (score > bestScore) { bestScore = score; next = n2; }
          }
        }
        if (next === -1) break;
        prev = curr; curr = next;
      }

      if (pts.length > 2) contours.push(pts.map(i => [i % W1, (i / W1) | 0]));
    }
  }

  return contours;
}

// Midpoint-quadratic-bezier smoothing:
// At each corner P, instead of a hard 90° angle we go to mid(P_prev, P),
// then Q P  mid(P, P_next) — turning every kink into a smooth curve.
function smoothPath(pts: [number, number][]): string {
  const n = pts.length;
  if (n < 3) return "";
  const s = (v: number) => String(v * CS); // integer coords → no decimals needed
  // Start at midpoint of last→first edge
  const mx0 = (pts[n - 1][0] + pts[0][0]) >> 1; // integer midpoint (corners always integers)
  const my0 = (pts[n - 1][1] + pts[0][1]) >> 1;
  let d = `M${s(mx0)},${s(my0)}`;
  for (let i = 0; i < n; i++) {
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[(i + 1) % n];
    d += ` Q${s(cx)},${s(cy)} ${s((cx + nx) >> 1)},${s((cy + ny) >> 1)}`;
  }
  return d + " Z";
}

// ── SVG assembly ───────────────────────────────────────────────────────────────

function toHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function buildSVG(
  labels: Uint8Array, w: number, h: number,
  palette: [number, number, number][],
  colorNums: number[],
  regions: Region[],
  watermark: boolean,
): string {
  const imgW = w * CS, imgH = h * CS;
  const k = palette.length;
  const LCOLS = Math.min(6, k), SWATCH = 14, ROW_H = 22, PAD = 14;
  const legendH = PAD * 2 + 16 + Math.ceil(k / LCOLS) * ROW_H;

  // ── Smooth contour paths ──
  const contours = traceContours(labels, w, h);
  const allPaths = contours.map(smoothPath).filter(Boolean).join(" ");

  // ── Number labels at pole of inaccessibility ──
  // Fixed font size for all numbers; white pill background for readability.
  const MIN_LABEL_AREA = 15;
  const numEls: string[] = [];
  for (const { pixels, label } of regions) {
    if (pixels.length < MIN_LABEL_AREA) continue;
    const rSet = new Set(pixels);
    const [px, py] = poleOfInaccessibility(pixels, w, h, rSet);
    const cx = px * CS + CS / 2;
    const cy = py * CS + CS / 2;
    const num = colorNums[label];
    const numStr = String(num);
    const pillW = numStr.length > 1 ? 10 : 7;
    const pillH = 8;
    // White pill behind the digit
    numEls.push(
      `<rect x="${cx - pillW / 2}" y="${cy - pillH / 2}" width="${pillW}" height="${pillH}" rx="1.5" fill="white" opacity="0.88"/>`,
      `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="${NUM_FS}">${numStr}</text>`,
    );
  }

  // ── Legend ──
  const cellW = Math.floor(imgW / LCOLS);
  const ly0 = imgH + PAD + 16;
  const legendEls: string[] = [];
  for (let i = 0; i < k; i++) {
    const [r, g, b] = palette[i];
    const col = i % LCOLS, row = (i / LCOLS) | 0;
    const lx = col * cellW + 4, ly = ly0 + row * ROW_H;
    legendEls.push(
      `<rect x="${lx}" y="${ly}" width="${SWATCH}" height="${SWATCH}" fill="${toHex(r, g, b)}" rx="2" stroke="#aaa" stroke-width="0.5"/>`,
      `<text x="${lx + SWATCH + 3}" y="${ly + SWATCH / 2}" dominant-baseline="central" font-size="9" fill="#444">${colorNums[i]}</text>`,
    );
  }

  const wmark = watermark
    ? `<text x="${imgW / 2}" y="${imgH - 5}" text-anchor="middle" font-size="7" fill="rgba(124,92,255,0.4)" font-weight="600">Canvasify Preview · canvasify.art</text>`
    : "";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${imgW} ${imgH + legendH}">`,
    `<rect width="${imgW}" height="${imgH + legendH}" fill="#fff"/>`,
    `<rect width="${imgW}" height="${imgH}" fill="#fafafa"/>`,
    // All region boundaries as smooth bezier curves
    `<path d="${allPaths}" stroke="#2a2a2a" stroke-width="0.9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    // Outer border (sharp rectangle on top)
    `<rect x="1" y="1" width="${imgW - 2}" height="${imgH - 2}" fill="none" stroke="#111" stroke-width="1.5"/>`,
    // Number labels
    `<g font-family="Arial,Helvetica,sans-serif" font-weight="600" fill="#111">${numEls.join("")}</g>`,
    wmark,
    `<line x1="0" y1="${imgH}" x2="${imgW}" y2="${imgH}" stroke="#ccc" stroke-width="1"/>`,
    `<text x="${imgW / 2}" y="${imgH + PAD + 4}" text-anchor="middle" font-size="10" font-weight="700" font-family="Arial,sans-serif" fill="#555">Color Legend</text>`,
    legendEls.join(""),
    `</svg>`,
  ].join("\n");
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function generatePBN(
  src: string,
  numColors: number,
  opts: { watermark?: boolean } = {},
): Promise<PBNResult> {
  const { watermark = true } = opts;

  const { data: raw, w: rw, h: rh } = await loadPixels(src);
  const { data: scaled, w, h } = downscale(raw, rw, rh);
  const n = w * h;

  // Pre-blur: 3 passes of 3×3 Gaussian smooth out pixel noise and make
  // colour region boundaries more organic before quantisation.
  let data = blur3x3(scaled, w, h);
  data = blur3x3(data, w, h);
  data = blur3x3(data, w, h);

  const palette = kmeans(data, n, numColors);
  const rawLabels = assignLabels(data, n, palette);
  const labels = mergeSmall(rawLabels, w, h);

  // Number colours by coverage (most-used = #1)
  const cov = new Array(numColors).fill(0);
  for (let i = 0; i < n; i++) cov[labels[i]]++;
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
