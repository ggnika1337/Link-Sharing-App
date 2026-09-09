"use client";
import { useState } from "react";
import Brand from "@/app/components/atoms/Brand";
import ProfileVisual from "@/app/components/molecules/ProfileVisual";
import LinksEditor from "./LinksEditor";
import ProfileEditor from "./ProfileEditor";
import type { LinkItem, Route, User } from "@/app/lib/types";

export default function Dashboard({
  user,
  links,
  setUser,
  setLinks,
  token,
  route,
  go,
  notice,
  setNotice,
  signOut,
}: {
  user: User;
  links: LinkItem[];
  setUser: (user: User) => void;
  setLinks: (links: LinkItem[]) => void;
  token: string;
  route: Route;
  go: (route: Route) => void;
  notice: string;
  setNotice: (message: string) => void;
  signOut: () => void;
}) {
  const [avatarPreview, setAvatarPreview] = useState("");
  return (
    <main className="app-shell">
      <header className="topbar">
        <Brand />
        <nav className="tabs">
          <button
            className={`tab ${route === "editor" ? "active" : ""}`}
            onClick={() => go("editor")}
          >
            🔗 &nbsp;Links
          </button>
          <button
            className={`tab ${route === "profile" ? "active" : ""}`}
            onClick={() => go("profile")}
          >
            ◎ &nbsp;Profile Details
          </button>
        </nav>
        <a className="outline-btn" href={`/${user._id}`}>
          Preview
        </a>
      </header>
      <section className="workspace">
        <aside className="phone-panel">
          <ProfileVisual user={user} links={links} avatarUrl={avatarPreview} />
        </aside>
        {route === "profile" ? (
          <ProfileEditor
            key={`${user._id}-${user.fullName}-${user.email}`}
            user={user}
            setUser={setUser}
            token={token}
            notice={notice}
            setNotice={setNotice}
            onAvatarPreview={setAvatarPreview}
          />
        ) : (
          <LinksEditor
            links={links}
            setLinks={setLinks}
            token={token}
            notice={notice}
            setNotice={setNotice}
          />
        )}
      </section>
      <button
        onClick={signOut}
        title="Sign out"
        style={{
          position: "fixed",
          bottom: 14,
          left: 14,
          border: 0,
          background: "transparent",
          color: "#737373",
          fontSize: 12,
        }}
      >
        Sign out
      </button>
    </main>
  );
}
