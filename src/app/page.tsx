import FAQ from "@/components/FAQ";
import Image from "next/image";

/* ─── Decorative Wave Divider (blue-on-blue texture break) ─── */
function WaveDivider() {
  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        preserveAspectRatio="none"
        className="w-full block h-[50px] md:h-[70px]"
      >
        <path
          d="M0,60 C120,90 240,30 360,55 C480,80 560,25 720,50 C880,75 960,20 1100,55 C1240,90 1340,35 1440,60 L1440,100 L0,100 Z"
          fill="#1b3cc4"
        />
        <path
          d="M0,0 L1440,0 L1440,60 C1340,35 1240,90 1100,55 C960,20 880,75 720,50 C560,25 480,80 360,55 C240,30 120,90 0,60 Z"
          fill="#2046E8"
        />
      </svg>
    </div>
  );
}

function WaveDividerReverse() {
  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        preserveAspectRatio="none"
        className="w-full block h-[50px] md:h-[70px]"
      >
        <path
          d="M0,60 C160,25 280,85 440,50 C600,15 720,80 900,55 C1080,30 1200,75 1440,45 L1440,100 L0,100 Z"
          fill="#2046E8"
        />
        <path
          d="M0,0 L1440,0 L1440,45 C1200,75 1080,30 900,55 C720,80 600,15 440,50 C280,85 160,25 0,60 Z"
          fill="#1b3cc4"
        />
      </svg>
    </div>
  );
}

