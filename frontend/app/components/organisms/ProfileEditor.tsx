"use client";
/* eslint-disable @next/next/no-img-element */
import { type ChangeEvent, useState } from "react";
import { readableError, request } from "@/app/lib/api";
import type { User } from "@/app/lib/types";

export default function ProfileEditor({
  user,
  setUser,
  token,
  notice,
  setNotice,
  onAvatarPreview,
}: {
  user: User;
  setUser: (user: User) => void;
  token: string;
  notice: string;
  setNotice: (message: string) => void;
  onAvatarPreview: (url: string) => void;
}) {
  const [form, setForm] = useState({
    fullName: user.fullName,
  });
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user.avatar?.url || "");
  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (
      !/^image\/(png|jpeg)$/.test(selected.type) ||
      selected.size > 2 * 1024 * 1024
    ) {
      setNotice("Use a PNG or JPG image below 2MB.");
      return;
    }
    setFile(selected);
    const localUrl = URL.createObjectURL(selected);
    setPreviewUrl(localUrl);
    onAvatarPreview(localUrl);
  }
  async function save() {
    setNotice("");
    if (!form.fullName.trim()) {
      setNotice("Please enter your name.");
      return;
    }
    setSaving(true);
    try {
      let updated = user;
      const changes = Object.fromEntries(
        Object.entries(form).filter(
          ([key, value]) => value !== user[key as keyof typeof form],
        ),
      );
      if (Object.keys(changes).length) {
        updated = await request<User>(
          `/users/${user._id}`,
          { method: "PATCH", body: JSON.stringify(changes) },
          token,
        );
      }
      if (file) {
        const data = new FormData();
        data.append("file", file);
        updated = await request<User>(
          "/users/avatar",
          { method: "PATCH", body: data },
          token,
        );
        setFile(null);
      }
      setUser(updated);
      setPreviewUrl(updated.avatar?.url || "");
      onAvatarPreview(updated.avatar?.url || "");
      setNotice("Your profile details have been saved.");
    } catch (error) {
      setNotice(readableError(error));
    } finally {
      setSaving(false);
    }
  }
  return (
    <article className="editor-panel">
      <div className="editor-head">
        <h1>Profile Details</h1>
        <p>Add your details to create a personal touch to your profile.</p>
      </div>
      <div className="editor-body">
        <div className="image-row">
          <span>Profile picture</span>
          <label className="upload-box">
            {previewUrl ? (
              <img
                className="upload-preview"
                src={previewUrl}
                alt="Selected avatar"
              />
            ) : (
              <span>▧</span>
            )}
            <span>+ Upload Image</span>
            <input
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={chooseImage}
            />
          </label>
          <span className="image-tip">
            Image must be below 2MB.
            <br />
            Use PNG or JPG format.
          </span>
        </div>
        <div className="profile-form">
          <label>First name*</label>
          <label className="field">
            <input
              className="field-input"
              placeholder="e.g. John"
              value={form.fullName}
              onChange={(event) =>
                setForm({
                  ...form,
                  fullName: event.target.value,
                })
              }
            />
          </label>
        </div>
      </div>
      {notice && (
        <p className={`notice ${notice.includes("saved") ? "" : "error"}`}>
          {notice}
        </p>
      )}
      <footer className="save-bar">
        <button
          className="primary-btn"
          onClick={() => void save()}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </footer>
    </article>
  );
}
