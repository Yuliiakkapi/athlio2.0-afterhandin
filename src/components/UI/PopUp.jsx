import "./PopUp.css";

export function PopUp({ title, children, onClose, width = 520 }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-sheet" style={{ maxWidth: width }}>
        {title ? <h2 style={{ marginTop: 0 }}>{title}</h2> : null}
        {children}
      </div>
    </div>
  );
}

export function PopUpActions({ children }) {
  return <div className="modal-actions">{children}</div>;
}
