import { useUser } from "../context/UserContext";

export function useProfile() {
  const { profile, loading } = useUser();
  return { profile, loading };
}
