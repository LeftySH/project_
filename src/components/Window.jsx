import closeIcon from '../assets/icons/close.svg';

export default function Window({
  id,
  title,
  dim,
  style,
  onBarPointerDown,
  onActivate,
  onClose,
  tools,
  resizeDirs,
  onResizeDown,
  children,
}) {
  return (
    <section className={`win win--${id}${dim ? ' is-dim' : ''}`} style={style} aria-label={title} onPointerDownCapture={onActivate}>
      <header className="win__bar" onPointerDown={onBarPointerDown}>
        <h2 className="win__title">{title}</h2>
        <div className="win__tools">
          {tools}
          <button type="button" className="win__btn" onClick={onClose} aria-label={`Close ${title}`}>
            <img src={closeIcon} width="18" height="18" alt="" draggable="false" />
          </button>
        </div>
      </header>
      <div className="win__body">{children}</div>
      {resizeDirs?.map((d) => (
        <span key={d} className={`win__rs win__rs--${d}`} onPointerDown={onResizeDown(d)} />
      ))}
    </section>
  );
}
