'use client'

import { useState, useMemo } from "react";
import ScrollingRow from "@/components/ScrollingRow";
import OpportunityModal from "@/components/OpportunityModal";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  category?: string;
  link?: string;
  requirements?: string[];
};

type OpportunitiesClientProps = {
  newOpportunities: Opportunity[];
  prestigiousOpportunities: Opportunity[];
  nationalOpportunities: Opportunity[];
};

export default function OpportunitiesClient({
  newOpportunities,
  prestigiousOpportunities,
  nationalOpportunities,
}: OpportunitiesClientProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Opportunity | null>(null);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const allOpportunities = useMemo(
    () => [...newOpportunities, ...prestigiousOpportunities, ...nationalOpportunities],
    [newOpportunities, prestigiousOpportunities, nationalOpportunities]
  );

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allOpportunities.filter(
      (opp) =>
        opp.title.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.category?.toLowerCase().includes(q)
    );
  }, [search, allOpportunities]);

  return (
    <>
      <div className="pt-32 pb-32">
        <div className="px-10 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-left">Hello Christine!</h1>
          <p className="text-lg text-gray-700 text-left mt-1">
            Find your next opportunity!
          </p>
        </div>

        <ScrollingRow title="New/Emerging" opportunities={newOpportunities} favorites={favorites} onToggleFavorite={toggleFavorite} onSelect={setSelected} />
        <ScrollingRow title="Prestigious" opportunities={prestigiousOpportunities} favorites={favorites} onToggleFavorite={toggleFavorite} onSelect={setSelected} />
        <ScrollingRow title="National" opportunities={nationalOpportunities} favorites={favorites} onToggleFavorite={toggleFavorite} onSelect={setSelected} />
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute -translate-y-1/2 pointer-events-none z-10 left-4 top-1/2 text-gray-500">
            search
          </span>
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-full bg-white/70 backdrop-blur-md border border-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
          />
        </div>
      </div>

      <OpportunityModal opportunity={selected} onClose={() => setSelected(null)} />
    </>
  );
}