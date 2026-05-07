/**
 * Get the step sequence based on user role.
 * "role" is always the first step.
 * "professional" covers scouts, coaches, and other non-athlete roles.
 */
export function getSteps(role) {
  if (role === "athlete") {
    return ["role", "basic", "sport", "position", "club", "location", "measure", "bio", "goals"];
  }

  if (role === "scout" || role === "professional") {
    return ["role", "basic", "location", "bio", "scout"];
  }

  if (role === "organization") {
    return ["role", "basic", "location", "bio"];
  }

  // No role selected yet — show only the role step
  return ["role"];
}
