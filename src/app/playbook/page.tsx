"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isFakePhone(digits: string): boolean {
  if (digits.length !== 10) return true;
  if (/^(\d)\1{9}$/.test(digits)) return true;
  if (digits.slice(3, 7) === "5501") return true;
  if (digits[0] === "0" || digits[0] === "1") return true;
  if (digits[3] === "0" || digits[3] === "1") return true;
  if (digits === "1234567890" || digits === "0987654321") return true;
  return false;
}

/* ─── Pillar Card ─── */
function PillarCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center px-4 sm:px-6">
      <div className="w-14 h-14 flex items-center justify-center bg-white/10 border border-white/20 mb-4">
        {icon}
      </div>
      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[13px] tracking-[0.2em] text-[#AFE2FF] mb-2">
        {number}
      </span>
      <h3 className="font-display text-[20px] sm:text-[22px] leading-[1.1] text-white mb-3">
        {title}
      </h3>
      <p className="text-[14px] sm:text-[15px] leading-[22px] text-white/70">
        {description}
      </p>
    </div>
  );
}

/* ─── Checkmark ─── */
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
   5AM CALLOUT PLAYBOOK — LEAD CAPTURE
   ═══════════════════════════════════════ */
export default function PlaybookPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [driverCount, setDriverCount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a 10-digit US phone number.");
      return;
    }
    if (isFakePhone(digits)) {
      setError("Please enter a real US phone number.");
      return;
    }

    const cleanPhone = `+1${digits}`;
    setSubmitting(true);

    localStorage.setItem(
      "voiceerp_lead",
      JSON.stringify({ name, email, phone: cleanPhone, driverCount, ts: Date.now() })
    );

    // Meta Pixel — Lead event
    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).fbq) {
      (window as unknown as Record<string, (...args: unknown[]) => void>).fbq("track", "Lead", {
        content_name: "5AM Callout Playbook",
      });
    }

    // Send to GHL with playbook-specific source & tags
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: cleanPhone,
        source: "5AM Callout Playbook",
        tags: ["playbook-lead", "5am-callout"],
      }),
    }).catch(() => {});

    router.push("/playbook/thank-you");
  }

  return (
    <main className="min-h-screen bg-[#0039D7]">
      {/* ─── NAVIGATION ─── */}
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
        <button
          onClick={scrollToForm}
          className="font-[family-name:var(--font-dm-mono)] font-light text-white text-sm tracking-wider hover:opacity-80 transition-opacity"
        >
          GET THE PLAYBOOK
        </button>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: "url(/playbook-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,57,215,0.88) 0%, rgba(0,57,215,0.6) 50%, rgba(0,57,215,0.8) 100%)",
          }}
        />

        <div className="relative px-4 sm:px-6 pt-8 sm:pt-10 md:pt-16 pb-10 sm:pb-12 md:pb-16" style={{ zIndex: 3 }}>
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:justify-between">
            {/* Left — Copy */}
            <div className="flex-1 text-center lg:text-left pt-0 lg:pt-4 lg:max-w-[48%]">
              <span className="inline-block font-[family-name:var(--font-dm-mono)] font-light text-[12px] sm:text-[13px] tracking-[0.2em] text-[#AFE2FF] mb-4">
                FREE PLAYBOOK
              </span>
              <h1 className="font-display text-[28px] sm:text-[36px] md:text-[44px] lg:text-[48px] leading-[1.05] mb-4 text-white">
                HOW 20 DSP OWNERS ELIMINATED 5AM EMERGENCY CALLS AND GOT THEIR WEEKENDS BACK
              </h1>
              <p className="text-[15px] sm:text-[16px] md:text-[18px] leading-[25px] sm:leading-[27px] text-white/80 mb-6">
                The tactical playbook Amazon DSP operators are using to stop
                bleeding 45 minutes every time a driver calls out at 4:47 AM.
              </p>
              <div className="space-y-2.5 mb-6 text-left inline-block">
                {[
                  "The real cost of callouts (it\u2019s not just time)",
                  "3 systems top DSPs use for automated coverage",
                  "Build a backup roster that self-activates",
                  "Callout escalation flowchart template",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check />
                    <span className="text-[14px] sm:text-[15px] leading-[20px] text-white/90">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollToForm}
                className="btn-pop lg:hidden inline-block bg-white text-[#0039D7] font-semibold text-[15px] px-8 py-3 rounded-none"
              >
                Get the Free Playbook
              </button>
            </div>

            {/* Right — Form (z-index above Viki so it stays clickable) */}
            <div ref={formRef} className="w-full lg:w-[380px] flex-shrink-0">
              <div className="bg-[#022EAD]/90 backdrop-blur-sm p-6 sm:p-8 border border-white/10">
                <h2 className="font-display text-[22px] sm:text-[24px] leading-[1.1] text-white mb-2">
                  GET THE FREE PLAYBOOK
                </h2>
                <p className="text-white/70 text-[14px] mb-6">
                  Enter your info and we&apos;ll send the 5AM Callout Playbook
                  straight to your inbox.
                </p>

                {error && (
                  <p className="text-red-300 text-[14px] mb-4 bg-red-500/20 px-3 py-2">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    required
                    minLength={2}
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white placeholder:text-white/50 text-[15px] outline-none focus:border-white transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white placeholder:text-white/50 text-[15px] outline-none focus:border-white transition-colors"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={handlePhoneChange}
                    inputMode="numeric"
                    maxLength={14}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white placeholder:text-white/50 text-[15px] outline-none focus:border-white transition-colors"
                  />
                  <select
                    value={driverCount}
                    onChange={(e) => setDriverCount(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white text-[15px] outline-none focus:border-white transition-colors appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='white' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                    }}
                  >
                    <option value="" className="text-gray-900">How many drivers?</option>
                    <option value="1-20" className="text-gray-900">1 &ndash; 20 drivers</option>
                    <option value="21-40" className="text-gray-900">21 &ndash; 40 drivers</option>
                    <option value="41-60" className="text-gray-900">41 &ndash; 60 drivers</option>
                    <option value="61-100" className="text-gray-900">61 &ndash; 100 drivers</option>
                    <option value="100+" className="text-gray-900">100+ drivers</option>
                  </select>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-pop w-full bg-white text-[#0039D7] font-semibold text-[16px] px-8 py-3.5 rounded-none hover:bg-gray-100 transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Send Me the Playbook"}
                  </button>
                  <p className="text-white/50 text-[12px] text-center">
                    No spam. Just the playbook. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT'S INSIDE — 3 PILLARS ─── */}
      <section className="text-white px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-[24px] sm:text-[28px] md:text-[36px] lg:text-[42px] leading-[1.1] text-center mb-4 text-white">
            WHAT&apos;S INSIDE THE PLAYBOOK
          </h2>
          <p className="text-[15px] sm:text-[16px] leading-[25px] text-white/70 text-center max-w-xl mx-auto mb-10 sm:mb-14">
            Everything you need to stop waking up in a panic and start running
            callout coverage on autopilot.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            <PillarCard
              number="01"
              title="THE REAL COST OF CALLOUTS"
              description="Every callout costs you 45+ minutes and $87 in hidden labor. We break down the math most DSP owners never calculate — and show you what it adds up to per month."
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 4v10l6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="14" cy="14" r="10" stroke="white" strokeWidth="2" />
                </svg>
              }
            />
            <PillarCard
              number="02"
              title="3 SYSTEMS FOR AUTOMATED COVERAGE"
              description="The three coverage systems top-performing DSPs use to fill callouts without picking up the phone — ranked by cost, speed, and reliability."
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M4 14h4l3-8 4 16 3-8h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <PillarCard
              number="03"
              title="BACKUP ROSTER TEMPLATE"
              description="A ready-to-use escalation flowchart and backup driver roster system. Plug in your drivers and it self-activates when someone calls out."
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="5" y="4" width="18" height="20" rx="2" stroke="white" strokeWidth="2" />
                  <path d="M10 10h8M10 14h8M10 18h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ─── PAIN POINT SECTION ─── */}
      <section className="text-white px-4 sm:px-6 py-10 sm:py-12 md:py-20 text-center">
        <div className="max-w-4xl mx-auto bg-[#022EAD] px-5 sm:px-8 md:px-16 py-10 sm:py-14 md:py-20">
          <h2 className="font-display text-[22px] sm:text-[24px] md:text-[36px] lg:text-[42px] leading-[1.1] mb-4 sm:mb-6 text-white">
            YOU KNOW THE DRILL
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] leading-[25px] sm:leading-[27px] max-w-lg mx-auto mb-8 sm:mb-10 text-white/80">
            4:47 AM. Phone buzzes. Driver can&apos;t make it.
            Now you&apos;re scrolling through contacts half-asleep, begging
            someone to cover a route that starts in two hours.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-14">
            <div className="flex flex-col items-center">
              <span className="font-[family-name:var(--font-dm-mono)] font-light text-[32px] sm:text-[40px] leading-[36px] text-white">
                45min
              </span>
              <span className="text-white text-[13px] sm:text-[14px] mt-2">
                avg time per callout
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-[family-name:var(--font-dm-mono)] font-light text-[32px] sm:text-[40px] leading-[36px] text-white">
                $87
              </span>
              <span className="text-white text-[13px] sm:text-[14px] mt-2">
                hidden cost per incident
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-[family-name:var(--font-dm-mono)] font-light text-[32px] sm:text-[40px] leading-[36px] text-white">
                3x/wk
              </span>
              <span className="text-white text-[13px] sm:text-[14px] mt-2">
                avg callout frequency
              </span>
            </div>
          </div>

          <p className="text-[15px] sm:text-[16px] leading-[25px] text-white/70 max-w-md mx-auto mb-8">
            That&apos;s over <strong className="text-white">$13,500/year</strong> and{" "}
            <strong className="text-white">117 hours</strong> lost to a problem that
            can be automated. This playbook shows you how.
          </p>

          <button
            onClick={scrollToForm}
            className="btn-pop inline-block bg-white text-[#0039D7] font-semibold text-[15px] sm:text-[16px] px-6 sm:px-8 py-3 rounded-none"
          >
            Get the Free Playbook
          </button>
        </div>
      </section>

      {/* ─── WHO THIS IS FOR ─── */}
      <section className="text-white px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[24px] sm:text-[28px] md:text-[36px] leading-[1.1] text-center mb-8 sm:mb-10 text-white">
            THIS PLAYBOOK IS FOR YOU IF...
          </h2>
          <div className="space-y-4">
            {[
              "You\u2019re the one answering callout texts at 5AM",
              "You\u2019ve ever had a route go uncovered because you couldn\u2019t find backup fast enough",
              "Your dispatching process lives in spreadsheets, group texts, or your head",
              "You want to scale past 40 drivers without hiring another ops manager",
              "You\u2019re tired of being chained to your phone on weekends",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check />
                <span className="text-[15px] sm:text-[16px] leading-[22px] text-white/90">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ─── */}
      <section className="text-white text-center px-4 sm:px-6 pt-10 sm:pt-12 md:pt-20 pb-24 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto bg-[#022EAD] px-5 sm:px-8 md:px-16 pt-10 sm:pt-14 md:pt-20 pb-0 relative overflow-hidden">
          <h2 className="font-display text-[22px] sm:text-[24px] md:text-[36px] lg:text-[42px] leading-[1.1] mb-4 text-white">
            STOP LOSING SLEEP OVER CALLOUTS
          </h2>
          <p className="text-[15px] sm:text-[16px] leading-[25px] text-white/70 max-w-md mx-auto mb-8 sm:mb-10">
            Even if you never work with us, this playbook will save you hours
            every week. It&apos;s free. No strings.
          </p>

          <button
            onClick={scrollToForm}
            className="btn-pop inline-block bg-white text-[#0039D7] font-semibold text-[15px] sm:text-[16px] px-8 py-3 rounded-none mb-8 sm:mb-12"
          >
            Send Me the Playbook
          </button>

          {/* Animated audio waveform */}
          <style
            dangerouslySetInnerHTML={{
              __html: `@keyframes wp{0%,100%{transform:scaleY(.15)}50%{transform:scaleY(1)}}`,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              height: 80,
              padding: 0,
              width: "100%",
              overflow: "hidden",
            }}
          >
            {Array.from({ length: 120 }, (_, i) => {
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
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/company/voiceerp/" aria-label="LinkedIn" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/voiceerp/reels/" aria-label="Instagram" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="https://www.facebook.com/voiceerp" aria-label="Facebook" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
