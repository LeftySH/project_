import { useCallback, useEffect, useRef, useState } from 'react';
import Window from './components/Window.jsx';
import DesktopIcon from './components/DesktopIcon.jsx';
import AboutBody from './components/AboutBody.jsx';
import ContactsBody from './components/ContactsBody.jsx';
import ProjectsBody from './components/ProjectsBody.jsx';
import ViewerBody from './components/ViewerBody.jsx';
import { projects } from './data.js';
import { useMedia } from './hooks.js';

import aboutOff from './assets/icons/about-off.svg';
import aboutOn from './assets/icons/about-on.svg';
import contactsOff from './assets/icons/contacts-off.svg';
import contactsOn from './assets/icons/contacts-on.svg';
import projectsOff from './assets/icons/projects-off.svg';
import projectsOn from './assets/icons/projects-on.svg';
import openIcon from './assets/icons/open.svg';

// Размеры и положение окон взяты из макета 1920x1080 (Frame 155)
const DESIGN_W = 1920;
const DESIGN_H = 1080;

const WINDOWS = {
  about: { title: 'ABOUT ME', x: 590, y: 589, w: 740, h: 460 },
  contacts: { title: 'CONTACTS', x: 390, y: 908, w: 292, h: 81 },
  projects: { title: 'MY PROJECTS', x: 1254, y: 106, w: 529, h: 438 },
  viewer: { x: 506, y: 58, w: 598, h: 378 },
};

const ICONS = {
  about: { x: 50, y: 50, size: [93, 73], label: 'about me.txt', off: aboutOff, on: aboutOn },
  contacts: { x: 175, y: 50, size: [93, 73], label: 'contacts.txt', off: contactsOff, on: contactsOn },
  projects: { x: 289, y: 55, size: [115, 68], label: 'my projects.txt', off: projectsOff, on: projectsOn },
};

const DESKTOP_OPEN = { about: true, contacts: true, projects: true, viewer: true };
const MOBILE_OPEN = { about: true, contacts: false, projects: false, viewer: false };
const MOBILE_MQ = '(min-width: 768px)';

const clamp = (v, min, max) => Math.min(Math.max(v, min), Math.max(min, max));

function startPositions() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const out = {};
  for (const [id, d] of Object.entries(WINDOWS)) {
    out[id] = {
      x: clamp(Math.round((d.x * vw) / DESIGN_W), 0, vw - d.w),
      y: clamp(Math.round((d.y * vh) / DESIGN_H), 0, vh - d.h),
    };
  }
  return out;
}

function startIconPositions() {
  const out = {};
  for (const [id, d] of Object.entries(ICONS)) out[id] = { x: d.x, y: d.y };
  return out;
}

// общий перетаскиватель для окон и иконок
function beginDrag(e, onMove, onEnd) {
  const el = e.currentTarget;
  const sx = e.clientX;
  const sy = e.clientY;
  let moved = false;
  el.setPointerCapture?.(e.pointerId);

  const move = (ev) => {
    const dx = ev.clientX - sx;
    const dy = ev.clientY - sy;
    if (!moved && Math.hypot(dx, dy) < 4) return;
    moved = true;
    onMove(dx, dy);
  };
  const up = () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
    onEnd?.(moved);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
}

