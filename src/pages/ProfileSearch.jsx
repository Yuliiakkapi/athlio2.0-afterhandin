import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import PlayerCard from "../components/UI/PlayerCard";
import SearchBar from "../components/UI/SearchBar";
import IconButton from "../components/UI/IconButton";
import Badge from "../components/UI/Badge";
import EventCard from "../components/domain/Events/EventCard";
import SuggestedFollowCard from "../components/domain/onboarding/SuggestedFollowCard";
import { SlidersHorizontal, BookmarkSimple } from "@phosphor-icons/react";
import "./search.css";

const PROFILE_SELECT = "*, clubs(name, logo_url, country)";

function FollowableSuggestedCard({ profile }) {
  return (
    <SuggestedFollowCard
      id={profile.id}
      name={profile.full_name || profile.username}
      avatarUrl={profile.avatar_url}
      verified={profile.verified}
      positions={profile.position ?? []}
      clubName={profile.clubs?.name || null}
    />
  );
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "athletes", label: "Athletes" },
  { key: "professionals", label: "Professionals" },
  { key: "clubs", label: "Clubs" },
  { key: "events", label: "Events" },
];

async function fetchSuggestedProfiles() {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id ?? null;
  let userCountry = null;
  let myFollowingIds = [];

  if (userId) {
    const [profileRes, followsRes] = await Promise.all([
      supabase.from("profiles").select("country").eq("id", userId).maybeSingle(),
      supabase.from("follows").select("following_id").eq("follower_id", userId),
    ]);
    userCountry = profileRes.data?.country ?? null;
    myFollowingIds = followsRes.data?.map((f) => f.following_id) ?? [];

    if (myFollowingIds.length > 0) {
      const { data: fofRows } = await supabase
        .from("follows")
        .select("following_id")
        .in("follower_id", myFollowingIds);

      const excluded = new Set([userId, ...myFollowingIds]);
      const counts = {};
      for (const { following_id } of fofRows ?? []) {
        if (!excluded.has(following_id)) {
          counts[following_id] = (counts[following_id] || 0) + 1;
        }
      }

      const candidates = Object.keys(counts)
        .sort((a, b) => counts[b] - counts[a])
        .slice(0, 20);

      if (candidates.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select(PROFILE_SELECT)
          .in("id", candidates);

        const sorted = (profiles ?? []).sort((a, b) => {
          const aScore = (counts[a.id] ?? 0) + (a.country === userCountry ? 3 : 0);
          const bScore = (counts[b.id] ?? 0) + (b.country === userCountry ? 3 : 0);
          return bScore - aScore;
        });

        if (sorted.length > 0) return sorted.slice(0, 3);
      }
    }

    if (userCountry) {
      let q = supabase
        .from("profiles")
        .select(PROFILE_SELECT)
        .eq("country", userCountry)
        .neq("id", userId);
      if (myFollowingIds.length > 0)
        q = q.not("id", "in", `(${myFollowingIds.join(",")})`);
      const { data } = await q.limit(3);
      if (data?.length > 0) return data;
    }
  }

  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .neq("id", userId ?? "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false })
    .limit(3);
  return data ?? [];
}

function ClubRow({ club, onClick }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="club-row" onClick={onClick}>
      <div className="club-row-logo-wrap">
        {club.logo_url ? (
          <img src={club.logo_url} alt={club.name} className="club-row-logo-img" />
        ) : (
          <span className="text-base-semibold club-row-initial">{club.name[0]}</span>
        )}
      </div>
      <div className="club-row-info">
        <div className="club-row-name-row">
          <span className="text-base-semibold">{club.name}</span>
          <Badge text="Club" color="light" size="xs" />
        </div>
        {club.country && (
          <span className="text-sm-regular club-row-country">{club.country}</span>
        )}
      </div>
      <button
        className={`club-row-bookmark${saved ? " club-row-bookmark--saved" : ""}`}
        onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
      >
        <BookmarkSimple size={20} weight={saved ? "fill" : "regular"} />
      </button>
    </div>
  );
}

function ProfileList({ profiles }) {
  return (
    <div className="search-player-list">
      {profiles.map((profile) => (
        <div key={profile.id}>
          <PlayerCard
            profile={{ ...profile, nationality: profile.country }}
            showAction={false}
          />
        </div>
      ))}
    </div>
  );
}

function ClubScrollRow({ clubs, onClubClick }) {
  return (
    <div className="clubs-scroll">
      {clubs.map((club) => (
        <div key={club.id} className="club-item" onClick={() => onClubClick(club.id)}>
          <div className="club-logo-wrap">
            {club.logo_url ? (
              <img src={club.logo_url} alt={club.name} className="club-logo" />
            ) : (
              <span className="club-logo-initial">{club.name[0]}</span>
            )}
          </div>
          <span className="club-name">{club.name}</span>
          {club.country && <span className="club-country">{club.country}</span>}
        </div>
      ))}
    </div>
  );
}

