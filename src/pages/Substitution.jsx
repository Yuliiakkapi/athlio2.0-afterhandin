import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plus, Sparkle, X } from "@phosphor-icons/react";
import OvrBadge from "../components/UI/OvrBadge";
import IconButton from "../components/UI/IconButton";
import { supabase } from "../lib/supabase";
import "./Substitution.css";

const TEAM_STATS = { ovr: 72, def: 71, att: 71, mid: 71 };

function hashNum(id, offset, min, max) {
  const n = parseInt((id ?? "0").replace(/-/g, "").slice(offset, offset + 8), 16);
  return min + (n % (max - min + 1));
}

function fakeOvr(id) { return hashNum(id, 0, 60, 90); }

const STAT_DEFS = [
  { label: "Goals",   offset: 2,  min: 2,  max: 25,  decimal: false, neutral: false },
  { label: "Assists", offset: 4,  min: 1,  max: 20,  decimal: false, neutral: false },
  { label: "Matches", offset: 6,  min: 10, max: 38,  decimal: false, neutral: true  },
  { label: "% Win",   offset: 8,  min: 30, max: 85,  decimal: false, neutral: false },
  { label: "GPM",     offset: 10, min: 10, max: 180, decimal: true,  neutral: false },
  { label: "APM",     offset: 12, min: 5,  max: 120, decimal: true,  neutral: false },
];

function makeStats(id) {
  return STAT_DEFS.map(({ label, offset, min, max, decimal, neutral }) => {
    const raw = hashNum(id, offset, min, max);
    const value = decimal ? raw / 100 : raw;
    const display = decimal ? value.toFixed(2) : String(value);
    return { label, value, display, neutral };
  });
}

function statColors(outStats, inStats) {
  if (!inStats) return outStats.map(() => ({ out: null, in: null }));
  return outStats.map((s, i) => {
    if (s.neutral) return { out: null, in: null };
    const o = s.value;
    const n = inStats[i].value;
    if (o > n) return { out: "positive", in: "negative" };
    if (n > o) return { out: "negative", in: "positive" };
    return { out: null, in: null };
  });
}

