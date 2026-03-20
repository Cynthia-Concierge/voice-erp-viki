"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function SchedulePage() {
  const [leadName, setLeadName] = useState("");
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("voiceerp_lead");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.name) setLeadName(data.name.split(" ")[0]);
      }
    } catch {
      /* ignore */
    }

    function onCalendlyEvent(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") {
        // Meta Pixel — Schedule event
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Schedule");
        }
        router.push("/thank-you");
      }
    }
    window.addEventListener("message", onCalendlyEvent);
    return () => window.removeEventListener("message", onCalendlyEvent);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0039D7] flex flex-col">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      {/* Nav */}
      <nav className="px-4 sm:px-5 md:px-10 py-4 flex items-center justify-between">
        <div className="pl-2 sm:pl-4 md:pl-8">
          <a href="/">
            <Image
              src="/voiceerp-logo.svg"
              alt="VoiceERP"
              width={90}
              height={34}
              priority
            />
          </a>
        </div>
      </nav>

      {/* Content */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-2xl w-full text-center text-white">
          <h1 className="font-display text-[28px] md:text-[42px] leading-[1.05] mb-4">
            {leadName ? `THANKS, ${leadName.toUpperCase()}!` : "THANK YOU!"}
          </h1>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] leading-[27px] mb-8 sm:mb-10 text-white/90">
            You&apos;re one step away from putting your DSP on autopilot.
            Schedule a quick call with our team below.
          </p>

          {/* Calendly Inline Widget */}
          <div
            className="calendly-inline-widget bg-white rounded-sm overflow-hidden shadow-2xl"
            data-url="https://calendly.com/sammy-voiceerp/intro-with-sam"
            style={{ minWidth: 320, height: 700 }}
          />
        </div>
      </section>
    </main>
  );
}
