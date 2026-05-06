import React from 'react';
import './TableInfo.css';

const ROWS = [
  { key: 'country', label: 'Nationality' },
  { key: 'age', label: 'Age' },
  { key: 'birthdate', label: 'Born in' },
  { key: 'team', label: 'Team' },
  { key: 'weightKg', label: 'Weight (Kg)' },
  { key: 'heightCm', label: 'Height (cm)' },
  { key: 'position', label: 'Position' },
  { key: 'shirtNumber', label: 'Shirt Number' },
  { key: 'preferredFoot', label: 'Preferred Foot' },
];

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatAge(info) {
  if (info?.birthdate) {
    const d = new Date(info.birthdate);
    if (!Number.isNaN(d.getTime())) {
      const diff = Date.now() - d.getTime();
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      if (Number.isFinite(years)) return `${years} years`;
    }
  }
  return info?.age ? `${info.age} years` : '—';
}

function renderValue(info, row) {
  if (!info) return '—';
  switch (row.key) {
    case 'country':
      return info.country || '—';
    case 'age':
      return formatAge(info);
    case 'birthdate':
      return formatDate(info.birthdate);
    case 'team':
      if (!info.teamName && !info.teamLogo) return '—';
      return (
        <span className="info-table-team">
          {info.teamLogo && (
            <img src={info.teamLogo} alt={info.teamName || 'Team'} className="info-table-team-logo" />
          )}
          <span>{info.teamName || '—'}</span>
        </span>
      );
    case 'weightKg':
      return info.weightKg ?? '—';
    case 'heightCm':
      return info.heightCm ?? '—';
    case 'position':
      return info.position || '—';
    case 'shirtNumber':
      return info.shirtNumber || '—';
    case 'preferredFoot':
      return info.preferredFoot || '—';
    default:
      return info[row.key] || '—';
  }
}

export default function TableInfo({ players = [] }) {
  if (!players.length) return null;
  const displayPlayers = players.slice(0, 3);

  return (
    <div className="info-table-card">
      <div className="info-table-header">Player Info</div>
      <div className="info-table-body">
        {ROWS.map((row, idx) => (
          <div key={row.key} className={`info-table-row ${idx % 2 === 1 ? 'alt' : ''}`}>
            <div className="info-table-label">{row.label}</div>
            <div className="info-table-values">
              {displayPlayers.map((player) => (
                <div key={`${player.id}-${row.key}`} className="info-table-value">
                  {renderValue(player.info, row)}
                </div>
              ))}
              {displayPlayers.length === 1 && (
                <div className="info-table-value placeholder" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
