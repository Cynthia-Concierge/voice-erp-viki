"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { trackSchedule } from "@/lib/pixel";

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
      // Calendly sends postMessage in multiple formats depending on widget version
      let eventName = "";
      if (typeof e.data === "object" && e.data !== null) {
        eventName = e.data.event || "";
      } else if (typeof e.data === "string") {
        try {
          const parsed = JSON.parse(e.data);
          eventName = parsed.event || "";
        } catch {
          // not JSON
        }
      }
      if (eventName === "calendly.event_scheduled") {
        trackSchedule({ content_name: "Calendly Booking" }).then(() => {
          router.push("/thank-you");
        });
      }
    }
    window.addEventListener("message", onCalendlyEvent);
    return () => window.removeEventListener("message", onCalendlyEvent);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0039D7] flex flex-col">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
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
            {leadName ? `ONE MORE STEP, ${leadName.toUpperCase()}` : "ONE MORE STEP"}
          </h1>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] leading-[27px] mb-3 text-white/90">
            Your numbers are ready. Book a 15-minute call and we&apos;ll walk you
            through your full cost breakdown, personalized recommendations,
            and 90-day savings roadmap.
          </p>
          <p className="text-[14px] leading-[22px] mb-8 sm:mb-10 text-white/60">
            No pitch &mdash; just your numbers, explained by someone who runs DSPs.
          </p>

          {/* Calendly Inline Widget */}
          <div
            className="calendly-inline-widget bg-white rounded-sm overflow-hidden shadow-2xl"
            data-url="https://calendly.com/sammy-voiceerp/intro-with-sam?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=0039D7"
            style={{ minWidth: 320, height: 700 }}
          />
        </div>
      </section>
    </main>
  );
}
