import { useEffect, useRef, useState } from 'react';
import { FPS_MODEL_LAST as LAST, makeBuffers, fillStar } from './tvModel.js';

// Заставка включения телевизора.
// Звезда и вспышка повторяют ролик кадр в кадр (30 к/с): параметры свечения подобраны
// по кадрам видео, между ними идёт плавная интерполяция. Сайт под слоем не меняется.

const FPS = 30;
const NOISE_T = 0.28; // секунд помех на чёрном экране до включения
const HOLD = 0.12; // секунд белого экрана перед растворением

export default function TvIntro({ onDone }) {
  const canvas = useRef(null);
  const [fading, setFading] = useState(false);
  const [tvDone, setTvDone] = useState(false);
  const [fxDone, setFxDone] = useState(false);

  useEffect(() => {
    if (tvDone && fxDone) onDone();
  }, [tvDone, fxDone, onDone]);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext('2d');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.max(3, Math.max(vw, vh) / 640);
    const cw = Math.ceil(vw / scale);
    const ch = Math.ceil(vh / scale);
    cv.width = cw;
    cv.height = ch;
    const img = ctx.createImageData(cw, ch);
    const px = img.data;
    for (let i = 3; i < px.length; i += 4) px[i] = 255;

    const buf = makeBuffers(cw, ch);
    const drawStar = (k) => {
      fillStar(px, cw, ch, k, buf);
      ctx.putImageData(img, 0, 0);
    };

    // помехи на чёрном экране перед включением
    const drawNoise = (t) => {
      const band = ((t * 2.2) % 1) * ch;
      let p = 0;
      for (let iy = 0; iy < ch; iy++) {
        const near = Math.max(0, 1 - Math.abs(iy - band) / (ch * 0.12));
        for (let ix = 0; ix < cw; ix++) {
          const n = Math.random();
          const v = n * n * (34 + near * 40);
          px[p] = px[p + 1] = px[p + 2] = v;
          p += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    let raf;
    let start = null;
    const frame = (now) => {
      if (start === null) start = now;
      const t = (now - start) / 1000;
      const k = (t - NOISE_T) * FPS - 1; // k = 0 — первый кадр звезды
      if (t < NOISE_T) {
        drawNoise(t);
      } else if (k <= LAST + 1) {
        drawStar(k);
      }
      if (k > LAST + 1 + HOLD * FPS) {
        setFading(true);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {!tvDone && (
        <div
          className={`tv${fading ? ' is-fading' : ''}`}
          aria-hidden="true"
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) setTvDone(true);
          }}
        >
          <canvas ref={canvas} />
        </div>
      )}
      {fading && !fxDone && (
        <div
          className="tv-after"
          aria-hidden="true"
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) setFxDone(true);
          }}
        />
      )}
    </>
  );
}
