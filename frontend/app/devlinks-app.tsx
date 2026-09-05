"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const platforms = ["GitHub", "YouTube", "LinkedIn", "Twitter", "Twitch", "Facebook", "GitLab", "Hashnode", "CodePen", "freeCodeCamp", "Dev.to", "Codewars", "Stack Overflow"];
const colors: Record<string, string> = { GitHub: "#1a1a1a", YouTube: "#ee3939", LinkedIn: "#2d68ff", Twitter: "#1da1f2", Twitch: "#9146ff", Facebook: "#1877f2", GitLab: "#fc6d26", Hashnode: "#2962ff", CodePen: "#111", "freeCodeCamp": "#302267", "Dev.to": "#111", Codewars: "#ad2c27", "Stack Overflow": "#f48024" };
const symbols: Record<string, string> = { GitHub: "♟", YouTube: "▶", LinkedIn: "in", Twitter: "𝕏", Twitch: "◧", Facebook: "f", GitLab: "◆", Hashnode: "H", CodePen: "◈", "freeCodeCamp": "⌁", "Dev.to": "DEV", Codewars: "⌘", "Stack Overflow": "▤" };

type LinkItem = { _id?: string; platform: string; url: string };
type User = { _id: string; fullName: string; email: string; avatar?: { url?: string }; links?: LinkItem[] };
type AuthMode = "login" | "signup";
type Route = "editor" | "profile" | "preview";

