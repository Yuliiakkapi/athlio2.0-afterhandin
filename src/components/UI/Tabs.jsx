import { Lock } from "@phosphor-icons/react";
import "./Tabs.css";

export default function Tabs({ tabs = [], active, onChange, lockedTabs = [], onLockedClick }) {
  function handleClick(tab) {
    if (lockedTabs.includes(tab)) {
      onLockedClick?.();
    } else {
      onChange?.(tab);
    }
  }

  return (
    <div className="tabs">
      {tabs.map((tab) => {
        const locked = lockedTabs.includes(tab);
        return (
          <button
            key={tab}
            className={`tabs__item${active === tab ? " tabs__item--active" : ""}${locked ? " tabs__item--locked" : ""}`}
            onClick={() => handleClick(tab)}
          >
            {tab}
            {locked && <Lock size={14} weight="bold" className="tabs__lock" />}
          </button>
        );
      })}
    </div>
  );
}
