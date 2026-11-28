// Модель свечения «звезды» при включении телевизора.
// Параметры подобраны по кадрам ролика (30 к/с), между кадрами — интерполяция.

// Параметры свечения по кадрам: [A1, L1, w1, A2, L2, w2, A3, rx, ry]
// A1/L1/w1 — горизонтальный луч, A2/L2/w2 — вертикальный, A3/rx/ry — общее сияние.
const KEYS = [
  [2.5, 120, 5.48, 4.6, 14.09, 39.5, 0.38, 475.46, 3.28],
  [2.5, 95, 9.76, 5.04, 23.43, 35.63, 0.44, 319.25, 3.12],
  [2.75, 80, 13.37, 4.78, 28.28, 30.62, 0.69, 210.77, 3.02],
  [4.13, 58.21, 18.48, 4.63, 32.34, 22.56, 1.14, 139.2, 3.0],
  [4.78, 47.87, 23.77, 4.4, 36.51, 13.55, 1.55, 100.64, 3.19],
  [2.33, 274.16, 41.38, 62.77, 6000, 3.0, 2.18, 118.53, 124.3],
  [334.77, 6000, 3.0, 336.28, 6000, 6.22, 0.9, 348.65, 202.56],
];
export const FPS_MODEL_LAST = KEYS.length - 1;
const LAST = FPS_MODEL_LAST; // кадр, после которого экран белеет целиком

const MODEL_W = 768; // размеры кадра ролика, в них заданы параметры
const MODEL_H = 432;

const mix = (a, b, t) => Math.exp(Math.log(a) * (1 - t) + Math.log(b) * t);

function paramsAt(k) {
  const i = Math.min(LAST - 1, Math.floor(k));
  const t = k - i;
  return KEYS[i].map((v, j) => mix(v, KEYS[i + 1][j], t));
}


export function makeBuffers(cw, ch) {
  return {
    gx1: new Float32Array(cw),
    gx2: new Float32Array(cw),
    gx3: new Float32Array(cw),
    gy1: new Float32Array(ch),
    gy2: new Float32Array(ch),
    gy3: new Float32Array(ch),
  };
}

// Заполняет RGBA-буфер серым изображением для кадра k (k = 0 — первый кадр звезды,
// k < 0 — нарастание из чёрного, k > LAST — выход в чистый белый).
export function fillStar(px, cw, ch, k, buf) {
  const { gx1, gx2, gx3, gy1, gy2, gy3 } = buf;
  const ramp = k < 0 ? k + 1 : 1;
  const white = k > LAST ? Math.min(1, k - LAST) : 0;
  const [A1, L1, w1, A2, L2, w2, A3, rx, ry] = paramsAt(Math.min(LAST, Math.max(0, k)));
  for (let ix = 0; ix < cw; ix++) {
    const x = ((ix + 0.5) / cw) * MODEL_W - MODEL_W / 2;
    gx1[ix] = A1 * Math.exp(-Math.abs(x) / L1);
    gx2[ix] = 1 / (1 + (x / w2) * (x / w2));
    gx3[ix] = (x / rx) * (x / rx);
  }
  for (let iy = 0; iy < ch; iy++) {
    const y = ((iy + 0.5) / ch) * MODEL_H - MODEL_H / 2;
    gy1[iy] = 1 / (1 + (y / w1) * (y / w1));
    gy2[iy] = A2 * Math.exp(-Math.abs(y) / L2);
    gy3[iy] = (y / ry) * (y / ry);
  }
  let p = 0;
  for (let iy = 0; iy < ch; iy++) {
    for (let ix = 0; ix < cw; ix++) {
      const d = 1 + gx3[ix] + gy3[iy];
      let v = (gx1[ix] * gy1[iy] + gx2[ix] * gy2[iy] + A3 / (d * Math.sqrt(d))) * ramp + white;
      v = v > 1 ? 255 : v * 255;
      px[p] = px[p + 1] = px[p + 2] = v;
      p += 4;
    }
  }
}
