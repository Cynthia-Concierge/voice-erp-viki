"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PlaybookThankYouPage() {
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
          {/* Checkmark Icon */}
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

          <h1 className="font-display text-[28px] sm:text-[36px] md:text-[48px] leading-[1.05] mb-4">
            {leadName
              ? `YOUR PLAYBOOK IS ON THE WAY, ${leadName.toUpperCase()}!`
              : "YOUR PLAYBOOK IS ON THE WAY!"}
          </h1>

          <p className="text-[16px] md:text-[18px] leading-[27px] mb-6 text-white/90">
            Check your inbox for <strong>The 5AM Callout Playbook</strong>.
            It includes the cost calculator, the 3 coverage systems, and the
            backup roster template.
          </p>

          <div className="bg-[#022EAD] p-6 sm:p-8 mb-8 text-left">
            <h2 className="font-display text-[20px] sm:text-[22px] leading-[1.1] text-white mb-3">
              WANT TO SEE THESE SYSTEMS IN ACTION?
            </h2>
            <p className="text-[14px] sm:text-[15px] leading-[22px] text-white/70 mb-4">
              The playbook shows you the framework. Viki does it automatically
              &mdash; calls drivers, fills callouts, manages your roster 24/7.
              See it work with YOUR routes in a 15-minute live demo.
            </p>
            <a
              href="/schedule"
              className="btn-pop inline-block bg-white text-[#0039D7] font-semibold text-[15px] sm:text-[16px] px-8 py-3 rounded-none"
            >
              Schedule a Demo
            </a>
          </div>

          <a
            href="/"
            className="text-white/60 text-[14px] hover:text-white/80 transition-colors underline"
          >
            Back to Home
          </a>
        </div>
      </section>
    </main>
  );
}