/* ─── Dashboard Mockup ─── */
function DashboardMockup() {
  const drivers = [
    { dot: "bg-green-500", name: "Alex M.", bar: "bg-green-400", w: "75%" },
    { dot: "bg-green-500", name: "Sarah K.", bar: "bg-green-400", w: "85%" },
    { dot: "bg-yellow-400", name: "Mike R.", bar: "bg-yellow-400", w: "55%" },
    { dot: "bg-green-500", name: "Lisa P.", bar: "bg-green-400", w: "80%" },
    { dot: "bg-red-500", name: "John D.", bar: "bg-red-400", w: "35%" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-[#2046E8] rounded flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 8V4l2 2.5L6 4v4M8 6h3M8 4h3M8 8h3"
                stroke="white"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-gray-800 tracking-tight">
            voiceERP
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">92</span>
          </div>
          <span className="text-[9px] text-green-600 font-bold mt-1 tracking-wider">
            FANTASTIC PLUS
          </span>
        </div>
      </div>

      {/* Driver Roster */}
      <h3 className="text-sm font-bold text-gray-800 mb-3 mt-2">
        Driver Roster
      </h3>
      <div className="space-y-2.5">
        {drivers.map((d, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className={`w-2.5 h-2.5 rounded-full ${d.dot} flex-shrink-0`}
            />
            <span className="text-[11px] text-gray-600 w-14 flex-shrink-0">
              {d.name}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`${d.bar} h-full rounded-full`}
                style={{ width: d.w }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Route Metrics */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="bg-blue-50 rounded-lg p-2.5">
          <span className="text-[10px] text-gray-500 font-medium">Routes</span>
          <div className="flex gap-1 mt-1.5">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <div className="w-4 h-4 bg-green-500 rounded" />
            <div className="w-4 h-4 bg-yellow-400 rounded" />
            <div className="w-4 h-4 bg-green-500 rounded" />
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-2.5">
          <span className="text-[10px] text-gray-500 font-medium">Status</span>
          <div className="flex gap-1 mt-1.5">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <div className="w-4 h-4 bg-green-500 rounded" />
            <div className="w-4 h-4 bg-green-500 rounded" />
            <div className="w-4 h-4 bg-red-400 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <span className="text-white/80 text-[14px] mt-2">{label}</span>
    </div>
  );
}

/* ─── Green Checkmark ─── */
function Check() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="11" cy="11" r="11" fill="#22c55e" />
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
    <main className="min-h-screen bg-[#2046E8]">
      {/* ─── NAVIGATION ─── */}
      <nav className="bg-[#2046E8] px-5 md:px-10 py-4 flex items-center justify-between">
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
      <section className="bg-[#2046E8] text-white text-center px-6 pt-10 md:pt-16 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-[36px] md:text-[52px] lg:text-[64px] leading-[1] md:leading-[58px] mb-4">
            20 DSPS JOINED VIKI&apos;S AI PARTNERSHIP IN THE LAST MONTH
          </h1>
          <p className="font-display text-[16px] md:text-[20px] tracking-[0.15em] mb-8 text-[#AFE2FF]">
            WHY ARE YOU STILL WAITING?
          </p>

          {/* Hero Image — Neighborhood background with Viki avatar */}
          <div className="max-w-2xl mx-auto mb-10 relative">
            {/* Background scene container with rounded corners */}
            <div className="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#a8d8ea] to-[#6db86b]">
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
                <div className="absolute bottom-[5%] left-[8%] w-14 h-12 bg-[#e8d5b0] rounded-t-lg">
                  <div className="absolute -top-4 left-0 w-0 h-0 border-l-[28px] border-r-[28px] border-b-[16px] border-l-transparent border-r-transparent border-b-[#c4956a]" />
                </div>
                <div className="absolute bottom-[5%] left-[25%] w-12 h-10 bg-[#d4c4a8] rounded-t-lg">
                  <div className="absolute -top-3 left-0 w-0 h-0 border-l-[24px] border-r-[24px] border-b-[12px] border-l-transparent border-r-transparent border-b-[#b0876a]" />
                </div>
                <div className="absolute bottom-[5%] right-[20%] w-14 h-11 bg-[#e0cdb0] rounded-t-lg">
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

          <p className="text-[16px] md:text-[18px] leading-[27px] max-w-xl mx-auto mb-8 opacity-90">
            Want to put your DSP on autopilot? Then join our new AI Partnership.
            Together, we customize Viki to optimize your Operations across the
            board. Saving you hundreds of thousands of dollars every year. If you
            enroll today, you will also receive a discounted per-driver price
            along with free Viki Upgrades for life. Limited spaces available.
          </p>

          <a
            href="#"
            className="inline-block bg-white text-gray-900 font-semibold text-[16px] px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Join Viki&apos;s AI Partnership
          </a>
        </div>
      </section>

      {/* Decorative wave break */}
      <WaveDivider />

      {/* ─── FEATURES SECTION ─── */}
      <section className="bg-[#1b3cc4] text-white px-6 pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-[24px] md:text-[36px] lg:text-[42px] leading-[1.05] text-center mb-12 md:mb-16">
            HERE&apos;S WHAT YOU CAN EXPECT FROM THE WORLD&apos;S FIRST
            VOICE-ACTIVATED AI DISPATCHER
          </h2>

          <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16">
            {/* Feature List */}
            <div className="flex-1 space-y-5">
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
                  <span className="text-[16px] md:text-[18px] leading-[27px] text-white/90">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Dashboard Mockup */}
            <div className="flex-1 flex justify-center">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Decorative wave break */}
      <WaveDividerReverse />

      {/* ─── STATS SECTION ─── */}
      <section className="bg-[#2046E8] text-white px-6 pt-12 md:pt-20 pb-16 md:pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-[24px] md:text-[36px] lg:text-[42px] leading-[1.05] mb-6">
            SAVE TIME. SAVE MONEY.
            <br />
            SAVE YOUR SANITY.
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[27px] max-w-lg mx-auto mb-12 opacity-90">
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
              className="inline-block border-2 border-white text-white font-semibold text-[16px] px-8 py-3 rounded-full hover:bg-white hover:text-[#2046E8] transition-colors"
            >
              Switch now and earn a $1,000 Bonus
            </a>
            <a
              href="#"
              className="inline-block border-2 border-white text-white font-semibold text-[16px] px-8 py-3 rounded-full hover:bg-white hover:text-[#2046E8] transition-colors"
            >
              Start your 60-day free trial
            </a>
          </div>
        </div>
      </section>

      {/* Decorative wave break */}
      <WaveDivider />

      {/* ─── FAQ SECTION ─── */}
      <section className="bg-[#1b3cc4] text-white px-6 pt-10 md:pt-16 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[24px] md:text-[36px] lg:text-[42px] leading-[1.05] mb-8 md:mb-12">
            YOUR QUESTIONS ANSWERED
          </h2>
          <FAQ />
        </div>
      </section>

      {/* Decorative wave break */}
      <WaveDividerReverse />

      {/* ─── FINAL CTA SECTION ─── */}
      <section className="bg-[#2046E8] text-white text-center px-6 pt-12 md:pt-20 pb-16 md:pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[24px] md:text-[36px] lg:text-[42px] leading-[1.05] mb-10">
            YOU&apos;RE ON THE WAY TO KNOCKING DOWN MORE FANTASTIC PLUS WEEKS
            THAN YOU EVER IMAGINED. GET STARTED TODAY!
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-block border-2 border-white text-white font-semibold text-[16px] px-7 py-3 rounded-full hover:bg-white hover:text-[#2046E8] transition-colors"
            >
              Start your 60-day free trial
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold text-[16px] px-7 py-3 rounded-full hover:bg-white hover:text-[#2046E8] transition-colors"
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
      <footer className="bg-[#0f1b61] text-white/70 px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span>&copy; 2025, Phoenicia Labs, Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="underline hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="underline hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
