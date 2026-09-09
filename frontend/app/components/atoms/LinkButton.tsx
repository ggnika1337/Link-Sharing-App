import { platformColors, platformSymbols } from "@/app/lib/platforms";
import type { LinkItem } from "@/app/lib/types";

export default function LinkButton({
  link,
  preview = false,
}: {
  link: LinkItem;
  preview?: boolean;
}) {
  return (
    <a
      className={preview ? "preview-link" : "mini-link"}
      style={{ background: platformColors[link.platform] || "#333" }}
      href={link.url}
      target="_blank"
      rel="noreferrer"
    >
      <span>
        <b className="platform-symbol">
          {platformSymbols[link.platform] || "↗"}
        </b>
        {link.platform}
      </span>
      <span>→</span>
    </a>
  );
}
