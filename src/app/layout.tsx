import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trivto Image Feed",
  description: "Take-home assignment for a TikTok-style vertical image feed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
