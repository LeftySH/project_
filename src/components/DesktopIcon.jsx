export default function DesktopIcon({ id, label, on, off, isOn, dim, style, size, onClick, onPointerDown }) {
  return (
    <button
      type="button"
      className={`icon icon--${id}${dim ? ' is-dim' : ''}`}
      style={style}
      onClick={onClick}
      onPointerDown={onPointerDown}
      aria-label={`Open ${label}`}
      aria-pressed={isOn}
    >
      <img src={isOn ? on : off} width={size[0]} height={size[1]} alt="" draggable="false" />
    </button>
  );
}
