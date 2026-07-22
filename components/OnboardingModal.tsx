'use client'

import { useState } from "react";

type OnboardingModalProps = {
  onComplete: () => void;
};

const slides = [
  {
    title: "Welcome to Oppify!",
    body: "We help you discover opportunities tailored to you — from competitions to volunteering, all in one place.",
  },
  {
    title: "External Opportunities",
    body: "These are competitions, scholarships, and workshops from outside RI — curated and posted by the Oppify team.",
  },
  {
    title: "Internal Opportunities",
    body: "Posted by your schoolmates — project teammates wanted, feedback requests, and volunteering asks from within RI.",
  },
  {
    title: "Your Information",
    body: "When you sign up for an internal opportunity, your name, email, and contact number are shared only with the person organizing it, so they can reach you. Want to post your own opportunity? Reach out via the Contact section under About Us.",
  },
];

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md cards rounded-3xl shadow-xl p-8 animate-popup">
        <h2 className="text-2xl font-bold mb-3">{slides[index].title}</h2>
        <p className="text-gray-700 mb-8">{slides[index].body}</p>

        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === index ? "w-6 bg-black" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          {index > 0 ? (
            <button
              onClick={() => setIndex((i) => i - 1)}
              className="text-sm text-gray-500 hover:text-black transition-all duration-200"
            >
              ← Back
            </button>
          ) : <span />}

          <button
            onClick={() => (isLast ? onComplete() : setIndex((i) => i + 1))}
            className="bg-black text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200"
          >
            {isLast ? "Get started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}