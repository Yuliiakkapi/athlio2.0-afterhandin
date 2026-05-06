import React, { useState, useRef, useEffect } from 'react';
import './PlayerSelector.css';
import Button from '../../UI/Button';
import PlusIcon from '../../../assets/icons/plus.svg';
import { useNavigate } from 'react-router';
import PlayerComparisonCard from './PlayerComparisonCard';

const SEASONS = [
  "Season 2025-26",
  "Season 2024-25",
  "Season 2023-24",
  "Season 2022-23"
];

const MAX_PLAYERS = 3;

const PlayerSelector = ({
  players = [],
  onAddPlayer,
  onRemovePlayer,
  onSeasonChange,
}) => {
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setIsDropdownOpen(false);
    if (onSeasonChange) {
      onSeasonChange(season);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const canAddMore = players.length < MAX_PLAYERS;
  const listModifier = players.length >= 2 ? ` player-selector-list--${Math.min(players.length, 3)}` : '';

  return (
    <div className="player-selector">
      <div className="player-selector-container">
        <div className="player-selector-controls">
          <div className="season-dropdown-wrapper" ref={dropdownRef}>
            <button className="season-selector" onClick={toggleDropdown}>
              <span className="season-text">{selectedSeason}</span>
              <img
                src="https://api.builder.io/api/v1/image/assets/e9cac1e18ae64186984fb4d639c633bc/9036da0af52d5c2760ad262991e1bd586471517e?placeholderIfAbsent=true"
                alt=""
                className="season-dropdown-icon"
              />
            </button>
            {isDropdownOpen && (
              <div className="season-dropdown-menu">
                {SEASONS.map((season) => (
                  <button
                    key={season}
                    className={`season-dropdown-item ${selectedSeason === season ? 'season-dropdown-item--active' : ''}`}
                    onClick={() => handleSeasonSelect(season)}
                  >
                    {season}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            size="small"
            type="primary"
            label="Add a new player"
            Icon={PlusIcon}
            color="white"
            onClick={() => navigate('/scouting/search')}
            disabled={!canAddMore}
          />
        </div>
        <div className={`player-selector-list${listModifier}`}>
          {players.length === 0 ? (
            <p className="player-selector-empty">Add up to 3 players to compare.</p>
          ) : (
            players.map((player, index) => (
              <PlayerComparisonCard
                key={player.id}
                playerName={player.name}
                playerAvatar={player.avatar}
                onRemove={() => onRemovePlayer(player.id)}
                playerIndex={index}
                totalPlayers={players.length}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelector;
