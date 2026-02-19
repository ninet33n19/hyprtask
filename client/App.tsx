import React, { useCallback, useEffect, useState } from "react";
import { setOnUnauthorized } from "./lib/api";
import { AuthProvider, useAuth } from "./lib/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import type { User } from "./types";
import Layout from "./components/Layout";
import { SelectionProvider } from "./context/SelectionContext";

type AuthRoute = "login" | "register" | "app";

function AppRoutes() {
  const { user, setUser, loading } = useAuth();
  const [authRoute, setAuthRoute] = useState<AuthRoute>("login");

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      setAuthRoute("login");
    });
    return () => setOnUnauthorized(null);
  }, [setUser]);

  const handleLoginSuccess = useCallback((u: User) => {
    setUser(u);
    setAuthRoute("app");
  }, [setUser]);

  if (loading) {
    return (
      <div className="app-loading">
        <span>Loading…</span>
      </div>
    );
  }

  if (!user) {
    if (authRoute === "register") {
      return (
        <Register
          onSuccess={handleLoginSuccess}
          onNavigateLogin={() => setAuthRoute("login")}
        />
      );
    }
    return (
      <Login
        onSuccess={handleLoginSuccess}
        onNavigateRegister={() => setAuthRoute("register")}
      />
    );
  }

  return (
    <SelectionProvider>
      <Layout />
    </SelectionProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
