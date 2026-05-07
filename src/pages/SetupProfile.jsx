import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import StepContainer from "../components/wizard/StepContainer";
import TextInput from "../components/inputs/TextInput";
import UnitInput from "../components/inputs/UnitInput";
import RoleSelect from "../components/domain/onboarding/RoleSelect";
import NameAndPhoto from "../components/domain/onboarding/NameAndPhoto";
import DateOfBirth from "../components/domain/onboarding/DateOfBirth";
import PositionSelect from "../components/domain/onboarding/PositionSelect";
import PlayingStyle from "../components/domain/onboarding/PlayingStyle";
import PreferredLeg from "../components/domain/onboarding/PreferredLeg";
import SportsSelect from "../components/domain/onboarding/SportSelect";
import PositionPage from "../components/domain/onboarding/PositionPage";
import ClubPicker from "../components/domain/onboarding/ClubPicker";
import AvatarPicker from "../components/domain/onboarding/AvatarPicker";
import LocationFields from "../components/domain/onboarding/LocationFields";
import GoalsField from "../components/domain/onboarding/GoalsField";
import GoalsSelect from "../components/domain/onboarding/GoalsSelect";
import AddHighlight from "../components/domain/onboarding/AddHighlight";
import Notifications from "../components/domain/onboarding/Notifications";
import Bio from "../components/domain/onboarding/Bio";
import FollowSuggestions from "../components/domain/onboarding/FollowSuggestions";
import Premium from "../components/domain/onboarding/Premium";
import { getSteps } from "../utils/steps";
import { buildProfilePayload } from "../utils/payload";
import Textarea from "../components/inputs/TextArea";
import OnboardingTopbar from "../components/domain/onboarding/UI/OnboardingTopbar";
import OnboardingNavbar from "../components/domain/onboarding/UI/OnboardingNavbar";
import "./setup-profile.css";

