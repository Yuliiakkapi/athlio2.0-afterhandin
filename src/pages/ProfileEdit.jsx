import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import TextInput from "../components/inputs/TextInput";
import Button from "../components/UI/Button";
import AvatarPicker from "../components/domain/onboarding/AvatarPicker";
import "./profile-edit.css";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    bio: "",
    avatar_url: "",
    city: "",
    country: "",
    age: "",
    gender: "",
  });

  function set(v) {
    setForm((f) => ({ ...f, ...v }));
  }

  useEffect(() => {
    async function loadProfile() {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserId(user.id);

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("full_name, username, bio, avatar_url, city, country, age, gender")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileErr && profile) {
        setForm({
          full_name: profile.full_name || "",
          username: profile.username || "",
          bio: profile.bio || "",
          avatar_url: profile.avatar_url || "",
          city: profile.city || "",
          country: profile.country || "",
          age: profile.age != null ? String(profile.age) : "",
          gender: profile.gender || "",
        });
      }

      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  async function handleSave(e) {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    const { error: saveErr } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        username: form.username,
        bio: form.bio || null,
        avatar_url: form.avatar_url || null,
        city: form.city || null,
        country: form.country || null,
        age: form.age ? parseInt(form.age) : null,
        gender: form.gender || null,
      })
      .eq("id", userId);

    setSaving(false);

    if (saveErr) {
      setError(saveErr.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/profile/me"), 800);
    }
  }

  if (loading) {
    return <div className="page profile-edit-page"><p>Loading…</p></div>;
  }

  return (
    <div className="page profile-edit-page">
      <form onSubmit={handleSave} className="profile-edit-form">
        {/* Avatar */}
        <div className="profile-edit-avatar">
          <AvatarPicker
            value={form.avatar_url}
            onChange={(v) => set({ avatar_url: v })}
            userId={userId}
          />
        </div>

        {/* Fields */}
        <div className="profile-edit-fields">
          <TextInput
            label="Full name"
            value={form.full_name}
            onChange={(v) => set({ full_name: v })}
          />
          <TextInput
            label="Username"
            value={form.username}
            onChange={(v) => set({ username: v })}
          />
          <TextInput
            label="Bio"
            value={form.bio}
            onChange={(v) => set({ bio: v })}
          />
          <TextInput
            label="City"
            value={form.city}
            onChange={(v) => set({ city: v })}
          />
          <TextInput
            label="Country"
            value={form.country}
            onChange={(v) => set({ country: v })}
          />
          <TextInput
            label="Age"
            value={form.age}
            onChange={(v) => set({ age: v })}
          />
          <TextInput
            label="Gender"
            value={form.gender}
            onChange={(v) => set({ gender: v })}
          />
        </div>

        {error && <p className="profile-edit-error">{error}</p>}
        {success && <p className="profile-edit-success">Saved!</p>}

        <div className="profile-edit-actions">
          <Button
            size="big"
            type="primary"
            label={saving ? "Saving…" : "Save changes"}
            htmlType="submit"
            disabled={saving}
          />
          <Button
            size="big"
            type="outline"
            label="Cancel"
            onClick={() => navigate("/profile/me")}
          />
        </div>
      </form>
    </div>
  );
}
