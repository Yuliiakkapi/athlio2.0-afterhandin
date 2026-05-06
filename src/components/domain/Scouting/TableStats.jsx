import React from 'react';
import './TableStats.css';

const ROWS = [
  { key: 'totalPlayed', label: 'Total Played', format: 'int' },
  { key: 'started', label: 'Started', format: 'int' },
  { key: 'minutesPerGame', label: 'Minutes per game', format: 'decimal' },
  { key: 'totalMinutes', label: 'Total minutes played', format: 'int' },
];

function formatValue(value, format) {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return '0';
  if (format === 'int') {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export default function TableStats({ players = [] }) {
  if (!players.length) return null;
  const displayPlayers = players.slice(0, 3);

  return (
    <div className="table-stats">
      <div className="table-stats-header">Matches</div>

      <div className="table-stats-body">
        {ROWS.map((row, idx) => {
          const values = displayPlayers.map((player) =>
            Number(player?.stats?.[row.key] ?? 0),
          );
          const maxValue = Math.max(...values);

          return (
            <div key={row.key} className={`table-row ${idx % 2 === 1 ? 'alt' : ''}`}>
              <div className="label">{row.label}</div>
              <div className="table-values">
                {values.map((value, playerIndex) => (
                  <div
                    key={`${row.key}-${playerIndex}`}
                    className={`value${value === maxValue ? ' value--highlight' : ''}`}
                  >
                    {formatValue(value, row.format)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
