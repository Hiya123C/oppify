'use client'

import { useEffect, useState } from "react";

type OnboardingModalProps = {
  onComplete: () => void;
};

const slides = [
  {
    icon: "waving_hand",
    title: "Welcome to Oppify!",
    body: "We help you discover opportunities tailored to you, from competitions to volunteering, STEM or Humanities, all in one place.",
  },
  {
    icon: "travel_explore",
    title: "External Opportunities",
    body: "Competitions, scholarships and workshops, curated and posted by the Oppify team.",
  },
  {
    icon: "groups",
    title: "Internal Opportunities",
    body: "Posted by your schoolmates or teachers: project teammates wanted, feedback requests and CE volunteering opportunities from within RI.",
  },
  {
    icon: "contact_page",
    title: "Your Information",
    body: "When you sign up for an internal opportunity, your name, email and contact number are shared only with the person organizing it, so they can reach you. If you want to post your own opportunity, feel free to reach out via the Contact section under About Us.",
  },
];

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const last = slides.length - 1;
  const isLast = index === last;

  function goTo(i: number) {
    setDirection(i > index ? "next" : "prev");
    setIndex(i);
  }

  function next() {
    if (isLast) onComplete();
    else goTo(index + 1);
  }

  // Arrow keys
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        if (index < last) goTo(index + 1);
      }
      if (e.key === "ArrowLeft" && index > 0) goTo(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const slide = slides[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 py-6"
    >
      <div className="w-full max-w-md cards rounded-3xl shadow-xl p-6 sm:p-8 animate-popup max-h-[90dvh] overflow-y-auto">
        {/* Skip */}
        <div className="flex justify-end h-5 mb-2">
          {!isLast && (
            <button
              onClick={() => goTo(last)}
              className="text-sm text-gray-500 hover:text-black transition-all duration-200"
            >
              Skip
            </button>
          )}
        </div>

        {/* Slide content: key forces the animation to replay on each slide */}
        <div key={index} className={`min-h-[13rem] sm:min-h-[12rem] ${direction === "next" ? "slide-next" : "slide-prev"}`}>
          <span className="material-symbols-outlined text-4xl text-[var(--mid-blue)] mb-3 block">
            {slide.icon}
          </span>
          <h2 id="onboarding-title" className="text-xl sm:text-2xl font-bold mb-3">{slide.title}</h2>
          <p className="text-sm sm:text-base text-gray-700">{slide.body}</p>
        </div>

        {/* Dots (tap to jump) */}
        <div className="flex justify-center gap-2 my-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-black" : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          {index > 0 ? (
            <button
              onClick={() => goTo(index - 1)}
              className="text-sm text-gray-500 hover:text-black transition-all duration-200"
            >
              ← Back
            </button>
          ) : <span />}

          <button
            onClick={next}
            className="bg-black text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200"
          >
            {isLast ? "Set up my profile" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}