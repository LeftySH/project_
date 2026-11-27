import thumbOff from '../assets/icons/thumb-off.svg';
import thumbOn from '../assets/icons/thumb-on.svg';
import { projects } from '../data.js';
import ScrollArea from './ScrollArea.jsx';

export default function ProjectsBody({ selectedId, onSelect }) {
  return (
    <div className="plist">
      <div className="plist__head">
        <span>Name</span>
        <span>Year</span>
      </div>
      <ScrollArea always>
        <ul className="plist__rows">
          {projects.map((p) => {
            const sel = p.id === selectedId;
            return (
              <li key={p.id}>
                <button type="button" className={`prow${sel ? ' is-sel' : ''}`} onClick={() => onSelect(p.id)}>
                  <img src={sel ? thumbOn : thumbOff} width="43" height="43" alt="" draggable="false" />
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
      </ScrollArea>
    </div>
  );
}
