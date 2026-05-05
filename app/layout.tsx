import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexrik - Precision Carbon Fiber Solutions",
  description: "Advanced composites for aerospace, automotive, and mission-critical industrial applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 引入原版 HTML 里的图标库 */}
        <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}