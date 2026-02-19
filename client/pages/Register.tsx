import React, { useState } from "react";
import { authApi } from "../lib/api";
import type { User } from "../types";
import Button from "../components/Button";
import Input from "../components/Input";

type Props = {
  onSuccess: (user: User) => void;
  onNavigateLogin: () => void;
};

export default function Register({ onSuccess, onNavigateLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { user, error: err } = await authApi.register(email, password);
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
        <p className="auth-subtitle">Create an account</p>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p className="auth-error">{error}</p>}
          <Button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>
        <p className="auth-footer">
          Already have an account?{" "}
          <button type="button" className="auth-link" onClick={onNavigateLogin}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
