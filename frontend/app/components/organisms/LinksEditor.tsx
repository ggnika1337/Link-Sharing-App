"use client";
import { useState } from "react";
import LinkCard from "@/app/components/molecules/LinkCard";
import { readableError, request } from "@/app/lib/api";
import type { LinkItem } from "@/app/lib/types";

export default function LinksEditor({
  links,
  setLinks,
  token,
  notice,
  setNotice,
}: {
  links: LinkItem[];
  setLinks: (links: LinkItem[]) => void;
  token: string;
  notice: string;
  setNotice: (message: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});
  function update(index: number, field: keyof LinkItem, value: string) {
    const next = [...links];
    next[index] = { ...next[index], [field]: value };
    setLinks(next);
  }
  async function save() {
    setNotice("");
    const invalid: Record<number, string> = {};
    links.forEach((link, index) => {
      try {
        new URL(link.url);
      } catch {
        invalid[index] = "Please enter a valid URL.";
      }
    });
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    setSaving(true);
    try {
      const stored = await Promise.all(
        links.map((link) =>
          link._id
            ? request<LinkItem>(
                `/links/${link._id}`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    platform: link.platform,
                    url: link.url,
                  }),
                },
                token,
              )
            : request<LinkItem>(
                "/links",
                {
                  method: "POST",
                  body: JSON.stringify({
                    platform: link.platform,
                    url: link.url,
                  }),
                },
                token,
              ),
        ),
      );
      setLinks(stored);
      setNotice("Your links have been saved.");
    } catch (error) {
      setNotice(readableError(error));
    } finally {
      setSaving(false);
    }
  }
  return (
    <article className="editor-panel">
      <div className="editor-head">
        <h1>Customize your links</h1>
        <p>
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
      </div>
      <div className="editor-body">
        <button
          className="add-link"
          onClick={() => setLinks([...links, { platform: "GitHub", url: "" }])}
        >
          + Add new link
        </button>
        {links.length === 0 ? (
          <div className="empty-state">
            <div>
              <div className="empty-icon">🔗</div>
              <h2>Let’s get you started</h2>
              <p>
                Use the “Add new link” button to get started. Once you have more
                than one link, you can reorder and edit them.
              </p>
            </div>
          </div>
        ) : (
          links.map((link, index) => (
            <LinkCard
              key={link._id || index}
              link={link}
              index={index}
              error={errors[index]}
              onUpdate={(field, value) => update(index, field, value)}
              onRemove={() =>
                setLinks(links.filter((_, itemIndex) => itemIndex !== index))
              }
            />
          ))
        )}
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
