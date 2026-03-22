"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ─── Fleet size presets ─── */
const FLEET_OPTIONS = [
  { label: "20 drivers", drivers: 20, callouts: 8, monthlyCost: 696, annualCost: 8352, hoursLost: 6 },
  { label: "40 drivers", drivers: 40, callouts: 16, monthlyCost: 1392, annualCost: 16704, hoursLost: 12 },
  { label: "60 drivers", drivers: 60, callouts: 24, monthlyCost: 2088, annualCost: 25056, hoursLost: 18 },
];

/* ─── Section IDs for TOC ─── */
const SECTIONS = [
  { id: "cost", label: "THE REAL COST", number: "01" },
  { id: "systems", label: "3 COVERAGE SYSTEMS", number: "02" },
  { id: "roster", label: "ROSTER TEMPLATE", number: "03" },
  { id: "flowchart", label: "ESCALATION FLOW", number: "04" },
  { id: "roadmap", label: "4-WEEK ROADMAP", number: "05" },
];

/* ─── Reusable checkmark ─── */
function Check({ color = "#1C77FF" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" className="flex-shrink-0 mt-0.5">
      <circle cx="11" cy="11" r="11" fill={color} />
      <path d="M6.5 11.5l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Green checkmark variant ─── */
function GreenCheck() {
  return <Check color="#4ADE80" />;
}

/* ─── Section heading ─── */
function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-8 sm:mb-10">
      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[12px] sm:text-[13px] tracking-[0.2em] text-[#AFE2FF] mb-2 block">
        SECTION {number}
      </span>
      <h2 className="font-display text-[24px] sm:text-[28px] md:text-[36px] lg:text-[42px] leading-[1.1] text-white">
        {title}
      </h2>
    </div>
  );
}

/* ═══════════════════════════════════════
   THE 5AM CALLOUT PLAYBOOK — CONTENT
   ═══════════════════════════════════════ */
export default function PlaybookContentPage() {
  const [fleetIndex, setFleetIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("cost");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const fleet = FLEET_OPTIONS[fleetIndex];

  /* ─── Scroll-spy via IntersectionObserver ─── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <main className="min-h-screen bg-[#0039D7]">
      {/* ─── NAVIGATION ─── */}
      <nav className="px-4 sm:px-5 md:px-10 py-4 flex items-center justify-between">
        <div className="pl-2 sm:pl-4 md:pl-8">
          <a href="/">
            <Image src="/voiceerp-logo.svg" alt="VoiceERP" width={90} height={34} priority />
          </a>
        </div>
        <a
          href="/schedule"
          className="font-[family-name:var(--font-dm-mono)] font-light text-white text-sm tracking-wider hover:opacity-80 transition-opacity"
        >
          BOOK A DEMO
        </a>
      </nav>

      {/* ─── HERO ─── */}
      <section className="text-white px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16 pb-10 sm:pb-14 md:pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block font-[family-name:var(--font-dm-mono)] font-light text-[12px] sm:text-[13px] tracking-[0.2em] text-[#AFE2FF] mb-4">
            THE COMPLETE GUIDE
          </span>
          <h1 className="font-display text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] leading-[1.05] mb-4 text-white">
            THE 5AM CALLOUT PLAYBOOK
          </h1>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] leading-[25px] sm:leading-[27px] text-white/80 max-w-2xl mx-auto mb-6">
            Everything you need to stop bleeding time and money every time a driver calls out.
            Five sections. Zero fluff. Ready to implement today.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] sm:text-[12px] tracking-[0.15em] text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 transition-colors"
              >
                {s.number} {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 flex gap-8">
        {/* Sticky TOC — desktop only */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-8">
            <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.2em] text-white/40 mb-4 block">
              CONTENTS
            </span>
            <div className="space-y-1">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block text-[13px] py-1.5 pl-3 border-l-2 transition-colors ${
                    activeSection === s.id
                      ? "border-[#AFE2FF] text-white"
                      : "border-white/10 text-white/40 hover:text-white/70"
                  }`}
                >
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] mr-1.5">
                    {s.number}
                  </span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Content column */}
        <div className="flex-1 min-w-0">

          {/* ═══════════════════════════════════
             SECTION 1: THE REAL COST OF CALLOUTS
             ═══════════════════════════════════ */}
          <section
            id="cost"
            ref={(el) => { sectionRefs.current.cost = el; }}
            className="mb-16 sm:mb-24 scroll-mt-8"
          >
            <SectionHeading number="01" title="THE REAL COST OF CALLOUTS" />

            {/* Visual timeline */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-8">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-2">
                ANATOMY OF A SINGLE CALLOUT
              </h3>
              <p className="text-[14px] text-white/60 mb-6">
                Here&apos;s what actually happens when your phone buzzes at 4:47 AM.
              </p>

              <div className="space-y-0">
                {[
                  { time: "4:47 AM", event: "Phone buzzes. Driver can\u2019t make it.", minutes: 0, color: "#FF6B6B" },
                  { time: "4:49 AM", event: "You wake up, read the text, process it.", minutes: 2, color: "#FFD93D" },
                  { time: "4:52 AM", event: "Pull up your contacts. Who\u2019s available?", minutes: 5, color: "#FFD93D" },
                  { time: "4:55 AM", event: "Call Driver B. No answer.", minutes: 8, color: "#FF6B6B" },
                  { time: "4:58 AM", event: "Call Driver C. \u201CI can\u2019t today.\u201D", minutes: 11, color: "#FF6B6B" },
                  { time: "5:03 AM", event: "Call Driver D. \u201CYeah, I can cover.\u201D", minutes: 16, color: "#4ADE80" },
                  { time: "5:08 AM", event: "Brief them on the route, send load-out details.", minutes: 21, color: "#FFD93D" },
                  { time: "5:15 AM", event: "Update schedule, notify station, log the change.", minutes: 28, color: "#FFD93D" },
                  { time: "5:32 AM", event: "Finally done. Now you\u2019re wide awake and behind.", minutes: 45, color: "#FF6B6B" },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 py-3 border-b border-white/10 last:border-0">
                    <span
                      className="font-[family-name:var(--font-dm-mono)] font-light text-[13px] sm:text-[14px] w-[70px] sm:w-[80px] flex-shrink-0"
                      style={{ color: step.color }}
                    >
                      {step.time}
                    </span>
                    <div className="flex-1">
                      <span className="text-[14px] sm:text-[15px] text-white/90">{step.event}</span>
                    </div>
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[12px] text-white/40 flex-shrink-0">
                      +{step.minutes}min
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
                <span className="text-[14px] text-white/60">Total time burned:</span>
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[24px] sm:text-[28px] text-white">
                  45 min
                </span>
              </div>
            </div>

            {/* Hidden costs breakdown */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-8">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-6">
                THE HIDDEN COSTS YOU&apos;RE NOT COUNTING
              </h3>

              <div className="space-y-4 mb-6">
                {[
                  { label: "Direct labor (45 min @ your rate)", amount: "$26", desc: "Your time finding and briefing backup" },
                  { label: "Overtime premium", amount: "$18", desc: "Backup driver gets OT for short-notice shift" },
                  { label: "Route disruption", amount: "$15", desc: "Late start \u2192 missed delivery windows \u2192 scorecard hit" },
                  { label: "Scorecard impact", amount: "$12", desc: "Delivered Not Received, concessions, customer complaints" },
                  { label: "Administrative overhead", amount: "$9", desc: "Schedule updates, station comms, payroll adjustments" },
                  { label: "Stress & sleep cost", amount: "$7", desc: "Decision fatigue, compounding through the day" },
                ].map((cost, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 py-2 border-b border-white/10 last:border-0">
                    <div className="flex-1">
                      <span className="text-[14px] sm:text-[15px] text-white">{cost.label}</span>
                      <span className="block text-[12px] sm:text-[13px] text-white/50 mt-0.5">{cost.desc}</span>
                    </div>
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[16px] sm:text-[18px] text-white flex-shrink-0">
                      {cost.amount}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/30 flex items-center justify-between">
                <span className="text-[15px] sm:text-[16px] text-white font-semibold">Total per incident:</span>
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[32px] text-white">
                  $87
                </span>
              </div>
            </div>

            {/* Fleet-size toggle */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-8">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-2">
                WHAT THIS COSTS YOUR FLEET
              </h3>
              <p className="text-[14px] text-white/60 mb-6">
                Select your fleet size to see the annual impact.
              </p>

              {/* Toggle buttons */}
              <div className="flex gap-0 mb-8">
                {FLEET_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setFleetIndex(i)}
                    className={`flex-1 py-3 text-[14px] sm:text-[15px] font-semibold transition-colors ${
                      fleetIndex === i
                        ? "bg-white text-[#0039D7]"
                        : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Dynamic numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-6">
                <div className="text-center">
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[32px] sm:text-[40px] leading-[36px] text-white block">
                    {fleet.callouts}
                  </span>
                  <span className="text-[13px] sm:text-[14px] text-white/60 mt-2 block">
                    callouts / month
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[32px] sm:text-[40px] leading-[36px] text-white block">
                    ${fleet.monthlyCost.toLocaleString()}
                  </span>
                  <span className="text-[13px] sm:text-[14px] text-white/60 mt-2 block">
                    hidden cost / month
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[32px] sm:text-[40px] leading-[36px] text-white block">
                    {fleet.hoursLost}h
                  </span>
                  <span className="text-[13px] sm:text-[14px] text-white/60 mt-2 block">
                    hours lost / month
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 text-center">
                <span className="text-[14px] text-white/60">Annual cost of callouts:</span>
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[36px] sm:text-[44px] text-white block mt-1">
                  ${fleet.annualCost.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Key insight callout */}
            <div className="border-l-4 border-[#FFD93D] bg-[#022EAD] p-5 sm:p-6">
              <p className="text-[15px] sm:text-[16px] leading-[24px] text-white/90">
                <strong className="text-[#FFD93D]">Key insight:</strong> Most DSP owners only count the
                45 minutes they spend on the phone. They never account for overtime premiums, route
                disruption, scorecard hits, or the compounding effect on their own decision-making
                for the rest of the day. When you add it all up, a single callout costs{" "}
                <strong className="text-white">3&ndash;4x</strong> what you think it does.
              </p>
            </div>
          </section>

          {/* ═══════════════════════════════════
             SECTION 2: 3 COVERAGE SYSTEMS
             ═══════════════════════════════════ */}
          <section
            id="systems"
            ref={(el) => { sectionRefs.current.systems = el; }}
            className="mb-16 sm:mb-24 scroll-mt-8"
          >
            <SectionHeading number="02" title="3 COVERAGE SYSTEMS THAT ACTUALLY WORK" />

            <p className="text-[15px] sm:text-[16px] leading-[25px] text-white/70 mb-10">
              Every DSP that has solved the callout problem uses one (or a combination) of these
              three systems. They&apos;re ranked from simplest to most advanced.
            </p>

            {/* System 1 */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[32px] text-[#AFE2FF] leading-none">
                  01
                </span>
                <div>
                  <h3 className="font-display text-[20px] sm:text-[22px] leading-[1.1] text-white">
                    TIERED BACKUP ROSTER
                  </h3>
                  <div className="flex gap-4 mt-2">
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#4ADE80]">COST: LOW</span>
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#FFD93D]">SPEED: MEDIUM</span>
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#4ADE80]">RELIABILITY: HIGH</span>
                  </div>
                </div>
              </div>

              <p className="text-[14px] sm:text-[15px] leading-[22px] text-white/70 mb-6">
                A pre-ranked list of backup drivers organized by tier. When someone calls out,
                you work down the list in order. Tier 1 drivers are your most reliable &mdash;
                they&apos;ve agreed to be first-call. Tier 2 are available but need more notice.
                Tier 3 is your emergency bench.
              </p>

              <h4 className="font-display text-[16px] text-white mb-3">HOW TO BUILD IT</h4>
              <div className="space-y-3 mb-6">
                {[
                  "Pull your top 8\u201310 most reliable drivers from attendance data",
                  "Call each one individually \u2014 ask if they\u2019d be willing to be first-call backup",
                  "Record their preferred routes, shift times, and days they\u2019re available",
                  "Rank them into 3 tiers based on response speed and route flexibility",
                  "Print the roster, post it at dispatch, and set a weekly 15-min review",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[13px] text-[#AFE2FF] mt-0.5 w-4 flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-[14px] sm:text-[15px] text-white/80">{step}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#4ADE80] mb-2 block">PROS</span>
                  <ul className="space-y-1.5">
                    {["Free to implement", "Works immediately", "Drivers appreciate being asked", "Builds team accountability"].map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] sm:text-[14px] text-white/70">
                        <span className="text-[#4ADE80] mt-0.5">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#FF6B6B] mb-2 block">CONS</span>
                  <ul className="space-y-1.5">
                    {["Still requires manual phone calls", "Goes stale without weekly updates", "Doesn\u2019t self-activate at 5AM", "Single point of failure (you)"].map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] sm:text-[14px] text-white/70">
                        <span className="text-[#FF6B6B] mt-0.5">&ndash;</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* System 2 */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[32px] text-[#AFE2FF] leading-none">
                  02
                </span>
                <div>
                  <h3 className="font-display text-[20px] sm:text-[22px] leading-[1.1] text-white">
                    THE FLEX POOL
                  </h3>
                  <div className="flex gap-4 mt-2">
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#FFD93D]">COST: MEDIUM</span>
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#4ADE80]">SPEED: HIGH</span>
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#4ADE80]">RELIABILITY: HIGH</span>
                  </div>
                </div>
              </div>

              <p className="text-[14px] sm:text-[15px] leading-[22px] text-white/70 mb-6">
                A group of 4&ndash;6 part-time or on-call drivers who are specifically hired and
                trained for coverage shifts. They don&apos;t have assigned routes &mdash; they&apos;re
                your rapid-response team. When a callout hits, you blast the flex pool with a
                single text. First to reply gets the shift.
              </p>

              <h4 className="font-display text-[16px] text-white mb-3">HOW TO BUILD IT</h4>
              <div className="space-y-3 mb-6">
                {[
                  "Identify 4\u20136 drivers who want extra hours but don\u2019t need full-time routes",
                  "Train them on your 5\u20138 most common routes (cross-training is essential)",
                  "Create a group text thread or channel specifically for flex callouts",
                  "Set clear rules: first to reply gets the shift, must respond within 15 minutes",
                  "Pay a small premium ($2\u20133/hr above base) to incentivize rapid response",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[13px] text-[#AFE2FF] mt-0.5 w-4 flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-[14px] sm:text-[15px] text-white/80">{step}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#4ADE80] mb-2 block">PROS</span>
                  <ul className="space-y-1.5">
                    {["Much faster response than roster calls", "Removes you from the call chain", "Drivers self-select based on availability", "Scales well as fleet grows"].map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] sm:text-[14px] text-white/70">
                        <span className="text-[#4ADE80] mt-0.5">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#FF6B6B] mb-2 block">CONS</span>
                  <ul className="space-y-1.5">
                    {["Requires hiring specifically for flex roles", "Cross-training takes 2\u20133 weeks", "Premium pay adds to labor costs", "Still manual blast at 5AM (unless automated)"].map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] sm:text-[14px] text-white/70">
                        <span className="text-[#FF6B6B] mt-0.5">&ndash;</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* System 3 */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="font-[family-name:var(--font-dm-mono)] font-light text-[28px] sm:text-[32px] text-[#AFE2FF] leading-none">
                  03
                </span>
                <div>
                  <h3 className="font-display text-[20px] sm:text-[22px] leading-[1.1] text-white">
                    AI-POWERED AUTO-DISPATCH
                  </h3>
                  <div className="flex gap-4 mt-2">
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#FFD93D]">COST: HIGHER</span>
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#4ADE80]">SPEED: FASTEST</span>
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#4ADE80]">RELIABILITY: HIGHEST</span>
                  </div>
                </div>
              </div>

              <p className="text-[14px] sm:text-[15px] leading-[22px] text-white/70 mb-6">
                An AI system that detects callouts automatically, evaluates driver availability
                and route compatibility in seconds, and dispatches the best-fit backup &mdash;
                all before you wake up. It calls drivers, confirms acceptance, briefs them on the
                route, and updates your schedule. You get a notification that it&apos;s handled.
              </p>

              <h4 className="font-display text-[16px] text-white mb-3">HOW IT WORKS</h4>
              <div className="space-y-3 mb-6">
                {[
                  "Driver sends a callout text at 4:47 AM \u2014 AI detects and classifies it instantly",
                  "System checks driver availability, route compatibility, and proximity in <5 seconds",
                  "AI calls the best-fit backup driver, briefs them on the route via voice",
                  "Once confirmed, schedule auto-updates and station is notified",
                  "You wake up to a notification: \u201CRoute DXL4 covered by Driver D. No action needed.\u201D",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[13px] text-[#AFE2FF] mt-0.5 w-4 flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-[14px] sm:text-[15px] text-white/80">{step}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#4ADE80] mb-2 block">PROS</span>
                  <ul className="space-y-1.5">
                    {["Zero owner involvement at 5AM", "Fastest possible response time", "Handles multiple callouts simultaneously", "Gets smarter over time with data"].map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] sm:text-[14px] text-white/70">
                        <span className="text-[#4ADE80] mt-0.5">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#FF6B6B] mb-2 block">CONS</span>
                  <ul className="space-y-1.5">
                    {["Monthly software cost", "Requires initial setup and driver onboarding", "Need to trust the system (takes 1\u20132 weeks)", "Not available from most dispatch tools"].map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] sm:text-[14px] text-white/70">
                        <span className="text-[#FF6B6B] mt-0.5">&ndash;</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Comparison grid */}
            <div className="bg-[#022EAD] p-5 sm:p-8">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-6">
                SIDE-BY-SIDE COMPARISON
              </h3>

              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-[13px] sm:text-[14px]">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 pr-4 text-white/50 font-normal font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.1em]">DIMENSION</th>
                      <th className="text-center py-3 px-2 text-white/50 font-normal font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.1em]">ROSTER</th>
                      <th className="text-center py-3 px-2 text-white/50 font-normal font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.1em]">FLEX POOL</th>
                      <th className="text-center py-3 px-2 text-white/50 font-normal font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.1em]">AI DISPATCH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { dim: "Setup cost", roster: "$0", flex: "$500\u2013$1K", ai: "$200\u2013$500/mo" },
                      { dim: "Time to implement", roster: "1 day", flex: "2\u20133 weeks", ai: "1 week" },
                      { dim: "Response speed", roster: "15\u201330 min", flex: "5\u201315 min", ai: "<2 min" },
                      { dim: "Owner involvement", roster: "High", flex: "Medium", ai: "None" },
                      { dim: "Works at 4:47 AM", roster: "If you\u2019re awake", flex: "If someone replies", ai: "Always" },
                      { dim: "Scalability", roster: "Low", flex: "Medium", ai: "High" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="py-3 pr-4 text-white/80">{row.dim}</td>
                        <td className="py-3 px-2 text-center text-white/60">{row.roster}</td>
                        <td className="py-3 px-2 text-center text-white/60">{row.flex}</td>
                        <td className="py-3 px-2 text-center text-white/60">{row.ai}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════
             SECTION 3: BACKUP ROSTER TEMPLATE
             ═══════════════════════════════════ */}
          <section
            id="roster"
            ref={(el) => { sectionRefs.current.roster = el; }}
            className="mb-16 sm:mb-24 scroll-mt-8"
          >
            <SectionHeading number="03" title="BACKUP ROSTER TEMPLATE" />

            <p className="text-[15px] sm:text-[16px] leading-[25px] text-white/70 mb-8">
              Here are the actual tables you need. Screenshot them, copy them into a spreadsheet,
              or print them out. The key is having them{" "}
              <strong className="text-white">ready before 4:47 AM</strong>.
            </p>

            {/* Table 1: Backup driver roster */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-6">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-2">
                BACKUP DRIVER ROSTER
              </h3>
              <p className="text-[13px] text-white/50 mb-5">Fill in with your own driver data</p>

              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-[12px] sm:text-[13px] min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/20">
                      {["NAME", "PHONE", "TIER", "PREFERRED ROUTES", "AVAILABILITY", "LAST UPDATED"].map((h) => (
                        <th key={h} className="text-left py-2.5 pr-3 text-white/50 font-normal font-[family-name:var(--font-dm-mono)] text-[10px] tracking-[0.1em]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Driver A", phone: "(___) ___-____", tier: "1", routes: "DXL1, DXL4, DXL7", avail: "Mon\u2013Fri", updated: "___/___" },
                      { name: "Driver B", phone: "(___) ___-____", tier: "1", routes: "DXL2, DXL5", avail: "Mon\u2013Sat", updated: "___/___" },
                      { name: "Driver C", phone: "(___) ___-____", tier: "2", routes: "DXL1, DXL3, DXL8", avail: "Tue\u2013Fri", updated: "___/___" },
                      { name: "Driver D", phone: "(___) ___-____", tier: "2", routes: "DXL4, DXL6", avail: "Mon\u2013Fri", updated: "___/___" },
                      { name: "Driver E", phone: "(___) ___-____", tier: "3", routes: "Any", avail: "As needed", updated: "___/___" },
                      { name: "Driver F", phone: "(___) ___-____", tier: "3", routes: "Any", avail: "Weekends", updated: "___/___" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="py-2.5 pr-3 text-white/80">{row.name}</td>
                        <td className="py-2.5 pr-3 text-white/40 font-[family-name:var(--font-dm-mono)]">{row.phone}</td>
                        <td className="py-2.5 pr-3">
                          <span className={`font-[family-name:var(--font-dm-mono)] font-light text-[12px] px-2 py-0.5 ${
                            row.tier === "1" ? "bg-[#4ADE80]/20 text-[#4ADE80]"
                            : row.tier === "2" ? "bg-[#FFD93D]/20 text-[#FFD93D]"
                            : "bg-white/10 text-white/50"
                          }`}>
                            T{row.tier}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 text-white/60">{row.routes}</td>
                        <td className="py-2.5 pr-3 text-white/60">{row.avail}</td>
                        <td className="py-2.5 text-white/40 font-[family-name:var(--font-dm-mono)]">{row.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Route-driver compatibility matrix */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-6">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-2">
                ROUTE-DRIVER COMPATIBILITY MATRIX
              </h3>
              <p className="text-[13px] text-white/50 mb-5">
                Mark which backup drivers can cover which routes
              </p>

              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-[12px] sm:text-[13px] min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-2.5 pr-3 text-white/50 font-normal font-[family-name:var(--font-dm-mono)] text-[10px] tracking-[0.1em]">ROUTE</th>
                      {["A", "B", "C", "D", "E", "F"].map((d) => (
                        <th key={d} className="text-center py-2.5 px-2 text-white/50 font-normal font-[family-name:var(--font-dm-mono)] text-[10px] tracking-[0.1em]">
                          DRV {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { route: "DXL1", drivers: [true, false, true, false, true, true] },
                      { route: "DXL2", drivers: [false, true, false, false, true, true] },
                      { route: "DXL3", drivers: [false, false, true, false, true, true] },
                      { route: "DXL4", drivers: [true, false, false, true, true, true] },
                      { route: "DXL5", drivers: [false, true, false, false, true, true] },
                      { route: "DXL6", drivers: [false, false, false, true, true, true] },
                      { route: "DXL7", drivers: [true, false, false, false, true, true] },
                      { route: "DXL8", drivers: [false, false, true, false, true, true] },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="py-2.5 pr-3 text-white/80 font-[family-name:var(--font-dm-mono)]">{row.route}</td>
                        {row.drivers.map((can, j) => (
                          <td key={j} className="py-2.5 px-2 text-center">
                            {can ? (
                              <span className="text-[#4ADE80]">&check;</span>
                            ) : (
                              <span className="text-white/15">&mdash;</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 3: Weekly availability grid */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-8">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-2">
                WEEKLY AVAILABILITY GRID
              </h3>
              <p className="text-[13px] text-white/50 mb-5">
                Track which backup drivers are available each day this week
              </p>

              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-[12px] sm:text-[13px] min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-2.5 pr-3 text-white/50 font-normal font-[family-name:var(--font-dm-mono)] text-[10px] tracking-[0.1em]">DRIVER</th>
                      {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                        <th key={d} className="text-center py-2.5 px-1 text-white/50 font-normal font-[family-name:var(--font-dm-mono)] text-[10px] tracking-[0.1em]">
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Driver A", days: [true, true, true, true, true, false, false] },
                      { name: "Driver B", days: [true, true, true, true, true, true, false] },
                      { name: "Driver C", days: [false, true, true, true, true, false, false] },
                      { name: "Driver D", days: [true, true, true, true, true, false, false] },
                      { name: "Driver E", days: [true, true, true, true, true, true, true] },
                      { name: "Driver F", days: [false, false, false, false, false, true, true] },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="py-2.5 pr-3 text-white/80">{row.name}</td>
                        {row.days.map((avail, j) => (
                          <td key={j} className="py-2.5 px-1 text-center">
                            {avail ? (
                              <span className="text-[#4ADE80]">&check;</span>
                            ) : (
                              <span className="text-white/15">&mdash;</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Setup steps */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-6">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-6">
                5 STEPS TO SET IT UP TODAY
              </h3>

              <div className="space-y-5">
                {[
                  { step: "1", title: "Pull your top performers", desc: "Look at attendance data from the last 90 days. Who has the fewest callouts, best on-time rate, and most route flexibility?" },
                  { step: "2", title: "Have the conversation", desc: "Call each driver individually. Don\u2019t mass-text. Ask: \u201CWould you be willing to be our first-call backup if someone calls out? I\u2019d really appreciate it.\u201D" },
                  { step: "3", title: "Record preferences", desc: "Which routes do they know? Which days are they available? Any routes they refuse to do? Write it all down." },
                  { step: "4", title: "Rank into tiers", desc: "Tier 1: Most reliable, fastest to respond, flexible on routes. Tier 2: Reliable but need more notice. Tier 3: Emergency-only, any route." },
                  { step: "5", title: "Print and review weekly", desc: "Print the roster, post it where you dispatch. Every Monday, spend 15 minutes confirming availability for the week." },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[24px] sm:text-[28px] text-[#AFE2FF]/40 leading-none flex-shrink-0 w-8">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="text-[15px] sm:text-[16px] text-white font-semibold mb-1">{s.title}</h4>
                      <p className="text-[13px] sm:text-[14px] text-white/60 leading-[20px]">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning box */}
            <div className="border-l-4 border-[#FF6B6B] bg-[#022EAD] p-5 sm:p-6">
              <p className="text-[15px] sm:text-[16px] leading-[24px] text-white/90">
                <strong className="text-[#FF6B6B]">The #1 reason rosters fail:</strong> They go stale.
                You build it once and never update it. Drivers change availability, quit, or get
                reassigned &mdash; and you&apos;re back to scrolling contacts at 5AM. Set a{" "}
                <strong className="text-white">15-minute weekly review</strong> every Monday. Non-negotiable.
              </p>
            </div>
          </section>

          {/* ═══════════════════════════════════
             SECTION 4: ESCALATION FLOWCHART
             ═══════════════════════════════════ */}
          <section
            id="flowchart"
            ref={(el) => { sectionRefs.current.flowchart = el; }}
            className="mb-16 sm:mb-24 scroll-mt-8"
          >
            <SectionHeading number="04" title="ESCALATION FLOWCHART" />

            <p className="text-[15px] sm:text-[16px] leading-[25px] text-white/70 mb-8">
              When a callout comes in, you need a decision tree &mdash; not a gut feeling.
              This flowchart tells you exactly what to do based on how much time you have.
            </p>

            {/* CSS flowchart */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-8">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-6">
                CALLOUT RESPONSE DECISION TREE
              </h3>

              <div className="space-y-4">
                {/* Start node */}
                <div className="flex justify-center">
                  <div className="bg-[#AFE2FF]/20 border border-[#AFE2FF]/40 px-5 py-3 text-center">
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#AFE2FF]">START</span>
                    <span className="block text-[14px] text-white mt-1">Callout received</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-6 bg-white/30" />
                </div>

                {/* Decision: How much time? */}
                <div className="flex justify-center">
                  <div className="bg-[#FFD93D]/15 border border-[#FFD93D]/40 px-5 py-3 text-center max-w-xs">
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#FFD93D]">DECISION</span>
                    <span className="block text-[14px] text-white mt-1">How much time before shift start?</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-4 bg-white/30" />
                </div>

                {/* Branches */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left branch: >2 hours */}
                  <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 px-4 py-3 text-center">
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[13px] text-[#4ADE80]">&gt; 2 HOURS</span>
                    </div>
                    <div className="flex justify-center"><div className="w-px h-3 bg-white/20" /></div>
                    <div className="bg-white/5 border border-white/10 px-4 py-3">
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.1em] text-[#AFE2FF] block mb-1">STEP 1</span>
                      <span className="text-[13px] text-white/80">Call Tier 1 backup (wait 5 min for response)</span>
                    </div>
                    <div className="flex justify-center"><div className="w-px h-3 bg-white/20" /></div>
                    <div className="bg-white/5 border border-white/10 px-4 py-3">
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.1em] text-[#AFE2FF] block mb-1">STEP 2</span>
                      <span className="text-[13px] text-white/80">No answer? Call Tier 2 (wait 5 min)</span>
                    </div>
                    <div className="flex justify-center"><div className="w-px h-3 bg-white/20" /></div>
                    <div className="bg-white/5 border border-white/10 px-4 py-3">
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.1em] text-[#AFE2FF] block mb-1">STEP 3</span>
                      <span className="text-[13px] text-white/80">Still no? Move to Tier 3 or Flex Pool</span>
                    </div>
                    <div className="flex justify-center"><div className="w-px h-3 bg-white/20" /></div>
                    <div className="bg-[#4ADE80]/15 border border-[#4ADE80]/30 px-4 py-3 text-center">
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.1em] text-[#4ADE80]">COVERED</span>
                    </div>
                  </div>

                  {/* Right branch: <2 hours */}
                  <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 px-4 py-3 text-center">
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[13px] text-[#FF6B6B]">&lt; 2 HOURS</span>
                    </div>
                    <div className="flex justify-center"><div className="w-px h-3 bg-white/20" /></div>
                    <div className="bg-white/5 border border-white/10 px-4 py-3">
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.1em] text-[#AFE2FF] block mb-1">STEP 1</span>
                      <span className="text-[13px] text-white/80">Blast Flex Pool text immediately</span>
                    </div>
                    <div className="flex justify-center"><div className="w-px h-3 bg-white/20" /></div>
                    <div className="bg-white/5 border border-white/10 px-4 py-3">
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.1em] text-[#AFE2FF] block mb-1">STEP 2</span>
                      <span className="text-[13px] text-white/80">Simultaneously call Tier 1 backup</span>
                    </div>
                    <div className="flex justify-center"><div className="w-px h-3 bg-white/20" /></div>
                    <div className="bg-[#FFD93D]/15 border border-[#FFD93D]/30 px-4 py-3">
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.1em] text-[#FFD93D] block mb-1">NO RESPONSE IN 10 MIN?</span>
                      <span className="text-[13px] text-white/80">Emergency protocol: call station, split route across 2 drivers</span>
                    </div>
                    <div className="flex justify-center"><div className="w-px h-3 bg-white/20" /></div>
                    <div className="bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 px-4 py-3 text-center">
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.1em] text-[#FF6B6B]">ESCALATE TO STATION</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication templates */}
            <div className="bg-[#022EAD] p-5 sm:p-8 mb-6">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-6">
                COMMUNICATION TEMPLATES
              </h3>
              <p className="text-[13px] text-white/50 mb-6">
                Copy these messages. Don&apos;t wing it at 5AM.
              </p>

              <div className="space-y-6">
                {/* Template 1 */}
                <div>
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#AFE2FF] mb-2 block">
                    INITIAL BACKUP CALL SCRIPT
                  </span>
                  <div className="bg-white/5 border border-white/10 p-4">
                    <p className="text-[14px] text-white/80 leading-[22px] italic">
                      &ldquo;Hey [Name], it&apos;s [Your Name]. I&apos;ve got a callout on route [Route ID]
                      starting at [Time]. You&apos;re my first call &mdash; can you cover today?
                      I&apos;ll send you the load-out as soon as you confirm.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Template 2 */}
                <div>
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#AFE2FF] mb-2 block">
                    FLEX POOL BLAST TEXT
                  </span>
                  <div className="bg-white/5 border border-white/10 p-4">
                    <p className="text-[14px] text-white/80 leading-[22px] italic">
                      &ldquo;OPEN SHIFT: Route [Route ID], [# packages] packages, start time [Time]
                      from [Station]. First to reply YES gets it. OT rate applies.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Template 3 */}
                <div>
                  <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#AFE2FF] mb-2 block">
                    EMERGENCY ESCALATION (TO STATION)
                  </span>
                  <div className="bg-white/5 border border-white/10 p-4">
                    <p className="text-[14px] text-white/80 leading-[22px] italic">
                      &ldquo;This is [Your Name] with [DSP Name]. I have an uncovered route [Route ID]
                      starting at [Time]. I&apos;ve exhausted my backup roster and flex pool.
                      Requesting route split or rescue support. I have [X] drivers who can
                      absorb partial volume.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timing rules */}
            <div className="bg-[#022EAD] p-5 sm:p-8">
              <h3 className="font-display text-[18px] sm:text-[20px] leading-[1.1] text-white mb-6">
                TIMING RULES QUICK REFERENCE
              </h3>

              <div className="space-y-3">
                {[
                  { time: "> 4 hours", action: "Standard tier cascade. You have time. Work the roster top to bottom.", color: "#4ADE80" },
                  { time: "2\u20134 hours", action: "Accelerated cascade. Call Tier 1 + text Flex Pool simultaneously.", color: "#4ADE80" },
                  { time: "< 2 hours", action: "Emergency mode. Blast Flex Pool + call Tier 1 + prep route split.", color: "#FFD93D" },
                  { time: "< 45 min", action: "Station escalation. Call station, request rescue/route reduction.", color: "#FF6B6B" },
                  { time: "No-show", action: "Immediate station call. Document everything. Follow up with driver.", color: "#FF6B6B" },
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-4 py-3 border-b border-white/10 last:border-0">
                    <span
                      className="font-[family-name:var(--font-dm-mono)] font-light text-[14px] w-[90px] flex-shrink-0"
                      style={{ color: rule.color }}
                    >
                      {rule.time}
                    </span>
                    <span className="text-[14px] sm:text-[15px] text-white/80">{rule.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════
             SECTION 5: IMPLEMENTATION ROADMAP
             ═══════════════════════════════════ */}
          <section
            id="roadmap"
            ref={(el) => { sectionRefs.current.roadmap = el; }}
            className="mb-16 sm:mb-24 scroll-mt-8"
          >
            <SectionHeading number="05" title="4-WEEK IMPLEMENTATION ROADMAP" />

            <p className="text-[15px] sm:text-[16px] leading-[25px] text-white/70 mb-10">
              Don&apos;t try to do everything at once. Follow this week-by-week plan
              and you&apos;ll have a working coverage system in 30 days.
            </p>

            <div className="space-y-6">
              {[
                {
                  week: "01",
                  title: "AUDIT & BUILD",
                  desc: "Pull your callout data from the last 90 days. How many per week? Which days? Which routes? Then build your backup roster using the template in Section 3.",
                  tasks: [
                    "Export callout log from last 90 days",
                    "Calculate your actual cost using Section 1 formula",
                    "Identify top 8\u201310 reliable drivers for backup roster",
                    "Call each driver and fill in the roster template",
                    "Complete the route-driver compatibility matrix",
                  ],
                },
                {
                  week: "02",
                  title: "BRIEF & DRY RUN",
                  desc: "Share the escalation flowchart with your team. Run a dry run on a Tuesday morning \u2014 simulate a callout and work the roster.",
                  tasks: [
                    "Print escalation flowchart and post at dispatch",
                    "Brief your operations team on the new process",
                    "Save communication templates in your phone\u2019s notes",
                    "Run a dry-run callout simulation (don\u2019t tell them it\u2019s fake)",
                    "Debrief: what worked, what didn\u2019t, what confused people?",
                  ],
                },
                {
                  week: "03",
                  title: "GO LIVE & ITERATE",
                  desc: "Use the system for every real callout this week. Track response times, which tier filled it, and any gaps in the roster.",
                  tasks: [
                    "Handle all callouts using the new escalation flow",
                    "Log response time for each callout (when received \u2192 when covered)",
                    "Note any roster gaps: drivers who didn\u2019t answer, wrong routes, etc.",
                    "Update the weekly availability grid every Monday",
                    "Adjust tiers based on actual performance",
                  ],
                },
                {
                  week: "04",
                  title: "MEASURE & DECIDE",
                  desc: "Compare this week to your baseline. How much time did you save? Are there gaps that a Flex Pool or AI dispatch could fill?",
                  tasks: [
                    "Calculate time saved vs. your Week 1 baseline",
                    "Identify remaining bottlenecks (usually: speed and 5AM involvement)",
                    "Decide: Is the roster enough, or do you need Flex Pool / AI?",
                    "If satisfied: set up recurring Monday roster reviews",
                    "If not: book a demo to see how AI dispatch handles the gaps",
                  ],
                },
              ].map((week) => (
                <div key={week.week} className="bg-[#022EAD] p-5 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="font-[family-name:var(--font-dm-mono)] font-light text-[32px] sm:text-[40px] text-[#AFE2FF]/30 leading-none flex-shrink-0">
                      {week.week}
                    </span>
                    <div>
                      <span className="font-[family-name:var(--font-dm-mono)] font-light text-[11px] tracking-[0.15em] text-[#AFE2FF] block mb-1">
                        WEEK {week.week}
                      </span>
                      <h3 className="font-display text-[20px] sm:text-[22px] leading-[1.1] text-white">
                        {week.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[14px] sm:text-[15px] leading-[22px] text-white/60 mb-5">
                    {week.desc}
                  </p>
                  <div className="space-y-2.5">
                    {week.tasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-4 h-4 border border-white/30 flex-shrink-0 mt-0.5" />
                        <span className="text-[13px] sm:text-[14px] text-white/80">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════
             CLOSING CTA
             ═══════════════════════════════════ */}
          <section className="text-center">
            <div className="bg-[#022EAD] px-5 sm:px-8 md:px-16 pt-10 sm:pt-14 md:pt-20 pb-0 relative overflow-hidden">
              <h2 className="font-display text-[22px] sm:text-[24px] md:text-[36px] lg:text-[42px] leading-[1.1] mb-4 text-white">
                WANT VIKI TO DO ALL OF THIS AUTOMATICALLY?
              </h2>
              <p className="text-[15px] sm:text-[16px] leading-[25px] text-white/70 max-w-lg mx-auto mb-8">
                Everything in this playbook &mdash; the roster, the escalation, the driver calls &mdash;
                Viki handles it all. Automatically. At 4:47 AM. Without waking you up.
              </p>

              <div className="space-y-3 mb-8 text-left inline-block">
                {[
                  "AI detects callouts and dispatches backup in under 2 minutes",
                  "Calls drivers, briefs them on routes, confirms coverage via voice",
                  "You wake up to a notification, not a crisis",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <GreenCheck />
                    <span className="text-[14px] sm:text-[15px] leading-[20px] text-white/90">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mb-8 sm:mb-12">
                <a
                  href="/schedule"
                  className="btn-pop inline-block bg-white text-[#0039D7] font-semibold text-[15px] sm:text-[16px] px-8 py-3 rounded-none"
                >
                  Schedule a Demo
                </a>
              </div>

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
        </div>
      </div>

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
