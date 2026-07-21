'use client'

import { useState, useMemo } from "react";
import ScrollingRow from "@/components/ScrollingRow";
import OpportunityModal from "@/components/OpportunityModal";
import SearchBar from "@/components/SearchBar";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

async function toggleFavorite(id: string, isFavorited: boolean) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) return;

  if (isFavorited) {
    // remove from favorites
    await supabase.from("external_favorites")
      .delete()
      .eq("user_id", user.data.user.id)
      .eq("opportunity_id", id);
  } else {
    // add to favorites
    await supabase.from("external_favorites")
      .insert({ user_id: user.data.user.id, opportunity_id: id });
  }
}

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

  const allExternalOpportunities = useMemo(
    () => [...newOpportunities, ...prestigiousOpportunities, ...nationalOpportunities],
    [newOpportunities, prestigiousOpportunities, nationalOpportunities]
  );

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allExternalOpportunities.filter(
      (opp) =>
        opp.title.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.category?.toLowerCase().includes(q)
    );
  }, [search, allExternalOpportunities]);

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

      <SearchBar items={allExternalOpportunities} onSelect={setSelected} />

      <OpportunityModal opportunity={selected} onClose={() => setSelected(null)} />
    </>
  );
}