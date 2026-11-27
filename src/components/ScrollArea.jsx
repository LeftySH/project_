import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const Chevron = ({ down }) => (
  <svg width="11" height="7" viewBox="0 0 11 7" aria-hidden="true" style={down ? { transform: 'scaleY(-1)' } : undefined}>
    <path d="M0.7 6.2 5.5 1.4 10.3 6.2" fill="none" stroke="#0d0d0d" strokeWidth="1.3" />
  </svg>
);

// Область с прокруткой и своим ползунком (как в макете).
// always — ползунок виден всегда (если контента мало, он закрашен целиком),
// иначе он появляется только когда содержимое не помещается.
export default function ScrollArea({ always = false, children }) {
  const view = useRef(null);
  const track = useRef(null);
  const thumb = useRef(null);
  const timer = useRef(null);
  const [m, setM] = useState({ over: false, ratio: 1, pos: 0, tall: true });

  const update = useCallback(() => {
    const el = view.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setM({
      over: max > 1,
      ratio: el.scrollHeight ? Math.min(1, el.clientHeight / el.scrollHeight) : 1,
      pos: max > 0 ? el.scrollTop / max : 0,
      tall: el.clientHeight >= 90,
    });
  }, []);

  useLayoutEffect(() => {
    const el = view.current;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    el.addEventListener('scroll', update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', update);
    };
  }, [update]);

  const show = (always || m.over) && m.tall;

  const stopHold = () => clearInterval(timer.current);

  // кнопки со стрелками: клик — шаг, зажатие — повтор
  const hold = (dir) => (e) => {
    e.preventDefault();
    const step = () => view.current?.scrollBy({ top: dir * 40 });
    step();
    stopHold();
    const first = setTimeout(() => {
      timer.current = setInterval(step, 50);
    }, 350);
    const up = () => {
      clearTimeout(first);
      stopHold();
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointerup', up);
  };

  const onTrackDown = (e) => {
    if (e.target !== track.current) return;
    const el = view.current;
    const rect = thumb.current.getBoundingClientRect();
    el.scrollBy({ top: (e.clientY < rect.top ? -1 : 1) * el.clientHeight * 0.9 });
  };

  const onThumbDown = (e) => {
    e.preventDefault();
    const el = view.current;
    const th = thumb.current;
    const startY = e.clientY;
    const startTop = el.scrollTop;
    const range = track.current.clientHeight - th.offsetHeight;
    const max = el.scrollHeight - el.clientHeight;
    th.setPointerCapture(e.pointerId);
    const move = (ev) => {
      if (range > 0) el.scrollTop = startTop + ((ev.clientY - startY) / range) * max;
    };
    const up = () => {
      th.removeEventListener('pointermove', move);
      th.removeEventListener('pointerup', up);
      th.removeEventListener('pointercancel', up);
    };
    th.addEventListener('pointermove', move);
    th.addEventListener('pointerup', up);
    th.addEventListener('pointercancel', up);
  };

  return (
    <div className="sa">
      <div className="sa__view" ref={view} tabIndex={m.over ? 0 : undefined}>
        {children}
      </div>
      {show && (
        <div className="sb" aria-hidden="true">
          <span className="sb__btn" onPointerDown={hold(-1)}>
            <Chevron />
          </span>
          <div className="sb__track" ref={track} onPointerDown={onTrackDown}>
            <span
              className="sb__thumb"
              ref={thumb}
              style={{ '--ratio': m.ratio, '--pos': m.pos }}
              onPointerDown={onThumbDown}
            />
          </div>
          <span className="sb__btn" onPointerDown={hold(1)}>
            <Chevron down />
          </span>
        </div>
      )}
    </div>
  );
}
