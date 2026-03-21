"use client";

import { useState, useRef, useEffect } from "react";
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
  calloutHoursPerMonth: number;
  coachingHoursPerMonth: number;
  totalHoursPerMonth: number;
  totalHoursPerYear: number;
  totalCostPerYear: number;
  dispatcherEquivalent: number;
  biggestDrain: string;
  biggestDrainHours: number;
}

function calculateSavings(
  drivers: number,
  routes: number,
  method: string
): SavingsResult {
  const schedulingBase = 60;
  const adminBase = 40;
  const calloutFrequency = 3;
  const calloutCostPerIncident = 87;
  const calloutTimePerIncident = 0.75;
  const coachingPerDriver = 0.5;

  const scale = drivers / 20;
  const methodMultiplier: Record<string, number> = {
    manual: 1.3,
    spreadsheet: 1.15,
    dispatcher: 0.85,
    software: 0.7,
  };
  const mult = methodMultiplier[method] || 1.0;

  const schedulingHoursPerMonth = Math.round(schedulingBase * scale * mult);
  const adminHoursPerMonth = Math.round(adminBase * scale * mult);

  const weeklyCallouts = Math.max(1, Math.round(calloutFrequency * (routes / 20)));
  const monthlyCallouts = weeklyCallouts * 4.3;
  const calloutCostPerMonth = Math.round(monthlyCallouts * calloutCostPerIncident);
  const calloutHoursPerMonth = Math.round(monthlyCallouts * calloutTimePerIncident);

  const coachingHoursPerMonth = Math.round(drivers * coachingPerDriver);

  const totalHoursPerMonth =
    schedulingHoursPerMonth + adminHoursPerMonth + calloutHoursPerMonth + coachingHoursPerMonth;
  const totalHoursPerYear = totalHoursPerMonth * 12;

  const hourlyRate = 35;
  const totalCostPerYear = Math.round(
    totalHoursPerYear * hourlyRate + calloutCostPerMonth * 12
  );

  const dispatcherEquivalent = Math.round((totalCostPerYear / 55000) * 10) / 10;

  // Find biggest drain
  const drains = [
    { name: "Scheduling", hours: schedulingHoursPerMonth },
    { name: "Admin work", hours: adminHoursPerMonth },
    { name: "Callout coverage", hours: calloutHoursPerMonth },
    { name: "Netradyne coaching", hours: coachingHoursPerMonth },
  ].sort((a, b) => b.hours - a.hours);

  return {
    schedulingHoursPerMonth,
    adminHoursPerMonth,
    calloutCostPerMonth,
    calloutHoursPerMonth,
    coachingHoursPerMonth,
    totalHoursPerMonth,
    totalHoursPerYear,
    totalCostPerYear,
    dispatcherEquivalent,
    biggestDrain: drains[0].name,
    biggestDrainHours: drains[0].hours,
  };
}

/* ─── Personalized recommendations engine ─── */
interface Recommendation {
  title: string;
  description: string;
  impact: string;
  priority: "HIGH" | "MEDIUM";
}