export default function ProfileSearch() {
  const [q, setQ] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // All-tab browse
  const [suggested, setSuggested] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(true);

  // Shared browse sections
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);

  // Filter-specific browse
  const [filterProfiles, setFilterProfiles] = useState([]);
  const [nearbyClubs, setNearbyClubs] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  const navigate = useNavigate();
  const browseMode = q.trim().length < 2;

  // Suggested profiles for All tab
  useEffect(() => {
    let cancel = false;
    fetchSuggestedProfiles().then((profiles) => {
      if (!cancel) { setSuggested(profiles); setBrowseLoading(false); }
    });
    return () => { cancel = true; };
  }, []);

  // Most popular clubs
  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from("clubs")
        .select("id, name, logo_url, country")
        .not("logo_url", "is", null)
        .limit(20);
      if (!cancel) setClubs(data || []);
    })();
    return () => { cancel = true; };
  }, []);

  // Events
  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("*, event_attendees(profiles(id, full_name, avatar_url))")
        .order("starts_at", { ascending: true })
        .limit(3);
      if (!cancel) {
        setEvents(
          (data ?? []).map((e) => ({
            ...e,
            attendees: e.event_attendees?.map((ea) => ea.profiles).filter(Boolean) ?? [],
          }))
        );
      }
    })();
    return () => { cancel = true; };
  }, []);

  // Filter-specific browse data (athletes / professionals / clubs near you)
  useEffect(() => {
    if (!browseMode || activeFilter === "all" || activeFilter === "events") return;
    let cancel = false;
    setFilterLoading(true);

    (async () => {
      if (activeFilter === "athletes") {
        const { data } = await supabase
          .from("profiles")
          .select(PROFILE_SELECT)
          .eq("role", "athlete")
          .order("created_at", { ascending: false })
          .limit(10);
        if (!cancel) setFilterProfiles(data || []);
      }

      if (activeFilter === "professionals") {
        const { data } = await supabase
          .from("profiles")
          .select(PROFILE_SELECT)
          .in("role", ["scout", "coach", "manager", "agent"])
          .order("created_at", { ascending: false })
          .limit(10);
        if (!cancel) setFilterProfiles(data || []);
      }

      if (activeFilter === "clubs") {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        let country = null;
        if (userId) {
          const { data: p } = await supabase
            .from("profiles")
            .select("country")
            .eq("id", userId)
            .maybeSingle();
          country = p?.country ?? null;
        }
        let q = supabase.from("clubs").select("id, name, logo_url, country");
        if (country) q = q.eq("country", country);
        const { data } = await q.limit(10);
        if (!cancel) setNearbyClubs(data || []);
      }

      if (!cancel) setFilterLoading(false);
    })();

    return () => { cancel = true; };
  }, [activeFilter, browseMode]);

  // Search
  useEffect(() => {
    let cancel = false;
    async function run() {
      const term = q.trim();
      if (term.length < 2) { setResults([]); return; }
      setLoading(true);
      if (activeFilter === "clubs") {
        const { data, error } = await supabase
          .from("clubs").select("id, name, logo_url, country")
          .ilike("name", `%${term}%`).limit(20);
        if (cancel) return;
        setResults(error ? [] : data || []);
      } else if (activeFilter === "events") {
        const { data, error } = await supabase
          .from("events").select("id, title, image_url, location_address, starts_at, ends_at")
          .ilike("title", `%${term}%`).limit(20);
        if (cancel) return;
        setResults(error ? [] : data || []);
      } else {
        let query = supabase.from("profiles").select(PROFILE_SELECT)
          .ilike("full_name", `%${term}%`).limit(20);
        if (activeFilter === "athletes") query = query.eq("role", "athlete");
        if (activeFilter === "professionals")
          query = query.in("role", ["scout", "coach", "manager", "agent"]);
        const { data, error } = await query;
        if (cancel) return;
        setResults(error ? [] : data || []);
      }
      setLoading(false);
    }
    run();
    return () => { cancel = true; };
  }, [q, activeFilter]);

  return (
    <main className="search-page">
      <div className="search-header">
        <div className="search-bar-row">
          <SearchBar value={q} onChange={setQ} placeholder="Search athletes, scouts..." />
          <IconButton icon={SlidersHorizontal} type="subtle" size="small" />
        </div>
        <div className="search-chips-row">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              className={`search-chip${activeFilter === key ? " search-chip--active" : ""}`}
              onClick={() => setActiveFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="search-body">

        {/* ── Search mode ── */}
        {!browseMode && (
          <>
            {loading && <p className="search-loading">Searching…</p>}

            {!loading && activeFilter === "events" && results.length === 0 && (
              <p className="no-results">No events found. Try a different search.</p>
            )}
            {!loading && activeFilter === "events" && results.length > 0 && (
              <div className="events-small-list">
                {results.map((event) => (
                  <EventCard key={event.id} event={event} variant="small"
                    onClick={() => navigate(`/event/${event.id}`)} />
                ))}
              </div>
            )}

            {!loading && activeFilter === "clubs" && results.length === 0 && (
              <p className="no-results">No clubs found. Try a different search.</p>
            )}
            {!loading && activeFilter === "clubs" && results.length > 0 && (
              <div className="clubs-grid">
                {results.map((club) => (
                  <div key={club.id} className="club-item" onClick={() => navigate(`/club/${club.id}`)}>
                    <div className="club-logo-wrap">
                      {club.logo_url
                        ? <img src={club.logo_url} alt={club.name} className="club-logo" />
                        : <span className="club-logo-initial">{club.name[0]}</span>}
                    </div>
                    <span className="club-name">{club.name}</span>
                    {club.country && <span className="club-country">{club.country}</span>}
                  </div>
                ))}
              </div>
            )}

            {!loading && activeFilter !== "clubs" && activeFilter !== "events" && results.length === 0 && (
              <p className="no-results">No players found. Try a different search.</p>
            )}
            {!loading && activeFilter !== "clubs" && activeFilter !== "events" && results.length > 0 && (
              <ProfileList profiles={results} />
            )}
          </>
        )}

        {/* ── Browse mode ── */}
        {browseMode && (

          /* ALL */
          activeFilter === "all" ? (
            <>
              {browseLoading && <p className="search-loading">Loading…</p>}

              {!browseLoading && suggested.length > 0 && (
                <section className="search-section">
                  <h2 className="search-section-title">Recent searches</h2>
                  <ProfileList profiles={suggested} />
                </section>
              )}

              {clubs.length > 0 && (
                <section className="search-section">
                  <h2 className="search-section-title">Clubs</h2>
                  <ClubScrollRow clubs={clubs} onClubClick={(id) => navigate(`/club/${id}`)} />
                </section>
              )}

              {events.length > 0 && (
                <section className="search-section">
                  <h2 className="search-section-title">Events</h2>
                  <div className="events-list">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} variant="big"
                        onClick={() => navigate(`/event/${event.id}`)} />
                    ))}
                  </div>
                </section>
              )}

              {!browseLoading && suggested.length === 0 && clubs.length === 0 && events.length === 0 && (
                <p className="no-results">No players yet. Start searching above.</p>
              )}
            </>

          /* ATHLETES */
          ) : activeFilter === "athletes" ? (
            <>
              {filterLoading && <p className="search-loading">Loading…</p>}

              {!filterLoading && filterProfiles.length > 0 && (
                <>
                  <section className="search-section">
                    <h2 className="search-section-title">Recent searches</h2>
                    <ProfileList profiles={filterProfiles.slice(0, 3)} />
                  </section>

                  {filterProfiles.length > 3 && (
                    <section className="search-section">
                      <h2 className="search-section-title">Suggested players</h2>
                      <div className="suggest-follow-grid">
                        {filterProfiles.slice(3).map((profile) => (
                          <FollowableSuggestedCard key={profile.id} profile={profile} />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}

              {!filterLoading && filterProfiles.length === 0 && (
                <p className="no-results">No athletes yet.</p>
              )}
            </>

          /* PROFESSIONALS */
          ) : activeFilter === "professionals" ? (
            <>
              {filterLoading && <p className="search-loading">Loading…</p>}

              {!filterLoading && filterProfiles.length > 0 && (
                <section className="search-section">
                  <h2 className="search-section-title">Scouts & Coaches</h2>
                  <div className="suggest-follow-grid">
                    {filterProfiles.map((profile) => (
                      <FollowableSuggestedCard key={profile.id} profile={profile} />
                    ))}
                  </div>
                </section>
              )}

              {!filterLoading && filterProfiles.length === 0 && (
                <p className="no-results">No professionals yet.</p>
              )}
            </>

          /* CLUBS */
          ) : activeFilter === "clubs" ? (
            <>
              {clubs.length > 0 && (
                <section className="search-section">
                  <h2 className="search-section-title">Most popular</h2>
                  <ClubScrollRow clubs={clubs} onClubClick={(id) => navigate(`/club/${id}`)} />
                </section>
              )}

              {nearbyClubs.length > 0 && (
                <section className="search-section">
                  <h2 className="search-section-title">Near you</h2>
                  <div className="club-near-list">
                    {nearbyClubs.map((club) => (
                      <ClubRow key={club.id} club={club}
                        onClick={() => navigate(`/club/${club.id}`)} />
                    ))}
                  </div>
                </section>
              )}
            </>

          /* EVENTS */
          ) : activeFilter === "events" ? (
            <>
              {events.length > 0 && (
                <section className="search-section">
                  <h2 className="search-section-title">Events near you</h2>
                  <div className="events-small-list">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} variant="small"
                        onClick={() => navigate(`/event/${event.id}`)} />
                    ))}
                  </div>
                </section>
              )}
              {events.length === 0 && (
                <p className="no-results">No events yet.</p>
              )}
            </>
          ) : null
        )}
      </div>
    </main>
  );
}
