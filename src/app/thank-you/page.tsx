"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThankYouPage() {
  const [leadName, setLeadName] = useState("");

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
  }, []);

  return (
    <main className="min-h-screen bg-[#0039D7] flex flex-col">
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
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="max-w-xl w-full text-center text-white">
          <div className="mb-8">
            <svg
              width="64"
              height="64"
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

          <h1 className="font-display text-[32px] sm:text-[36px] md:text-[48px] leading-[1.05] mb-4">
            {leadName
              ? `YOU'RE ALL SET, ${leadName.toUpperCase()}!`
              : "YOU'RE ALL SET!"}
          </h1>

          <p className="text-[16px] md:text-[18px] leading-[27px] mb-6 text-white/90">
            Your call has been scheduled. We&apos;ll send you a confirmation
            email with all the details.
          </p>

          <p className="text-[15px] leading-[24px] mb-10 text-white/70">
            In the meantime, get ready to see how Viki can save your DSP
            60+ hours per month and cut safety infractions by 30%.
          </p>

          <a
            href="/"
            className="inline-block bg-white text-[#0039D7] font-semibold text-[15px] sm:text-[16px] px-8 py-3 rounded-none hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </section>
    </main>
  );
}
