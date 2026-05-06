import React from 'react';
import './TableCategory.css';

function formatValue(value, format) {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return '0';
  if (format === 'int') {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}

export default function TableCategory({ title, rows = [], players = [] }) {
  if (!players.length || !rows.length) return null;
  const displayPlayers = players.slice(0, 3);

  return (
    <div className="category-card">
      <div className="category-card-header">{title}</div>
      <div className="category-card-body">
        {rows.map((row, idx) => {
          const values = displayPlayers.map((player) =>
            Number(player?.stats?.[row.key] ?? 0),
          );
          const maxValue = Math.max(...values);
          return (
            <div key={row.key} className={`category-row ${idx % 2 === 1 ? 'alt' : ''}`}>
              <div className="category-label">{row.label}</div>
              <div className="category-values">
                {values.map((value, playerIndex) => (
                  <div
                    key={`${row.key}-${playerIndex}`}
                    className={`category-value${
                      value === maxValue ? ' category-value--highlight' : ''
                    }`}
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
