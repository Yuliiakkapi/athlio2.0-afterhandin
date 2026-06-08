import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Plus, X, Copy, Images } from "@phosphor-icons/react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";
import TextInput from "../components/inputs/TextInput";
import DateInput from "../components/inputs/DateInput";
import SelectInput from "../components/inputs/SelectInput";
import Button from "../components/UI/Button";
import BottomSheet from "../components/UI/BottomSheet";
import SearchBar from "../components/UI/SearchBar";
import MatchCard from "../components/domain/Post/MatchCard";
import { formatMatchDate } from "../lib/format";
import "./add-match.css";

async function uploadFile(file, userId) {
  const path = `posts/${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  await supabase.storage.from("post-media").upload(path, file, {
    cacheControl: "3600", upsert: false, contentType: file.type || "application/octet-stream",
  });
  const { data: { publicUrl } } = supabase.storage.from("post-media").getPublicUrl(path);
  return publicUrl;
}

const MATCH_TYPES = [
  "League match",
  "Cup match",
  "Friendly match",
  "National teams match",
  "National teams match (friendly)",
];

const SCORES = Array.from({ length: 21 }, (_, i) => String(i));
const MINUTES = Array.from({ length: 13 }, (_, i) => `${i * 10} min`);
const STATS = Array.from({ length: 11 }, (_, i) => String(i));
const CARDS_OPTIONS = ["None", "Yellow", "Red"];

/* ─── Chip group ──────────────────────────────────────────────── */
function ChipGroup({ options, value, onChange, error }) {
  return (
    <div>
      <div className="am-chip-group">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`am-chip${value === opt.value ? " am-chip--active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="am-field-error">{error}</p>}
    </div>
  );
}

/* ─── Club row for picker ─────────────────────────────────────── */
function ClubRow({ club, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`am-club-row${selected ? " am-club-row--selected" : ""}`}
      onClick={() => onSelect(club)}
    >
      <div className="am-club-logo-wrap">
        {club.logo_url ? (
          <img src={club.logo_url} alt={club.name} className="am-club-logo" />
        ) : (
          <span className="am-club-initial">{(club.name || "?")[0]}</span>
        )}
      </div>
      <div className="am-club-info">
        <span className="text-base-semibold">{club.name}</span>
        {club.league && <span className="text-xs-regular am-club-league">{club.league}</span>}
      </div>
      {selected && <CheckCircle size={20} weight="fill" color="var(--primary-500)" />}
    </button>
  );
}

