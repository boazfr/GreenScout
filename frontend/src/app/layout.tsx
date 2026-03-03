import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "greenScout",
  description: "Find nature activities near you for the whole family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
