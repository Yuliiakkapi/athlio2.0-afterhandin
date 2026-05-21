import { Lock } from "@phosphor-icons/react";
import "./NavTabs.css";

/**
 * NavigationTabs
 *
 * variant      "underline" | "pill" | "segment"
 * tabs         { id, label }[]  OR  string[]  (strings used as both id and label)
 * activeTab    string
 * onTabChange  (id: string) => void
 * lockedTabs   string[]   — tab ids that are locked (segment variant)
 * onLockedClick () => void — called when a locked tab is tapped
 */
export default function NavigationTabs({
  tabs = [],
  activeTab,
  onTabChange,
  variant = "underline",
  lockedTabs = [],
  onLockedClick,
}) {
  const normalized = tabs.map((t) =>
    typeof t === "string" ? { id: t, label: t } : t
  );

  function handleClick(id) {
    if (lockedTabs.includes(id)) {
      onLockedClick?.();
    } else {
      onTabChange?.(id);
    }
  }

  if (variant === "segment") {
    return (
      <div className="navtabs-segment">
        {normalized.map(({ id, label }) => {
          const locked = lockedTabs.includes(id);
          return (
            <button
              key={id}
              className={`navtabs-segment__item${activeTab === id ? " navtabs-segment__item--active" : ""}${locked ? " navtabs-segment__item--locked" : ""}`}
              onClick={() => handleClick(id)}
            >
              {label}
              {locked && <Lock size={14} weight="bold" className="navtabs-segment__lock" />}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <div className="navtabs-pill-wrap">
        <div className="navtabs-pill">
          {normalized.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`navtabs-pill-tab${activeTab === id ? " navtabs-pill-tab--active" : ""}`}
              role="tab"
              aria-selected={activeTab === id}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav className="navbartabs">
      <div className="tabContainer">
        {normalized.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className={`tab${activeTab === id ? " tabActive" : ""}`}
            role="tab"
            aria-selected={activeTab === id}
          >
            <span className={`tabLabel${activeTab === id ? " tabLabelActive" : ""}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
