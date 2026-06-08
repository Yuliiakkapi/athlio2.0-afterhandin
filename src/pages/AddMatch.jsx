import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";
import TextInput from "../components/inputs/TextInput";
import DateInput from "../components/inputs/DateInput";
import SelectInput from "../components/inputs/SelectInput";
import Button from "../components/UI/Button";
import BottomSheet from "../components/UI/BottomSheet";
import SearchBar from "../components/UI/SearchBar";
import "./add-match.css";

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

      const { error } = await supabase.from("posts").insert({
        author_id: session.user.id,
        type: "match",
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
        content: null,
        media: null,
      });

      if (error) throw error;
      navigate("/post-match-select", { replace: true });
    } catch (err) {
      console.error("Failed to save match:", err);
    } finally {
      savingRef.current = false;
    }
  }

  const filteredClubs = clubSearch.length >= 2
    ? clubs.filter((c) => c.name.toLowerCase().includes(clubSearch.toLowerCase()))
    : clubs;

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