export default function AddMatch() {
  const navigate = useNavigate();
  const savingRef = useRef(false);
  const { profile } = useUser();

  // Post-save flow: "form" → "make-post" → "match-added"
  const [step, setStep] = useState("form");
  const [savedMatchId, setSavedMatchId] = useState(null);
  const [makePostText, setMakePostText] = useState("");
  const [shareOnFeed, setShareOnFeed] = useState(true);
  const [makePostImages, setMakePostImages] = useState([]);
  const makePostFileRef = useRef(null);
  const makingPostRef = useRef(false);

  // Auto-close "match-added" after the checkmark animation finishes (~2.7s)
  useEffect(() => {
    if (step !== "match-added") return;
    const t = setTimeout(() => navigate("/home"), 2700);
    return () => clearTimeout(t);
  }, [step, navigate]);

  const [form, setForm] = useState({
    homeOrAway: null,
    matchType: "League match",
    date: "",
    yourTeam: null,      // { name, id?, league? }
    opponentTeam: null,
    yourScore: "0",
    opponentScore: "0",
    participation: "full",
    minutesPlayed: "0 min",
    goals: "0",
    assists: "0",
    cards: "None",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Sheets state
  const [sheet, setSheet] = useState(null); // 'type' | 'your-team' | 'opponent'

  // Clubs data for pickers
  const [clubs, setClubs] = useState([]);
  const [clubSearch, setClubSearch] = useState("");

  function patch(v) { setForm((f) => ({ ...f, ...v })); }
  function closeSheet() { setSheet(null); setClubSearch(""); }

  // Pre-populate your team from profile
  useEffect(() => {
    if (!profile) return;

    async function loadUserClub() {
      if (profile.club_id) {
        const { data } = await supabase
          .from("clubs")
          .select("id, name, logo_url, country")
          .eq("id", profile.club_id)
          .maybeSingle();
        if (data) patch({ yourTeam: { id: data.id, name: data.name, logo_url: data.logo_url } });
      } else if (profile.club_other_name) {
        patch({ yourTeam: { name: profile.club_other_name } });
      }
    }

    loadUserClub();
  }, [profile?.id]);

  // Fetch clubs when pickers open
  useEffect(() => {
    if (sheet !== "your-team" && sheet !== "opponent") return;
    let cancel = false;

    (async () => {
      let q = supabase.from("clubs").select("id, name, logo_url, country");
      if (clubSearch.length >= 2) {
        q = q.ilike("name", `%${clubSearch}%`);
      } else if (profile?.country) {
        q = q.eq("country", profile.country);
      }
      const { data } = await q.limit(20);
      if (!cancel) setClubs(data ?? []);
    })();

    return () => { cancel = true; };
  }, [sheet, clubSearch, profile?.country]);

  function validate() {
    const e = {};
    if (!form.homeOrAway) e.homeOrAway = "Please select Home or Away match";
    if (!form.date) e.date = "Date is required";
    if (!form.opponentTeam) e.opponentTeam = "Opponent team is required";
    return e;
  }

  async function handleSave() {
    setSubmitted(true);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (savingRef.current) return;
    savingRef.current = true;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const minutesNum = parseInt(form.minutesPlayed) || 0;

      const { data, error } = await supabase.from("matches").insert({
        player_id: session.user.id,
        league: form.matchType,
        date_of_game: form.date || null,
        your_team: form.yourTeam?.name || null,
        opponent: form.opponentTeam?.name || null,
        opponent_club_id: form.opponentTeam?.id || null,
        your_score: Number(form.yourScore) || 0,
        opponent_score: Number(form.opponentScore) || 0,
        minutes_played: minutesNum,
        goals: Number(form.goals) || 0,
        assists: Number(form.assists) || 0,
        yellow_cards: form.cards === "Yellow" ? 1 : 0,
        red_cards: form.cards === "Red" ? 1 : 0,
        home_or_away: form.homeOrAway || null,
        participation: form.participation || null,
      }).select("id").single();

      if (error) throw error;
      setSavedMatchId(data?.id ?? null);
      setStep("make-post");
    } catch (err) {
      console.error("Failed to save match:", err);
    } finally {
      savingRef.current = false;
    }
  }

  async function handleMakePostFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    const newItems = files.map((f) => ({
      id: `${Date.now()}_${Math.random()}`,
      preview: URL.createObjectURL(f),
      publicUrl: null,
      _temp: true,
      _file: f,
    }));
    setMakePostImages((prev) => [...prev, ...newItems]);
    await Promise.all(newItems.map(async (item) => {
      const url = await uploadFile(item._file, userId).catch(() => null);
      setMakePostImages((prev) =>
        prev.map((img) => img.id === item.id ? { ...img, publicUrl: url, _temp: false } : img)
      );
    }));
  }

  async function handlePublish() {
    if (makingPostRef.current) return;
    makingPostRef.current = true;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && savedMatchId) {
        const readyUrls = makePostImages.filter((img) => !img._temp && img.publicUrl).map((img) => img.publicUrl);
        await supabase.from("posts").insert({
          author_id: session.user.id,
          type: "match",
          content: makePostText.trim() || null,
          media: readyUrls[0] ?? null,
          media_urls: readyUrls,
          match_id: savedMatchId,
        });
        document.dispatchEvent(new CustomEvent("composer:posted"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      makingPostRef.current = false;
      setStep("match-added");
    }
  }

  const filteredClubs = clubSearch.length >= 2
    ? clubs.filter((c) => c.name.toLowerCase().includes(clubSearch.toLowerCase()))
    : clubs;

  /* ── Make a post overlay ── */
  if (step === "make-post") {
    return (
      <div className="am-overlay">
        <div className="am-sheet">
          <div className="am-sheet-header">
            <span className="am-sheet-title text-lg-semibold">Make a post</span>
            <button className="am-sheet-close" onClick={() => setStep("match-added")} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <div className="am-sheet-body">
            {/* 1 photo: show "Change photo" above card */}
            {makePostImages.length === 1 && (
              <button type="button" className="am-change-photo" onClick={() => { makePostFileRef.current.value = ""; makePostFileRef.current.click(); }}>
                Change photo
              </button>
            )}

            {/* Match card — switches variant based on photo count */}
            <MatchCard
              imageUrl={makePostImages.length === 1 ? (makePostImages[0].publicUrl || makePostImages[0].preview) : null}
              yourTeam={form.yourTeam?.name || "—"}
              yourTeamLogoUrl={form.yourTeam?.logo_url || profile?.club?.logo_url}
              yourScore={Number(form.yourScore) || 0}
              opponent={form.opponentTeam?.name || "—"}
              opponentLogoUrl={form.opponentTeam?.logo_url}
              opponentScore={Number(form.opponentScore) || 0}
              league={form.matchType}
              date={formatMatchDate(form.date)}
              goalsCount={Number(form.goals) || 0}
              assistsCount={Number(form.assists) || 0}
              minCount={parseInt(form.minutesPlayed) || 0}
              yellowCards={form.cards === "Yellow" ? 1 : 0}
              redCards={form.cards === "Red" ? 1 : 0}
            />

            {/* 0 photos: empty picker */}
            {makePostImages.length === 0 && (
              <button type="button" className="am-photo-empty" onClick={() => { makePostFileRef.current.value = ""; makePostFileRef.current.click(); }}>
                <span className="am-photo-icon-wrap"><Images size={22} /></span>
                <span className="am-photo-label text-base-semibold">Add video or photo</span>
                <span className="am-photo-sub text-sm-medium">Choose from library</span>
              </button>
            )}

            {/* 2+ photos: carousel */}
            {makePostImages.length >= 2 && (
              <div className="am-photo-thumbs">
                {makePostImages.map((img) => (
                  <div key={img.id} className="am-photo-thumb">
                    <img src={img.preview} alt="" />
                    {img._temp && <div className="am-photo-thumb-uploading" />}
                    <button onClick={() => setMakePostImages((p) => p.filter((i) => i.id !== img.id))} aria-label="Remove">
                      <X size={12} weight="bold" />
                    </button>
                  </div>
                ))}
                <button className="am-photo-thumb-add" onClick={() => { makePostFileRef.current.value = ""; makePostFileRef.current.click(); }}><Plus size={20} /></button>
              </div>
            )}

            <input ref={makePostFileRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={handleMakePostFiles} />

            {/* Caption */}
            <div className="am-caption-field">
              <span className="am-caption-label text-2xs-semibold">Add text</span>
              <textarea
                className="am-caption-textarea"
                value={makePostText}
                onChange={(e) => setMakePostText(e.target.value)}
                placeholder="Add a caption..."
                rows={3}
              />
            </div>
          </div>

          <div className="am-sheet-footer">
            <button className="am-skip-btn text-base-semibold" onClick={() => setStep("match-added")}>Skip</button>
            <Button label="Publish" type="primary" size="medium" onClick={handlePublish} />
          </div>
        </div>
      </div>
    );
  }

  /* ── Match added overlay ── */
  if (step === "match-added") {
    const link = savedMatchId ? `https://athlio.app/match/${savedMatchId}` : "https://athlio.app/match/001";
    return (
      <div className="am-overlay">
        <div className="am-sheet am-sheet--added">
          <div className="am-sheet-header">
            <button className="am-sheet-close" onClick={() => navigate("/home")} aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <div className="am-added-content">
            <svg className="am-added-svg" width="90" height="90" viewBox="0 0 90 90" fill="none">
              <path
                className="am-added-circle"
                d="M45 1.57895C50.7021 1.57895 56.3484 2.70207 61.6165 4.88418C66.8846 7.06629 71.6713 10.2647 75.7033 14.2967C79.7353 18.3287 82.9337 23.1154 85.1158 28.3835C87.2979 33.6516 88.4211 39.2979 88.4211 45C88.4211 50.7021 87.2979 56.3484 85.1158 61.6165C82.9337 66.8846 79.7353 71.6713 75.7033 75.7033C71.6713 79.7353 66.8846 82.9337 61.6165 85.1158C56.3484 87.2979 50.7021 88.4211 45 88.4211C39.2979 88.4211 33.6516 87.2979 28.3835 85.1158C23.1154 82.9337 18.3287 79.7353 14.2967 75.7033C10.2647 71.6713 7.06628 66.8846 4.88417 61.6165C2.70206 56.3484 1.57894 50.7021 1.57895 45C1.57895 39.2978 2.70207 33.6515 4.88419 28.3835C7.0663 23.1154 10.2647 18.3287 14.2967 14.2967C18.3287 10.2646 23.1154 7.06628 28.3835 4.88417C33.6516 2.70206 39.2979 1.57894 45 1.57895L45 1.57895Z"
                stroke="var(--primary-default, #4051fd)"
                strokeWidth="3.15789"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="am-added-check"
                d="M26.0526 44.3684L39.3701 57.6316L64.7368 32.3684"
                stroke="var(--primary-default, #4051fd)"
                strokeWidth="3.15789"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="am-added-title heading-4xl-italic">Match is added</p>
            <p className="am-added-sub text-sm-medium">Share link with your coach to get verification badge</p>

            <div className="am-added-link-row">
              <span className="am-added-link-text text-sm-medium">{link}</span>
              <button className="am-added-copy" onClick={() => navigator.clipboard?.writeText(link)} aria-label="Copy link">
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="am-page">
      <div className="am-body">

        {/* Home / Away */}
        <ChipGroup
          options={[
            { value: "home", label: "Home match" },
            { value: "away", label: "Away match" },
          ]}
          value={form.homeOrAway}
          onChange={(v) => { patch({ homeOrAway: v }); setErrors((e) => ({ ...e, homeOrAway: null })); }}
          error={submitted && errors.homeOrAway}
        />

        {/* Type */}
        <TextInput
          label="Type"
          value={form.matchType}
          readOnly
          onClick={() => setSheet("type")}
        />

        {/* Date */}
        <DateInput
          value={form.date}
          onChange={(v) => { patch({ date: v }); setErrors((e) => ({ ...e, date: null })); }}
        />
        {submitted && errors.date && <p className="am-field-error">{errors.date}</p>}

        {/* Your team */}
        <TextInput
          label="Your team *"
          value={form.yourTeam?.name || ""}
          readOnly
          onClick={() => setSheet("your-team")}
        />

        {/* Opponent team */}
        <TextInput
          label="Opponent team *"
          value={form.opponentTeam?.name || ""}
          readOnly
          onClick={() => setSheet("opponent")}
        />
        {submitted && errors.opponentTeam && <p className="am-field-error">{errors.opponentTeam}</p>}

        {/* Result */}
        <p className="am-section-title text-base-semibold">Result</p>
        <div className="am-score-row">
          <SelectInput label="Your team *" value={form.yourScore} onChange={(v) => patch({ yourScore: v })} options={SCORES} />
          <span className="am-score-dash">—</span>
          <SelectInput label="Opponent *" value={form.opponentScore} onChange={(v) => patch({ opponentScore: v })} options={SCORES} />
        </div>

        {/* Your performance */}
        <p className="am-section-title text-base-semibold">Your performance</p>
        <ChipGroup
          options={[
            { value: "full",       label: "Full match" },
            { value: "subbed_off", label: "Subbed off" },
            { value: "subbed_on",  label: "Subbed on" },
          ]}
          value={form.participation}
          onChange={(v) => patch({ participation: v })}
        />

        <div className="am-stats-row">
          <SelectInput label="Minutes played *" value={form.minutesPlayed} onChange={(v) => patch({ minutesPlayed: v })} options={MINUTES} />
          <SelectInput label="Goals" value={form.goals} onChange={(v) => patch({ goals: v })} options={STATS} />
        </div>

        <div className="am-stats-row">
          <SelectInput label="Assists" value={form.assists} onChange={(v) => patch({ assists: v })} options={STATS} />
          <SelectInput label="Cards" value={form.cards} onChange={(v) => patch({ cards: v })} options={CARDS_OPTIONS} />
        </div>
      </div>

      <div className="am-footer">
        <Button label="Add match" type="primary" size="medium" fullWidth onClick={handleSave} />
      </div>

      {/* ── Type picker ── */}
      <BottomSheet title="Pick the type" open={sheet === "type"} onClose={closeSheet}>
        <div className="am-type-list">
          {MATCH_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className="am-type-option"
              onClick={() => { patch({ matchType: type }); closeSheet(); }}
            >
              <span className="text-base-medium">{type}</span>
              {form.matchType === type && (
                <CheckCircle size={20} weight="regular" color="var(--primary-500)" />
              )}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* ── Your team picker ── */}
      <BottomSheet
        title="Pick your team"
        open={sheet === "your-team"}
        onClose={closeSheet}
        footer={
          <Button label="Choose" type="primary" size="medium" fullWidth
            disabled={!form.yourTeam}
            onClick={closeSheet}
          />
        }
      >
        <p className="am-picker-section-label text-sm-semibold">Recommended clubs</p>
        {filteredClubs.map((club) => (
          <ClubRow
            key={club.id}
            club={club}
            selected={form.yourTeam?.id === club.id}
            onSelect={(c) => patch({ yourTeam: c })}
          />
        ))}
        <button type="button" className="am-add-manual" onClick={() => {
          const name = prompt("Enter your team name:");
          if (name) { patch({ yourTeam: { name } }); closeSheet(); }
        }}>
          <span className="am-add-manual-icon"><Plus size={16} /></span>
          <span className="text-base-medium">Add your team manually</span>
        </button>
      </BottomSheet>

      {/* ── Opponent picker ── */}
      <BottomSheet
        title="Pick opponent team"
        open={sheet === "opponent"}
        onClose={closeSheet}
        footer={
          <Button label="Choose" type="primary" size="medium" fullWidth
            disabled={!form.opponentTeam}
            onClick={closeSheet}
          />
        }
      >
        <SearchBar
          value={clubSearch}
          onChange={setClubSearch}
          placeholder="Search for opponent team"
        />
        <p className="am-picker-section-label text-sm-semibold">Recommended clubs</p>
        {filteredClubs.map((club) => (
          <ClubRow
            key={club.id}
            club={club}
            selected={form.opponentTeam?.id === club.id}
            onSelect={(c) => patch({ opponentTeam: c })}
          />
        ))}
        <button type="button" className="am-add-manual" onClick={() => {
          const name = prompt("Enter opponent team name:");
          if (name) { patch({ opponentTeam: { name } }); closeSheet(); }
        }}>
          <span className="am-add-manual-icon"><Plus size={16} /></span>
          <span className="text-base-medium">Add opponent team manually</span>
        </button>
      </BottomSheet>
    </main>
  );
}
