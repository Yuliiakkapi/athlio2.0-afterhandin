import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import ProfileInfoCard from "../../../UI/InfoCards";
import CareerHistory from "../CareerHistory";
import "./Infotab.css";

export default function InfoTab({ profile, isMe = false }) {
  const [infoRow, setInfoRow] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loadingExp, setLoadingExp] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;

    async function fetchInfo() {
      const { data } = await supabase
        .from("info")
        .select(
          "nationality, nationality_code, birth_date, height_cm, weight_kg, shirt_number, preferred_foot, injured, playing_style"
        )
        .eq("profile_id", profile.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setInfoRow(data || null);
    }

    function sanitizeLogo(url) {
      if (!url || typeof url !== "string") return null;
      try {
        const u = new URL(url);
        if (u.protocol !== "https:") return null;
        if (u.hostname.includes("edgeone.app")) return null;
        return url;
      } catch {
        return null;
      }
    }

    async function fetchExperiences() {
      setLoadingExp(true);
      const { data, error } = await supabase
        .from("experiences")
        .select("start_date, end_date, is_current, matches_played, goals_scored, club:club_id(name, logo_url, league)")
        .eq("profile_id", profile.id)
        .order("start_date", { ascending: false });

      if (!error) {
        const rows = Array.isArray(data) ? data : [];
        setExperiences(
          rows.map((row) => {
            const clean = sanitizeLogo(row.logo_url);
            return { ...row, logo_url: clean, logo: clean };
          })
        );
      }
      setLoadingExp(false);
    }

    fetchInfo();
    fetchExperiences();
  }, [profile?.id]);

  const combinedInfo = {
    birthDate: infoRow?.birth_date || null,
    nationality: infoRow?.nationality || null,
    nationalityCode: infoRow?.nationality_code || null,
    location: profile.country || null,
    heightCm: infoRow?.height_cm ?? profile.height_cm ?? null,
    weightKg: infoRow?.weight_kg ?? profile.weight_kg ?? null,
    injured: infoRow?.injured ?? null,
    preferredFoot: infoRow?.preferred_foot || null,
    playingStyle: infoRow?.playing_style || null,
    shirtNumber: infoRow?.shirt_number ?? null,
  };

  return (
    <main>
      <div className="profile-info-tab">
        <ProfileInfoCard info={combinedInfo} isMe={isMe} />
        <CareerHistory profile={profile} experiences={experiences} />
      </div>
    </main>
  );
}
