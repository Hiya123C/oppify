'use client'

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ScrollingRow from "@/components/ScrollingRow";

const newOpportunities = [
  { id: "1", title: "Beach Cleanup Volunteer", description: "Help clean up the coastline with local volunteers.", deadline: "Aug 20", category: "Volunteering" },
  { id: "2", title: "Startup Idea Feedback", description: "Test out a new app idea and give feedback.", deadline: "Rolling", category: "Testing" },
  { id: "3", title: "Robotics Club Recruitment", description: "Join the school robotics team, no experience needed.", deadline: "Sep 5", category: "Club" },
];

const prestigiousOpportunities = [
  { id: "4", title: "Global Youth Science Fellowship", description: "International research fellowship for high schoolers.", deadline: "Oct 1", category: "Scholarship" },
  { id: "5", title: "UN Youth Summit", description: "Represent your school at the international summit.", deadline: "Nov 15", category: "International" },
];

const nationalOpportunities = [
  { id: "6", title: "NUS High Coding Workshop", description: "Hands-on coding workshop hosted by NUS High.", deadline: "Sep 20", category: "Workshop" },
  { id: "7", title: "RI Debate Invitational", description: "Open debate competition hosted by Raffles Institution.", deadline: "Sep 30", category: "Competition" },
];

export default function Page() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Navbar />

      <div className="pt-32 px-10 max-w-6xl mx-auto pb-32">
        <h1 className="text-5xl font-bold text-left">Hello Christine!</h1>
        <p className="text-lg text-gray-700 text-left mt-1">
          Find your next opportunity!!
        </p>

        <ScrollingRow
          title="New/Emerging"
          opportunities={newOpportunities}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
        <ScrollingRow
          title="Prestigious"
          opportunities={prestigiousOpportunities}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
        <ScrollingRow
          title="National"
          opportunities={nationalOpportunities}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {/* Search bar fixed at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-6 py-3 rounded-full bg-white/70 backdrop-blur-md border border-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
        />
      </div>
    </main>
  );
}