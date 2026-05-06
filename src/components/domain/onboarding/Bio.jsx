import Textarea from "../../inputs/TextArea";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import "./Bio.css";

function countryCodeToEmoji(code) {
  if (!code || typeof code !== "string") return "";
  const cc = code.trim().toUpperCase();
  if (cc.length !== 2) return "";
  const first = cc.codePointAt(0) - 65 + 0x1F1E6;
  const second = cc.codePointAt(1) - 65 + 0x1F1E6;
  return String.fromCodePoint(first, second);
}

function positionLabelFromId(id, sport) {
  // Guard against non-string values (e.g., empty arrays from form state)
  if (!id || typeof id !== "string") return "Player";
  const base = id.split("_")[0].toLowerCase();
  const footballMap = {
    lw: "Winger",
    rw: "Winger",
    st: "Striker",
    cm: "Midfielder",
    cdm: "Defensive midfielder",
    lb: "Left back",
    rb: "Right back",
    cb: "Center back",
    gk: "Goalkeeper",
  };
  const basketballMap = {
    pg: "Point guard",
    sg: "Shooting guard",
    sf: "Small forward",
    pf: "Power forward",
    c: "Center",
  };
  if ((sport || "").toLowerCase() === "basketball") {
    return basketballMap[base] || base.toUpperCase();
  }
  return footballMap[base] || base.toUpperCase();
}

export default function Bio({ value, onChange, sport, position, clubId, clubOtherName, country }) {
  const [clubName, setClubName] = useState(clubOtherName || "");

  useEffect(() => {
    let mounted = true;
    if (!clubId || clubOtherName) return; // nothing to fetch or already have other name
    (async () => {
      try {
        const { data, error } = await supabase.from("clubs").select("name").eq("id", clubId).maybeSingle();
        if (mounted && !error && data && data.name) setClubName(data.name);
      } catch (e) {
        // ignore errors silently
      }
    })();
    return () => (mounted = false);
  }, [clubId, clubOtherName]);

  // Build suggestions only when we have at least one hint (position, club or country)
  const suggestions = [];
  // Ensure posId is either a string or null, never an array/object
  let posId = null;
  if (Array.isArray(position)) {
    posId = position.length > 0 ? position[0] : null;
  } else if (typeof position === "string") {
    posId = position || null;
  }
  const posLabel = positionLabelFromId(posId, sport);
  const countryEmoji = countryCodeToEmoji(country);
  const club = clubOtherName || clubName || null;

  if (posId || club || countryEmoji) {
    // Primary suggestion: "<Position> from 🇪🇸 playing for @Club"
    if (posId && (countryEmoji || club)) {
      const clubSlug = club ? `@${club.replace(/\s+/g, "")}` : "";
      suggestions.push(`${posLabel}${countryEmoji ? ` from ${countryEmoji}` : ""}${club ? ` playing for ${clubSlug}` : ""}`);
    }

    // Fallback suggestion: position + club
    if (posId && club) {
      const clubSlug = `@${club.replace(/\s+/g, "")}`;
      suggestions.push(`${posLabel} playing for ${clubSlug}`);
    }

    // Fallback suggestion: position + country
    if (posId && countryEmoji) {
      suggestions.push(`${posLabel} from ${countryEmoji}`);
    }
  }

  // remove duplicate suggestion strings (can occur when one template
  // collapses to the same text as another)
  const uniqueSuggestions = Array.from(new Set(suggestions));

  return (
    <div>
      <div
        className="role-header"
        style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}
      >
        <h1 className="role-header-title">You’re almost there!</h1>
        <p className="role-header-subtitle">Write a short bio using the info you shared or choose one of our suggested examples to get started.</p>
      </div>

  <Textarea placeholder="Bio" value={value || ""} onChange={onChange} />

      <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontSize: 8, color: "#000", fontWeight: 500, fontStyle: "normal", fontFamily: "Geist" }}>
          150 characters max
        </span>
      </div>

      {uniqueSuggestions.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, color: "var(--color-gray-600)", marginBottom: 8 }}>Suggestions</div>
          <div className="bio-suggestions-wrap">
            {uniqueSuggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(s)}
                className="bio-suggestion"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
