'use client'

import { useEffect, useMemo, useState } from "react";
import ScrollingRow from "@/components/ScrollingRow";
import OpportunityModal from "@/components/OpportunityModal";
import SearchBar from "@/components/SearchBar";
import { createClient } from "@/utils/supabase/client";
import { readProfile } from "@/utils/profile";
import OnboardingModal from "./OnboardingModal";

import { useRouter } from "next/navigation";

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
  internationalOpportunities: Opportunity[];
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
  internationalOpportunities,
  nationalOpportunities,
}: OpportunitiesClientProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

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
    console.log("heart clicked!!", id);
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
  const normalizedInternationalOpportunities = useMemo(
    () => internationalOpportunities.map(normalizeOpportunity),
    [internationalOpportunities]
  );
  const normalizedNationalOpportunities = useMemo(
    () => nationalOpportunities.map(normalizeOpportunity),
    [nationalOpportunities]
  );

  const allExternalOpportunities = useMemo(
    () => [
      ...normalizedNewOpportunities,
      ...normalizedInternationalOpportunities,
      ...normalizedNationalOpportunities,
    ],
    [normalizedNewOpportunities, normalizedInternationalOpportunities, normalizedNationalOpportunities]
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

  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    async function loadName() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const profile = await readProfile(supabase, user.id);
      setUserName(profile.name || 'there');
    }
    loadName();
  }, [supabase]);

  //onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkOnboarding() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("has_onboarded")
        .eq("id", user.id)
        .single();

      if (!data?.has_onboarded) {
        setShowOnboarding(true);
      }
    }
    checkOnboarding();
  }, [supabase]);

  async function handleOnboardingComplete() {
    setShowOnboarding(false);
    if (userId) {
      const { error } = await supabase.from("profiles").upsert({ id: userId, has_onboarded: true });
      if (error) console.error("onboarding flag failed", error);
    }
    router.push("/profile");
  }

  return (
    <>
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <div className="pt-32 pb-32">
        <div className="px-10 max-w-7xl mx-auto">
          {/* <h1 className="text-5xl font-bold text-left">Hello {userName || '...'}!</h1> */}
          <h1 className="lg:text-5xl text-4xl font-bold text-left ">Hello there!</h1>
          <p className="text-lg text-gray-700 text-left mt-1">
            Find your next opportunity!
          </p>
        </div>

        <ScrollingRow title="Currently open" opportunities={normalizedNewOpportunities} favorites={favorites} onToggleFavorite={toggleFavorite} onSelect={setSelected} />
        <ScrollingRow title="International" opportunities={normalizedInternationalOpportunities} favorites={favorites} onToggleFavorite={toggleFavorite} onSelect={setSelected} />
        <ScrollingRow title="National" opportunities={normalizedNationalOpportunities} favorites={favorites} onToggleFavorite={toggleFavorite} onSelect={setSelected} />
      </div>

      <SearchBar items={allExternalOpportunities} onSelect={setSelected} />

      <OpportunityModal opportunity={selected} onClose={() => setSelected(null)} />
    </>
  );
}