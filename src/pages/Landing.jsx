import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Landing() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    
    // If logged in, go to home
    if (user) {
      navigate("/home", { replace: true });
      return;
    }

    // If not logged in, go to intro
    navigate("/intro", { replace: true });
  }, [loading, navigate, user]);

  return null;
}
