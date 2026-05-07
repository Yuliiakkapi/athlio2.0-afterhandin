/**
 * Get the step sequence based on user role.
 * "professional" covers scouts, coaches, and other non-athlete roles.
 */
export function getSteps(role) {
  if (role === "athlete") {
    return ["basic", "role", "sport", "position", "club", "location", "measure", "bio", "goals"];
  }

  if (role === "scout" || role === "professional") {
    return ["basic", "role", "location", "bio", "scout"];
  }

  if (role === "organization") {
    return ["basic", "role", "location", "bio"];
  }

  // default fallback
  return ["basic", "role", "sport", "location", "bio"];
}
