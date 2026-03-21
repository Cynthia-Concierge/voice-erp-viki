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

/* ─── Savings calculation engine ─── */
interface SavingsResult {
  schedulingHoursPerMonth: number;
  adminHoursPerMonth: number;
  calloutCostPerMonth: number;
  coachingHoursPerMonth: number;
  totalHoursPerYear: number;
  totalCostPerYear: number;
  dispatcherEquivalent: number;
}

function calculateSavings(
  drivers: number,
  routes: number,
  method: string
): SavingsResult {
  // Base rates per 20 drivers (from Sammy's research data)
  const schedulingBase = 60; // hrs/month for ~20 drivers
  const adminBase = 40; // hrs/month for ~20 drivers
  const calloutFrequency = 3; // times per week
  const calloutCostPerIncident = 87; // dollars
  const calloutTimePerIncident = 0.75; // hours (45 min)
  const coachingPerDriver = 0.5; // hrs/month per driver (Netradyne reviews)

  // Scale factor based on fleet size
  const scale = drivers / 20;

  // Method efficiency multiplier — more manual = more waste
  const methodMultiplier: Record<string, number> = {
    manual: 1.3, // pen & paper, phone calls
    spreadsheet: 1.15, // Google Sheets / Excel
    dispatcher: 0.85, // human dispatcher handles some
    software: 0.7, // basic software but not AI
  };
  const mult = methodMultiplier[method] || 1.0;

  const schedulingHoursPerMonth = Math.round(schedulingBase * scale * mult);
  const adminHoursPerMonth = Math.round(adminBase * scale * mult);

  // Callout costs scale with routes, not just drivers
  const weeklyCallouts = Math.max(1, Math.round(calloutFrequency * (routes / 20)));
  const monthlyCallouts = weeklyCallouts * 4.3;
  const calloutCostPerMonth = Math.round(monthlyCallouts * calloutCostPerIncident);
  const calloutHoursPerMonth = Math.round(monthlyCallouts * calloutTimePerIncident);

  const coachingHoursPerMonth = Math.round(drivers * coachingPerDriver);

  const totalHoursPerMonth =
    schedulingHoursPerMonth +
    adminHoursPerMonth +
    calloutHoursPerMonth +
    coachingHoursPerMonth;

  const totalHoursPerYear = totalHoursPerMonth * 12;

  // Cost = time cost ($35/hr ops manager rate) + direct callout costs
  const hourlyRate = 35;
  const totalCostPerYear = Math.round(
    totalHoursPerYear * hourlyRate + calloutCostPerMonth * 12
  );

  // How many full dispatchers this equals ($55k/yr avg)
  const dispatcherEquivalent =
    Math.round((totalCostPerYear / 55000) * 10) / 10;

  return {
    schedulingHoursPerMonth,
    adminHoursPerMonth,
    calloutCostPerMonth,
    coachingHoursPerMonth,
    totalHoursPerYear,
    totalCostPerYear,
    dispatcherEquivalent,
  };
}

