"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is voiceERP, exactly?",
    answer:
      "VoiceERP is the world's first voice-activated AI dispatcher built specifically for Amazon DSPs. Our AI assistant, Viki, handles scheduling, driver management, rescues, Netradyne coaching, and more — all through simple voice commands or automated workflows.",
  },
  {
    question: "Do I have to talk to Viki?",
    answer:
      "Not at all! While Viki supports voice commands, you can also interact through text, dashboards, and automated workflows. Viki adapts to however you prefer to work.",
  },
  {
    question: "How hard is it to set up?",
    answer:
      "Setup is simple and takes less than a day. Our team handles the heavy lifting — we integrate with your existing systems and customize Viki to match your operation's specific needs.",
  },
  {
    question: "Will it work with our current systems?",
    answer:
      "Yes! Viki integrates seamlessly with the tools you already use — Amazon Relay, Netradyne, your payroll system, and more. No need to rip and replace anything.",
  },
  {
    question: "Can it really handle bonuses and payroll?",
    answer:
      "Absolutely. Viki tracks driver performance, calculates bonuses based on your custom rules, and integrates with your payroll provider to streamline the entire process.",
  },
  {
    question: "What happens if something goes wrong?",
    answer:
      "You're never alone. Our support team is available around the clock, and Viki is designed to escalate critical issues to you immediately. Plus, you always have full override control.",
  },
  {
    question: "How much time do I need to spend with Viki each week?",
    answer:
      "Most DSP owners spend less than 2 hours per week reviewing Viki's reports and approving recommendations. Viki handles the day-to-day so you can focus on growing your business.",
  },
  {
    question: "What happens after the 60-day trial?",
    answer:
      "After your trial, you can continue with a flexible monthly plan at a discounted per-driver rate. No long-term contracts required. If you enrolled through the AI Partnership, your discounted rate and free upgrades are locked in for life.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border-b border-gray-200 last:border-b-0"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-5 px-2 text-left hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-sm md:text-base font-medium text-gray-900 pr-4">
              {faq.question}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={`faq-chevron flex-shrink-0 ${
                openIndex === index ? "open" : ""
              }`}
            >
              <path
                d="M5 8l5 5 5-5"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            className={`faq-answer ${openIndex === index ? "open" : ""}`}
            style={{
              paddingBottom: openIndex === index ? "20px" : "0",
              paddingLeft: "8px",
              paddingRight: "8px",
            }}
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
