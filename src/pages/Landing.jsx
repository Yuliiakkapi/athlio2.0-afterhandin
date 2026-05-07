import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Landing() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/home", { replace: true });
      return;
    }

    const seen = localStorage.getItem("introSeen") === "true";
    navigate(seen ? "/auth" : "/intro", { replace: true });
  }, [loading, navigate, user]);

  return null;
}
