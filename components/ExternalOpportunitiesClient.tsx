'use client'

import { useEffect, useMemo, useState } from "react";
import ScrollingRow from "@/components/ScrollingRow";
import OpportunityModal from "@/components/OpportunityModal";
import SearchBar from "@/components/SearchBar";
import { createClient } from "@/utils/supabase/client";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  category?: string;
  link?: string;
  requirements?: string[];
};

const favoriteTableCandidates = ["external_favorites"];

function isMissingTableError(error: { message?: string } | null | undefined) {
  const message = error?.message?.toLowerCase() ?? "";
  return message.includes("could not find the table") || message.includes("schema cache") || message.includes("relation") || message.includes("does not exist");
}

type OpportunitiesClientProps = {
  newOpportunities: Opportunity[];
  prestigiousOpportunities: Opportunity[];
  nationalOpportunities: Opportunity[];
};

function normalizeOpportunity(opp: Opportunity): Opportunity {
  return {
    ...opp,
    id: String(opp.id),
  };
}

export default function OpportunitiesClient({
  newOpportunities,
  prestigiousOpportunities,
  nationalOpportunities,
}: OpportunitiesClientProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isActive = true;

    async function loadFavorites() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isActive) setFavorites(new Set());
        return;
      }

      let favoriteRows: Array<{ opportunity_id: string | number }> | null = null;
      let favoriteError: { message?: string } | null = null;

      for (const tableName of favoriteTableCandidates) {
        const { data, error } = await supabase
          .from(tableName)
          .select("opportunity_id")
          .eq("user_id", user.id);

        if (!error) {
          favoriteRows = data as Array<{ opportunity_id: string | number }> | null;
          favoriteError = null;
          break;
        }

        favoriteError = error;
        if (!isMissingTableError(error)) {
          break;
        }
      }

      if (!isActive) return;

      if (!favoriteError) {
        const nextFavorites = new Set(
          (favoriteRows ?? []).map((row) => String(row.opportunity_id))
        );
        setFavorites(nextFavorites);
      }
    }

    loadFavorites();

    return () => {
      isActive = false;
    };
  }, [supabase]);

  async function toggleFavorite(id: string) {
    const normalizedId = String(id);
    const isFavorited = favorites.has(normalizedId);

    setFavorites((prev) => {
      const next = new Set(prev);
      isFavorited ? next.delete(normalizedId) : next.add(normalizedId);
      return next;
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("toggleFavorite: no logged-in user, reverting");
      setFavorites((prev) => {
        const next = new Set(prev);
        isFavorited ? next.add(normalizedId) : next.delete(normalizedId);
        return next;
      });
      return;
    }

    let didSucceed = false;

    for (const tableName of favoriteTableCandidates) {
      if (isFavorited) {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq("user_id", user.id)
          .eq("opportunity_id", normalizedId);

        if (!error) {
          didSucceed = true;
          break;
        }
        console.error(`toggleFavorite delete error (${tableName}):`, error);
        if (!isMissingTableError(error)) break;
      } else {
        const { error } = await supabase.from(tableName).insert({
          user_id: user.id,
          opportunity_id: normalizedId,
        });

        if (!error) {
          didSucceed = true;
          break;
        }
        console.error(`toggleFavorite insert error (${tableName}):`, error);
        if (!isMissingTableError(error)) break;
      }
    }

    if (!didSucceed) {
      setFavorites((prev) => {
        const next = new Set(prev);
        isFavorited ? next.add(normalizedId) : next.delete(normalizedId);
        return next;
      });
    }
  }

  const normalizedNewOpportunities = useMemo(
    () => newOpportunities.map(normalizeOpportunity),
    [newOpportunities]
  );
  const normalizedPrestigiousOpportunities = useMemo(
    () => prestigiousOpportunities.map(normalizeOpportunity),
    [prestigiousOpportunities]
  );
  const normalizedNationalOpportunities = useMemo(
    () => nationalOpportunities.map(normalizeOpportunity),
    [nationalOpportunities]
  );

  const allExternalOpportunities = useMemo(
    () => [
      ...normalizedNewOpportunities,
      ...normalizedPrestigiousOpportunities,
      ...normalizedNationalOpportunities,
    ],
    [normalizedNewOpportunities, normalizedPrestigiousOpportunities, normalizedNationalOpportunities]
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

        <ScrollingRow title="New/Emerging" opportunities={normalizedNewOpportunities} favorites={favorites} onToggleFavorite={toggleFavorite} onSelect={setSelected} />
        <ScrollingRow title="Prestigious" opportunities={normalizedPrestigiousOpportunities} favorites={favorites} onToggleFavorite={toggleFavorite} onSelect={setSelected} />
        <ScrollingRow title="National" opportunities={normalizedNationalOpportunities} favorites={favorites} onToggleFavorite={toggleFavorite} onSelect={setSelected} />
      </div>

      <SearchBar items={allExternalOpportunities} onSelect={setSelected} />

      <OpportunityModal opportunity={selected} onClose={() => setSelected(null)} />
    </>
  );
}