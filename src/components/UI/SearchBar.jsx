import React from "react";
import "./SearchBar.css";
import SearchIcon from "../../assets/icons/search.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";

const SearchBar = ({
  label = "Search",
  onClick,
  onClear,
  value,
  onChange,
  placeholder,
}) => {
  const editable = typeof onChange === "function";

  return (
    <div
      className="search-card"
      {...(!editable ? { role: "button", onClick, tabIndex: 0 } : {})}
    >
      <div className="search-content">
        <span className="search-icon" aria-hidden>
          <img src={SearchIcon} alt="" />
        </span>

        {editable ? (
          <input
            className="search-input"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || label}
            aria-label={label}
          />
        ) : (
          <span className="search-label">{label}</span>
        )}

        {(onClear || (editable && (value || "").length > 0)) && (
          <button
            className="search-clear"
            onClick={(e) => {
              e.stopPropagation();
              if (onClear) return onClear();
              if (editable) return onChange("");
            }}
            aria-label="Clear search"
          >
            <img src={CloseIcon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
