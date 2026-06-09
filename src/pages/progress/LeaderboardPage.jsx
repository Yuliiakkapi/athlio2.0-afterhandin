import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { fetchWatchlist } from "../../lib/watchlist";
import { fetchSeasonStats } from "../../lib/stats";
import OvrBadge from "../../components/UI/OvrBadge";
import "./LeaderboardPage.css";

/* ── seeded OVR (same as Watchlist.jsx) ── */
function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
function fakeOvr(idStr) {
  const n = idStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.round(seededRand(n * 3571)() * 40 + 50);
}

function buildRows(profiles, statsArr) {
  const statsMap = new Map(statsArr.map((r) => [r.profile_id, r.stats]));
  return profiles
    .map((p) => {
      const s = statsMap.get(p.id);
      return {
        id: p.id,
        name: p.full_name || "Unknown",
        club: p.club || "—",
        g: s?.goals ?? 0,
        a: s?.assists ?? 0,
        ovr: fakeOvr(p.id),
        avatarUrl: p.avatar_url || null,
      };
    })
    .sort((a, b) => b.g - a.g || b.a - a.a)
    .slice(0, 10);
}

async function loadWatchlist() {
  const wl = await fetchWatchlist();
  if (!wl.length) return [];
  const statsArr = await fetchSeasonStats(wl.map((p) => p.id));
  return buildRows(wl, statsArr);
}

async function loadAll() {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .not("full_name", "is", null)
    .limit(100);
  if (error || !profiles?.length) return [];

  const ids = profiles.map((p) => p.id);
  const { data: infoRows } = await supabase
    .from("info")
    .select("profile_id, club:club_id(name)")
    .in("profile_id", ids);
  const infoMap = new Map((infoRows || []).map((r) => [r.profile_id, r]));

  const enriched = profiles.map((p) => ({
    ...p,
    club: infoMap.get(p.id)?.club?.name || null,
  }));

  const statsArr = await fetchSeasonStats(ids);
  return buildRows(enriched, statsArr);
}

async function loadLaLigaU19() {
  const { data: spanishClubs } = await supabase
    .from("clubs")
    .select("id")
    .eq("country_code", "ES");
  if (!spanishClubs?.length) return [];

  const spanishClubIds = spanishClubs.map((c) => c.id);
  const { data: infoRows } = await supabase
    .from("info")
    .select("profile_id, birth_date, club:club_id(name)")
    .in("club_id", spanishClubIds);
  if (!infoRows?.length) return [];

  const today = new Date();
  const u19 = infoRows.filter((r) => {
    if (!r.birth_date) return false;
    const birth = new Date(r.birth_date);
    let age = today.getFullYear() - birth.getFullYear();
    if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
    return age <= 19;
  });
  if (!u19.length) return [];

  const ids = u19.map((r) => r.profile_id);
  const infoMap = new Map(u19.map((r) => [r.profile_id, r]));

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", ids);

  const enriched = (profiles || []).map((p) => ({
    ...p,
    club: infoMap.get(p.id)?.club?.name || null,
  }));

  const statsArr = await fetchSeasonStats(ids);
  return buildRows(enriched, statsArr);
}

const TABS = [
  { label: "Watchlist",     load: loadWatchlist },
  { label: "All",           load: loadAll },
  { label: "La Liga 1 U19", load: loadLaLigaU19 },
];

/* ── Card ── */
function LeaderboardCard({ players, loading, onPlayerClick }) {
  const header = (
    <div className="lbp-thead">
      <span className="lbp-thead-player">Player</span>
      <div className="lbp-thead-right">
        <span className="lbp-thead-stat">G</span>
        <span className="lbp-thead-stat">A</span>
        <span className="lbp-thead-rating">Rating</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="lbp-card">
        {header}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`lbp-row lbp-row--skeleton${i === 4 ? " lbp-row--last" : ""}`} />
        ))}
      </div>
    );
  }

  if (!players.length) {
    return (
      <div className="lbp-card">
        {header}
        <div className="lbp-empty">No players found</div>
      </div>
    );
  }

  return (
    <div className="lbp-card">
      {header}
      {players.map((player, i) => (
        <div
          key={player.id}
          className={["lbp-row lbp-row--clickable", i === players.length - 1 && "lbp-row--last"].filter(Boolean).join(" ")}
          onClick={() => onPlayerClick(player.id)}
        >
          <div className="lbp-row-left">
            <span className="lbp-rank">{i + 1}.</span>
            <div className="lbp-avatar">
              {player.avatarUrl
                ? <img src={player.avatarUrl} alt={player.name} className="lbp-avatar-img" />
                : player.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
            </div>
            <div className="lbp-player-info">
              <span className="lbp-player-name text-sm-semibold">{player.name}</span>
              <span className="lbp-player-club text-xs-medium">{player.club}</span>
            </div>
          </div>

          <div className="lbp-row-right">
            <span className="lbp-stat">{player.g}</span>
            <span className="lbp-stat">{player.a}</span>
            <div className="lbp-rating">
              <OvrBadge value={player.ovr} size="sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page ── */
export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabData, setTabData] = useState({});
  const [tabLoading, setTabLoading] = useState({});
  const loadedRef = useRef(new Set());
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  function loadTab(index) {
    if (loadedRef.current.has(index)) return;
    loadedRef.current.add(index);
    setTabLoading((prev) => ({ ...prev, [index]: true }));
    TABS[index].load()
      .then((players) => setTabData((prev) => ({ ...prev, [index]: players })))
      .catch(() => setTabData((prev) => ({ ...prev, [index]: [] })))
      .finally(() => setTabLoading((prev) => ({ ...prev, [index]: false })));
  }

  const loadTabRef = useRef(loadTab);
  loadTabRef.current = loadTab;

  useEffect(() => {
    loadTabRef.current(0);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    function onScroll() {
      const cardWidth = carousel.offsetWidth + 12;
      const index = Math.round(carousel.scrollLeft / cardWidth);
      setActiveTab(index);
      loadTabRef.current(index);
    }
    carousel.addEventListener("scroll", onScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", onScroll);
  }, []);

  function handleTabClick(index) {
    setActiveTab(index);
    loadTab(index);
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.children[index];
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  return (
    <div className="lbp-page">
      <div className="lbp-tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            className={`lbp-tab${activeTab === i ? " lbp-tab--active" : ""}`}
            onClick={() => handleTabClick(i)}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="lbp-carousel" ref={carouselRef}>
        {TABS.map((tab, i) => (
          <LeaderboardCard
            key={tab.label}
            players={tabData[i] || []}
            loading={!!tabLoading[i]}
            onPlayerClick={(id) => navigate(`/profile/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}
