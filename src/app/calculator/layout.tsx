import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DSP Savings Calculator — See What Manual Dispatch Costs You | VoiceERP",
  description:
    "Free calculator for Amazon DSP owners. Enter your fleet details and see the hours, dollars, and dispatcher headcount you're burning on manual dispatch every year.",
  openGraph: {
    title: "DSP Savings Calculator — What Is Manual Dispatch Costing You?",
    description:
      "Enter your fleet size and dispatch method. In 30 seconds, see exactly how much time and money your DSP is losing to manual operations.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DSP Savings Calculator — What Is Manual Dispatch Costing You?",
    description:
      "Free calculator for Amazon DSP owners. See the real cost of manual dispatch in 30 seconds.",
    images: ["/og-image.png"],
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
