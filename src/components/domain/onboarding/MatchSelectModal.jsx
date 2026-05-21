import { X } from "@phosphor-icons/react";
import "./MatchSelectModal.css";

export default function MatchSelectModal({ matches, selectedMatch, onSelect, onClose }) {
  const handleSelect = (match) => {
    onSelect(match.value);
    onClose();
  };

  return (
    <div className="match-modal-overlay" onClick={onClose}>
      <div className="match-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="match-modal-handle" />

        <div className="match-modal-header">
          <h2 className="match-modal-title">Select match</h2>
          <button
            type="button"
            className="match-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {matches && matches.length > 0 ? (
          <div className="match-modal-list">
            {matches.map((match) => (
              <button
                key={match.value}
                type="button"
                className={`match-modal-item ${selectedMatch === match.value ? "selected" : ""}`}
                onClick={() => handleSelect(match)}
              >
                <span className="match-modal-item-label">{match.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="match-modal-empty">
            <div className="match-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7V12M12 16H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="match-modal-empty-text">No matches to select</p>
          </div>
        )}
      </div>
    </div>
  );
}
