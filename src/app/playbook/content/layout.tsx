import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The 5AM Callout Playbook — Full Guide | VoiceERP",
  description:
    "The complete tactical playbook for Amazon DSP owners. Learn the real cost of callouts, 3 coverage systems, backup roster templates, escalation flowcharts, and a 4-week implementation roadmap.",
  openGraph: {
    title: "The 5AM Callout Playbook — Full Guide",
    description:
      "Everything you need to eliminate 5AM emergency calls. Coverage systems, backup roster templates, escalation flowcharts, and implementation roadmap.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 5AM Callout Playbook — Full Guide",
    description:
      "The complete tactical playbook for Amazon DSP owners. Coverage systems, templates, and implementation roadmap.",
    images: ["/og-image.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PlaybookContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