export default function Setup() {
  const navigate = useNavigate();

  const [role, setRole] = useState(""); // empty until user picks on role step
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    avatar_url: "",
    age: "",
    sports: [],
    primarySport: "football",
    gender: "",
    height: "",
    weight: "",
    position: [],
    bio: "",
    club_id: null,
    club_other_name: "",
    country: "",
    region: "",
    city: "",
    dob: "",
    goals: "",
    highlightUrl: "",
    highlightType: "",
    highlightText: "",
    highlightMatch: "",
    playingStyle: "",
    preferredLeg: "",
    talent_preferences: "",
    org_name: "",
    org_founded_year: "",
    org_team_size: "",
    org_description: "",
  });
  const [userId, setUserId] = useState(null);
  const [usernameErr, setUsernameErr] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const steps = useMemo(() => getSteps(role), [role]);
  const [idx, setIdx] = useState(0);
  const stepId = steps[idx];

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      // Allow onboarding flow without auth (for development/demo)
      const isOnboarding = sessionStorage.getItem("athlio_onboarding") === "true";
      if (!user && !isOnboarding) return navigate("/auth", { replace: true });
      if (!user) return; // Skip profile loading during onboarding demo
      setUserId(user.id);
      const { data: profile, error: readErr } = await supabase
        .from("profiles")
        .select("*")
        .match({ id: user.id })
        .maybeSingle();
      if (!profile) {
        const { error: insertErr } = await supabase
          .from("profiles")
          .insert({ id: user.id });
      }

      if (profile) {
        const sports = Array.isArray(profile.sports) ? profile.sports : [];
        setRole(profile.role || "athlete");
        setForm((f) => ({
          ...f,
          full_name: profile.full_name || "",
          username: profile.username || "",
          avatar_url: profile.avatar_url || "",
          age: profile.age ?? "",
          sports,
          primarySport: profile.primary_sport || sports[0] || "",
          gender: profile.gender || "",
          height: profile.height_cm ?? "",
          weight: profile.weight_kg ?? "",
          position: profile.position
            ? Array.isArray(profile.position)
              ? profile.position
              : [profile.position]
            : [],
          bio: profile.bio || profile.description || "",
          club_id: profile.club_id || null,
          club_other_name: profile.club_other_name || "",
          country: profile.country || "",
          region: profile.region || "",
          city: profile.city || "",
          goals: profile.goals || "",
          talent_preferences: profile.talent_preferences
            ? JSON.stringify(profile.talent_preferences)
            : "",
          org_name: profile.org_name || "",
          org_founded_year: profile.org_founded_year ?? "",
          org_team_size: profile.org_team_size ?? "",
          org_description: profile.org_description || "",
        }));
      }
    })();
  }, [navigate]);

  useEffect(() => {
    const trimmed = (form.username || "").trim();
    if (!trimmed || !userId) {
      setUsernameErr("");
      setIsCheckingUsername(false);
      return;
    }

    let ignore = false;
    setIsCheckingUsername(true);

    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", trimmed)
        .maybeSingle();

      if (ignore) return;

      if (error) {
        if (error.code === "PGRST116") {
          setUsernameErr("username already used");
        } else {
          console.error("USERNAME CHECK ERROR", error);
          setUsernameErr("");
        }
      } else if (data && data.id && data.id !== userId) {
        setUsernameErr("username already used");
      } else {
        setUsernameErr("");
      }

      setIsCheckingUsername(false);
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [form.username, userId]);

  function set(v) {
    setForm((f) => ({ ...f, ...v }));
  }
  function next() {
    setIdx((i) => Math.min(i + 1, steps.length - 1));
  }
  function back() {
    if (idx === 0) {
      navigate(-1); // go back to wherever the user came from (auth/intro)
      return;
    }
    setIdx((i) => Math.max(i - 1, 0));
  }

  async function finish() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = buildProfilePayload({ role, form, heightUnit, weightUnit });
    console.log("Submitting profile payload:", payload);

    if (user) {
      const { error: upsertErr } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...payload }, { onConflict: "id" });

      if (upsertErr) {
        console.error("PROFILE UPSERT ERROR", upsertErr);
      }
    }

    navigate("/home");
  }

  // Determine whether the Continue button should be enabled for the current
  // step. Default to true for steps without specific rules.
  const canContinue = (() => {
    try {
      switch (stepId) {
        case "role":
          return Boolean(role); // disabled until user taps a card
        case "name":
          return (form.full_name || "").toString().trim() !== "";
        case "dob":
          return true; // pre-selected by default
        case "position":
          return true; // position is optional
        case "style":
          return true; // first style is pre-selected
        case "leg":
          return Boolean(form.preferredLeg);
        case "club":
          return (
            Boolean(form.club_id) ||
            (form.club_other_name || "").toString().trim() !== ""
          );
        case "bio":
          return true; // bio is optional
        default:
          return true;
      }
    } catch (e) {
      return true;
    }
  })();

  return (
    <div className="setup-profile-page">
      {/* Fixed topbar: back arrow + progress bar */}
      <OnboardingTopbar
        onBack={back}
        currentStep={idx + 1}
        totalSteps={Math.max(steps.length, 1)}
        showBack={true}
        dark={stepId === "position"}
      />

      <StepContainer
        onBack={back}
        onNext={next}
        onFinish={finish}
        /* hide the built-in StepContainer buttons - we'll render our
           OnboardingNavbar below which uses the same callbacks */
        showBack={false}
        showNext={false}
        showFinish={false}
      >
        {stepId === "role" && <RoleSelect role={role} onChange={setRole} onNext={next} />}

        {stepId === "name" && (
          <NameAndPhoto
            name={form.full_name}
            avatarUrl={form.avatar_url}
            onNameChange={(v) => set({ full_name: v })}
            onAvatarChange={(v) => set({ avatar_url: v })}
          />
        )}

        {stepId === "dob" && (
          <DateOfBirth
            value={form.dob}
            onChange={(v) => set({ dob: v })}
          />
        )}

        {stepId === "position" && role === "athlete" && (
          <PositionSelect
            value={form.position}
            onChange={(v) => set({ position: v })}
          />
        )}

        {stepId === "style" && role === "athlete" && (
          <PlayingStyle
            value={form.playingStyle}
            onChange={(v) => set({ playingStyle: v })}
            positions={form.position}
          />
        )}

        {stepId === "leg" && role === "athlete" && (
          <PreferredLeg
            value={form.preferredLeg}
            onChange={(v) => set({ preferredLeg: v })}
          />
        )}

        {stepId === "bio" && (
          <Bio
            value={form.bio}
            onChange={(v) => set({ bio: v })}
            sport={form.primarySport}
            position={form.position}
            clubId={form.club_id}
            clubOtherName={form.club_other_name}
            country={form.country}
          />
        )}

        {stepId === "premium" && <Premium onContinue={() => next()} />}

        {stepId === "measure" && role === "athlete" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <UnitInput
              label="Height"
              value={form.height}
              onChange={(v) => set({ height: v })}
              unit={heightUnit}
              setUnit={setHeightUnit}
              unitOptions={["cm", "ft"]}
              placeholderCm="Height (cm)"
              placeholderAlt="Height (e.g. 5'11)"
            />
            <UnitInput
              label="Weight"
              value={form.weight}
              onChange={(v) => set({ weight: v })}
              unit={weightUnit}
              setUnit={setWeightUnit}
              unitOptions={["kg", "lb"]}
              placeholderCm="Weight (kg)"
              placeholderAlt="Weight (lb)"
            />
            <TextInput
              label="Gender"
              value={form.gender}
              onChange={(v) => set({ gender: v })}
            />
          </div>
        )}

        {stepId === "club" && (role === "athlete" || role === "scout" || role === "professional") && (
          <ClubPicker
            sport={form.primarySport || "football"}
            value={{
              club_id: form.club_id,
              club_other_name: form.club_other_name,
            }}
            onChange={(v) => set(v)}
          />
        )}

        {stepId === "location" && (
          <LocationFields
            country={form.country}
            city={form.city}
            onChange={(v) => set(v)}
          />
        )}

        {stepId === "goals" && role === "athlete" && (
          <GoalsSelect value={form.goals} onChange={(v) => set({ goals: v })} />
        )}

        {stepId === "highlight" && role === "athlete" && (
          <AddHighlight
            mediaUrl={form.highlightUrl}
            mediaType={form.highlightType}
            text={form.highlightText}
            match={form.highlightMatch}
            onMediaChange={(v) =>
              set(v
                ? { highlightUrl: v.url, highlightType: v.type }
                : { highlightUrl: "", highlightType: "" }
              )
            }
            onTextChange={(v) => set({ highlightText: v })}
            onMatchChange={(v) => set({ highlightMatch: v })}
          />
        )}

        {stepId === "notifications" && (
          <Notifications />
        )}

        {stepId === "follow" && (role === "athlete" || role === "scout" || role === "professional") && (
          <FollowSuggestions
            role={role}
            sport={form.primarySport}
            position={form.position}
            clubId={form.club_id}
            country={form.country}
            goals={
              role === "athlete"
                ? form.goals
                : typeof form.talent_preferences === "string"
                  ? form.talent_preferences
                  : ""
            }
          />
        )}

        {stepId === "scout" && (role === "scout" || role === "professional") && (
          <GoalsField
            value={form.talent_preferences}
            onChange={(v) => set({ talent_preferences: v })}
            items={[
              "Discover new talent",
              "Expand your scouting network",
              "Find new players",
              "Build a strong team",
              "Post tryouts or events",
              "Build partnerships",
              "Collaborate with scouts and coaches",
            ]}
            title="Select your scouting goals"
            subtitle="Choose the goals that reflect what you want to accomplish on Athlio. Pick multiple."
          />
        )}

        {stepId === "org" && role === "organization" && (
          <div>
            <TextInput
              label="Organization name"
              value={form.org_name}
              onChange={(v) => set({ org_name: v })}
            />
            <TextInput
              label="Founded year"
              value={form.org_founded_year}
              onChange={(v) => set({ org_founded_year: v })}
            />
            <TextInput
              label="Team size"
              value={form.org_team_size}
              onChange={(v) => set({ org_team_size: v })}
            />
            <Textarea
              label="Organization description"
              value={form.org_description}
              onChange={(v) => set({ org_description: v })}
            />
          </div>
        )}

        {/* Removed final 'review' step per request (auto-finish after last configured step) */}
      </StepContainer>
      <OnboardingNavbar
        onBack={back}
        onNext={
          stepId === "notifications"
            ? async () => { if ("Notification" in window) await Notification.requestPermission().catch(() => {}); next(); }
          : stepId === "location" && !form.city
            ? async () => {
                try {
                  if (!navigator.geolocation) { next(); return; }
                  const pos = await new Promise((res, rej) =>
                    navigator.geolocation.getCurrentPosition(res, rej, { timeout: 9000 })
                  );
                  const data = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&addressdetails=1`,
                    { headers: { "Accept-Language": "en" } }
                  ).then(r => r.json());
                  if (data.address) {
                    set({
                      city:    data.address.city || data.address.town || data.address.village || "",
                      country: data.address.country || "",
                    });
                  }
                } catch { /* permission denied — just advance */ }
                next();
              }
          : next
        }
        onFinish={finish}
        showNext={idx < steps.length - 1}
        showFinish={idx === steps.length - 1}
        canContinue={canContinue}
        dark={stepId === "position"}
        primaryLabel={
          stepId === "highlight"     ? "Post" :
          stepId === "notifications" ? "Turn on notifications" :
          stepId === "location" && !form.city ? "Give access to location" :
          "Continue"
        }
        secondaryLabel={
          stepId === "club"          ? "I'm not in a club" :
          stepId === "goals"         ? "Skip" :
          stepId === "highlight"     ? "Skip" :
          stepId === "notifications" ? "Skip" :
          stepId === "location"      ? "Skip" :
          null
        }
        onSecondary={
          stepId === "club"      ? () => { set({ club_id: null, club_other_name: null }); next(); } :
          stepId === "goals"     ? () => next() :
          stepId === "highlight" ? () => next() :
          stepId === "notifications" ? () => next() :
          null
        }
      />
    </div>
  );
}
