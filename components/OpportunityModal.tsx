'use client'

import { useState, useEffect } from "react";
import { cleanLocalDigits, storedToLocal } from "@/utils/profile";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  category?: string;
  link?: string;
  requirements?: string[];
};

type OpportunityModalProps = {
  opportunity: Opportunity | null;
  onClose: () => void;
  onPrimaryAction?: (opportunity: Opportunity, contactInfo: { name: string; email: string; contactNumber: string }) => void;
  primaryLabel?: string;
  primaryButtonClassName?: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultContactNumber?: string;
  contactPersonName?: string;
};

export default function OpportunityModal({
  opportunity,
  onClose,
  onPrimaryAction,
  primaryLabel = 'Sign up',
  primaryButtonClassName,
  defaultName = '',
  defaultEmail = '',
  defaultContactNumber = '',
  contactPersonName = 'the opportunity organizer',
}: OpportunityModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [contactNumber, setContactNumber] = useState(defaultContactNumber);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    setName(defaultName);
    setEmail(defaultEmail);
    // setContactNumber(defaultContactNumber);
    setContactNumber(storedToLocal(defaultContactNumber));
  }, [defaultName, defaultEmail, defaultContactNumber, opportunity?.id]);



  if (!opportunity) return null;

  function handleClose() {
    setShowConfirm(false);
    onClose();
  }

  function handleConfirmSignup() {
    if (contactNumber && !/^[89]\d{7}$/.test(contactNumber)) {
      setPhoneError("Enter a valid 8-digit Singapore number starting with 8 or 9");
      return;
    }
    setPhoneError("");
    onPrimaryAction?.(opportunity!, {
      name,
      email,
      contactNumber: contactNumber ? `+65${contactNumber}` : "",
    });
    setShowConfirm(false);
  }

  return (
    <div onClick={handleClose} className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg cards rounded-3xl shadow-xl p-8 animate-popup max-h-[85vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-5 right-5 text-2xl text-gray-500 hover:text-black transition-all duration-200" aria-label="Close">✕</button>

        {opportunity.category && (
          <span className="inline-block text-xs font-medium text-gray-600 bg-white/60 border border-gray-300 rounded-full px-3 py-1 mb-3">
            {opportunity.category}
          </span>
        )}

        <h2 className="text-2xl font-bold pr-8">{opportunity.title}</h2>
        <p className="text-gray-700 mt-3">{opportunity.description}</p>
        <p className="text-sm text-gray-500 mt-4">Deadline: {opportunity.deadline ?? "To be determined"}</p>

        {opportunity.requirements && opportunity.requirements.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">Requirements:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              {opportunity.requirements.map((req, i) => <li key={i}>{req}</li>)}
            </ul>
          </div>
        )}

        {opportunity.link && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">Relevant links:</h3>
            <a href={opportunity.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-2 inline-block break-all">
              {opportunity.link}
            </a>
          </div>
        )}

        {onPrimaryAction && !showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            className={primaryButtonClassName ?? "mt-6 bg-black text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200"}
          >
            {primaryLabel}
          </button>
        )}

        {showConfirm && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Confirm the details below. This will be shared with{" "}
              <span className="font-medium text-gray-800">{contactPersonName}</span>, who is organizing this opportunity, so they can reach you.
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
              />
              <div>
                <div className="flex">
                  <span className="px-4 py-2 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-600">
                    +65
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="91234567"
                    value={contactNumber}
                    onChange={(e) => { setContactNumber(cleanLocalDigits(e.target.value)); setPhoneError(""); }}
                    className="w-full border border-gray-300 rounded-r-xl px-4 py-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
                  />
                </div>
                {phoneError && <p className="text-xs text-red-600 mt-1">{phoneError}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleConfirmSignup}
                className="bg-black text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200"
              >
                Confirm & Sign Up
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-sm text-gray-500 hover:text-black transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}