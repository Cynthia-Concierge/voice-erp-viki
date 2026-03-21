"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface StoredLead {
  name?: string;
  drivers?: number;
  savings?: {
    totalCostPerYear: number;
    totalHoursPerYear: number;
  };
}

export default function CalculatorResultsPage() {
  const [lead, setLead] = useState<StoredLead>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("voiceerp_lead");
      if (raw) setLead(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const firstName = lead.name?.split(" ")[0] || "";

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
          {/* Checkmark */}
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
            {firstName
              ? `YOUR REPORT IS ON THE WAY, ${firstName.toUpperCase()}!`
              : "YOUR REPORT IS ON THE WAY!"}
          </h1>

          <p className="text-[16px] md:text-[18px] leading-[27px] mb-6 text-white/90">
            Check your inbox for your personalized DSP Savings Report
            {lead.drivers ? ` for your ${lead.drivers}-driver operation` : ""}.
            It includes a full cost breakdown and our top recommendations.
          </p>

          {lead.savings && (
            <div className="bg-[#022EAD] p-6 sm:p-8 mb-8 text-center">
              <p className="text-[14px] text-white/60 mb-1">Your annual savings potential</p>
              <p className="font-display text-[36px] sm:text-[48px] leading-[1] text-[#4ADE80] mb-1">
                ${lead.savings.totalCostPerYear.toLocaleString()}
              </p>
              <p className="text-[13px] text-white/50">
                {lead.savings.totalHoursPerYear.toLocaleString()} hours recovered per year
              </p>
            </div>
          )}

          <div className="bg-[#022EAD] p-6 sm:p-8 mb-8 text-left">
            <h2 className="font-display text-[20px] sm:text-[22px] leading-[1.1] text-white mb-3">
              WANT TO SEE THESE SAVINGS IN ACTION?
            </h2>
            <p className="text-[14px] sm:text-[15px] leading-[22px] text-white/70 mb-4">
              The report shows you the numbers. Viki delivers them &mdash;
              automated scheduling, callout coverage, driver coaching, all
              voice-activated. See it run with YOUR routes in 15 minutes.
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
