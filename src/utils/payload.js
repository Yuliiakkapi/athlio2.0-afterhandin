/**
 * Build profile payload for Supabase upsert
 */
export function buildProfilePayload({ role, form, heightUnit, weightUnit }) {
  // Generate username from full_name if not provided
  let username = form.username;
  if (!username && form.full_name) {
    // Create a simple username from first + last name
    username = form.full_name.toLowerCase().replace(/\s+/g, "");
  }

  const payload = {
    role: role === "professional" && form.professionalType ? form.professionalType : role,
    full_name: form.full_name,
    username: username || undefined,
    avatar_url: form.avatar_url?.startsWith("data:") ? undefined : (form.avatar_url || undefined),
    bio: form.bio || form.description,
    sports: Array.isArray(form.sports) ? form.sports : [],
    primary_sport: form.primarySport || null,
    gender: form.gender || null,
    position: Array.isArray(form.position) ? form.position : [],
    club_id: form.club_id || null,
    country: form.country || null,
    region: form.region || null,
    city: form.city || null,
    goals: form.goals || null,
    talent_preferences: form.talent_preferences || null,
  };

  // Add manager-specific fields
  if (role === "manager") {
    payload.org_name = form.org_name || null;
    payload.org_founded_year = form.org_founded_year ? parseInt(form.org_founded_year) : null;
    payload.org_team_size = form.org_team_size ? parseInt(form.org_team_size) : null;
    payload.org_description = form.org_description || null;
  }

  return payload;
}
