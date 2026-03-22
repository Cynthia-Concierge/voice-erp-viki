"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function PlaybookThankYouPage() {
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("voiceerp_lead");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.name) setLeadName(data.name.split(" ")[0]);
        if (data.email) setLeadEmail(data.email);
      }
    } catch {
      /* ignore */
    }

    function onCalendlyEvent(e: MessageEvent) {
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
        if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).fbq) {
          (window as unknown as Record<string, (...args: unknown[]) => void>).fbq("track", "Schedule", {
            content_name: "Playbook to Demo",
          });
        }
        router.push("/thank-you");
      }
    }
    window.addEventListener("message", onCalendlyEvent);
    return () => window.removeEventListener("message", onCalendlyEvent);
  }, [router]);

  // Build Calendly URL with prefill if we have lead data
  const calendlyBase = "https://calendly.com/sammy-voiceerp/intro-with-sam";
  const calendlyParams = new URLSearchParams();
  if (leadName) calendlyParams.set("name", leadName);
  if (leadEmail) calendlyParams.set("email", leadEmail);
  const calendlyUrl = calendlyParams.toString()
    ? `${calendlyBase}?${calendlyParams.toString()}`
    : calendlyBase;

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

      {/* Confirmation + Calendly */}
      <section className="flex-1 px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto text-white">
          {/* Checkmark + Confirmation */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="mb-6">
              <svg
                width="56"
                height="56"
                viewBox="0 0 64 64"
                fill="none"
                className="mx-auto"
              >
                <circle cx="32" cy="32" r="32" fill="white" fillOpacity="0.15" />
                <path
                  d="M20 33l8 8 16-16"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="font-display text-[26px] sm:text-[32px] md:text-[42px] leading-[1.05] mb-3">
              {leadName
                ? `YOUR PLAYBOOK IS ON THE WAY, ${leadName.toUpperCase()}!`
                : "YOUR PLAYBOOK IS ON THE WAY!"}
            </h1>

            <p className="text-[15px] sm:text-[16px] leading-[25px] text-white/80 max-w-lg mx-auto">
              We&apos;re emailing <strong>The 5AM Callout Playbook</strong> to you now.
              While you wait, book a 15-minute call to see how Viki automates
              everything in the playbook &mdash; for YOUR routes.
            </p>
          </div>

          {/* Why book now */}
          <div className="bg-[#022EAD] p-5 sm:p-6 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" stroke="#4ADE80" strokeWidth="2" />
                <path d="M8 12l3 3 5-5" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-[14px] leading-[20px] text-white/80">
                <strong className="text-white">No pitch, just proof.</strong> We&apos;ll
                pull up YOUR Amazon station, YOUR driver count, and show you exactly
                how Viki handles the scenarios in the playbook.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" stroke="#4ADE80" strokeWidth="2" />
                <path d="M8 12l3 3 5-5" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-[14px] leading-[20px] text-white/80">
                <strong className="text-white">15 minutes.</strong> That&apos;s it.
                Most DSP owners say &ldquo;I wish I&apos;d seen this 6 months ago.&rdquo;
              </p>
            </div>
          </div>

          {/* Calendly Embed */}
          <div className="mb-6">
            <h2 className="font-display text-[20px] sm:text-[22px] leading-[1.1] text-white text-center mb-4">
              PICK A TIME THAT WORKS
            </h2>
            <div
              className="calendly-inline-widget bg-white overflow-hidden shadow-2xl"
              data-url={calendlyUrl}
              style={{ minWidth: 320, height: 700 }}
            />
          </div>

          {/* Skip link */}
          <div className="text-center">
            <a
              href="/"
              className="text-white/50 text-[13px] hover:text-white/70 transition-colors underline"
            >
              No thanks, just send me the playbook
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
