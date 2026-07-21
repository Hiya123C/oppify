'use client'

import { useState } from "react";
import Navbar from "@/components/Navbar";
import OpportunityCard from "@/components/OpportunityCard";

const categories = ["Volunteering", "Hackathon", "Scholarship", "Workshop", "Competition", "Leadership"];

// placeholder — later this comes from the favorites table joined with opportunities
const placeholderFavorites = [
  { id: "1", title: "Beach Cleanup Volunteer Drive", description: "Join a coastal cleanup initiative.", deadline: "Aug 20", category: "Volunteering" },
  { id: "2", title: "NUS High Coding Workshop", description: "Hands-on coding workshop.", deadline: "Sep 20", category: "Workshop" },
];

// placeholder — later from volunteer_signups joined with volunteer_requests
const placeholderVolunteering = [
  { title: "Photography Club — School Fair", status: "Confirmed" },
  { title: "Peer Tutoring Platform Backend Help", status: "Pending" },
];

export default function ProfilePage() {
  const [name, setName] = useState("Christine");
  const [rollingSpeed, setRollingSpeed] = useState(40); // seconds per full scroll loop
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(["Volunteering", "Workshop"]));

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Navbar />

      <div className="pt-32 pb-32 px-6 sm:px-10 max-w-4xl mx-auto space-y-16">

        <section>
          <h1 className="text-4xl font-bold mb-6">Your Profile</h1>

          <div className="cards rounded-2xl p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div>
              <div className="flex items-center gap-3 mt-2">
              <label className="text-md text-gray-700">
                Scroll Speed: {rollingSpeed}s
              </label>
              
                <button
                  onClick={() => setRollingSpeed((s) => Math.max(15, s - 5))}
                  className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-100"
                >
                  -
                </button>
                <button
                  onClick={() => setRollingSpeed((s) => Math.min(80, s + 5))}
                  className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Your Interests</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select categories to personalize your opportunity feed.
          </p>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                  selectedCategories.has(cat)
                    ? "bg-black text-white border-black"
                    : "cards text-gray-700 hover:bg-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>
          {placeholderFavorites.length === 0 ? (
            <p className="text-sm text-gray-500">No favorites yet — go explore opportunities!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {placeholderFavorites.map((opp) => (
                <OpportunityCard key={opp.id} {...opp} isFavorited onToggleFavorite={() => {}} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Volunteering You've Signed Up For</h2>
          {placeholderVolunteering.length === 0 ? (
            <p className="text-sm text-gray-500">You haven&apos;t signed up for anything yet.</p>
          ) : (
            <div className="space-y-3">
              {placeholderVolunteering.map((item, i) => (
                <div key={i} className="cards rounded-xl px-5 py-4 flex justify-between items-center">
                  <p className="font-medium">{item.title}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    item.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}