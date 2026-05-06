import React from 'react';
import './PlayerComparisonCard.css';
import profilePlaceholder from '../../../assets/icons/profile.png';

const PlayerComparisonCard = ({ playerName, playerAvatar, onRemove, playerIndex, totalPlayers }) => {
  const handleImgError = (event) => {
    if (event.currentTarget.src !== profilePlaceholder) {
      event.currentTarget.src = profilePlaceholder;
    }
  };

  return (
    <div className={`player-comparison-card player-comparison-card--${totalPlayers}-players player-comparison-card--position-${playerIndex}`}>
      <div className="player-comparison-card-content">
        <div className="player-comparison-card-avatar-wrapper">
          <img
            src={playerAvatar || profilePlaceholder}
            alt={playerName}
            className="player-comparison-card-avatar"
            onError={handleImgError}
          />
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
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 3L3 9M3 3L9 9" stroke="#000215" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default PlayerComparisonCard;
