export type LinkItem = { _id?: string; platform: string; url: string };
export type User = {
  _id: string;
  fullName: string;
  email: string;
  avatar?: { url?: string };
  links?: LinkItem[];
};
export type AuthMode = "login" | "signup";
export type Route = "editor" | "profile";
