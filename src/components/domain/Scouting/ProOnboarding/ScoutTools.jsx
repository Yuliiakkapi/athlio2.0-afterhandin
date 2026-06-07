import { useState } from "react";
import { Star, ArrowsLeftRight, UsersThree, MagnifyingGlass } from "@phosphor-icons/react";
import "./ScoutTools.css";

const TOOLS = [
  {
    key: "watchlist",
    Icon: Star,
    name: "Player Watchlist",
    desc: "Track and monitor your top prospects.",
  },
  {
    key: "comparison",
    Icon: ArrowsLeftRight,
    name: "Player Comparison",
    desc: "Compare stats side-by-side across players.",
  },
  {
    key: "team",
    Icon: UsersThree,
    name: "Team Builder",
    desc: "Build and manage your scouted squad.",
  },
  {
    key: "ai",
    Icon: MagnifyingGlass,
    name: "AI Scout",
    desc: "Get AI-powered player recommendations.",
  },
];

export default function ScoutTools() {
  const [enabled, setEnabled] = useState(new Set());

  function toggle(key) {
    setEnabled((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <div className="st-content">
      <div className="st-header">
        <h1 className="st-title">Scout Tools</h1>
        <p className="st-subtitle">Pick the tools you want to activate</p>
      </div>

      <div className="st-list">
        {TOOLS.map((tool, i) => {
          const on = enabled.has(tool.key);
          return (
            <button
              key={tool.key}
              type="button"
              className={`st-item${i < TOOLS.length - 1 ? " st-item--border" : ""}${on ? " st-item--selected" : ""}`}
              onClick={() => toggle(tool.key)}
            >
              <div className="st-item-icon">
                <tool.Icon size={26} weight={on ? "fill" : "regular"} />
              </div>
              <div className="st-item-text">
                <span className="st-item-name">{tool.name}</span>
                <span className="st-item-desc">{tool.desc}</span>
              </div>
              <div className={`st-item-check${on ? " st-item-check--on" : ""}`}>
                {on && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