function readableError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API}${path}`, { ...options, headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(Array.isArray(body.message) ? body.message[0] : body.message || "Request failed. Please try again.");
  }
  return response.json() as Promise<T>;
}

function Brand({ className = "" }: { className?: string }) { return <div className={`brand ${className}`}><span className="brand-mark">⛓</span><span>devlinks</span></div>; }
function LinkButton({ link, preview = false }: { link: LinkItem; preview?: boolean }) { return <a className={preview ? "preview-link" : "mini-link"} style={{ background: colors[link.platform] || "#333" }} href={link.url} target="_blank" rel="noreferrer"><span><b className="platform-symbol">{symbols[link.platform] || "↗"}</b>{link.platform}</span><span>→</span></a>; }
function ProfileVisual({ user, links, preview = false }: { user: User | null; links: LinkItem[]; preview?: boolean }) {
  const complete = Boolean(user?.fullName || user?.email || user?.avatar?.url);
  return <div className={preview ? "preview-card" : "phone"}>
    {user?.avatar?.url ? <img className="avatar" src={user.avatar.url} alt="Profile" /> : <div className="avatar-placeholder" />}
    {complete ? <><h2 className="profile-name">{user?.fullName || "Your name"}</h2><p className="profile-email">{user?.email || "you@example.com"}</p></> : <><div className="profile-skeleton" /><div className="profile-skeleton" style={{ width: 72 }} /></>}
    {links.filter((link) => link.url).map((link, index) => <LinkButton key={link._id || index} link={link} preview={preview} />)}
    {!links.some((link) => link.url) && !preview && <div className="empty-slots"><span /><span /><span /></div>}
  </div>;
}

export default function DevLinksApp() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [route, setRoute] = useState<Route>(() => typeof window !== "undefined" && window.location.pathname === "/preview" ? "preview" : "editor");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("devlinks-token");
    const onPopState = () => setRoute(window.location.pathname === "/preview" ? "preview" : "editor");
    window.addEventListener("popstate", onPopState);
    void (async () => {
      if (!saved) { setLoading(false); return; }
      setToken(saved);
      await loadAccount(saved);
    })();
    return () => window.removeEventListener("popstate", onPopState);
    // The account request intentionally runs once on initial client hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAccount(activeToken = token) {
    if (!activeToken) return;
    try {
      const [account, savedLinks] = await Promise.all([request<User>("/auth/current-user", {}, activeToken), request<LinkItem[]>("/links", {}, activeToken)]);
      setUser(account); setLinks(savedLinks);
    } catch (error) { localStorage.removeItem("devlinks-token"); setToken(null); setNotice(readableError(error)); }
    finally { setLoading(false); }
  }
  function go(next: Route) { setNotice(""); setRoute(next); window.history.pushState({}, "", next === "preview" ? "/preview" : "/"); }
  function signOut() { localStorage.removeItem("devlinks-token"); setToken(null); setUser(null); setLinks([]); setRoute("editor"); window.history.replaceState({}, "", "/"); }
  if (loading) return <main className="auth-page"><Brand /><p style={{ position: "absolute", marginTop: 120, color: "#737373" }}>Loading your profile…</p></main>;
  if (route === "preview") return <Preview user={user} links={links} onBack={() => go("editor")} />;
  if (!token || !user) return <Auth mode={authMode} setMode={setAuthMode} onLogin={async (newToken) => { localStorage.setItem("devlinks-token", newToken); setToken(newToken); setLoading(true); await loadAccount(newToken); }} />;
  return <Dashboard user={user} links={links} setUser={setUser} setLinks={setLinks} token={token} route={route} go={go} notice={notice} setNotice={setNotice} signOut={signOut} />;
}

function Auth({ mode, setMode, onLogin }: { mode: AuthMode; setMode: (mode: AuthMode) => void; onLogin: (token: string) => Promise<void> }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" }); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setError(""); setBusy(true); try { if (mode === "signup") { await request("/auth/sign-up", { method: "POST", body: JSON.stringify(form) }); setMode("login"); setError("Account created — please sign in."); } else { const result = await request<{ token: string }>("/auth/sign-in", { method: "POST", body: JSON.stringify({ email: form.email, password: form.password }) }); await onLogin(result.token); } } catch (err) { setError(readableError(err)); } finally { setBusy(false); } }
  const signup = mode === "signup";
  return <main className="auth-page"><div className="auth-wrap"><Brand className="auth-brand" /><form className="auth-card" onSubmit={submit}><h1>{signup ? "Create account" : "Login"}</h1><p>{signup ? "Let’s get you started sharing your links!" : "Add your details below to get back into the app"}</p>{signup && <label className="field"><span className="field-label">Full name</span><input required className="field-input" placeholder="e.g. Alex Smith" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>}<label className="field"><span className="field-label">Email address</span><input required type="email" className="field-input" placeholder="e.g. alex@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label className="field"><span className="field-label">Password</span><input required minLength={6} maxLength={20} type="password" className="field-input" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>{signup && <small style={{ color: "#737373", display: "block", marginTop: 8 }}>Password must contain at least 6 characters.</small>}<p className="form-message">{error}</p><button className="primary-btn" disabled={busy}>{busy ? "Please wait…" : signup ? "Create new account" : "Login"}</button><p className="auth-switch">{signup ? "Already have an account? " : "Don’t have an account? "}<button type="button" className="text-link" style={{ border: 0, background: "transparent", padding: 0 }} onClick={() => { setError(""); setMode(signup ? "login" : "signup"); }}>{signup ? "Login" : "Create account"}</button></p></form></div></main>;
}

function Dashboard({ user, links, setUser, setLinks, token, route, go, notice, setNotice, signOut }: { user: User; links: LinkItem[]; setUser: (user: User) => void; setLinks: (links: LinkItem[]) => void; token: string; route: Route; go: (route: Route) => void; notice: string; setNotice: (message: string) => void; signOut: () => void }) {
  return <main className="app-shell"><header className="topbar"><Brand /><nav className="tabs"><button className={`tab ${route === "editor" ? "active" : ""}`} onClick={() => go("editor")}>🔗 &nbsp;Links</button><button className={`tab ${route === "profile" ? "active" : ""}`} onClick={() => go("profile")}>◎ &nbsp;Profile Details</button></nav><button className="outline-btn" onClick={() => go("preview")}>Preview</button></header><section className="workspace"><aside className="phone-panel"><ProfileVisual user={user} links={links} /></aside>{route === "profile" ? <ProfileEditor key={user._id + user.fullName + user.email} user={user} setUser={setUser} token={token} notice={notice} setNotice={setNotice} /> : <LinksEditor links={links} setLinks={setLinks} token={token} notice={notice} setNotice={setNotice} />}</section><button onClick={signOut} title="Sign out" style={{ position: "fixed", bottom: 14, left: 14, border: 0, background: "transparent", color: "#737373", fontSize: 12 }}>Sign out</button></main>;
}

function LinksEditor({ links, setLinks, token, notice, setNotice }: { links: LinkItem[]; setLinks: (links: LinkItem[]) => void; token: string; notice: string; setNotice: (message: string) => void }) {
  const [saving, setSaving] = useState(false); const [errors, setErrors] = useState<Record<number, string>>({});
  function update(index: number, field: keyof LinkItem, value: string) { const next = [...links]; next[index] = { ...next[index], [field]: value }; setLinks(next); }
  function remove(index: number) { setLinks(links.filter((_, itemIndex) => itemIndex !== index)); }
  async function save() { setNotice(""); const invalid: Record<number, string> = {}; links.forEach((link, index) => { try { new URL(link.url); } catch { invalid[index] = "Please enter a valid URL."; } }); setErrors(invalid); if (Object.keys(invalid).length) return; setSaving(true); try { const stored = await Promise.all(links.map(async (link) => link._id ? request<LinkItem>(`/links/${link._id}`, { method: "PATCH", body: JSON.stringify({ platform: link.platform, url: link.url }) }, token) : request<LinkItem>("/links", { method: "POST", body: JSON.stringify({ platform: link.platform, url: link.url }) }, token))); setLinks(stored); setNotice("Your links have been saved."); } catch (error) { setNotice(readableError(error)); } finally { setSaving(false); } }
  return <article className="editor-panel"><div className="editor-head"><h1>Customize your links</h1><p>Add/edit/remove links below and then share all your profiles with the world!</p></div><div className="editor-body"><button className="add-link" onClick={() => setLinks([...links, { platform: "GitHub", url: "" }])}>+ Add new link</button>{links.length === 0 ? <div className="empty-state"><div><div className="empty-icon">🔗</div><h2>Let’s get you started</h2><p>Use the “Add new link” button to get started. Once you have more than one link, you can reorder and edit them. We’re here to help you share your profiles with everyone!</p></div></div> : links.map((link, index) => <div className="link-card" key={link._id || index}><div className="link-card-header"><b><span className="drag">☰</span>Link #{index + 1}</b><button className="remove-btn" onClick={() => remove(index)}>Remove</button></div><label className="field"><span className="field-label">Platform</span><select className="field-select" value={link.platform} onChange={(e) => update(index, "platform", e.target.value)}>{platforms.map((platform) => <option key={platform}>{platform}</option>)}</select></label><label className="field"><span className="field-label">Link</span><input className={`field-input ${errors[index] ? "invalid" : ""}`} placeholder="https://www.example.com" value={link.url} onChange={(e) => update(index, "url", e.target.value)} /></label>{errors[index] && <p className="field-error">{errors[index]}</p>}</div>)}</div>{notice && <p className={`notice ${notice.includes("saved") ? "" : "error"}`}>{notice}</p>}<footer className="save-bar"><button className="primary-btn" onClick={() => void save()} disabled={saving}>{saving ? "Saving…" : "Save"}</button></footer></article>;
}

function ProfileEditor({ user, setUser, token, notice, setNotice }: { user: User; setUser: (user: User) => void; token: string; notice: string; setNotice: (message: string) => void }) {
  const [form, setForm] = useState({ fullName: user.fullName, email: user.email }); const [saving, setSaving] = useState(false); const [file, setFile] = useState<File | null>(null);
  async function save() { setNotice(""); if (!form.fullName.trim()) { setNotice("Please enter your name."); return; } setSaving(true); try { let updated = await request<User>(`/users/${user._id}`, { method: "PATCH", body: JSON.stringify(form) }, token); if (file) { const data = new FormData(); data.append("file", file); updated = await request<User>("/users/avatar", { method: "PATCH", body: data }, token); setFile(null); } setUser(updated); setNotice("Your profile details have been saved."); } catch (error) { setNotice(readableError(error)); } finally { setSaving(false); } }
  function chooseImage(event: ChangeEvent<HTMLInputElement>) { const selected = event.target.files?.[0]; if (!selected) return; if (!/^image\/(png|jpeg)$/.test(selected.type) || selected.size > 2 * 1024 * 1024) { setNotice("Use a PNG or JPG image below 2MB."); return; } setFile(selected); }
  const [firstName, ...rest] = form.fullName.split(" ");
  return <article className="editor-panel"><div className="editor-head"><h1>Profile Details</h1><p>Add your details to create a personal touch to your profile.</p></div><div className="editor-body"><div className="image-row"><span>Profile picture</span><label className="upload-box"><span>{file || user.avatar?.url ? "✓" : "▧"}</span><span>+ Upload Image</span><input type="file" accept="image/png,image/jpeg" hidden onChange={chooseImage} /></label><span className="image-tip">Image must be below 1024×1024px.<br />Use PNG or JPG format.</span></div><div className="profile-form"><label>First name*</label><label className="field"><input className="field-input" placeholder="e.g. John" value={firstName} onChange={(e) => setForm({ ...form, fullName: `${e.target.value} ${rest.join(" ")}`.trim() })} /></label><label>Last name</label><label className="field"><input className="field-input" placeholder="e.g. Appleseed" value={rest.join(" ")} onChange={(e) => setForm({ ...form, fullName: `${firstName} ${e.target.value}`.trim() })} /></label><label>Email</label><label className="field"><input type="email" className="field-input" placeholder="e.g. email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label></div></div>{notice && <p className={`notice ${notice.includes("saved") ? "" : "error"}`}>{notice}</p>}<footer className="save-bar"><button className="primary-btn" onClick={() => void save()} disabled={saving}>{saving ? "Saving…" : "Save"}</button></footer></article>;
}

function Preview({ user, links, onBack }: { user: User | null; links: LinkItem[]; onBack: () => void }) {
  const [copied, setCopied] = useState(false); const shareUrl = useMemo(() => typeof window === "undefined" ? "" : window.location.href, []);
  async function share() { try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { window.prompt("Copy your share link:", shareUrl); } }
  return <main className="preview-page"><header className="preview-top"><button className="outline-btn" onClick={onBack}>Back to Editor</button><button className="primary-btn" onClick={() => void share()}>{copied ? "Copied!" : "Share Link"}</button></header><ProfileVisual user={user} links={links} preview /></main>;
}
