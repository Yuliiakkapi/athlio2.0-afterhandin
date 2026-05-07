/**
 * Get the step sequence based on user role
 */
export function getSteps(role) {
  const baseSteps = ["basic", "role", "sport", "bio", "avatar", "location"];

  if (role === "athlete") {
    return ["basic", "role", "sport", "position", "club", "avatar", "location", "bio"];
  }

  if (role === "scout") {
    return ["basic", "role", "avatar", "location", "bio"];
  }

  if (role === "organization") {
    return ["basic", "role", "avatar", "location", "bio"];
  }

  return baseSteps;
}
