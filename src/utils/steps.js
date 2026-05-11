/**
 * Get the step sequence based on user role.
 * "role" is always the first step.
 * "professional" covers scouts, coaches, and other non-athlete roles.
 */
export function getSteps(role) {
  if (role === "athlete") {
    return ["role", "name", "dob", "position", "style", "leg", "club", "goals", "highlight", "notifications", "location", "bio"];
  }

  // "professional" means the user picked Professional but hasn't chosen a sub-role yet
  if (role === "professional") {
    return ["role", "profession", "name", "dob", "location", "bio", "scout"];
  }

  // Sub-roles set after the profession step — skip the profession picker
  if (role === "scout" || role === "coach" || role === "manager" || role === "agent") {
    return ["role", "name", "dob", "location", "bio", "scout"];
  }

  if (role === "organization") {
    return ["role", "name", "dob", "location", "bio"];
  }

  // No role selected yet — show only the role step
  return ["role"];
}
