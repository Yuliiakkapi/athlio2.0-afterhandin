import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import CardInfoSingle from "../../../UI/InfoCards";
import EditIcon from "../../../../assets/icons/edit.svg?react";
import Button from "../../../UI/Button";
import "./InfoTab.css";
import ExperienceList from "../../Scouting/ExperienceList";

export default function InfoTab({ profile, isMe = false }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;

    function sanitizeLogo(url) {
      if (!url || typeof url !== "string") return null;
      try {
        const u = new URL(url);
        if (u.protocol !== "https:") return null; // force https only
        // hard-block known bad proxy hosts
        if (u.hostname.includes("edgeone.app")) return null;
        return url;
      } catch {
        return null;
      }
    }

    async function fetchExperiences() {
      setLoading(true);

      const { data, error } = await supabase
        .from("experiences")
        .select(
          "team_name, org_name, logo_url, start_date, end_date, is_current",
        )
        .eq("profile_id", profile.id)
        .order("start_date", { ascending: false });

      if (error) {
        console.error("Error fetching experiences:", error);
      } else {
        const rows = Array.isArray(data) ? data : [];
        const processed = rows.map((row) => {
          const clean = sanitizeLogo(row.logo_url);
          return {
            ...row,
            logo_url: clean, // ExperienceList uses this
            logo: clean, // optional normalized key
          };
        });
        setExperiences(processed);
      }

      setLoading(false);
    }

    fetchExperiences();
  }, [profile?.id]);

  const playersWithExperiences = [
    {
      id: profile.id,
      experiences: experiences || [],
    },
  ];

  return (
    <main>
      <div className="profile-info-tab">
        {/* === Header with edit button === */}
        <div className="info-tab-header">
          {isMe && (
            <Button
              size="medium"
              type="outline"
              Icon={EditIcon}
              className="edit-info-btn"
              onClick={() => (window.location.href = "/edit-profile")}
            />
          )}
        </div>

        {/* === Info cards === */}
        <CardInfoSingle profile={profile} />

        {/* === Experiences section === */}
        <section className="info-experience-section">
          <h3 className="info-section-title">Career history</h3>
          {loading ? (
            <p>Loading experience...</p>
          ) : (
            <ExperienceList players={playersWithExperiences} />
          )}
        </section>
      </div>
    </main>
  );
}