export default function App() {
  const isDesktop = useMedia(MOBILE_MQ);

  const [open, setOpen] = useState(() => (window.innerWidth >= 768 ? DESKTOP_OPEN : MOBILE_OPEN));
  const [pos, setPos] = useState(startPositions);
  const [iconPos, setIconPos] = useState(startIconPositions);
  // порядок слоёв: последний элемент лежит сверху
  const [order, setOrder] = useState(['about', 'viewer', 'projects', 'contacts']);
  const [activeState, setActive] = useState('about');
  const [currentId, setCurrentId] = useState(projects[0].id);
  const suppressClick = useRef(false);

  const current = projects.find((p) => p.id === currentId) || projects[0];
  const topOpen = [...order].reverse().find((id) => open[id]);
  const activeId = open[activeState] ? activeState : topOpen;

  // при переходе между телефоном и десктопом сбрасываем набор открытых окон
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setOpen(isDesktop ? DESKTOP_OPEN : MOBILE_OPEN);
    setActive('about');
  }, [isDesktop]);

  // не даём окнам уехать за экран при ресайзе
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setPos((p) => {
        const n = {};
        for (const id of Object.keys(p)) {
          n[id] = { x: clamp(p[id].x, 100 - WINDOWS[id].w, vw - 100), y: clamp(p[id].y, 0, vh - 40) };
        }
        return n;
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const focus = useCallback((id) => {
    setActive(id);
    setOrder((o) => (o[o.length - 1] === id ? o : [...o.filter((x) => x !== id), id]));
  }, []);

  const openWin = useCallback(
    (id) => {
      setOpen((prev) => {
        if (isDesktop || id === 'viewer') return { ...prev, [id]: true };
        // на телефоне about / contacts / projects открываются по одному
        return { about: false, contacts: false, projects: false, viewer: false, [id]: true };
      });
      focus(id);
    },
    [isDesktop, focus],
  );

  const closeWin = useCallback(
    (id) => {
      setOpen((prev) => {
        const next = { ...prev, [id]: false };
        if (!isDesktop && id === 'projects') next.viewer = false;
        return next;
      });
    },
    [isDesktop],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && activeId) closeWin(activeId);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeId, closeWin]);

  const onBarPointerDown = (id) => (e) => {
    if (!isDesktop || e.button !== 0 || e.target.closest('button, a')) return;
    const { x: ox, y: oy } = pos[id];
    beginDrag(e, (dx, dy) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setPos((p) => ({
        ...p,
        [id]: { x: clamp(ox + dx, 100 - WINDOWS[id].w, vw - 100), y: clamp(oy + dy, 0, vh - 40) },
      }));
    });
  };

  const onIconPointerDown = (id) => (e) => {
    if (!isDesktop || e.button !== 0) return;
    const { x: ox, y: oy } = iconPos[id];
    const [w, h] = ICONS[id].size;
    beginDrag(
      e,
      (dx, dy) => {
        setIconPos((p) => ({
          ...p,
          [id]: { x: clamp(ox + dx, 0, window.innerWidth - w), y: clamp(oy + dy, 0, window.innerHeight - h) },
        }));
      },
      (moved) => {
        suppressClick.current = moved;
      },
    );
  };

  const onIconClick = (id) => () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    openWin(id);
  };

  const winProps = (id) => ({
    id,
    dim: isDesktop && activeId !== id,
    onActivate: () => focus(id),
    onClose: () => closeWin(id),
    onBarPointerDown: onBarPointerDown(id),
    style: isDesktop
      ? {
          left: pos[id].x,
          top: pos[id].y,
          width: WINDOWS[id].w,
          height: id === 'viewer' ? undefined : WINDOWS[id].h,
          zIndex: 10 + order.indexOf(id),
        }
      : { zIndex: 10 + order.indexOf(id) },
  });

  const onSelectProject = (id) => {
    setCurrentId(id);
    openWin('viewer');
  };

  const goToProject = (e) => {
    if (!current.url) e.preventDefault();
  };

  return (
    <main className="desktop" data-mode={isDesktop ? 'desktop' : 'mobile'} data-viewer={open.viewer ? 'on' : 'off'}>
      <div className="brand">
        <h1 className="brand__title">Project_</h1>
        <p className="brand__aka">aka LeftySH</p>
      </div>

      {Object.entries(ICONS).map(([id, d]) => (
        <DesktopIcon
          key={id}
          id={id}
          label={d.label}
          on={d.on}
          off={d.off}
          size={d.size}
          isOn={open[id]}
          dim={isDesktop && open[id] && activeId !== id}
          style={isDesktop ? { left: iconPos[id].x, top: iconPos[id].y } : undefined}
          onPointerDown={onIconPointerDown(id)}
          onClick={onIconClick(id)}
        />
      ))}

      {open.about && (
        <Window {...winProps('about')} title={WINDOWS.about.title}>
          <AboutBody />
        </Window>
      )}

      {open.contacts && (
        <Window {...winProps('contacts')} title={WINDOWS.contacts.title}>
          <ContactsBody />
        </Window>
      )}

      {open.projects && (
        <Window {...winProps('projects')} title={WINDOWS.projects.title}>
          <ProjectsBody selectedId={open.viewer ? current.id : null} onSelect={onSelectProject} />
        </Window>
      )}

      {open.viewer && (
        <Window
          {...winProps('viewer')}
          title={current.file.toUpperCase()}
          tools={
            <a
              className="win__btn win__go"
              href={current.url || '#'}
              onClick={goToProject}
              target={current.url ? '_blank' : undefined}
              rel={current.url ? 'noopener noreferrer' : undefined}
              aria-label={`Go to project ${current.file}`}
            >
              <img src={openIcon} width="102" height="18" alt="" draggable="false" />
            </a>
          }
        >
          <ViewerBody project={current} />
        </Window>
      )}
    </main>
  );
}
