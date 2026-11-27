import thumbOff from '../assets/icons/thumb-off.svg';
import thumbOn from '../assets/icons/thumb-on.svg';
import { projects } from '../data.js';

const Chevron = ({ down }) => (
  <svg width="11" height="7" viewBox="0 0 11 7" aria-hidden="true" style={down ? { transform: 'scaleY(-1)' } : undefined}>
    <path d="M0.5 6 5.5 1 10.5 6" fill="none" stroke="#0d0d0d" strokeWidth="1.2" />
  </svg>
);

export default function ProjectsBody({ selectedId, onSelect }) {
  return (
    <div className="plist">
      <div className="plist__head">
        <span>Name</span>
        <span>Year</span>
      </div>
      <div className="plist__main">
        <ul className="plist__rows">
          {projects.map((p) => {
            const sel = p.id === selectedId;
            return (
              <li key={p.id}>
                <button type="button" className={`prow${sel ? ' is-sel' : ''}`} onClick={() => onSelect(p.id)}>
                  <img src={sel ? thumbOn : thumbOff} width="42" height="42" alt="" draggable="false" />
                  <span className="prow__text">
                    <span className="prow__name">{p.file}</span>
                    <span className="prow__tag">{p.tag}</span>
                  </span>
                  <span className="prow__year">{p.year}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="sb" aria-hidden="true">
          <span className="sb__arrow">
            <Chevron />
          </span>
          <span className="sb__track" />
          <span className="sb__arrow sb__arrow--down">
            <Chevron down />
          </span>
        </div>
      </div>
    </div>
  );
}
