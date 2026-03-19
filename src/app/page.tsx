import FAQ from "@/components/FAQ";

/* ─── Wave SVG Dividers ─── */
function WaveBlueToWhite() {
  return (
    <div className="relative w-full -mt-px">
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        preserveAspectRatio="none"
        className="w-full block h-[60px] md:h-[80px]"
      >
        <path
          d="M0,60 C120,90 240,30 360,55 C480,80 560,25 720,50 C880,75 960,20 1100,55 C1240,90 1340,35 1440,60 L1440,100 L0,100 Z"
          fill="white"
        />
        <path
          d="M0,0 L1440,0 L1440,60 C1340,35 1240,90 1100,55 C960,20 880,75 720,50 C560,25 480,80 360,55 C240,30 120,90 0,60 Z"
          fill="#2046E8"
        />
      </svg>
    </div>
  );
}

function WaveWhiteToBlue() {
  return (
    <div className="relative w-full -mt-px">
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        preserveAspectRatio="none"
        className="w-full block h-[60px] md:h-[80px]"
      >
        <path
          d="M0,60 C160,25 280,85 440,50 C600,15 720,80 900,55 C1080,30 1200,75 1440,45 L1440,100 L0,100 Z"
          fill="#2046E8"
        />
        <path
          d="M0,0 L1440,0 L1440,45 C1200,75 1080,30 900,55 C720,80 600,15 440,50 C280,85 160,25 0,60 Z"
          fill="white"
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
    <div className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-blue-primary rounded flex items-center justify-center">
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
            <div className={`w-2.5 h-2.5 rounded-full ${d.dot} flex-shrink-0`} />
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
function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Down arrow */}
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
      <span className="font-display text-4xl md:text-5xl font-bold text-white tracking-wide">
        {value}
      </span>
      <span className="text-white/80 text-xs md:text-sm mt-1">{label}</span>
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

/* ─── MAIN PAGE ─── */
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ══════════════════════════════════════
          NAVIGATION
         ══════════════════════════════════════ */}
      <nav className="bg-blue-primary px-5 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
          >
            <rect
              width="28"
              height="28"
              rx="6"
              fill="white"
              fillOpacity="0.15"
            />
            <path
              d="M6 19V9l4.5 5L14.5 9v10M17 13h5M17 9h5M17 17h5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-white text-lg tracking-tight">
            <span className="font-normal opacity-90">voice</span>
            <span className="font-bold">ERP</span>
          </span>
        </div>
        <div className="flex items-center gap-5 md:gap-7 text-white text-xs md:text-sm font-semibold tracking-wider">
          <a href="#" className="hidden sm:block hover:opacity-80 transition-opacity">
            LOGIN
          </a>
          <a href="#" className="hidden sm:block hover:opacity-80 transition-opacity">
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

      {/* ══════════════════════════════════════
          HERO SECTION
         ══════════════════════════════════════ */}
      <section className="bg-blue-primary text-white text-center px-6 pt-10 md:pt-16 pb-20 relative">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-[2rem] md:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] mb-4 tracking-tight">
            20 DSPS JOINED VIKI&apos;S AI
            <br className="hidden md:block" /> PARTNERSHIP IN THE LAST MONTH
          </h1>
          <p className="font-display text-base md:text-xl tracking-[0.15em] mb-8 opacity-85 font-medium">
            WHY ARE YOU STILL WAITING?
          </p>

          {/* Hero Illustration */}
          <div className="max-w-md mx-auto mb-10 rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] bg-gradient-to-br from-sky-300 via-blue-200 to-amber-200 flex items-center justify-center relative">
              {/* Placeholder — replace with actual illustration */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-30">
                  <rect x="8" y="16" width="48" height="36" rx="4" stroke="#1a3ac0" strokeWidth="2" />
                  <circle cx="32" cy="30" r="8" stroke="#1a3ac0" strokeWidth="2" />
                  <path d="M16 48l10-12 8 6 12-16 10 12" stroke="#1a3ac0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-blue-800/40 text-xs font-medium">
                  Hero Illustration
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm md:text-[15px] leading-relaxed max-w-xl mx-auto mb-8 opacity-90">
            Want to put your DSP on autopilot? Then join our new AI Partnership.
            Together, we customize Viki to optimize your Operations across the
            board. Saving you hundreds of thousands of dollars every year. If you
            enroll today, you will also receive a discounted per-driver price
            along with free Viki Upgrades for life. Limited spaces available.
          </p>

          <a
            href="#"
            className="inline-block bg-white text-gray-900 font-semibold text-sm md:text-base px-8 py-3 rounded-full border-2 border-white hover:bg-gray-100 transition-colors"
          >
            Join Viki&apos;s AI Partnership
          </a>
        </div>
      </section>

      {/* Wave: blue → white */}
      <WaveBlueToWhite />

      {/* ══════════════════════════════════════
          FEATURES SECTION
         ══════════════════════════════════════ */}
      <section className="bg-white px-6 pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-4xl lg:text-[2.6rem] font-bold text-center leading-[1.1] mb-12 md:mb-16 text-gray-900 tracking-tight">
            HERE&apos;S WHAT YOU CAN EXPECT FROM
            <br className="hidden sm:block" /> THE WORLD&apos;S FIRST
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
                  <span className="text-sm md:text-base text-gray-700">
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

      {/* Wave: white → blue */}
      <WaveWhiteToBlue />

      {/* ══════════════════════════════════════
          STATS SECTION
         ══════════════════════════════════════ */}
      <section className="bg-blue-primary text-white px-6 pt-12 md:pt-20 pb-16 md:pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-4xl lg:text-[2.6rem] font-bold leading-[1.1] mb-6 tracking-tight">
            SAVE TIME. SAVE MONEY.
            <br />
            SAVE YOUR SANITY.
          </h2>
          <p className="text-sm md:text-[15px] leading-relaxed max-w-lg mx-auto mb-12 opacity-90">
            DSPs who&apos;ve partnered with Viki are racking up massive savings
            in time and money across the board. Join them today and start seeing
            the same results flow to your bottomline.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 mb-14">
            <StatCard value="60hrs" label="per month on scheduling" />
            <StatCard value="40hrs" label="per month on admin" />
            <StatCard value="30%" label="cut in safety infractions" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4">
            <a
              href="#"
              className="inline-block border-2 border-white text-white font-semibold text-sm md:text-base px-8 py-3 rounded-full hover:bg-white hover:text-blue-primary transition-colors"
            >
              Switch now and earn a $1,000 Bonus
            </a>
            <a
              href="#"
              className="inline-block border-2 border-white text-white font-semibold text-sm md:text-base px-8 py-3 rounded-full hover:bg-white hover:text-blue-primary transition-colors"
            >
              Start your 60-day free trial
            </a>
          </div>
        </div>
      </section>

      {/* Wave: blue → white */}
      <WaveBlueToWhite />

      {/* ══════════════════════════════════════
          FAQ SECTION
         ══════════════════════════════════════ */}
      <section className="bg-white px-6 pt-10 md:pt-16 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 tracking-tight">
            YOUR QUESTIONS ANSWERED
          </h2>
          <FAQ />
        </div>
      </section>

      {/* Wave: white → blue */}
      <WaveWhiteToBlue />

      {/* ══════════════════════════════════════
          FINAL CTA SECTION
         ══════════════════════════════════════ */}
      <section className="bg-blue-primary text-white text-center px-6 pt-12 md:pt-20 pb-16 md:pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-4xl lg:text-[2.6rem] font-bold leading-[1.1] mb-10 tracking-tight">
            YOU&apos;RE ON THE WAY TO KNOCKING DOWN MORE FANTASTIC PLUS WEEKS
            THAN YOU EVER IMAGINED. GET STARTED TODAY!
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-block border-2 border-white text-white font-semibold text-sm md:text-base px-7 py-3 rounded-full hover:bg-white hover:text-blue-primary transition-colors"
            >
              Start your 60-day free trial
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold text-sm md:text-base px-7 py-3 rounded-full hover:bg-white hover:text-blue-primary transition-colors"
            >
              {/* Speaker icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
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

      {/* ══════════════════════════════════════
          FOOTER
         ══════════════════════════════════════ */}
      <footer className="bg-[#0f1b61] text-white/70 px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span>&copy; 2025, Phoenicia Labs, Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="underline hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="underline hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
