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
  openGraph: {
    title: "VoiceERP – The World's First Voice-Activated AI Dispatcher",
    description:
      "All-in-one ops platform with a voice-activated AI dispatcher. Save 60+ hours per month on scheduling and admin.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceERP – Voice-Activated AI Dispatcher",
    description:
      "All-in-one ops platform with a voice-activated AI dispatcher. Save 60+ hours per month.",
    images: ["/og-image.png"],
  },
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
        {/* Adobe Fonts — Acumin Pro Condensed */}
        <link rel="stylesheet" href="https://use.typekit.net/yjd4mwc.css" />

        {/* Meta Pixel — base code + PageView */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1432471141994433');
fbq('track', 'PageView');
`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1432471141994433&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