function PlayerAvatar({ player }) {
  if (player?.avatar_url) {
    return <img src={player.avatar_url} alt="" className="sub-player-photo" />;
  }
  const initials = (player?.full_name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return <div className="sub-player-initials">{initials}</div>;
}

function PlayerCard({ player, ovr, stats, colorKey, variant }) {
  const clubName = player?.clubs?.name ?? player?.club_other_name ?? null;
  const posLabel = (player?.position?.[0] ?? "CDM").toUpperCase();

  return (
    <div className="sub-player-card">
      <div className="sub-player-photo-wrap">
        <PlayerAvatar player={player} />
        <div className={`sub-player-ovr-overlay${variant === "in" ? " sub-player-ovr-overlay--in" : ""}`}>
          <span className="sub-player-ovr-number">{ovr}</span>
          <span className="sub-player-ovr-label">OVR</span>
        </div>
      </div>
      <div className="sub-player-info">
        <div className="sub-player-name-row">
          <span className="sub-player-name">{player?.full_name ?? "Unknown"}</span>
        </div>
        <div className="sub-player-meta">
          <span className="sub-player-pos-tag">{posLabel}</span>
          {clubName && (
            <>
              <span className="sub-player-dot" />
              <span className="sub-player-club">{clubName}</span>
            </>
          )}
        </div>
        <div className="sub-player-stats">
          {stats.map(({ label, display }, i) => (
            <div key={label} className="sub-player-stat-row">
              <span className="sub-player-stat-label">{label}</span>
              <span className={`sub-player-stat-value${colorKey[i] ? ` sub-player-stat-value--${colorKey[i]}` : ""}`}>
                {display}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Substitution() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const player = state?.player ?? null;
  const slot = state?.slot ?? null;
  const slotIndex = state?.slotIndex ?? null;

  const [localInPlayer, setLocalInPlayer] = useState(state?.inPlayer ?? null);
  const [autoPickLoading, setAutoPickLoading] = useState(false);

  const posLabel = (player?.position?.[0] ?? slot?.pos ?? "CDM").toUpperCase();
  const outOvr = fakeOvr(player?.id ?? "0");
  const inOvr = localInPlayer ? fakeOvr(localInPlayer.id) : null;

  const outStats = makeStats(player?.id ?? "0");
  const inStats = localInPlayer ? makeStats(localInPlayer.id) : null;
  const colors = statColors(outStats, inStats);

  const teamOvrAfter = localInPlayer
    ? Math.max(60, Math.min(99, TEAM_STATS.ovr + Math.round((inOvr - outOvr) * 0.3)))
    : null;

  async function handleAutoPick() {
    setAutoPickLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*, clubs(name, logo_url, country)")
      .eq("role", "athlete")
      .limit(50);
    const athletes = data ?? [];
    const posFiltered = athletes.filter((p) =>
      p.position?.some((pos) => pos.toUpperCase() === posLabel)
    );
    const pool = posFiltered.length > 0 ? posFiltered : athletes;
    const best = pool.reduce((acc, p) => {
      return !acc || fakeOvr(p.id) > fakeOvr(acc.id) ? p : acc;
    }, null);
    if (best) setLocalInPlayer(best);
    setAutoPickLoading(false);
  }

  return (
    <div className="sub-page">
      <div className="sub-topbar">
        <IconButton size="small" type="subtle" icon={ArrowLeft} onClick={() => navigate(-1)} />
        <h1 className="sub-title">Substitution</h1>
        <IconButton size="small" type="subtle" icon={X} onClick={() => navigate("/scouting/team")} />
      </div>

      {/* Team OVR card */}
      <div className="sub-ovr-card">
        <div className="sub-ovr-left">
          <span className="sub-ovr-rotated-label">team ovr</span>
          <div className="sub-ovr-badge-row">
            <OvrBadge value={TEAM_STATS.ovr} size="sm" variant="gold" />
            <ArrowRight size={24} color="var(--neutral-400)" />
            {teamOvrAfter !== null && (
              <OvrBadge value={teamOvrAfter} size="sm" variant="gold" />
            )}
          </div>
        </div>
        <div className="sub-ovr-divider" />
        <div className="sub-ovr-stats">
          <div className="sub-ovr-stat">
            <span className="sub-ovr-stat-label">Def</span>
            <span className="sub-ovr-stat-value">{TEAM_STATS.def}</span>
          </div>
          <div className="sub-ovr-stat">
            <span className="sub-ovr-stat-label">ATT</span>
            <span className="sub-ovr-stat-value">{TEAM_STATS.att}</span>
          </div>
          <div className="sub-ovr-stat">
            <span className="sub-ovr-stat-label">Mid</span>
            <span className="sub-ovr-stat-value">{TEAM_STATS.mid}</span>
          </div>
        </div>
      </div>

      {/* OUT / IN direction labels */}
      <div className="sub-direction-row">
        <div className="sub-direction-col">
          <span className="sub-direction-out">OUT</span>
        </div>
        <div className="sub-direction-spacer" />
        <div className="sub-direction-col">
          <span className="sub-direction-in">IN</span>
        </div>
      </div>

      {/* Two player panels */}
      <div className="sub-panels">
        <PlayerCard
          player={player}
          ovr={outOvr}
          stats={outStats}
          colorKey={colors.map((c) => c.out)}
          variant="out"
        />

        <div className="sub-arrow-between">
          <ArrowRight size={24} color="var(--neutral-400)" />
        </div>

        {localInPlayer ? (
          <PlayerCard
            player={localInPlayer}
            ovr={inOvr}
            stats={inStats}
            colorKey={colors.map((c) => c.in)}
            variant="in"
          />
        ) : (
          <div className="sub-empty-card">
            <div className="sub-empty-inner">
              <button
                className="sub-add-btn"
                onClick={() =>
                  navigate("/scouting/select-players", {
                    state: { pos: posLabel, outPlayer: player, slot, slotIndex },
                  })
                }
              >
                <div className="sub-add-icon-wrap">
                  <Plus size={32} weight="bold" color="var(--primary-600)" />
                </div>
                <span className="sub-add-label">Add a player</span>
              </button>
              <button className="sub-autopick-btn" onClick={handleAutoPick} disabled={autoPickLoading}>
                <Sparkle size={18} color="var(--primary-700)" />
                <span>{autoPickLoading ? "Picking…" : "Auto-pick"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="sub-actions">
        <button
          className="sub-confirm-btn"
          disabled={!localInPlayer}
          onClick={() => navigate("/scouting/team", { state: { slotIndex, inPlayer: localInPlayer } })}
        >
          Confirm Substitution
        </button>
        <button
          className="sub-cancel-btn"
          onClick={() =>
            navigate("/scouting/select-players", {
              state: { pos: posLabel, outPlayer: player, slot, slotIndex },
            })
          }
        >
          Choose a different player
        </button>
      </div>
    </div>
  );
}
