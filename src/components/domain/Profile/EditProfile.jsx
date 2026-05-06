import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../../lib/supabase";
import Button from "../../../components/UI/Button";
import TextInput from "../../../components/inputs/TextInput";
import VerifyIcon from "../../../assets/icons/verify.svg?react";

import "./EditProfile.css";
import Select from "../../inputs/Select";
import AvatarPicker from "../onboarding/AvatarPicker";
import "./EditProfile.css";

// === Position options by sport ===
const FOOTBALL_POSITIONS = [
  { value: "gk", label: "Goalkeeper" },
  { value: "lb", label: "Left Back" },
  { value: "cb", label: "Center Back" },
  { value: "rb", label: "Right Back" },
  { value: "cdm", label: "Defensive Midfielder" },
  { value: "cm", label: "Central Midfielder" },
  { value: "lw", label: "Left Winger" },
  { value: "rw", label: "Right Winger" },
  { value: "st", label: "Striker" },
];

const BASKETBALL_POSITIONS = [
  { value: "pg", label: "Point Guard" },
  { value: "sg", label: "Shooting Guard" },
  { value: "sf", label: "Small Forward" },
  { value: "pf", label: "Power Forward" },
  { value: "c", label: "Center" },
];

export default function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: "",
    gender: "",
    primary_sport: "",
    position: "",
    country: "",
    city: "",
    bio: "",
    role: "",
    avatar_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // === Load profile data from Supabase ===
  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, gender, primary_sport, position, country, city, bio, role, avatar_url",
        )
        .eq("id", user.id)
        .single();

      if (error) setError(error.message);
      else if (data) setProfile(data);

      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // === Save profile to Supabase ===
  async function handleSave() {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", user.id);

    setSaving(false);

    if (error) setError(error.message);
    else navigate("/profile/me");
  }

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  // Determine which positions to show
  const positionOptions =
    profile.primary_sport === "basketball"
      ? BASKETBALL_POSITIONS
      : FOOTBALL_POSITIONS;

  return (
    <main className="edit-profile">
      <header className="edit-profile__header">
        <AvatarPicker
          value={profile.avatar_url}
          onChange={(v) => handleChange("avatar_url", v)}
        />
      </header>

      <form className="edit-profile__form">
        {/* === Full Name === */}
        <TextInput
          label="Full Name *"
          value={profile.full_name || ""}
          onChange={(v) => handleChange("full_name", v)}
        />

        {/* === Gender === */}
        <Select
          label="Gender *"
          value={profile.gender || ""}
          onChange={(v) => handleChange("gender", v)}
          options={[
            { value: "", label: "Select gender" },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* === Sport === */}
        <Select
          label="Sport *"
          value={profile.primary_sport || ""}
          onChange={(v) => handleChange("primary_sport", v)}
          options={[
            { value: "", label: "Select sport" },
            { value: "football", label: "Football" },
            { value: "basketball", label: "Basketball" },
          ]}
        />

        {/* === Position (changes dynamically) === */}
        <Select
          label="Position *"
          value={profile.position || ""}
          onChange={(v) => handleChange("position", v)}
          options={[
            {
              value: "",
              label: profile.primary_sport
                ? "Select position"
                : "Select a sport first",
            },
            ...positionOptions,
          ]}
          disabled={!profile.primary_sport}
        />

        {/* === Location fields === */}
        <TextInput
          label="Country"
          value={profile.country || ""}
          onChange={(v) => handleChange("country", v)}
        />

        <TextInput
          label="City"
          value={profile.city || ""}
          onChange={(v) => handleChange("city", v)}
        />

        {/* === Bio === */}
        <TextInput
          label="Bio"
          value={profile.bio || ""}
          onChange={(v) => handleChange("bio", v)}
          helperText="Max 150 characters"
        />

        {/* === RoleSelect (Category) === */}
        <Select
          label="Category *"
          value={profile.role || ""}
          onChange={(v) => handleChange("role", v)}
          options={[
            { value: "athlete", label: "Athlete" },
            { value: "scout", label: "Scout" },
            { value: "organization", label: "Organization" },
          ]}
        />
      </form>

      {/* === Action Buttons === */}
      <div className="edit-profile__buttons">
        <Button
          type="outline"
          size="medium"
          label="Verify my account"
          Icon={VerifyIcon}
          onClick={() => console.log("Verify clicked")}
        />

        <Button
          type="primary"
          size="medium"
          label={saving ? "Saving..." : "Save"}
          onClick={handleSave}
          disabled={saving}
        />
      </div>
    </main>
  );
}
