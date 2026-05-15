import React from 'react';
import './PlayerComparisonCard.css';
import { UserCircle, X } from '@phosphor-icons/react';

const PlayerComparisonCard = ({ playerName, playerAvatar, onRemove, playerIndex, totalPlayers }) => {
  return (
    <div className={`player-comparison-card player-comparison-card--${totalPlayers}-players player-comparison-card--position-${playerIndex}`}>
      <div className="player-comparison-card-content">
        <div className="player-comparison-card-avatar-wrapper">
          {playerAvatar ? (
            <img
              src={playerAvatar}
              alt={playerName}
              className="player-comparison-card-avatar"
            />
          ) : (
            <UserCircle className="player-comparison-card-avatar player-comparison-card-avatar-fallback" aria-hidden="true" />
          )}
        </div>
        <div className="player-comparison-card-name">
          <span>{playerName}</span>
        </div>
      </div>
      <button 
        className="player-comparison-card-remove-btn" 
        onClick={onRemove}
        aria-label={`Remove ${playerName}`}
      >
        <X size={12} weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
};

export default PlayerComparisonCard;
