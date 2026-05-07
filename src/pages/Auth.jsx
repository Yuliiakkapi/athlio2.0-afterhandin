import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

function formatAuthError(err) {
  const message = typeof err === "string" ? err : err?.message;
  if (!message) return "An error occurred";
  const lower = message.toLowerCase();

  if (err?.status === 429 || lower.includes("rate") || lower.includes("too many")) {
    return "Email rate limit reached. If you already signed up, switch to Log in or use Google sign-in.";
  }
  if (lower.includes("password") && message.match(/\d+/)) {
    return "Password must be at least 6 characters";
  }
  if (
    lower.includes("missing email") ||
    lower.includes("missing email or phone")
  ) {
    return "Please enter your email";
  }
  return message;
}

function isAuthRateLimitError(err) {
  const message = (typeof err === "string" ? err : err?.message || "").toLowerCase();
  return err?.status === 429 || message.includes("rate") || message.includes("too many");
}

function getRetrySeconds(err) {
  const message = typeof err === "string" ? err : err?.message || "";
  const match = message.match(/(\d+)\s*(second|sec|minute|min)/i);
  if (!match) return 60;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return 60;
  const unit = match[2].toLowerCase();
  return unit.startsWith("min") ? amount * 60 : amount;
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode === "login" ? "login" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const timer = setInterval(() => {
      setCooldownLeft((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownLeft]);

  const signupBlocked = mode === "signup" && cooldownLeft > 0;

  async function submit(e) {
    e.preventDefault();
    if (isSubmitting || signupBlocked) return;
    setErr("");
    setIsSubmitting(true);

    try {
      const cleanEmail = (email || "").trim();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

        if (error && isAuthRateLimitError(error)) {
          // Supabase free tier rate-limits email signups (3/hour).
          // The account may have been created in a previous attempt — try
          // logging in silently so the user can continue without waiting.
          const { data: fallbackLogin, error: fallbackErr } =
            await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password,
            });

          if (!fallbackErr && fallbackLogin?.user?.id) {
            await supabase
              .from("profiles")
              .upsert({ id: fallbackLogin.user.id }, { onConflict: "id" });
            return navigate("/setup-profile", { replace: true });
          }

          // Fallback login failed — account doesn't exist yet or needs
          // confirmation. Switch to login mode and tell the user clearly.
          setMode("login");
          setCooldownLeft(getRetrySeconds(error));
          return setErr(
            "Signup limit reached. If you already signed up, log in below. Otherwise wait a moment and try again."
          );
        }

        if (error) return setErr(formatAuthError(error));

        // signUp succeeded — user may be auto-confirmed (if email confirm is
        // disabled in Supabase) or session will be null until confirmed.
        const uid =
          data?.user?.id || (await supabase.auth.getUser()).data?.user?.id;
        if (uid) {
          await supabase
            .from("profiles")
            .upsert({ id: uid }, { onConflict: "id" });
          return navigate("/setup-profile", { replace: true });
        }

        // No session yet — email confirmation is enabled in Supabase.
        // Tell the user to check their inbox.
        return setErr("Check your email to confirm your account, then log in.");
      }

      const { data: loginData, error: loginErr } =
        await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (loginErr && isAuthRateLimitError(loginErr)) {
        setCooldownLeft(getRetrySeconds(loginErr));
      }
      if (loginErr) return setErr(formatAuthError(loginErr));

      const uid =
        loginData?.user?.id || (await supabase.auth.getUser()).data?.user?.id;
      if (uid) {
        await supabase
          .from("profiles")
          .upsert({ id: uid }, { onConflict: "id" });
      }
      navigate("/home", { replace: true });
    } finally {
      setIsSubmitting(false);
    }
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
            label={
              signupBlocked
                ? `Try again in ${cooldownLeft}s`
                : mode === "signup"
                  ? "Sign up"
                  : "Log in"
            }
            htmlType="submit"
            disabled={isSubmitting || signupBlocked}
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
