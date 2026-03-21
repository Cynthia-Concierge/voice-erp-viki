import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Playbook: How 20 DSP Owners Eliminated 5AM Callouts | VoiceERP",
  description:
    "Download the free 5AM Callout Playbook. Learn the 3 systems top Amazon DSP operators use to automate callout coverage, save 45+ min per incident, and get their weekends back.",
  openGraph: {
    title: "The 5AM Callout Playbook — Free for Amazon DSP Owners",
    description:
      "How 20 DSP owners eliminated 5AM emergency calls and got their weekends back. Download the free playbook.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 5AM Callout Playbook — Free for Amazon DSP Owners",
    description:
      "How 20 DSP owners eliminated 5AM emergency calls. Free playbook with the 3 systems for automated callout coverage.",
    images: ["/og-image.png"],
  },
};

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