function getRecommendations(
  drivers: number,
  routes: number,
  method: string,
  results: SavingsResult
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Method-specific recommendations
  if (method === "manual") {
    recs.push({
      title: "Eliminate phone-based scheduling immediately",
      description: `With ${drivers} drivers, manual phone calls and texts are your single biggest time sink. Every callout triggers a cascade: wake up, scroll contacts, call 3-5 drivers, confirm, update the schedule. At your scale, this is unsustainable.`,
      impact: `Save ${results.schedulingHoursPerMonth} hrs/mo`,
      priority: "HIGH",
    });
    recs.push({
      title: "Implement automated callout escalation",
      description: "Build a tiered backup roster where Driver A's callout automatically triggers a call to Driver B, then C, then D — without you touching your phone. The playbook covers exactly how to set this up.",
      impact: `Recover ${results.calloutHoursPerMonth} hrs/mo in callout time`,
      priority: "HIGH",
    });
  } else if (method === "spreadsheet") {
    recs.push({
      title: "Replace spreadsheet scheduling with automated dispatch",
      description: `Google Sheets can't call your drivers at 5AM. You're spending ${results.schedulingHoursPerMonth} hours/month on something that should take zero manual effort. Your spreadsheet is a record-keeping tool, not a dispatch system.`,
      impact: `Save ${results.schedulingHoursPerMonth} hrs/mo`,
      priority: "HIGH",
    });
    recs.push({
      title: "Automate Netradyne infraction follow-ups",
      description: `At ${drivers} drivers, you're spending ${results.coachingHoursPerMonth} hours/month manually reviewing infractions and coaching drivers. Automated coaching calls can handle this in real-time, the moment an infraction occurs.`,
      impact: `Save ${results.coachingHoursPerMonth} hrs/mo`,
      priority: "HIGH",
    });
  } else if (method === "dispatcher") {
    recs.push({
      title: "Augment your dispatcher with AI for off-hours coverage",
      description: `Your dispatcher handles 9-5, but callouts happen at 4:47 AM. You're still the overnight backup. AI dispatching covers the ${Math.round(results.calloutHoursPerMonth * 0.6)} hours/month of off-hours work your dispatcher can't.`,
      impact: `Eliminate off-hours overhead`,
      priority: "HIGH",
    });
    recs.push({
      title: "Scale your dispatcher ratio from 1:20 to 1:60",
      description: `Industry average is 1 dispatcher per 20 drivers. Top DSPs using AI achieve 1:60. With ${drivers} drivers, you could handle ${Math.round(drivers * 3)} drivers on the same headcount — or cut dispatcher costs by 66%.`,
      impact: `${results.dispatcherEquivalent > 1 ? `Eliminate ${Math.round(results.dispatcherEquivalent - 1)} dispatcher positions` : "Reduce dispatcher workload by 66%"}`,
      priority: "HIGH",
    });
  } else {
    recs.push({
      title: "Switch from dashboard-based to voice-activated dispatch",
      description: `Your current software requires someone to sit at a screen. Voice-activated dispatch works hands-free — drivers don't download an app, and your ops manager doesn't need to be at a computer. It runs while everyone sleeps.`,
      impact: `Save ${results.adminHoursPerMonth} hrs/mo in admin`,
      priority: "HIGH",
    });
    recs.push({
      title: "Consolidate your tool stack",
      description: `Most DSPs using dispatch software still run ADP, Hera, ClickUp, and Netradyne separately. That's ${results.adminHoursPerMonth} hours/month of admin work syncing systems. A unified platform eliminates the gap.`,
      impact: `Eliminate cross-system admin work`,
      priority: "HIGH",
    });
  }

  // Fleet-size-specific recommendation
  if (drivers >= 60) {
    recs.push({
      title: "You're at the scale where every hour costs you growth",
      description: `At ${drivers} drivers, you're losing ${results.totalHoursPerMonth} hours/month to ops. That's ${Math.round(results.totalHoursPerMonth / 160 * 100)}% of a full-time employee doing nothing but dispatch admin. Those hours should be spent on route optimization, driver retention, and hitting Fantastic Plus.`,
      impact: `Redirect ${results.totalHoursPerMonth} hrs/mo to growth`,
      priority: "MEDIUM",
    });
  } else if (drivers <= 25) {
    recs.push({
      title: "Automate now before scaling makes it 3x worse",
      description: `At ${drivers} drivers, your ops overhead is manageable but painful. When you grow to 50+ drivers, these same problems triple — and you'll be too busy fighting fires to fix them. DSPs that automate at your size grow 40% faster.`,
      impact: "Prevent ops bottleneck during growth",
      priority: "MEDIUM",
    });
  } else {
    recs.push({
      title: "You're in the danger zone for ops burnout",
      description: `${drivers} drivers is the size where most DSP owners burn out. Too big to do everything yourself, not big enough to justify a full ops team. Automation is the bridge that gets you to 60+ drivers without the breakdown.`,
      impact: `Reclaim ${Math.round(results.totalHoursPerMonth / 4)} hrs/week`,
      priority: "MEDIUM",
    });
  }

  return recs;
}

