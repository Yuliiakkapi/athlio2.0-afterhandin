import { useEffect, useState } from "react";
import SelectionCard from "./UI/SelectionCard";
import FootballIcon from "../../../assets/icons/football.svg?react";
import BasketballIcon from "../../../assets/icons/basketball.svg?react";
import { supabase } from "../../../lib/supabase";

export default function SportsSelect({
  sports,
  onChange,
  primarySport,
  onPrimaryChange,
}) {
  const [available, setAvailable] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("sports")
          .select("id,name,description,icon_url")
          .order("name", { ascending: true });

        if (!mounted) return;

        if (error || !data || data.length === 0) {
          // fallback defaults
          setAvailable([
            {
              id: "football",
              name: "Football",
              description:
                "Show your talent and connect with the global football network.",
              icon: <FootballIcon />,
            },
            {
              id: "basketball",
              name: "Basketball",
              description:
                "Play hard, get noticed, and take your game to the next level.",
              icon: <BasketballIcon />,
            },
          ]);
        } else {
          setAvailable(
            data.map((r) => ({
              id: r.id ?? (r.name || "").toLowerCase(),
              name: r.name,
              description: r.description ||
                "Show your talent and connect with the global network.",
              // prefer remote icon URL when present, otherwise fall back to
              // our local SVG React components for common sports
              icon: r.icon_url
                ? r.icon_url
                : (r.id === "football" || (r.name || "").toLowerCase() === "football")
                ? <FootballIcon />
                : (r.id === "basketball" || (r.name || "").toLowerCase() === "basketball")
                ? <BasketballIcon />
                : null,
            }))
          );
        }
      } catch (e) {
        if (mounted) {
          setAvailable([
            {
              id: "football",
              name: "Football",
              description:
                "Show your talent and connect with the global football network. Play hard, get noticed, and take your game to the next level.",
            },
            {
              id: "basketball",
              name: "Basketball",
              description:
                "Show your talent and connect with the global basketball network. Play hard, get noticed, and take your game to the next level.",
            },
          ]);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleSport = (sportId) => {
    // Enforce single-selection: when a sport is selected, send an array
    // containing only that sport. If the already-selected sport is clicked
    // again, deselect by sending an empty array.
    const exists = Array.isArray(sports) && sports.length > 0 && sports[0] === sportId;
    if (exists) {
      onChange([]);
    } else {
      onChange([sportId]);
    }
  };

  return (
    <div>
      <div
        className="role-header"
        style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}
      >
        <h1 className="role-header-title">Choose your sport</h1>
        <p className="role-header-subtitle">Which sports are you playing</p>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        {available.map((s) => (
          <SelectionCard
            key={s.id}
            name={s.name}
            description={s.description}
            icon={s.icon}
            value={s.id}
            groupName="sport"
            // Only consider the first element of `sports` as the selected
            // sport to keep compatibility with callers that expect an
            // array (we'll send back an array with a single item).
            checked={Array.isArray(sports) && sports.length > 0 && sports[0] === s.id}
            onChange={toggleSport}
            inputType="radio"
          />
        ))}
      </div>

      {/* primarySport select intentionally removed — primary sport will be
          inferred or handled elsewhere when a card is selected */}
    </div>
  );
}
