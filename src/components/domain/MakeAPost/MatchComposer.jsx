import React, { useEffect, useState } from "react";
import MatchCard from "../../domain/Post/MatchCard";
import GrowingTextArea from "../../inputs/GrowingTextArea";
import { supabase } from "../../../lib/supabase";

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
  const [opponentText, setOpponentText] = useState("Opponent");

  useEffect(() => {
    const val = form?.your_team;
    const base = teamToText(val, "");
    // if we already have a readable string, keep it
    if (base && typeof base === "string" && base.trim() && !isLikelyId(base)) {
      setYourTeamText(base.trim());
      return;
    }
    const id = Array.isArray(val)
      ? val[0]?.club_id || val[0]?.id || val[0]
      : typeof val === "object"
        ? val.club_id || val.id || val.value
        : null;
    if (!id) {
      setYourTeamText("Your team");
      return;
    }
    let ignore = false;
    (async () => {
      const { data } = await supabase
        .from("clubs")
        .select("name, club_name, title")
        .eq("id", id)
        .maybeSingle();
      if (!ignore) {
        setYourTeamText(
          data?.name || data?.club_name || data?.title || "Your team",
        );
      }
    })();
    return () => {
      ignore = true;
    };
  }, [form?.your_team]);

  useEffect(() => {
    const val = form?.opponent_team;
    const base = teamToText(val, "");
    if (base && typeof base === "string" && base.trim() && !isLikelyId(base)) {
      setOpponentText(base.trim());
      return;
    }
    const id = Array.isArray(val)
      ? val[0]?.club_id || val[0]?.id || val[0]
      : typeof val === "object"
        ? val.club_id || val.id || val.value
        : null;
    if (!id) {
      setOpponentText("Opponent");
      return;
    }
    let ignore = false;
    (async () => {
      const { data } = await supabase
        .from("clubs")
        .select("name, club_name, title")
        .eq("id", id)
        .maybeSingle();
      if (!ignore) {
        setOpponentText(
          data?.name || data?.club_name || data?.title || "Opponent",
        );
      }
    })();
    return () => {
      ignore = true;
    };
  }, [form?.opponent_team]);

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
            isImage={Boolean(imagePreview)}
            imageUrl={imagePreview || ""}
            yourTeam={yourTeamText}
            yourScore={form?.your_score}
            opponent={opponentText}
            opponentScore={form?.opponent_score}
            league={form?.league}
            date={form?.date_of_game}
            goalsCount={form?.goals}
            assistsCount={form?.assists}
            minCount={form?.minutes_played}
          />
        </div>
      </div>
    </section>
  );
}
