/**
 * Build profile payload for Supabase upsert
 */
export function buildProfilePayload({ role, form, heightUnit, weightUnit }) {
  const payload = {
    role,
    full_name: form.full_name,
    username: form.username,
    avatar_url: form.avatar_url,
    dob: form.dob || null,
    age: form.dob
      ? Math.floor((Date.now() - new Date(form.dob)) / (365.25 * 24 * 3600 * 1000))
      : (form.age ? parseInt(form.age) : null),
    bio: form.bio || form.description,
    sports: Array.isArray(form.sports) ? form.sports : [],
    primary_sport: form.primarySport || null,
    gender: form.gender || null,
    height_cm: form.height ? parseInt(form.height) : null,
    weight_kg: form.weight ? parseInt(form.weight) : null,
    position: Array.isArray(form.position) ? form.position : [],
    club_id: form.club_id || null,
    club_other_name: form.club_other_name || null,
    country: form.country || null,
    region: form.region || null,
    city: form.city || null,
    goals: form.goals || null,
    playing_style: form.playingStyle || null,
    preferred_leg: form.preferredLeg || null,
    talent_preferences: form.talent_preferences || null,
  };

  // Add organization-specific fields
  if (role === "organization") {
    payload.org_name = form.org_name || null;
    payload.org_founded_year = form.org_founded_year ? parseInt(form.org_founded_year) : null;
    payload.org_team_size = form.org_team_size ? parseInt(form.org_team_size) : null;
    payload.org_description = form.org_description || null;
  }

  return payload;
}
