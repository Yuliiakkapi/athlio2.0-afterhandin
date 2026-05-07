import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { updateProfile } from "../lib/profiles";
import ProgressBar from "../components/domain/onboarding/UI/ProgressBar";
import OnboardingNavbar from "../components/domain/onboarding/UI/OnboardingNavbar";
import RoleSelect from "../components/domain/onboarding/RoleSelect";
import SportSelect from "../components/domain/onboarding/SportSelect";
import PositionPage from "../components/domain/onboarding/PositionPage";
import ClubPicker from "../components/domain/onboarding/ClubPicker";
import LocationFields from "../components/domain/onboarding/LocationFields";
import GoalsField from "../components/domain/onboarding/GoalsField";
import AvatarPicker from "../components/domain/onboarding/AvatarPicker";
import Bio from "../components/domain/onboarding/Bio";
import FollowSuggestions from "../components/domain/onboarding/FollowSuggestions";
import Premium from "../components/domain/onboarding/Premium";
import TextInput from "../components/inputs/TextInput";

function buildSteps(role) {
  return [
    "role",
    ...(role === "athlete" ? ["sport", "position", "club"] : []),
    "location",
    "goals",
    "avatar",
    "bio",
    "follow",
    "premium",
  ];
}

export default function SetupProfile() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    role: "",
    sports: [],
    positions: [],
    club: { club_id: null, club_other_name: null },
    country: "",
    city: "",
    goals: "",
    avatar: "",
    fullName: "",
    bio: "",
  });

  const steps = buildSteps(form.role);
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  function patch(updates) {
    setForm((f) => ({ ...f, ...updates }));
  }

  function canContinue() {
    if (currentStep === "role") return !!form.role;
    if (currentStep === "sport") return form.sports.length > 0;
    if (currentStep === "avatar") return !!form.fullName.trim();
    return true;
  }

  function handleNext() {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
    else handleFinish();
  }

  function handleBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  async function handleFinish() {
    if (saving) return;
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) {
        navigate("/auth");
        return;
      }

      let avatarUrl = form.avatar || null;
      if (form.avatar && form.avatar.startsWith("data:")) {
        const ext = form.avatar.includes("image/png") ? "png" : "jpg";
        const blob = await (await fetch(form.avatar)).blob();
        const path = `avatars/${userId}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(path, blob, { upsert: true });
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
          avatarUrl = urlData?.publicUrl || avatarUrl;
        }
      }

      await updateProfile(userId, {
        full_name: form.fullName || null,
        role: form.role,
        primary_sport: form.sports[0] || null,
        positions: form.positions.length > 0 ? form.positions : null,
        club_id: form.club.club_id || null,
        country: form.country || null,
        city: form.city || null,
        goals: form.goals || null,
        avatar_url: avatarUrl,
        bio: form.bio || null,
        onboarding_complete: true,
      });

      navigate("/home");
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page onboarding">
      <ProgressBar currentStep={stepIndex + 1} totalSteps={steps.length} />

      <div className="onboarding-step-content">
        {currentStep === "role" && (
          <RoleSelect role={form.role} onChange={(v) => patch({ role: v })} />
        )}

        {currentStep === "sport" && (
          <SportSelect
            sports={form.sports}
            onChange={(v) => patch({ sports: v })}
            primarySport={form.sports[0] || ""}
            onPrimaryChange={(v) => patch({ sports: [v] })}
          />
        )}

        {currentStep === "position" && (
          <PositionPage
            sport={form.sports[0] || ""}
            value={form.positions}
            onChange={(v) => patch({ positions: v })}
          />
        )}

        {currentStep === "club" && (
          <ClubPicker
            sport={form.sports[0] || "football"}
            value={form.club}
            onChange={(v) => patch({ club: v })}
          />
        )}

        {currentStep === "location" && (
          <LocationFields
            country={form.country}
            city={form.city}
            onChange={(v) => patch(v)}
          />
        )}

        {currentStep === "goals" && (
          <GoalsField
            value={form.goals}
            onChange={(v) => patch({ goals: v })}
          />
        )}

        {currentStep === "avatar" && (
          <div>
            <div
              className="role-header"
              style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}
            >
              <h1 className="role-header-title">Set up your profile</h1>
              <p className="role-header-subtitle">Add your name and a profile picture</p>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <AvatarPicker
                value={form.avatar}
                onChange={(v) => patch({ avatar: v })}
              />
              <TextInput
                label="Full Name"
                value={form.fullName}
                onChange={(v) => patch({ fullName: v })}
              />
            </div>
          </div>
        )}

        {currentStep === "bio" && (
          <Bio
            value={form.bio}
            onChange={(v) => patch({ bio: v })}
            sport={form.sports[0] || ""}
            position={form.positions}
            clubId={form.club.club_id}
            clubOtherName={form.club.club_other_name}
            country={form.country}
          />
        )}

        {currentStep === "follow" && (
          <FollowSuggestions
            role={form.role}
            sport={form.sports[0] || ""}
            position={form.positions}
            clubId={form.club.club_id}
            country={form.country}
            goals={form.goals}
          />
        )}

        {currentStep === "premium" && (
          <Premium onContinue={handleFinish} />
        )}
      </div>

      <OnboardingNavbar
        showBack={stepIndex > 0}
        showNext={!isLastStep}
        showFinish={isLastStep}
        canContinue={canContinue()}
        onBack={handleBack}
        onNext={handleNext}
        onFinish={saving ? undefined : handleFinish}
      />
    </div>
  );
}
