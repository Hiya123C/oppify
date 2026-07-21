//change to opportunities

//prob the homepage
//strictly comps, workshops, events

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import OpportunityCard from "@/components/OpportunityCard";
import FilterBar from "@/components/FilterBar";

//to-change to actual database
const placeholderOpportunities = [
  { title: "Beach Cleanup Volunteer", description: "Help clean up the coastline with local volunteers.", deadline: "Aug 20", category: "Volunteering" },
  { title: "Robotics Club Recruitment", description: "Join the school robotics team, no experience needed.", deadline: "Sep 5", category: "Club" },
  { title: "Startup Idea Feedback", description: "Test out a new app idea and give feedback.", deadline: "Rolling", category: "Testing" },
];

export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <Navbar />

      {/* actual content */}

      <div className="pt-32 px-10 max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-left">
          Hello Christine!
        </h1>
        <p className="text-lg text-gray-700 text-left mt-1">
          Find your next opportunity!!
        </p>

        <FilterBar />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {placeholderOpportunities.map((opp, i) => (
            <OpportunityCard key={i} {...opp} />
          ))}
        </div>

      </div>

    </main>
  );
}

