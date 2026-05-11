/**
 * Get the step sequence based on user role
 */
export function getSteps(role) {
  if (role === "athlete") {
    return ["basic", "role", "sport", "position", "club", "location", "measure", "bio", "goals", "highlight", "notifications"];
  }

  if (role === "scout") {
    return ["basic", "role", "location", "bio", "scout"];
  }

  if (role === "organization") {
    return ["basic", "role", "location", "bio"];
  }

  // default fallback
  return ["basic", "role", "sport", "location", "bio"];
}
