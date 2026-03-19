import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300"],
});

/* Barlow Condensed as fallback for Acumin Pro Condensed
   (Acumin Pro requires Adobe Fonts kit — add Typekit embed for exact match) */
const barlowCondensed = Barlow_Condensed({
  variable: "--font-heading-fallback",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VoiceERP – The World's First Voice-Activated AI Dispatcher",
  description:
    "Put your DSP on autopilot with Viki, the world's first voice-activated AI dispatcher. Save time, save money, save your sanity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmMono.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <head>
        {/* Adobe Fonts — Acumin Pro Condensed
            Replace KITID with your actual Adobe Fonts project ID */}
        {/* <link rel="stylesheet" href="https://use.typekit.net/KITID.css" /> */}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
