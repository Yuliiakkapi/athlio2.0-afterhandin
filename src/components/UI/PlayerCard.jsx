import { Link } from "react-router-dom";
import { TShirt, Check } from "@phosphor-icons/react";
import ProfilePicture from "./ProfilePicture";
import Badge from "./Badge";
import Button from "./Button";
import IconButton from "./IconButton";
import { toPositionAbbr } from "../../utils/positions";
import RoleBadge from "./RoleBadge";
import "./PlayerCard.css";

function flagEmoji(code) {
  if (!code || code.length !== 2) return null;
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

/**
 * infoType  "club" | "national"
 * isFollowing  boolean — false = Follow button, true = check icon
 */
export default function PlayerCard({
  profile,
  infoType = "club",
  isFollowing = false,
  onFollow,
}) {
  if (!profile) return null;

  const positions = Array.isArray(profile.position)
    ? profile.position
    : profile.position
    ? [profile.position]
    : [];

  const clubName = profile.clubs?.name || profile.club_other_name;
  const clubLogo = profile.clubs?.logo_url;
  const clubLeague = profile.clubs?.country;
  const flag = flagEmoji(profile.nationality_code);

  return (
    <Link to={`/profile/${profile.id}`} className="player-card">
      <ProfilePicture
        imgUrl={profile.avatar_url}
        size="medium"
        verified={profile.verified}
      />

      <div className="player-card-info">
        <div className="player-card-top">
          <span className="player-card-name text-base-semibold">
            {profile.full_name || profile.username}
          </span>
          <div className="player-card-positions">
            {infoType === "professional" ? (
              <RoleBadge role={profile.role} />
            ) : (
              positions.slice(0, 2).map((pos) => (
                <Badge key={pos} text={toPositionAbbr(pos)} color="light" size="xs" />
              ))
            )}
          </div>
        </div>

        <div className="player-card-sub">
          {infoType === "professional" && (
            <>
              {profile.org_name && (
                <span className="player-card-sub-text text-sm-regular">
                  {profile.org_name}
                </span>
              )}
              {profile.nationality && profile.org_name && (
                <span className="player-card-dot" aria-hidden="true" />
              )}
              {profile.nationality && (
                <span className="player-card-sub-text text-sm-regular">
                  {profile.nationality}
                </span>
              )}
            </>
          )}

          {infoType === "club" && clubName && (
            <>
              {clubLogo && (
                <img
                  src={clubLogo}
                  alt={clubName}
                  className="player-card-club-logo"
                />
              )}
              <span className="player-card-sub-text text-sm-regular">
                {clubName}
              </span>
              {clubLeague && (
                <>
                  <span className="player-card-dot" aria-hidden="true" />
                  <span className="player-card-sub-text text-sm-regular">
                    {clubLeague}
                  </span>
                </>
              )}
            </>
          )}

          {infoType === "national" && (
            <>
              {flag && (
                <span className="player-card-flag" aria-hidden="true">
                  {flag}
                </span>
              )}
              {profile.nationality && (
                <span className="player-card-sub-text text-sm-regular">
                  {profile.nationality}
                </span>
              )}
              {profile.shirt_number != null && (
                <>
                  <span className="player-card-dot" aria-hidden="true" />
                  <TShirt size={14} className="player-card-shirt-icon" />
                  <span className="player-card-sub-text text-sm-regular">
                    {profile.shirt_number}
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className="player-card-action"
        onClick={(e) => e.preventDefault()}
      >
        {isFollowing ? (
          <IconButton icon={Check} size="small" type="subtle" onClick={onFollow} />
        ) : (
          <Button
            size="small"
            type="primary"
            label="Follow"
            onClick={onFollow}
          />
        )}
      </div>
    </Link>
  );
}
