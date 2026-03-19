"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is voiceERP, exactly?",
    answer:
      "voiceERP is the real-time system behind Viki — a fully autonomous, voice-activated AI dispatcher that manages scheduling, coaching, compliance, and payroll. No manual inputs. No dashboards. Just results.",
  },
  {
    question: "Do I have to talk to Viki?",
    answer:
      "Nope. Viki listens to your systems, not your voice. She reacts to data, not dialogue. You don't train her. She's already trained.",
  },
  {
    question: "How hard is it to set up?",
    answer:
      "It's not. We install and configure voiceERP for you — usually in under 6 hours. You'll be up and running before your next shift starts.",
  },
  {
    question: "Will it work with our current systems?",
    answer:
      "Yes. voiceERP is designed to integrate with the tools DSPs already use (like Netradyne, payroll, and scheduling). It can replace or plug into what's already there.",
  },
  {
    question: "Can it really handle bonuses and payroll?",
    answer:
      "Yes. Viki tracks performance, calculates incentives, and uploads bonuses to your payroll system. No more spreadsheets. No more late uploads.",
  },
  {
    question: "What happens if something goes wrong?",
    answer:
      "You don't panic — because Viki's already correcting it. She's built with live alerting, fallback logic, and proactive fail-safes. And yes, you'll still have full visibility.",
  },
  {
    question: "How much time do I need to spend with Viki each week?",
    answer:
      "It varies from customer to customer, and how many features they deploy. But on average, we've seen two dedicated hours per week.",
  },
  {
    question: "What happens after the 60-day trial?",
    answer:
      "You keep your weekends. If you choose to continue, we'll transition you into a full plan without downtime. If not, there are no strings attached.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border-b border-white/20 last:border-b-0"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-5 px-2 text-left hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-[15px] md:text-[17px] font-medium text-white pr-4">
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
                stroke="white"
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
            <p className="text-[15px] text-white/80 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
