import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "devlinks | Share your links",
  description: "Create and share a personal link profile.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
