import FAQ from "@/components/FAQ";
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
      <span className="font-display text-[40px] md:text-[52px] leading-[1] text-white tracking-wide">
        {value}
      </span>
      <span className="text-white text-[14px] mt-2">{label}</span>
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
      <circle cx="11" cy="11" r="11" fill="#AFE2FF" />
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
  return (
    <main className="min-h-screen bg-[#0039D7]">
      {/* ─── NAVIGATION ─── */}
      <nav className="px-5 md:px-10 py-4 flex items-center justify-between">
        <Image
          src="/voiceerp-logo.svg"
          alt="VoiceERP"
          width={118}
          height={45}
          priority
        />
        <div className="flex items-center gap-5 md:gap-7 text-white text-xs md:text-sm font-semibold tracking-wider">
          <a
            href="#"
            className="hidden sm:block hover:opacity-80 transition-opacity"
          >
            LOGIN
          </a>
          <a
            href="#"
            className="hidden sm:block hover:opacity-80 transition-opacity"
          >
            GET STARTED
          </a>
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xs md:text-sm">MENU</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 5h12M3 9h12M3 13h12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="text-white text-center px-6 pt-10 md:pt-16 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-[36px] md:text-[52px] lg:text-[64px] leading-[1] md:leading-[58px] mb-4 text-white">
            20 DSPS JOINED VIKI&apos;S AI PARTNERSHIP IN THE LAST MONTH
          </h1>
          <p className="font-display text-[16px] md:text-[20px] tracking-[0.15em] mb-8 text-[#AFE2FF]">
            WHY ARE YOU STILL WAITING?
          </p>

          {/* Hero Image — Neighborhood background with Viki avatar */}
          <div className="max-w-2xl mx-auto mb-10 relative">
            {/* Background scene container */}
            <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#a8d8ea] to-[#6db86b]">
              {/* Sky + neighborhood scene (painted with gradients) */}
              <div className="aspect-[16/9] md:aspect-[2.2/1] relative">
                {/* Sky */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#5ba3d9] via-[#7ec8e3] to-transparent" />
                {/* Clouds */}
                <div className="absolute top-[10%] left-[5%] w-24 h-8 bg-white/40 rounded-full blur-sm" />
                <div className="absolute top-[8%] left-[15%] w-16 h-6 bg-white/30 rounded-full blur-sm" />
                <div className="absolute top-[15%] right-[10%] w-20 h-7 bg-white/35 rounded-full blur-sm" />
                <div className="absolute top-[12%] right-[25%] w-14 h-5 bg-white/25 rounded-full blur-sm" />
                {/* Trees */}
                <div className="absolute bottom-0 left-[3%] w-16 h-[55%] bg-[#2d7a3a] rounded-t-full" />
                <div className="absolute bottom-0 left-[12%] w-20 h-[60%] bg-[#3a8a47] rounded-t-full" />
                <div className="absolute bottom-0 left-[22%] w-14 h-[45%] bg-[#4a9a57] rounded-t-full" />
                <div className="absolute bottom-0 right-[5%] w-18 h-[50%] bg-[#2d7a3a] rounded-t-full" />
                <div className="absolute bottom-0 right-[15%] w-16 h-[55%] bg-[#3a8a47] rounded-t-full" />
                {/* Houses */}
                <div className="absolute bottom-[5%] left-[8%] w-14 h-12 bg-[#e8d5b0] rounded-none">
                  <div className="absolute -top-4 left-0 w-0 h-0 border-l-[28px] border-r-[28px] border-b-[16px] border-l-transparent border-r-transparent border-b-[#c4956a]" />
                </div>
                <div className="absolute bottom-[5%] left-[25%] w-12 h-10 bg-[#d4c4a8] rounded-none">
                  <div className="absolute -top-3 left-0 w-0 h-0 border-l-[24px] border-r-[24px] border-b-[12px] border-l-transparent border-r-transparent border-b-[#b0876a]" />
                </div>
                <div className="absolute bottom-[5%] right-[20%] w-14 h-11 bg-[#e0cdb0] rounded-none">
                  <div className="absolute -top-4 left-0 w-0 h-0 border-l-[28px] border-r-[28px] border-b-[16px] border-l-transparent border-r-transparent border-b-[#c4956a]" />
                </div>
                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-[12%] bg-gradient-to-t from-[#5a9e4a] to-[#6db86b]" />
              </div>
            </div>

            {/* Viki avatar — overlaid on the scene */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] md:w-[45%] z-10">
              <Image
                src="/viki-avatar.webp"
                alt="Viki - AI Dispatcher"
                width={600}
                height={600}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          <p className="text-[16px] md:text-[18px] leading-[27px] max-w-xl mx-auto mb-8 text-white">
            Want to put your DSP on autopilot? Then join our new AI Partnership.
            Together, we customize Viki to optimize your Operations across the
            board. Saving you hundreds of thousands of dollars every year. If you
            enroll today, you will also receive a discounted per-driver price
            along with free Viki Upgrades for life. Limited spaces available.
          </p>

          <a
            href="#"
            className="inline-block bg-white text-[#0039D7] font-semibold text-[16px] px-8 py-3 rounded-none hover:bg-gray-100 transition-colors"
          >
            Join Viki&apos;s AI Partnership
          </a>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="text-white px-6 pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-[24px] md:text-[36px] lg:text-[42px] leading-[1.05] text-center mb-12 md:mb-16 text-white">
            HERE&apos;S WHAT YOU CAN EXPECT FROM THE WORLD&apos;S FIRST
            VOICE-ACTIVATED AI DISPATCHER
          </h2>

          <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16">
            {/* Feature List */}
            <div className="flex-1 space-y-4">
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
            <div className="flex-1 flex justify-center">
              <Image
                src="/dashboard-mockup.webp"
                alt="VoiceERP Driver Roster Dashboard"
                width={500}
                height={600}
                className="w-full max-w-md shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className="text-white px-6 py-12 md:py-20 text-center">
        <div className="max-w-4xl mx-auto bg-[#022EAD] px-8 md:px-16 py-14 md:py-20">
          <h2 className="font-display text-[24px] md:text-[36px] lg:text-[42px] leading-[1.05] mb-6 text-white">
            SAVE TIME. SAVE MONEY.
            <br />
            SAVE YOUR SANITY.
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[27px] max-w-lg mx-auto mb-12 text-white">
            DSPs who&apos;ve partnered with Viki are racking up massive savings
            in time and money across the board. Join them today and start seeing
            the same results flow to your bottomline.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 mb-14">
            <StatCard value="60hrs" label="per month on scheduling" />
            <StatCard value="40hrs" label="per month on admin" />
            <StatCard value="30%" label="cut in safety infractions" />
          </div>

          <div className="flex flex-col items-center gap-4">
            <a
              href="#"
              className="inline-block border-2 border-white bg-white text-[#0039D7] font-semibold text-[16px] px-8 py-3 rounded-none hover:bg-gray-100 transition-colors"
            >
              Switch now and earn a $1,000 Bonus
            </a>
            <a
              href="#"
              className="inline-block border-2 border-white bg-transparent text-white font-semibold text-[16px] px-8 py-3 rounded-none hover:bg-white/10 transition-colors"
            >
              Start your 60-day free trial
            </a>
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="text-white px-6 pt-10 md:pt-16 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[24px] md:text-[36px] lg:text-[42px] leading-[1.05] mb-8 md:mb-12 text-white">
            YOUR QUESTIONS ANSWERED
          </h2>
          <FAQ />
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ─── */}
      <section className="text-white text-center px-6 pt-12 md:pt-20 pb-16 md:pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[24px] md:text-[36px] lg:text-[42px] leading-[1.05] mb-10 text-white">
            YOU&apos;RE ON THE WAY TO KNOCKING DOWN MORE FANTASTIC PLUS WEEKS
            THAN YOU EVER IMAGINED. GET STARTED TODAY!
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-block border-2 border-white bg-white text-[#0039D7] font-semibold text-[16px] px-7 py-3 rounded-none hover:bg-gray-100 transition-colors"
            >
              Start your 60-day free trial
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 border-2 border-white bg-white text-[#0039D7] font-semibold text-[16px] px-7 py-3 rounded-none hover:bg-gray-100 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M2 7v4h3l4 4V3L5 7H2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 6.5a3.5 3.5 0 010 5M15 4a7 7 0 010 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Hear Viki in action
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#002a9e] text-white px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>&copy; 2025, Phoenicia Labs, Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="underline hover:opacity-80 transition-opacity"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="underline hover:opacity-80 transition-opacity"
            >
              Terms of Service
            </a>
          </div>
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="text-white hover:opacity-80 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="text-white hover:opacity-80 transition-opacity">
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
