"use client";
import { useEffect, useState } from "react";
import Brand from "@/app/components/atoms/Brand";
import Auth from "@/app/components/organisms/Auth";
import Dashboard from "@/app/components/organisms/Dashboard";
import { readableError, request } from "@/app/lib/api";
import type { AuthMode, LinkItem, Route, User } from "@/app/lib/types";

export default function DevLinksApp() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [route, setRoute] = useState<Route>("editor");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const savedToken = localStorage.getItem("devlinks-token");
    void (async () => {
      if (!savedToken) {
        setLoading(false);
        return;
      }
      setToken(savedToken);
      try {
        const [account, savedLinks] = await Promise.all([
          request<User>("/auth/current-user", {}, savedToken),
          request<LinkItem[]>("/links", {}, savedToken),
        ]);
        setUser(account);
        setLinks(savedLinks);
      } catch (error) {
        localStorage.removeItem("devlinks-token");
        setToken(null);
        setNotice(readableError(error));
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading)
    return (
      <main className="auth-page">
        <Brand />
        <p style={{ position: "absolute", marginTop: 120, color: "#737373" }}>
          Loading your profile…
        </p>
      </main>
    );
  if (!token || !user)
    return (
      <Auth
        mode={authMode}
        setMode={setAuthMode}
        onLogin={async (newToken) => {
          localStorage.setItem("devlinks-token", newToken);
          setToken(newToken);
          setLoading(true);
          try {
            const [account, savedLinks] = await Promise.all([
              request<User>("/auth/current-user", {}, newToken),
              request<LinkItem[]>("/links", {}, newToken),
            ]);
            setUser(account);
            setLinks(savedLinks);
          } catch (error) {
            setNotice(readableError(error));
          } finally {
            setLoading(false);
          }
        }}
      />
    );
  return (
    <Dashboard
      user={user}
      links={links}
      setUser={setUser}
      setLinks={setLinks}
      token={token}
      route={route}
      go={(next) => {
        setNotice("");
        setRoute(next);
      }}
      notice={notice}
      setNotice={setNotice}
      signOut={() => {
        localStorage.removeItem("devlinks-token");
        setToken(null);
        setUser(null);
        setLinks([]);
      }}
    />
  );
}
