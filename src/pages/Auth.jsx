import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import TextInput from "../components/inputs/TextInput";
import Button from "../components/UI/Button";
import GoogleIcon from "../assets/logos/Google.svg";
import MainLogoSmall from "../assets/logos/main-logo-small.svg";
import "./auth.css";

const OAUTH_REDIRECT = window.location.origin + "/auth/callback";

async function signInWithGoogle(setErr) {
  setErr("");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: OAUTH_REDIRECT,
      queryParams: { prompt: "select_account" },
    },
  });
  if (error) setErr(error.message);
}

function formatAuthError(message) {
  if (!message) return "An error occurred";
  if (message.toLowerCase().includes("password") && message.match(/\d+/)) {
    return "Password must be at least 6 characters";
  }
  if (
    message.toLowerCase().includes("missing email") ||
    message.toLowerCase().includes("missing email or phone")
  ) {
    return "Please enter your email";
  }
  return message;
}

export default function Auth() {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return setErr(formatAuthError(error.message));

      const uid =
        data?.user?.id || (await supabase.auth.getUser()).data?.user?.id;
      if (uid) {
        await supabase.from("profiles").upsert({ id: uid }, { onConflict: "id" });
      }
      return navigate("/setup-profile", { replace: true });
    }

    const { data: loginData, error: loginErr } =
      await supabase.auth.signInWithPassword({ email, password });
    if (loginErr) return setErr(formatAuthError(loginErr.message));

    const uid =
      loginData?.user?.id || (await supabase.auth.getUser()).data?.user?.id;
    if (uid) {
      await supabase.from("profiles").upsert({ id: uid }, { onConflict: "id" });
    }
    navigate("/home", { replace: true });
  }

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <img src={MainLogoSmall} alt="Athlio" />
      </div>

      <div className="role-header">
        <h1 className="role-header-title">
          {mode === "signup" ? "Create account" : "Log in"}
        </h1>
        <p className="role-header-subtitle">
          {mode === "signup"
            ? "Get access to the biggest database of athletes."
            : "Welcome back. Enter your credentials to continue."}
        </p>
      </div>

      <form onSubmit={submit}>
        <div className="auth-inputs">
          <TextInput
            label="Email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={setEmail}
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        {err && <p className="auth-error">{err}</p>}

        <div className="auth-actions">
          <Button
            size="big"
            type="primary"
            label={mode === "signup" ? "Sign up" : "Log in"}
            onClick={submit}
          />

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>

          <Button
            size="big"
            type="outline"
            label="Continue with Google"
            Icon={() => <img src={GoogleIcon} alt="Google" />}
            onClick={() => signInWithGoogle(setErr)}
          />
        </div>
      </form>

      <div className="auth-toggle">
        <p>
          {mode === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>
        <Button
          type="subtle"
          size="medium"
          label={mode === "signup" ? "Log in" : "Sign up"}
          onClick={() => setMode((m) => (m === "signup" ? "login" : "signup"))}
        />
      </div>
    </div>
  );
}
