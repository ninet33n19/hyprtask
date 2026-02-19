import React, { useState } from "react";
import { useAuth } from "../lib/auth";
import { authApi } from "../lib/api";
import Button from "./Button";

export default function TopBar() {
  const { user, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await authApi.logout();
    setUser(null);
    setLoggingOut(false);
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-logo">Hyprtask</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-user-wrap">
          <button
            type="button"
            className="topbar-user-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="topbar-user-email">{user?.email}</span>
            <span className="topbar-user-chevron">▼</span>
          </button>
          {menuOpen && (
            <>
              <div
                className="topbar-backdrop"
                aria-hidden
                onClick={() => setMenuOpen(false)}
              />
              <div className="topbar-dropdown">
                <div className="topbar-dropdown-email">{user?.email}</div>
                <Button
                  variant="ghost"
                  className="topbar-logout"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Signing out…" : "Sign out"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
