import { Minus, Plus } from "@phosphor-icons/react";
import "./NumberPicker.css";

export default function NumberPicker({
  label,
  required = false,
  value,
  onChange,
  min = 0,
  max = 99,
}) {
  function decrement() { if (value > min) onChange(value - 1); }
  function increment() { if (value < max) onChange(value + 1); }

  return (
    <div className="number-picker">
      {label && (
        <span className="number-picker__label">
          {label}{required && " *"}
        </span>
      )}
      <div className="number-picker__control">
        <button
          type="button"
          className="number-picker__btn"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease"
        >
          <Minus size={20} weight="bold" />
        </button>
        <span className="number-picker__value">{value}</span>
        <button
          type="button"
          className="number-picker__btn"
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase"
        >
          <Plus size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
}
