import React from 'react';
import './NavTabs.css';

const NavigationTabs = ({
  tabs = [
    { id: 'stats', label: 'Stats' },
    { id: 'info', label: 'Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'availability', label: 'Availability' },
  ],
  activeTab,
  onTabChange
}) => {

  return (
    <nav className="navbartabs">
      <div className="tabContainer">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab ${activeTab === tab.id ? 'tabActive' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            <span className={`tabLabel ${activeTab === tab.id ? 'tabLabelActive' : ''}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTabs;
