"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Format raw digits into (XXX) XXX-XXXX as the user types
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Reject obvious fake US numbers
function isFakePhone(digits: string): boolean {
  if (digits.length !== 10) return true;
  // All same digit: 0000000000, 1111111111, etc.
  if (/^(\d)\1{9}$/.test(digits)) return true;
  // 555-01XX test range (reserved by FCC)
  if (digits.slice(3, 7) === "5501") return true;
  // Area code can't start with 0 or 1
  if (digits[0] === "0" || digits[0] === "1") return true;
  // Exchange (digits 4-6) can't start with 0 or 1
  if (digits[3] === "0" || digits[3] === "1") return true;
  // Sequential: 1234567890
  if (digits === "1234567890" || digits === "0987654321") return true;
  return false;
}

export default function LeadModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
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
      JSON.stringify({ name, email, phone: cleanPhone, ts: Date.now() })
    );

    // Send lead to GHL in the background — don't block redirect
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone: cleanPhone }),
    }).catch(() => {});

    router.push("/schedule");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-[#0039D7] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="font-display text-[24px] md:text-[28px] leading-[1.1] text-white mb-2">
          GET STARTED WITH VIKI
        </h2>
        <p className="text-white/80 text-[14px] mb-6">
          Enter your details and we&apos;ll get you set up with a free
          consultation.
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
            className="w-full bg-white text-[#0039D7] font-semibold text-[16px] px-8 py-3 rounded-none hover:bg-gray-100 transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Continue to Schedule a Call"}
          </button>
        </form>
      </div>
    </div>
  );
}
