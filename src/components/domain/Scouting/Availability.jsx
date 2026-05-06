import React from 'react';
import './Availability.css';
import profilePlaceholder from '../../../assets/icons/profile.png';

const FALLBACK_AVATAR = profilePlaceholder;
const FALLBACK_ICON =
  'https://api.builder.io/api/v1/image/assets/e9cac1e18ae64186984fb4d639c633bc/feca78aec91a801ddc79124b791fa68faaee5023?placeholderIfAbsent=true';

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRange(injury) {
  const start = formatDate(injury.start_date);
  const end = formatDate(injury.end_date);
  const expected = formatDate(injury.expected_return_date);
  if (start && end) return `${start} · ${end}`;
  if (start && expected) return `${start} · est. ${expected}`;
  if (start) return `${start} · ongoing`;
  if (expected) return `est. ${expected}`;
  return 'Timeline unavailable';
}

function getStatus(injuries = []) {
  if (!injuries.length) {
    return { badge: 'Available', text: 'No injuries reported', tone: 'available' };
  }
  const sorted = [...injuries].sort((a, b) => {
    const aTime = new Date(a.start_date || 0).getTime();
    const bTime = new Date(b.start_date || 0).getTime();
    return bTime - aTime;
  });
  const active = sorted.find((injury) => {
    if (!injury.end_date) return true;
    const end = new Date(injury.end_date);
    return !Number.isNaN(end.getTime()) && end >= new Date();
  });
  if (active) {
    return {
      badge: 'Unavailable',
      text: active.title || 'Currently injured',
      tone: 'unavailable',
    };
  }
  return {
    badge: 'Available',
    text: 'Recovered from recent injuries',
    tone: 'available',
  };
}

function InjuryList({ injuries = [] }) {
  if (!injuries.length) {
    return <p className="availability-empty">No recorded injuries.</p>;
  }
  return injuries.map((injury, index) => (
    <div
      key={`${injury.profile_id}-${injury.title}-${injury.start_date}-${index}`}
      className="availability-injury-item"
    >
      <div className="availability-injury-content">
        <img
          src={injury.logo_url || FALLBACK_ICON}
          alt=""
          className="availability-injury-icon"
        />
        <div className="availability-injury-details">
          <div className="availability-injury-type">
            {injury.title || injury.category || 'Injury'}
          </div>
          <div className="availability-injury-period">
            {injury.body_part ? `${injury.body_part} · ` : ''}
            {formatRange(injury)}
          </div>
        </div>
      </div>
    </div>
  ));
}

export default function Availability({ players = [] }) {
  if (!players.length) return null;
  const displayPlayers = players.slice(0, 3);

  return (
    <div className="availability-container">
      {displayPlayers.map((player) => {
        const injuries = player.injuries || [];
        const status = getStatus(injuries);

        return (
          <div key={player.id} className="availability-card">
            <div className="availability-header">
              <div className="availability-player-info">
                <img
                  className="availability-avatar"
                  src={player.avatar || FALLBACK_AVATAR}
                  alt={player.name}
                  onError={(event) => {
                    if (event.currentTarget.src !== FALLBACK_AVATAR) {
                      event.currentTarget.src = FALLBACK_AVATAR;
                    }
                  }}
                />
                <div className="availability-player-name">{player.name}</div>
              </div>
            </div>

            <div className="availability-status-section">
              <div className="availability-status-content">
                <span className="availability-status-label">Status</span>
                <span className={`availability-status-badge ${status.tone}`}>
                  {status.badge}
                </span>
                <span className="availability-status-text">{status.text}</span>
              </div>
            </div>

            <InjuryList injuries={injuries} />
          </div>
        );
      })}
    </div>
  );
}
