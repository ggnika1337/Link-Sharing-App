import { platforms } from "@/app/lib/platforms";
import type { LinkItem } from "@/app/lib/types";

export default function LinkCard({
  link,
  index,
  error,
  onUpdate,
  onRemove,
}: {
  link: LinkItem;
  index: number;
  error?: string;
  onUpdate: (field: keyof LinkItem, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="link-card">
      <div className="link-card-header">
        <b>
          <span className="drag">☰</span>Link #{index + 1}
        </b>
        <button className="remove-btn" onClick={onRemove}>
          Remove
        </button>
      </div>
      <label className="field">
        <span className="field-label">Platform</span>
        <select
          className="field-select"
          value={link.platform}
          onChange={(event) => onUpdate("platform", event.target.value)}
        >
          {platforms.map((platform) => (
            <option key={platform}>{platform}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field-label">Link</span>
        <input
          className={`field-input ${error ? "invalid" : ""}`}
          placeholder="https://www.example.com"
          value={link.url}
          onChange={(event) => onUpdate("url", event.target.value)}
        />
      </label>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
