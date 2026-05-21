/**
 * Get the step sequence based on user role.
 * "role" is always the first step.
 * "professional" covers scouts, coaches, and other non-athlete roles.
 */
export function getSteps(role) {
  if (role === "athlete") {
    return ["role", "name", "dob", "position", "style", "leg", "location", "club", "goals", "highlight", "notifications", "find-people", "premium"];
  }

  // "professional" means the user picked Professional but hasn't chosen a sub-role yet
  if (role === "professional") {
    return ["role", "profession", "name", "dob", "location", "club", "find-people", "premium"];
  }

  // Sub-roles set after the profession step — skip the profession picker
  if (role === "scout" || role === "coach" || role === "manager" || role === "agent") {
    return ["role", "name", "dob", "location", "club", "find-people", "premium"];
  }

  if (role === "organization") {
    return ["role", "name", "dob", "location"];
  }

  // No role selected yet — show only the role step
  return ["role"];
}