/* ─── Animated counter ─── */
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1500,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useState(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Slider step labels ─── */
function SliderLabels({ labels }: { labels: string[] }) {
  return (
    <div className="flex justify-between mt-1">
      {labels.map((l, i) => (
        <span key={i} className="text-[11px] text-white/40">
          {l}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   DSP OPS SAVINGS CALCULATOR
   ═══════════════════════════════════════ */
export default function CalculatorPage() {
  const router = useRouter();

  // Calculator inputs
  const [drivers, setDrivers] = useState(30);
  const [routes, setRoutes] = useState(20);
  const [method, setMethod] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SavingsResult | null>(null);

  // Lead capture
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [gated, setGated] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function handleCalculate() {
    if (!method) return;
    const r = calculateSavings(drivers, routes, method);
    setResults(r);
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleGetReport() {
    setGated(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
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
      JSON.stringify({
        name,
        email,
        phone: cleanPhone,
        drivers,
        routes,
        method,
        savings: results,
        ts: Date.now(),
      })
    );

    // Meta Pixel
    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).fbq) {
      (window as unknown as Record<string, (...args: unknown[]) => void>).fbq("track", "Lead", {
        content_name: "DSP Savings Calculator",
        value: results?.totalCostPerYear,
        currency: "USD",
      });
    }

    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: cleanPhone,
        source: "DSP Savings Calculator",
        tags: ["calculator-lead", `drivers-${drivers}`, `method-${method}`],
      }),
    }).catch(() => {});

    router.push("/calculator/results");
  }

  const methodOptions = [
    {
      value: "manual",
      label: "Phone Calls & Texts",
      desc: "Calling/texting drivers manually",
    },
    {
      value: "spreadsheet",
      label: "Spreadsheets",
      desc: "Google Sheets, Excel, or paper",
    },
    {
      value: "dispatcher",
      label: "Human Dispatcher",
      desc: "Dedicated person handling dispatch",
    },
    {
      value: "software",
      label: "Dispatch Software",
      desc: "Using a tool, but not AI-powered",
    },
  ];

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
        <a
          href="/"
          className="font-[family-name:var(--font-dm-mono)] font-light text-white text-sm tracking-wider hover:opacity-80 transition-opacity"
        >
          VOICEERP.COM
        </a>
      </nav>

      {/* ─── HERO ─── */}
      <section className="text-white text-center px-4 sm:px-6 pt-8 sm:pt-10 md:pt-16 pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block font-[family-name:var(--font-dm-mono)] font-light text-[12px] sm:text-[13px] tracking-[0.2em] text-[#AFE2FF] mb-4">
            FREE CALCULATOR
          </span>
          <h1 className="font-display text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] leading-[1.05] mb-4 text-white">
            SEE EXACTLY WHAT MANUAL DISPATCH IS COSTING YOUR DSP
          </h1>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] leading-[25px] sm:leading-[27px] text-white/80 max-w-xl mx-auto">
            Enter your fleet details below. In 30 seconds you&apos;ll see the
            hours, dollars, and dispatcher headcount you&apos;re burning every year.
          </p>
        </div>
      </section>

      {/* ─── CALCULATOR ─── */}
      <section className="text-white px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-2xl mx-auto bg-[#022EAD] p-6 sm:p-8 md:p-10">
          <h2 className="font-display text-[22px] sm:text-[24px] leading-[1.1] text-white mb-8">
            YOUR DSP DETAILS
          </h2>

          {/* Driver Count Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-[14px] text-white/80">
                How many drivers do you have?
              </label>
              <span className="font-[family-name:var(--font-dm-mono)] font-light text-[24px] text-white">
                {drivers}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={150}
              step={5}
              value={drivers}
              onChange={(e) => setDrivers(Number(e.target.value))}
              className="w-full h-1 bg-white/20 appearance-none cursor-pointer accent-white"
              style={{
                accentColor: "white",
              }}
            />
            <SliderLabels labels={["5", "50", "100", "150"]} />
          </div>

          {/* Route Count Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-[14px] text-white/80">
                How many routes per day?
              </label>
              <span className="font-[family-name:var(--font-dm-mono)] font-light text-[24px] text-white">
                {routes}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              step={5}
              value={routes}
              onChange={(e) => setRoutes(Number(e.target.value))}
              className="w-full h-1 bg-white/20 appearance-none cursor-pointer accent-white"
              style={{
                accentColor: "white",
              }}
            />
            <SliderLabels labels={["5", "20", "40", "60", "80"]} />
          </div>

          {/* Dispatch Method */}
          <div className="mb-8">
            <label className="text-[14px] text-white/80 block mb-3">
              How do you currently handle dispatch?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {methodOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMethod(opt.value)}
                  className={`text-left px-4 py-3 border transition-colors ${
                    method === opt.value
                      ? "border-white bg-white/15"
                      : "border-white/20 bg-white/5 hover:border-white/40"
                  }`}
                >
                  <span className="text-[14px] font-semibold text-white block">
                    {opt.label}
                  </span>
                  <span className="text-[12px] text-white/50">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={!method}
            className="btn-pop w-full bg-white text-[#0039D7] font-semibold text-[16px] px-8 py-3.5 rounded-none hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Calculate My Savings
          </button>
        </div>
      </section>

      {/* ─── RESULTS ─── */}
      {showResults && results && (
        <section
          ref={resultsRef}
          className="text-white px-4 sm:px-6 pb-12 sm:pb-16 md:pb-20"
        >
          <div className="max-w-2xl mx-auto">
            {/* Big number header */}
            <div className="text-center mb-8 sm:mb-10">
              <p className="font-[family-name:var(--font-dm-mono)] font-light text-[13px] tracking-[0.2em] text-[#AFE2FF] mb-2">
                YOUR DSP IS LOSING
              </p>
              <p className="font-display text-[48px] sm:text-[64px] md:text-[80px] leading-[1] text-white mb-2">
                <AnimatedNumber
                  value={results.totalCostPerYear}
                  prefix="$"
                  suffix="/yr"
                />
              </p>
              <p className="text-[15px] sm:text-[16px] text-white/70">
                That&apos;s{" "}
                <strong className="text-white">
                  <AnimatedNumber value={results.totalHoursPerYear} suffix=" hours" />
                </strong>{" "}
                and the equivalent of{" "}
                <strong className="text-white">
                  {results.dispatcherEquivalent} full-time dispatchers
                </strong>
              </p>
            </div>

            {/* Breakdown cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#022EAD] p-5 sm:p-6 text-center">
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[36px] text-white block">
                  <AnimatedNumber value={results.schedulingHoursPerMonth} suffix="hrs" />
                </span>
                <span className="text-[12px] sm:text-[13px] text-white/60 mt-1 block">
                  scheduling per month
                </span>
              </div>
              <div className="bg-[#022EAD] p-5 sm:p-6 text-center">
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[36px] text-white block">
                  <AnimatedNumber value={results.adminHoursPerMonth} suffix="hrs" />
                </span>
                <span className="text-[12px] sm:text-[13px] text-white/60 mt-1 block">
                  admin work per month
                </span>
              </div>
              <div className="bg-[#022EAD] p-5 sm:p-6 text-center">
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[36px] text-white block">
                  <AnimatedNumber
                    value={results.calloutCostPerMonth}
                    prefix="$"
                  />
                </span>
                <span className="text-[12px] sm:text-[13px] text-white/60 mt-1 block">
                  callout costs per month
                </span>
              </div>
              <div className="bg-[#022EAD] p-5 sm:p-6 text-center">
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[36px] text-white block">
                  <AnimatedNumber value={results.coachingHoursPerMonth} suffix="hrs" />
                </span>
                <span className="text-[12px] sm:text-[13px] text-white/60 mt-1 block">
                  Netradyne coaching per month
                </span>
              </div>
            </div>

            {/* Viki comparison bar */}
            <div className="bg-[#022EAD] p-5 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-1">
                    WITH VIKI, THIS DROPS TO
                  </p>
                  <p className="text-[14px] text-white/60">
                    $12/driver/month &times; {drivers} drivers ={" "}
                    <strong className="text-white">
                      ${(drivers * 12 * 12).toLocaleString()}/yr
                    </strong>
                  </p>
                </div>
                <div className="text-center sm:text-right">
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[32px] sm:text-[40px] text-[#4ADE80]">
                    <AnimatedNumber
                      value={
                        results.totalCostPerYear - drivers * 12 * 12
                      }
                      prefix="$"
                    />
                  </span>
                  <span className="text-[13px] text-[#4ADE80]/80 block">
                    saved per year
                  </span>
                </div>
              </div>
            </div>

            {/* Gate CTA */}
            {!gated ? (
              <div className="text-center">
                <p className="text-[15px] text-white/70 mb-4">
                  Want the full breakdown with actionable recommendations?
                </p>
                <button
                  onClick={handleGetReport}
                  className="btn-pop inline-block bg-white text-[#0039D7] font-semibold text-[16px] px-8 py-3.5 rounded-none"
                >
                  Get My Full Savings Report
                </button>
              </div>
            ) : (
              /* ─── Lead capture form ─── */
              <div ref={formRef} className="bg-[#022EAD] p-6 sm:p-8">
                <h3 className="font-display text-[22px] sm:text-[24px] leading-[1.1] text-white mb-2">
                  GET YOUR FULL REPORT
                </h3>
                <p className="text-white/70 text-[14px] mb-6">
                  We&apos;ll send a personalized savings breakdown for your
                  {" "}{drivers}-driver DSP, plus recommendations to cut these
                  costs immediately.
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
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-pop w-full bg-white text-[#0039D7] font-semibold text-[16px] px-8 py-3.5 rounded-none hover:bg-gray-100 transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Send My Report"}
                  </button>
                  <p className="text-white/50 text-[12px] text-center">
                    No spam. Just your personalized report. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── SOCIAL PROOF STRIP ─── */}
      <section className="text-white px-4 sm:px-6 py-10 sm:py-12 md:py-16 text-center">
        <div className="max-w-4xl mx-auto bg-[#022EAD] px-5 sm:px-8 md:px-16 py-10 sm:py-14">
          <h2 className="font-display text-[22px] sm:text-[24px] md:text-[36px] leading-[1.1] mb-4 text-white">
            DSP OWNERS ARE SAVING $150K+/YEAR WITH VIKI
          </h2>
          <p className="text-[15px] sm:text-[16px] leading-[25px] text-white/70 max-w-lg mx-auto mb-8">
            20 Amazon DSP operators joined Viki&apos;s AI Partnership last month.
            They&apos;re getting 100+ hours back every month while their
            dispatching runs on autopilot.
          </p>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div className="flex flex-col items-center">
              <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[40px] leading-[36px] text-white">
                60hrs
              </span>
              <span className="text-white text-[12px] sm:text-[14px] mt-2">
                saved on scheduling/mo
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[40px] leading-[36px] text-white">
                1:60
              </span>
              <span className="text-white text-[12px] sm:text-[14px] mt-2">
                dispatcher-to-driver ratio
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[40px] leading-[36px] text-white">
                30%
              </span>
              <span className="text-white text-[12px] sm:text-[14px] mt-2">
                fewer safety infractions
              </span>
            </div>
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
