import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import ProfileInfoCard from "../../../UI/InfoCards";
import CareerHistory from "../CareerHistory";
import ProfessionalInfoTab from "./ProfessionalInfoTab";
import "./Infotab.css";

const PROFESSIONAL_ROLES = ["scout", "coach", "manager", "agent", "professional"];

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

export default function InfoTab({ profile, isMe = false }) {
  const [infoRow, setInfoRow] = useState(null);
  const [experiences, setExperiences] = useState([]);

  const isProfessional = PROFESSIONAL_ROLES.includes(profile?.role);

  useEffect(() => {
    if (!profile?.id) return;

    if (isProfessional) {
      supabase
        .from("experiences")
        .select("org_name, team_name, logo_url, start_date, end_date, is_current")
        .eq("profile_id", profile.id)
        .order("start_date", { ascending: false })
        .then(({ data, error }) => {
          if (!error) {
            const rows = Array.isArray(data) ? data : [];
            setExperiences(rows.map((row) => ({ ...row, logo_url: sanitizeLogo(row.logo_url) })));
          }
        });
    } else {
      supabase
        .from("info")
        .select(
          "nationality, nationality_code, birth_date, height_cm, weight_kg, shirt_number, preferred_foot, injured, playing_style"
        )
        .eq("profile_id", profile.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => setInfoRow(data || null));

      supabase
        .from("experiences")
        .select("start_date, end_date, is_current, matches_played, goals_scored, club:club_id(name, logo_url, league)")
        .eq("profile_id", profile.id)
        .order("start_date", { ascending: false })
        .then(({ data, error }) => {
          if (!error) {
            const rows = Array.isArray(data) ? data : [];
            setExperiences(
              rows.map((row) => {
                const clean = sanitizeLogo(row.logo_url);
                return { ...row, logo_url: clean, logo: clean };
              })
            );
          }
        });
    }
  }, [profile?.id, isProfessional]);

  if (isProfessional) {
    return (
      <main>
        <div className="profile-info-tab">
          <ProfessionalInfoTab profile={profile} experiences={experiences} isMe={isMe} />
        </div>
      </main>
    );
  }

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
