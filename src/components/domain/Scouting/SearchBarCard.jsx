import React, { useEffect, useState } from 'react';
import './SearchBarCard.css';
import profilePlaceholder from '../../../assets/icons/profile.png';
import defaultTeamLogo from '../../../assets/logos/main-logo.svg';
import defaultFlag from '../../../assets/icons/verification.svg';
import { supabase } from '../../../lib/supabase';

const SearchBarCard = ({
  profileId,
  playerName: fallbackName = 'Player',
  teamName: fallbackTeam = '—',
  nationality: fallbackCountry = '—',
  avatar: fallbackAvatar = profilePlaceholder,
  teamLogo: fallbackTeamLogo = defaultTeamLogo,
  flag: fallbackFlag = defaultFlag,
  onSelect,
}) => {
  const [state, setState] = useState({
    loading: !!profileId,
    name: fallbackName,
    team: fallbackTeam,
    country: fallbackCountry,
    avatar: fallbackAvatar,
    teamLogo: fallbackTeamLogo,
    flag: fallbackFlag,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!profileId) return;
      setState((s) => ({ ...s, loading: true }));
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, country, club_other_name, club_id')
        .eq('id', profileId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error('SearchBarCard profile fetch', error);
        setState((s) => ({ ...s, loading: false }));
        return;
      }
      let teamName = data?.club_other_name || fallbackTeam;
      let teamLogo = fallbackTeamLogo;

      if (data?.club_id) {
        const { data: clubRow, error: clubErr } = await supabase
          .from('clubs')
          .select('name, logo_url')
          .eq('id', data.club_id)
          .maybeSingle();
        if (!clubErr && clubRow) {
          teamName = data?.club_other_name || clubRow.name || fallbackTeam;
          teamLogo = clubRow.logo_url || fallbackTeamLogo;
        }
      }
      const country = data?.country || fallbackCountry;
      setState({
        loading: false,
        name: data?.full_name || fallbackName,
        team: teamName,
        country,
        avatar: data?.avatar_url || fallbackAvatar,
        teamLogo,
        flag: fallbackFlag,
      });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const { name, team, country, avatar, teamLogo, flag } = state;

  return (
    <button className="search-card-item" onClick={() => onSelect?.(profileId)}>
      <div className="avatar-wrap" aria-hidden>
        <img
          src={avatar || profilePlaceholder}
          alt={`${name} avatar`}
          className="avatar-img"
          onError={(event) => {
            if (event.currentTarget.src !== profilePlaceholder) {
              event.currentTarget.src = profilePlaceholder;
            }
          }}
        />
      </div>

      <div className="info">
        <div className="name">{name}</div>
        <div className="meta">
          <span className="position">Midfielder</span>

          {teamLogo && <img src={teamLogo} alt={`${team} logo`} className="team-logo" />}
          <span className="team-name">{team}</span>

          {flag && <img src={flag} alt={country} className="flag" />}
          <span className="country">{country}</span>
        </div>
      </div>
    </button>
  );
};

export default SearchBarCard;
