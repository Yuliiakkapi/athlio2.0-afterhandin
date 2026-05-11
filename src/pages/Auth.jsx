import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Button from "../components/UI/Button";
import GoogleIcon from "../assets/logos/Google.svg";
import MainLogoSmall from "../assets/logos/main-logo-small.svg";
import { validateEmail } from "../utils/validate";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
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

    const cleanEmail = (email || "").trim();
    if (!validateEmail(cleanEmail)) {
      setErr("Please enter a valid email address.");
      return;
    }

    if (mode === "signup" && !agreeTerms) {
      setErr("Please accept the Terms and Conditions and Privacy Policy.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
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
      <div className="auth-shell">
      <div className="auth-logo">
        <img src={MainLogoSmall} alt="Athlio" />
      </div>

      <div className="role-header">
        <h1 className="role-header-title">
          {mode === "signup" ? "Create account" : "Welcome back"}
        </h1>
        <p className="role-header-subtitle">
          {mode === "signup"
            ? "Get access to the biggest database of athletes."
            : "Welcome back. Enter your credentials to continue."}
        </p>
      </div>

      <form onSubmit={submit}>
        <div className="auth-inputs">
          <label className="auth-field">
            <span className="auth-sr-only">Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email *"
              autoComplete="email"
              className="auth-field-input"
              required
            />
          </label>

          <label className="auth-field">
            <span className="auth-sr-only">Password</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password *"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="auth-field-input"
              required
            />
          </label>

          {mode === "signup" && (
            <label className="auth-field">
              <span className="auth-sr-only">Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password *"
                autoComplete="new-password"
                className="auth-field-input"
                required
              />
            </label>
          )}

          {mode === "signup" && (
            <label className="auth-terms">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>
              </span>
            </label>
          )}

          {err && <p className="auth-error">{err}</p>}

          <Button
            size="big"
            type="primary"
            label={
              signupBlocked
                ? `Try again in ${cooldownLeft}s`
                : mode === "signup"
                  ? "Create an account"
                  : "Log in"
            }
            htmlType="submit"
            disabled={isSubmitting || signupBlocked}
          />
        </div>

        <div className="auth-social-separator" aria-hidden="true">
          <span />
          <p>or sign up with</p>
          <span />
        </div>

        <div className="auth-actions">
          <div className="auth-social-row">
            <button type="button" className="auth-social-button" onClick={() => signInWithGoogle(setErr)} aria-label="Continue with Google">
              <img src={GoogleIcon} alt="Google" />
            </button>
            <button type="button" className="auth-social-button" aria-label="Continue with Apple">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M16.365 1.43c0 1.14-.43 2.23-1.12 3.05-.75.87-1.98 1.54-3.13 1.45-.14-1.1.4-2.26 1.07-3.02.74-.83 2.03-1.46 3.18-1.48Z" fill="currentColor"/>
                <path d="M20.32 16.63c-.68 1.58-1.01 2.28-1.89 3.62-1.23 1.88-2.96 4.22-5.09 4.24-1.88.02-2.37-1.23-4.94-1.21-2.57.01-3.12 1.23-5 .99-2.12-.28-3.76-2.34-4.99-4.22C.47 17.01-.53 12.5 1.09 9.48c1.18-2.2 3.3-3.59 5.59-3.61 1.76-.02 3.42 1.28 4.49 1.28 1.07 0 3.08-1.59 5.21-1.35.89.04 3.4.35 5 2.7-.13.08-2.99 1.74-2.96 5.13.04 4.04 3.54 5.35 3.58 5.36-.03.09-.55 1.9-1.68 3.66Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </form>

      <div className="auth-toggle">
        <p>{mode === "signup" ? "Already have an account?" : "Don't have an account?"}</p>
        <Button
          type="subtle"
          size="medium"
          label={mode === "signup" ? "Log in" : "Sign up"}
          onClick={() => setMode((m) => (m === "signup" ? "login" : "signup"))}
        />
      </div>
      </div>
    </div>
  );
}
