"use client";

import { useState, useEffect } from "react";
import FAQ from "@/components/FAQ";
import LeadModal from "@/components/LeadModal";
import Image from "next/image";

/* ─── Stat Card ─── */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        className="mb-2 opacity-80"
      >
        <path
          d="M14 4v16m0 0l-6-6m6 6l6-6"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[32px] sm:text-[40px] leading-[36px] text-white">
        {value}
      </span>
      <span className="text-white text-[13px] sm:text-[14px] mt-2">{label}</span>
    </div>
  );
}

/* ─── Blue Checkmark ─── */
function Check() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 22 22"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="11" cy="11" r="11" fill="#1C77FF" />
      <path
        d="M6.5 11.5l3 3 6-6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowSticky(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#0039D7]">
      {modalOpen && <LeadModal onClose={() => setModalOpen(false)} />}

      {/* ─── STICKY MOBILE CTA ─── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#022EAD] px-4 py-3 transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          onClick={() => setModalOpen(true)}
          className="btn-pop w-full bg-white text-[#0039D7] font-semibold text-[15px] py-3.5 rounded-none"
        >
          Schedule a Demo
        </button>
      </div>

      {/* ─── NAVIGATION ─── */}
      <nav className="px-4 sm:px-5 md:px-10 py-4 flex items-center justify-between">
        <div className="pl-2 sm:pl-4 md:pl-8">
          <Image
            src="/voiceerp-logo.svg"
            alt="VoiceERP"
            width={90}
            height={34}
            priority
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="font-[family-name:var(--font-dm-mono)] font-light text-white text-sm tracking-wider hover:opacity-80 transition-opacity"
        >
          GET STARTED
        </button>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="text-white text-center px-4 sm:px-6 pt-8 sm:pt-10 md:pt-16 pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-[32px] sm:text-[36px] md:text-[52px] lg:text-[64px] leading-[1.05] sm:leading-[1] md:leading-[58px] mb-3 sm:mb-4 text-white">
            20 AMAZON DSP OWNERS JOINED VIKI THIS MONTH
          </h1>
          <p className="font-display text-[14px] sm:text-[16px] md:text-[20px] tracking-[0.15em] mb-6 sm:mb-8 text-[#AFE2FF]">
            THEY&apos;RE GETTING 100+ HOURS BACK. YOU&apos;RE STILL DOING DISPATCH.
          </p>
        </div>

        {/* Hero Image — full-bleed on mobile, constrained on desktop */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="max-w-5xl mb-8 sm:mb-10 -mx-4 sm:mx-auto">
          <img
            src="/hero-scene@2x.png"
            srcSet="/hero-scene.png 800w, /hero-scene@2x.png 1600w"
            sizes="(max-width: 640px) 100vw, 1024px"
            alt="Viki - AI Dispatcher in neighborhood"
            className="w-full h-auto"
            fetchPriority="high"
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-[15px] sm:text-[16px] md:text-[18px] leading-[25px] sm:leading-[27px] max-w-xl mx-auto mb-6 sm:mb-8 text-white">
            The world&apos;s first voice-activated AI dispatcher — built
            specifically for Amazon DSPs.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-pop inline-block bg-white text-[#0039D7] font-semibold text-[15px] sm:text-[16px] px-6 sm:px-8 py-3 rounded-none"
          >
            Join Viki&apos;s AI Partnership
          </button>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="text-white px-4 sm:px-6 pt-10 sm:pt-12 md:pt-20 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-[36px] md:text-[36px] lg:text-[42px] leading-[1.1] sm:leading-[1.05] text-center mb-8 sm:mb-12 md:mb-16 text-white">
            WHAT AMAZON DSP OWNERS GET WITH VIKI
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-16">
            {/* Feature List */}
            <div className="flex-1 space-y-3 sm:space-y-4 w-full">
              {[
                "Calls and books drivers",
                "Coordinates rescues",
                "Manages your fleet and rosters",
                "Monitors Netradyne & coaches",
                "Handles scheduling and confirms",
                "Incident, write-ups, incentives, payroll integration & compliance",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check />
                  <span className="text-[14px] leading-[20px] text-white">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Dashboard Screenshot */}
            <div className="flex-1 flex justify-center w-full">
              <Image
                src="/dashboard-mockup.webp"
                alt="VoiceERP Driver Roster Dashboard"
                width={500}
                height={600}
                className="w-full max-w-sm sm:max-w-md shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className="text-white px-4 sm:px-6 py-10 sm:py-12 md:py-20 text-center">
        <div className="max-w-4xl mx-auto bg-[#022EAD] px-5 sm:px-8 md:px-16 py-10 sm:py-14 md:py-20">
          <h2 className="font-display text-[22px] sm:text-[24px] md:text-[36px] lg:text-[42px] leading-[1.1] sm:leading-[1.05] mb-4 sm:mb-6 text-white">
            AMAZON DSP OWNERS ARE SAVING $150K+/YEAR WITH VIKI
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] leading-[25px] sm:leading-[27px] max-w-lg mx-auto mb-8 sm:mb-12 text-white">
            DSPs who&apos;ve partnered with Viki are racking up massive savings
            in time and money across the board. Join them today and start seeing
            the same results flow to your bottomline.
          </p>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-14">
            <StatCard value="60hrs" label="per month on scheduling" />
            <StatCard value="40hrs" label="per month on admin" />
            <StatCard value="30%" label="cut in safety infractions" />
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="btn-pop inline-block border-2 border-white bg-white text-[#0039D7] font-semibold text-[14px] sm:text-[16px] px-5 sm:px-8 py-3 rounded-none"
            >
              Switch now and earn a $1,000 Bonus
            </button>
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="text-white px-4 sm:px-6 pt-8 sm:pt-10 md:pt-16 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[22px] sm:text-[24px] md:text-[36px] lg:text-[42px] leading-[1.1] sm:leading-[1.05] mb-6 sm:mb-8 md:mb-12 text-white">
            YOUR QUESTIONS ANSWERED
          </h2>
          <FAQ />
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ─── */}
      <section className="text-white text-center px-4 sm:px-6 pt-10 sm:pt-12 md:pt-20 pb-24 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto bg-[#022EAD] px-5 sm:px-8 md:px-16 pt-10 sm:pt-14 md:pt-20 pb-0 relative overflow-hidden">
          <h2 className="font-display text-[22px] sm:text-[24px] md:text-[36px] lg:text-[42px] leading-[1.1] sm:leading-[1.05] mb-8 sm:mb-10 text-white">
            YOU&apos;RE ON THE WAY TO KNOCKING DOWN MORE FANTASTIC PLUS WEEKS
            THAN YOU EVER IMAGINED. GET STARTED TODAY!
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-12">
            <button
              onClick={() => setModalOpen(true)}
              className="btn-pop inline-flex items-center gap-2 border-2 border-white bg-white text-[#0039D7] font-semibold text-[15px] sm:text-[16px] px-6 sm:px-7 py-3 rounded-none"
            >
              Schedule a Demo
            </button>
          </div>

          {/* Animated audio waveform */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes wp{0%,100%{transform:scaleY(.15)}50%{transform:scaleY(1)}}
          `}} />
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 80, padding: 0, width: "100%", overflow: "hidden" }}>
            {Array.from({ length: 120 }, (_, i) => {
              // Gentle wave shape — no center peak, just subtle random variation
              const wave = Math.sin(i * 0.3) * 0.3 + 0.7;
              const h = 20 + wave * 60;
              const dur = 1.0 + ((i * 7) % 13) * 0.15;
              const delay = ((i * 3) % 23) * 0.09;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: h,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.18)",
                    transformOrigin: "bottom",
                    animation: `wp ${dur.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#002a9e] text-white px-4 sm:px-6 py-6 pb-20 sm:pb-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between text-xs">
          <span>&copy; 2025, Phoenicia Labs, Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a
              href="https://voiceerp.com/privacy-policy"
              className="underline hover:opacity-80 transition-opacity"
            >
              Privacy Policy
            </a>
            <a
              href="https://voiceerp.com/terms"
              className="underline hover:opacity-80 transition-opacity"
            >
              Terms of Service
            </a>
          </div>
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/voiceerp/" aria-label="LinkedIn" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/voiceerp/reels/" aria-label="Instagram" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/voiceerp" aria-label="Facebook" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
