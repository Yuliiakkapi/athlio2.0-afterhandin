import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase puts the OAuth tokens in the URL hash — getSession() processes them
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        // Something went wrong, send them back to auth
        navigate("/auth", { replace: true });
        return;
      }

      // Check if this user already has a profile with a username set
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name")
        .eq("id", session.user.id)
        .maybeSingle();

      const needsOnboarding = !profile?.username;
      navigate(needsOnboarding ? "/setup-profile" : "/home", { replace: true });
    });
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <p style={{ fontSize: 16, color: "#727481" }}>Signing you in…</p>
    </div>
  );
}
