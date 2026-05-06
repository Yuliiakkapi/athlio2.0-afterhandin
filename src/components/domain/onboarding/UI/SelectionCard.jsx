import React, { useCallback } from "react";
import "./SelectionCard.css";

// SelectionCard is a reusable selectable card. When `groupName` and `value` are
// provided (and `onChange`), it acts like a radio within that group. If those
// props are omitted, it renders a non-interactive presentation-only card.
export default function SelectionCard({
  name,
  description,
  icon,
  value,
  groupName,
  checked = false,
  onChange,
  inputType = "radio", // 'radio' (default) or 'checkbox' for multi-select behavior
}) {
  const selectable =
    typeof onChange === "function" &&
    ((inputType === "checkbox" && value) || (groupName && value));

  const activate = useCallback(() => {
    if (selectable) onChange(value);
  }, [selectable, onChange, value]);

  const handleKey = useCallback(
    (e) => {
      if (!selectable) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    },
    [selectable, activate]
  );

  return (
    <div
      className={"role-card" + (checked ? " selected" : "")}
      role={selectable ? (inputType === "checkbox" ? "checkbox" : "radio") : undefined}
      aria-checked={selectable ? !!checked : undefined}
      tabIndex={selectable ? 0 : undefined}
      onKeyDown={handleKey}
      onClick={activate}
    >
      {selectable && (
        <input
          className="visually-hidden"
          type={inputType === "checkbox" ? "checkbox" : "radio"}
          name={inputType === "checkbox" ? undefined : groupName}
          value={value}
          checked={checked}
       /* Activation is handled by the card itself (click / keyboard),
         avoid calling onChange twice by not wiring the input's
         onChange handler. The input remains present for semantics.
         To avoid React's controlled-without-onChange warning we mark
         the input as readOnly since the card handles interaction. */
       readOnly
          aria-checked={checked}
          tabIndex={-1} /* keep only the card itself focusable */
        />
      )}
      <div className="role-icon">
        {icon ? (
          // if icon is a string, treat it as an image URL
          typeof icon === "string" ? (
            <img src={icon} alt={`${name} icon`} />
          ) : (
            // otherwise assume it's a React node/component
            icon
          )
        ) : null}
      </div>

      <div className="role-body">
        <h3 className="role-title">{name}</h3>
        <p className="role-desc">{description}</p>
      </div>
    </div>
  );
}
