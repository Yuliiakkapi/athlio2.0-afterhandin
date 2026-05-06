import { useState, useEffect } from "react";
import ClubPicker from "../onboarding/ClubPicker";
import Button from "../../UI/Button";
import CheckIcon from "../../../assets/icons/check.svg?react";
import "./ClubPickerPost.css";

function TeamPickerOverlay({
  open,
  sport,
  initialValue,
  onClose,
  onPick,
  origin,
}) {
  const [show, setShow] = useState(open);
  const [state, setState] = useState(open ? "in" : "out");
  const [selected, setSelected] = useState(initialValue || null);

  // set CSS variables globally so we don't use inline styles
  useEffect(() => {
    const root = document.documentElement;
    const ox = origin?.x ?? window.innerWidth / 2;
    const oy = origin?.y ?? window.innerHeight / 2;
    root.style.setProperty("--tp-origin-x", `${ox}px`);
    root.style.setProperty("--tp-origin-y", `${oy}px`);
  }, [origin]);

  useEffect(() => {
    if (open) {
      setShow(true);
      requestAnimationFrame(() => setState("in"));
    } else {
      setState("out");
      const t = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setSelected(initialValue || null);
    }
  }, [open, initialValue]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select a team"
      className={`tp-backdrop ${state === "in" ? "is-in" : "is-out"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className={`tp-panel ${state === "in" ? "is-in" : "is-out"}`}>
        <div className="tp-header">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="tp-close"
          >
            ×
          </button>
        </div>

        <div className="tp-body">
          <ClubPicker
            sport={sport}
            value={selected}
            onChange={(v) => setSelected(v)}
          />
        </div>

        <div className="tp-footer">
          <Button
            size="big"
            type="primary"
            label="Apply"
            Icon={CheckIcon}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPick?.(selected);
              onClose?.();
            }}
            disabled={!selected}
          />
        </div>
      </div>
    </div>
  );
}

function getClubLabel(v) {
  if (!v) return "";
  if (v.club_other_name) return v.club_other_name;
  // If we only have an id, show a short placeholder. Parent can resolve full name asynchronously.
  if (v.club_id) return "Selected club";
  return "";
}

function FieldButton({ label, value, placeholder, onClick }) {
  const display = getClubLabel(value) || "";
  return (
    <button
      type="button"
      onClick={onClick}
      className="tp-field-btn"
      aria-label={label}
    >
      <div className="tp-field-label">{label}</div>
      <div
        className={`tp-field-value ${display ? "has-value" : "is-placeholder"}`}
      >
        {display || placeholder}
      </div>
    </button>
  );
}

/**
 * Two-field component that mirrors the UI in the screenshot:
 *  - "For which team did you play?"
 *  - "Against what team you played?"
 * Clicking either opens the overlay reusing ClubPicker logic.
 */
function TeamSelectFields({
  sport,
  homeTeam,
  opponentTeam,
  onChangeHome,
  onChangeOpponent,
}) {
  const [whichOpen, setWhichOpen] = useState(null); // "home" | "opponent" | null

  return (
    <div className="clubs-container">
      <FieldButton
        placeholder="Against what team you played?*"
        value={opponentTeam}
        onClick={() => setWhichOpen("opponent")}
      />
      <TeamPickerOverlay
        open={whichOpen === "opponent"}
        sport={sport}
        initialValue={opponentTeam}
        onClose={() => setWhichOpen(null)}
        onPick={onChangeOpponent}
      />
    </div>
  );
}

// Named exports so you can import alongside the default ClubPicker if you want.
export { TeamPickerOverlay, TeamSelectFields };
