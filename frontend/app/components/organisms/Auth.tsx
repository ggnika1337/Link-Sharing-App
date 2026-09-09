"use client";
import { type FormEvent, useState } from "react";
import Brand from "@/app/components/atoms/Brand";
import { readableError, request } from "@/app/lib/api";
import type { AuthMode } from "@/app/lib/types";

export default function Auth({
  mode,
  setMode,
  onLogin,
}: {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  onLogin: (token: string) => Promise<void>;
}) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const signup = mode === "signup";
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (signup) {
        await request("/auth/sign-up", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setMode("login");
        setError("Account created — please sign in.");
      } else {
        const result = await request<{ token: string }>("/auth/sign-in", {
          method: "POST",
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        await onLogin(result.token);
      }
    } catch (err) {
      setError(readableError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <Brand className="auth-brand" />
        <form className="auth-card" onSubmit={submit}>
          <h1>{signup ? "Create account" : "Login"}</h1>
          <p>
            {signup
              ? "Let’s get you started sharing your links!"
              : "Add your details below to get back into the app"}
          </p>
          {signup && (
            <label className="field">
              <span className="field-label">Full name</span>
              <input
                required
                className="field-input"
                placeholder="e.g. Alex Smith"
                value={form.fullName}
                onChange={(event) =>
                  setForm({ ...form, fullName: event.target.value })
                }
              />
            </label>
          )}
          <label className="field">
            <span className="field-label">Email address</span>
            <input
              required
              type="email"
              className="field-input"
              placeholder="e.g. alex@email.com"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
            />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input
              required
              minLength={6}
              maxLength={20}
              type="password"
              className="field-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
            />
          </label>
          {signup && (
            <small style={{ color: "#737373", display: "block", marginTop: 8 }}>
              Password must contain at least 6 characters.
            </small>
          )}
          <p className="form-message">{error}</p>
          <button className="primary-btn" disabled={busy}>
            {busy ? "Please wait…" : signup ? "Create new account" : "Login"}
          </button>
          <p className="auth-switch">
            {signup ? "Already have an account? " : "Don’t have an account? "}
            <button
              type="button"
              className="text-link"
              style={{ border: 0, background: "transparent", padding: 0 }}
              onClick={() => {
                setError("");
                setMode(signup ? "login" : "signup");
              }}
            >
              {signup ? "Login" : "Create account"}
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}
