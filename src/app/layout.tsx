/**
 * Root layout for the App Router application.
 * This file exists to apply global metadata and styles across the image feed experience.
 * It interacts with src/app/globals.css and every route rendered under src/app/.
 */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trivto Image Feed",
  description: "Take-home assignment for a TikTok-style vertical image feed.",
};

/**
 * Wraps every route in the global HTML document shell.
 */
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
