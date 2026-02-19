import React, { useState } from "react";
import { authApi } from "../lib/api";
import type { User } from "../types";
import Button from "../components/Button";
import Input from "../components/Input";

type Props = {
  onSuccess: (user: User) => void;
  onNavigateRegister: () => void;
};

export default function Login({ onSuccess, onNavigateRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { user, error: err } = await authApi.login(email, password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    if (user) onSuccess(user);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Hyprtask</h1>
        <p className="auth-subtitle">Sign in to continue</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <Button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="auth-footer">
          Don’t have an account?{" "}
          <button type="button" className="auth-link" onClick={onNavigateRegister}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
