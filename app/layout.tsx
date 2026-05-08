import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s | Nexrik LLC', 
    default: 'Nexrik LLC | Custom Carbon Fiber Parts & Precision CNC Machining',
  },
  description: 'Nexrik LLC specializes in premium custom carbon fiber manufacturing and high-precision CNC machining for B2B industrial and automotive applications.',
  keywords: ['Nexrik LLC', 'carbon fiber custom parts', 'CNC machining', 'carbon fiber layup', 'US B2B carbon fiber supplier'],
  openGraph: {
    title: 'Nexrik LLC | Engineering & Manufacturing',
    description: 'High-precision carbon fiber components and engineering solutions by Nexrik LLC.',
    url: 'https://nexrik.com',
    siteName: 'Nexrik LLC',
    locale: 'en_US',
    type: 'website',
  },
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


