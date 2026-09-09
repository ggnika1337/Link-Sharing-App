/* eslint-disable @next/next/no-img-element */
import LinkButton from "@/app/components/atoms/LinkButton";
import type { LinkItem, User } from "@/app/lib/types";

export default function ProfileVisual({
  user,
  links,
  preview = false,
  avatarUrl,
}: {
  user: User | null;
  links: LinkItem[];
  preview?: boolean;
  avatarUrl?: string;
}) {
  const displayedAvatar = avatarUrl || user?.avatar?.url;
  const complete = Boolean(user?.fullName || user?.email || displayedAvatar);
  return (
    <div className={preview ? "preview-card" : "phone"}>
      {displayedAvatar ? (
        <img className="avatar" src={displayedAvatar} alt="Profile" />
      ) : (
        <div className="avatar-placeholder" />
      )}
      {complete ? (
        <>
          <h2 className="profile-name">{user?.fullName || "Your name"}</h2>
          <p className="profile-email">{user?.email || "you@example.com"}</p>
        </>
      ) : (
        <>
          <div className="profile-skeleton" />
          <div className="profile-skeleton" style={{ width: 72 }} />
        </>
      )}
      {links
        .filter((link) => link.url)
        .map((link, index) => (
          <LinkButton key={link._id || index} link={link} preview={preview} />
        ))}
      {!links.some((link) => link.url) && !preview && (
        <div className="empty-slots">
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
}
