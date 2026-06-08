import React, { useEffect, useState } from "react";
import MatchCard from "../../domain/Post/MatchCard";
import GrowingTextArea from "../../inputs/GrowingTextArea";
import { supabase } from "../../../lib/supabase";
import { formatMatchDate } from "../../../lib/format";

export default function MatchComposer({
  form,
  caption,
  imagePreview,
  onCaptionChange,
}) {
  const isLikelyId = (s) => {
    if (!s || typeof s !== "string") return false;
    const t = s.trim();
    if (!t) return false;
    const isDigits = /^\d+$/.test(t);
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        t,
      );
    return isDigits || isUuid;
  };

  const teamToText = (val, fallback) => {
    if (!val) return fallback;
    if (typeof val === "string") return isLikelyId(val) ? "" : val;
    if (Array.isArray(val)) return teamToText(val[0], fallback);
    if (typeof val === "object") {
      return (
        val.club_other_name ||
        val.name ||
        val.label ||
        val.title ||
        val.club_name ||
        val.club ||
        ""
      );
    }
    return fallback;
  };

  const [yourTeamText, setYourTeamText] = useState("Your team");
  const [yourTeamLogo, setYourTeamLogo] = useState(null);
  const [opponentText, setOpponentText] = useState("Opponent");
  const [opponentLogo, setOpponentLogo] = useState(null);

  const resolveClub = (val, fallbackName, setName, setLogo) => {
    const base = teamToText(val, "");
    const inlineLogo = typeof val === "object" && val?.logo_url ? val.logo_url : null;

    if (base && typeof base === "string" && base.trim() && !isLikelyId(base)) {
      setName(base.trim());
      if (inlineLogo) setLogo(inlineLogo);
      return null; // no async needed
    }

    const id = Array.isArray(val)
      ? val[0]?.club_id || val[0]?.id || val[0]
      : typeof val === "object"
        ? val.club_id || val.id || val.value
        : null;

    if (!id) {
      setName(fallbackName);
      setLogo(null);
      return null;
    }

    let ignore = false;
    (async () => {
      const { data } = await supabase
        .from("clubs")
        .select("name, logo_url")
        .eq("id", id)
        .maybeSingle();
      if (!ignore) {
        setName(data?.name || fallbackName);
        setLogo(data?.logo_url || null);
      }
    })();
    return () => { ignore = true; };
  };

  useEffect(
    () => resolveClub(form?.your_team, "Your team", setYourTeamText, setYourTeamLogo),
    [form?.your_team],
  );

  useEffect(
    () => resolveClub(form?.opponent_team, "Opponent", setOpponentText, setOpponentLogo),
    [form?.opponent_team],
  );

  return (
    <section className="compose-screen">
      <div className="compose-content">
        <GrowingTextArea
          value={caption}
          onChange={onCaptionChange}
          placeholder="Do you want to add something about the match?"
        />
        <div className="matchcard-preview">
          <MatchCard
            imageUrl={imagePreview || ""}
            yourTeam={yourTeamText}
            yourTeamLogoUrl={yourTeamLogo}
            yourScore={form?.your_score}
            opponent={opponentText}
            opponentLogoUrl={opponentLogo}
            opponentScore={form?.opponent_score}
            league={form?.league}
            date={formatMatchDate(form?.date_of_game)}
            goalsCount={form?.goals}
            assistsCount={form?.assists}
            minCount={form?.minutes_played}
          />
        </div>
      </div>
    </section>
  );
}
