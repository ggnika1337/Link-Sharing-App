"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileVisual from "@/app/components/molecules/ProfileVisual";
import { readableError, request } from "@/app/lib/api";
import type { User } from "@/app/lib/types";

export default function PublicProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    void request<User>(`/users/${userId}`)
      .then(setUser)
      .catch((reason) => setError(readableError(reason)));
    const token = localStorage.getItem("devlinks-token");
    if (token) {
      void request<User>("/auth/current-user", {}, token)
        .then((currentUser) => setIsOwner(currentUser._id === userId))
        .catch(() => setIsOwner(false));
    }
  }, [userId]);
  async function shareProfile() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy your profile link:", window.location.href);
    }
  }
  if (error)
    return (
      <main className="preview-page">
        <p className="notice error">{error}</p>
      </main>
    );
  if (!user)
    return (
      <main className="preview-page">
        <p className="notice">Loading profile…</p>
      </main>
    );
  return (
    <main className="preview-page">
      {isOwner && (
        <header className="preview-top">
          <Link className="outline-btn" href="/">
            Back to Editor
          </Link>
          <button className="primary-btn" onClick={() => void shareProfile()}>
            {copied ? "Copied!" : "Share Link"}
          </button>
        </header>
      )}
      <ProfileVisual user={user} links={user.links || []} preview />
    </main>
  );
}