/* ─── Benchmark data by fleet size ─── */
function getBenchmarks(drivers: number, method: string) {
  let tier: string;
  let avgSchedulingHrs: number;
  let avgAdminHrs: number;
  let avgCalloutCost: number;
  let topSchedulingHrs: number;
  let topAdminHrs: number;
  let topCalloutCost: number;

  if (drivers <= 25) {
    tier = "Small DSP (5-25 drivers)";
    avgSchedulingHrs = 45;
    avgAdminHrs = 30;
    avgCalloutCost = 850;
    topSchedulingHrs = 8;
    topAdminHrs = 5;
    topCalloutCost = 200;
  } else if (drivers <= 50) {
    tier = "Mid-size DSP (26-50 drivers)";
    avgSchedulingHrs = 80;
    avgAdminHrs = 55;
    avgCalloutCost = 1600;
    topSchedulingHrs = 12;
    topAdminHrs = 8;
    topCalloutCost = 350;
  } else {
    tier = "Large DSP (51+ drivers)";
    avgSchedulingHrs = 130;
    avgAdminHrs = 90;
    avgCalloutCost = 2800;
    topSchedulingHrs = 18;
    topAdminHrs = 12;
    topCalloutCost = 500;
  }

  return { tier, avgSchedulingHrs, avgAdminHrs, avgCalloutCost, topSchedulingHrs, topAdminHrs, topCalloutCost };
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
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value, duration]);

  return (
    <span>
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

/* ─── Check icon ─── */
function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" className="flex-shrink-0 mt-0.5">
      <circle cx="11" cy="11" r="11" fill="#1C77FF" />
      <path d="M6.5 11.5l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   DSP OPS DIAGNOSTIC CALCULATOR
   ═══════════════════════════════════════ */
export default function CalculatorPage() {
  const router = useRouter();

  // Calculator inputs
  const [drivers, setDrivers] = useState(30);
  const [routes, setRoutes] = useState(20);
  const [method, setMethod] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SavingsResult | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Lead capture
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const diagnosticRef = useRef<HTMLDivElement>(null);

  function handleCalculate() {
    if (!method) return;
    const r = calculateSavings(drivers, routes, method);
    setResults(r);
    setShowResults(true);
    setUnlocked(false);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) { setError("Please enter your full name."); return; }
    if (!EMAIL_RE.test(email.trim())) { setError("Please enter a valid email address."); return; }
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) { setError("Please enter a 10-digit US phone number."); return; }
    if (isFakePhone(digits)) { setError("Please enter a real US phone number."); return; }

    const cleanPhone = `+1${digits}`;
    setSubmitting(true);

    localStorage.setItem(
      "voiceerp_lead",
      JSON.stringify({ name, email, phone: cleanPhone, drivers, routes, method, savings: results, ts: Date.now() })
    );

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
        name, email, phone: cleanPhone,
        source: "DSP Savings Calculator",
        tags: ["calculator-lead", `drivers-${drivers}`, `method-${method}`],
      }),
    }).catch(() => {});

    setSubmitting(false);
    setUnlocked(true);
    setTimeout(() => {
      diagnosticRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }

  const methodOptions = [
    { value: "manual", label: "Phone Calls & Texts", desc: "Calling/texting drivers manually" },
    { value: "spreadsheet", label: "Spreadsheets", desc: "Google Sheets, Excel, or paper" },
    { value: "dispatcher", label: "Human Dispatcher", desc: "Dedicated person handling dispatch" },
    { value: "software", label: "Dispatch Software", desc: "Using a tool, but not AI-powered" },
  ];

  const methodLabels: Record<string, string> = {
    manual: "Phone Calls & Texts",
    spreadsheet: "Spreadsheets",
    dispatcher: "Human Dispatcher",
    software: "Dispatch Software",
  };

  const recommendations = results ? getRecommendations(drivers, routes, method, results) : [];
  const benchmarks = getBenchmarks(drivers, method);

  return (
    <main className="min-h-screen bg-[#0039D7]">
      {/* ─── NAVIGATION ─── */}
      <nav className="px-4 sm:px-5 md:px-10 py-4 flex items-center justify-between">
        <div className="pl-2 sm:pl-4 md:pl-8">
          <a href="/"><Image src="/voiceerp-logo.svg" alt="VoiceERP" width={90} height={34} priority /></a>
        </div>
        <a href="/" className="font-[family-name:var(--font-dm-mono)] font-light text-white text-sm tracking-wider hover:opacity-80 transition-opacity">
          VOICEERP.COM
        </a>
      </nav>

      {/* ─── HERO ─── */}
      <section className="text-white text-center px-4 sm:px-6 pt-8 sm:pt-10 md:pt-16 pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block font-[family-name:var(--font-dm-mono)] font-light text-[12px] sm:text-[13px] tracking-[0.2em] text-[#AFE2FF] mb-4">
            FREE DSP DIAGNOSTIC
          </span>
          <h1 className="font-display text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] leading-[1.05] mb-4 text-white">
            SEE EXACTLY WHAT MANUAL DISPATCH IS COSTING YOUR DSP
          </h1>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] leading-[25px] sm:leading-[27px] text-white/80 max-w-xl mx-auto">
            Answer 3 questions. Get your annual cost number instantly &mdash; then
            unlock a personalized action plan to cut it.
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
              <label className="text-[14px] text-white/80">How many drivers do you have?</label>
              <span className="font-[family-name:var(--font-dm-mono)] font-light text-[24px] text-white">{drivers}</span>
            </div>
            <input type="range" min={5} max={150} step={5} value={drivers}
              onChange={(e) => setDrivers(Number(e.target.value))}
              className="w-full h-1 bg-white/20 appearance-none cursor-pointer" style={{ accentColor: "white" }} />
            <SliderLabels labels={["5", "50", "100", "150"]} />
          </div>

          {/* Route Count Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-[14px] text-white/80">How many routes per day?</label>
              <span className="font-[family-name:var(--font-dm-mono)] font-light text-[24px] text-white">{routes}</span>
            </div>
            <input type="range" min={5} max={80} step={5} value={routes}
              onChange={(e) => setRoutes(Number(e.target.value))}
              className="w-full h-1 bg-white/20 appearance-none cursor-pointer" style={{ accentColor: "white" }} />
            <SliderLabels labels={["5", "20", "40", "60", "80"]} />
          </div>

          {/* Dispatch Method */}
          <div className="mb-8">
            <label className="text-[14px] text-white/80 block mb-3">How do you currently handle dispatch?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {methodOptions.map((opt) => (
                <button key={opt.value} onClick={() => setMethod(opt.value)}
                  className={`text-left px-4 py-3 border transition-colors ${method === opt.value ? "border-white bg-white/15" : "border-white/20 bg-white/5 hover:border-white/40"}`}>
                  <span className="text-[14px] font-semibold text-white block">{opt.label}</span>
                  <span className="text-[12px] text-white/50">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleCalculate} disabled={!method}
            className="btn-pop w-full bg-white text-[#0039D7] font-semibold text-[16px] px-8 py-3.5 rounded-none hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Show Me What I&apos;m Losing
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         PHASE 1: THE BIG SCARY NUMBER (FREE)
         ═══════════════════════════════════════ */}
      {showResults && results && (
        <section ref={resultsRef} className="text-white px-4 sm:px-6 pb-12 sm:pb-16 md:pb-20">
          <div className="max-w-2xl mx-auto">
            {/* Big number */}
            <div className="text-center mb-6">
              <p className="font-[family-name:var(--font-dm-mono)] font-light text-[13px] tracking-[0.2em] text-[#AFE2FF] mb-2">
                YOUR DSP IS LOSING
              </p>
              <p className="font-display text-[48px] sm:text-[64px] md:text-[80px] leading-[1] text-white mb-2">
                <AnimatedNumber value={results.totalCostPerYear} prefix="$" suffix="/yr" />
              </p>
              <p className="text-[15px] sm:text-[16px] text-white/70">
                That&apos;s <strong className="text-white">{results.totalHoursPerYear.toLocaleString()} hours</strong> and
                the equivalent of <strong className="text-white">{results.dispatcherEquivalent} full-time dispatchers</strong>
              </p>
            </div>

            {/* Teaser — what the diagnostic contains */}
            <div className="bg-[#022EAD] p-6 sm:p-8 mb-6">
              <p className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-1">
                YOUR #1 COST DRAIN
              </p>
              <p className="text-[14px] text-white/60 mb-4">
                {results.biggestDrain} &mdash; <strong className="text-white">{results.biggestDrainHours} hrs/month</strong>
              </p>
              <div className="w-full bg-white/10 h-2 mb-1">
                <div className="bg-white h-2" style={{ width: `${Math.min((results.biggestDrainHours / results.totalHoursPerMonth) * 100, 100)}%` }} />
              </div>
              <p className="text-[12px] text-white/40">
                {Math.round((results.biggestDrainHours / results.totalHoursPerMonth) * 100)}% of your total ops overhead
              </p>
            </div>

            {/* Gate — what's behind the form */}
            {!unlocked && (
              <div ref={formRef} className="bg-[#022EAD] p-6 sm:p-8">
                <h3 className="font-display text-[22px] sm:text-[24px] leading-[1.1] text-white mb-3">
                  UNLOCK YOUR FULL DIAGNOSTIC
                </h3>
                <p className="text-white/70 text-[14px] mb-5">
                  Your personalized action plan for a {drivers}-driver DSP
                  using {methodLabels[method]?.toLowerCase() || method}:
                </p>
                <div className="space-y-2.5 mb-6">
                  {[
                    "Full breakdown by category with priority ranking",
                    `3 specific recommendations for your setup`,
                    `Benchmark comparison — how you stack up against other ${benchmarks.tier}s`,
                    "90-day savings roadmap with concrete next steps",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check />
                      <span className="text-[13px] sm:text-[14px] leading-[18px] text-white/80">{item}</span>
                    </div>
                  ))}
                </div>

                {error && (
                  <p className="text-red-300 text-[14px] mb-4 bg-red-500/20 px-3 py-2">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" required minLength={2} placeholder="Full Name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white placeholder:text-white/50 text-[15px] outline-none focus:border-white transition-colors" />
                  <input type="email" required placeholder="Email Address" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white placeholder:text-white/50 text-[15px] outline-none focus:border-white transition-colors" />
                  <input type="tel" required placeholder="(555) 123-4567" value={phone}
                    onChange={handlePhoneChange} inputMode="numeric" maxLength={14}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white placeholder:text-white/50 text-[15px] outline-none focus:border-white transition-colors" />
                  <button type="submit" disabled={submitting}
                    className="btn-pop w-full bg-white text-[#0039D7] font-semibold text-[16px] px-8 py-3.5 rounded-none hover:bg-gray-100 transition-colors disabled:opacity-60">
                    {submitting ? "Unlocking..." : "Unlock My Full Diagnostic"}
                  </button>
                  <p className="text-white/50 text-[12px] text-center">
                    No spam. Your diagnostic is shown instantly + emailed.
                  </p>
                </form>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
         PHASE 2: FULL DIAGNOSTIC (UNLOCKED)
         ═══════════════════════════════════════ */}
      {unlocked && results && (
        <section ref={diagnosticRef} className="text-white px-4 sm:px-6 pb-12 sm:pb-16 md:pb-20">
          <div className="max-w-2xl mx-auto">

            {/* ── Full Breakdown ── */}
            <div className="mb-8">
              <h3 className="font-display text-[22px] sm:text-[26px] leading-[1.1] text-white mb-2">
                FULL COST BREAKDOWN
              </h3>
              <p className="text-[14px] text-white/60 mb-6">
                Where your {results.totalHoursPerMonth} hours/month are going, ranked by impact
              </p>

              {[
                { label: "Scheduling & shift coordination", hours: results.schedulingHoursPerMonth, cost: results.schedulingHoursPerMonth * 35 },
                { label: "Admin & paperwork", hours: results.adminHoursPerMonth, cost: results.adminHoursPerMonth * 35 },
                { label: "Callout coverage", hours: results.calloutHoursPerMonth, cost: results.calloutCostPerMonth },
                { label: "Netradyne coaching", hours: results.coachingHoursPerMonth, cost: results.coachingHoursPerMonth * 35 },
              ]
                .sort((a, b) => b.hours - a.hours)
                .map((item, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[14px] text-white/90">
                        <span className="font-[family-name:var(--font-dm-mono)] font-light text-[12px] text-[#AFE2FF] mr-2">
                          #{i + 1}
                        </span>
                        {item.label}
                      </span>
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[14px] text-white">
                        {item.hours} hrs &middot; ${item.cost.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-2">
                      <div
                        className="h-2 transition-all duration-700"
                        style={{
                          width: `${(item.hours / results.totalHoursPerMonth) * 100}%`,
                          backgroundColor: i === 0 ? "#FF6B6B" : i === 1 ? "#FFD93D" : "#4ADE80",
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>

            {/* ── Benchmark Comparison ── */}
            <div className="bg-[#022EAD] p-6 sm:p-8 mb-8">
              <h3 className="font-display text-[20px] sm:text-[22px] leading-[1.1] text-white mb-2">
                HOW YOU COMPARE
              </h3>
              <p className="text-[13px] text-white/50 mb-6">{benchmarks.tier} benchmarks</p>

              <div className="space-y-5">
                {[
                  {
                    label: "Scheduling hours/mo",
                    yours: results.schedulingHoursPerMonth,
                    avg: benchmarks.avgSchedulingHrs,
                    top: benchmarks.topSchedulingHrs,
                    unit: "hrs",
                  },
                  {
                    label: "Admin hours/mo",
                    yours: results.adminHoursPerMonth,
                    avg: benchmarks.avgAdminHrs,
                    top: benchmarks.topAdminHrs,
                    unit: "hrs",
                  },
                  {
                    label: "Callout costs/mo",
                    yours: results.calloutCostPerMonth,
                    avg: benchmarks.avgCalloutCost,
                    top: benchmarks.topCalloutCost,
                    unit: "$",
                    prefix: true,
                  },
                ].map((b, i) => (
                  <div key={i}>
                    <p className="text-[13px] text-white/70 mb-2">{b.label}</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center bg-white/5 py-2">
                        <span className="font-[family-name:var(--font-dm-mono)] font-light text-[18px] sm:text-[22px] text-white block">
                          {b.prefix ? "$" : ""}{b.yours.toLocaleString()}{!b.prefix ? b.unit : ""}
                        </span>
                        <span className="text-[11px] text-white/50">You</span>
                      </div>
                      <div className="text-center bg-white/5 py-2">
                        <span className="font-[family-name:var(--font-dm-mono)] font-light text-[18px] sm:text-[22px] text-white/60 block">
                          {b.prefix ? "$" : ""}{b.avg.toLocaleString()}{!b.prefix ? b.unit : ""}
                        </span>
                        <span className="text-[11px] text-white/40">Avg DSP</span>
                      </div>
                      <div className="text-center bg-white/5 py-2">
                        <span className="font-[family-name:var(--font-dm-mono)] font-light text-[18px] sm:text-[22px] text-[#4ADE80] block">
                          {b.prefix ? "$" : ""}{b.top.toLocaleString()}{!b.prefix ? b.unit : ""}
                        </span>
                        <span className="text-[11px] text-[#4ADE80]/60">Top 10%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Personalized Recommendations ── */}
            <div className="mb-8">
              <h3 className="font-display text-[22px] sm:text-[26px] leading-[1.1] text-white mb-2">
                YOUR ACTION PLAN
              </h3>
              <p className="text-[14px] text-white/60 mb-6">
                3 recommendations for a {drivers}-driver DSP using {methodLabels[method]?.toLowerCase()}
              </p>

              {recommendations.map((rec, i) => (
                <div key={i} className="bg-[#022EAD] p-5 sm:p-6 mb-4">
                  <div className="flex items-start gap-3 mb-2">
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 flex-shrink-0 ${rec.priority === "HIGH" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"}`}>
                      {rec.priority}
                    </span>
                    <h4 className="font-display text-[16px] sm:text-[18px] leading-[1.2] text-white">
                      {rec.title.toUpperCase()}
                    </h4>
                  </div>
                  <p className="text-[13px] sm:text-[14px] leading-[20px] text-white/70 mb-3 pl-0">
                    {rec.description}
                  </p>
                  <p className="text-[13px] font-semibold text-[#4ADE80]">
                    Impact: {rec.impact}
                  </p>
                </div>
              ))}
            </div>

            {/* ── 90-Day Roadmap ── */}
            <div className="bg-[#022EAD] p-6 sm:p-8 mb-8">
              <h3 className="font-display text-[20px] sm:text-[22px] leading-[1.1] text-white mb-6">
                YOUR 90-DAY SAVINGS ROADMAP
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-white/15 flex items-center justify-center text-[12px] font-semibold text-white">1</div>
                    <div className="w-px flex-1 bg-white/20 mt-1" />
                  </div>
                  <div className="pb-2">
                    <p className="font-display text-[16px] text-white mb-1">DAYS 1-30: STOP THE BLEEDING</p>
                    <p className="text-[13px] text-white/60 leading-[19px]">
                      Set up automated callout escalation. Build your backup driver roster.
                      Target: eliminate {Math.round(results.calloutHoursPerMonth * 0.7)} hrs/mo of callout overhead.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-white/15 flex items-center justify-center text-[12px] font-semibold text-white">2</div>
                    <div className="w-px flex-1 bg-white/20 mt-1" />
                  </div>
                  <div className="pb-2">
                    <p className="font-display text-[16px] text-white mb-1">DAYS 31-60: AUTOMATE SCHEDULING</p>
                    <p className="text-[13px] text-white/60 leading-[19px]">
                      Replace {method === "manual" ? "phone calls" : method === "spreadsheet" ? "spreadsheets" : "manual processes"} with
                      automated shift confirmation and driver booking.
                      Target: cut scheduling from {results.schedulingHoursPerMonth} to {Math.round(results.schedulingHoursPerMonth * 0.15)} hrs/mo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-[#4ADE80]/20 flex items-center justify-center text-[12px] font-semibold text-[#4ADE80]">3</div>
                  </div>
                  <div>
                    <p className="font-display text-[16px] text-[#4ADE80] mb-1">DAYS 61-90: FULL AUTOPILOT</p>
                    <p className="text-[13px] text-white/60 leading-[19px]">
                      Automated Netradyne coaching, integrated payroll, and 24/7 voice dispatching.
                      Target: {results.totalHoursPerMonth} hrs/mo &rarr; under {Math.round(results.totalHoursPerMonth * 0.1)} hrs/mo.
                      Annual savings: <strong className="text-[#4ADE80]">${(results.totalCostPerYear - drivers * 12 * 12).toLocaleString()}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Final CTA ── */}
            <div className="bg-[#022EAD] p-6 sm:p-8 text-center">
              <h3 className="font-display text-[22px] sm:text-[26px] leading-[1.1] text-white mb-3">
                READY TO START YOUR 90-DAY ROADMAP?
              </h3>
              <p className="text-[14px] text-white/60 mb-6 max-w-md mx-auto">
                See Viki run with YOUR routes and YOUR drivers in a 15-minute live demo.
                No pitch &mdash; just proof.
              </p>
              <a href="/schedule"
                className="btn-pop inline-block bg-white text-[#0039D7] font-semibold text-[15px] sm:text-[16px] px-8 py-3 rounded-none">
                Schedule a Demo
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ─── SOCIAL PROOF (shown when no results yet) ─── */}
      {!showResults && (
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
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[40px] leading-[36px] text-white">60hrs</span>
                <span className="text-white text-[12px] sm:text-[14px] mt-2">saved on scheduling/mo</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[40px] leading-[36px] text-white">1:60</span>
                <span className="text-white text-[12px] sm:text-[14px] mt-2">dispatcher-to-driver ratio</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[40px] leading-[36px] text-white">30%</span>
                <span className="text-white text-[12px] sm:text-[14px] mt-2">fewer safety infractions</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#002a9e] text-white px-4 sm:px-6 py-6 pb-20 sm:pb-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between text-xs">
          <span>&copy; 2025, Phoenicia Labs, Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="https://voiceerp.com/privacy-policy" className="underline hover:opacity-80 transition-opacity">Privacy Policy</a>
            <a href="https://voiceerp.com/terms" className="underline hover:opacity-80 transition-opacity">Terms of Service</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/company/voiceerp/" aria-label="LinkedIn" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="https://www.instagram.com/voiceerp/reels/" aria-label="Instagram" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
            <a href="https://www.facebook.com/voiceerp" aria-label="Facebook" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
