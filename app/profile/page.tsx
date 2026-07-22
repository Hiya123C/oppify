'use client'

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import OpportunityCard from "@/components/OpportunityCard";
import { getDefaultProfile, readProfile, saveProfile } from "@/utils/profile";
import { createClient } from "@/utils/supabase/client";


const categories = ["Volunteering", "Hackathon", "Scholarship", "Workshop", "Competition", "Leadership", "Research", "Internship", "STEM", "Computing", "Humanities", "Arts", "Sports", "Community Service"];

type FavoriteOpportunity = {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  category?: string;
};

type SignupItem = {
  id: string;
  opportunity_title: string;
  status: string;
};

const favoriteTableCandidates = ["external_favorites"];
const signupTableCandidates = ["volunteer_signups"];

function isMissingTableError(error: { message?: string } | null | undefined) {
  const message = error?.message?.toLowerCase() ?? "";
  return message.includes("could not find the table") || message.includes("schema cache") || message.includes("relation") || message.includes("does not exist");
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(getDefaultProfile);
  const [rollingSpeed, setRollingSpeed] = useState(40); // seconds per full scroll loop
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(["Volunteering", "Workshop"]));
  const [favorites, setFavorites] = useState<FavoriteOpportunity[]>([]);
  const [signups, setSignups] = useState<SignupItem[]>([]);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isActive = true;

    async function loadProfileData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isActive) {
          setFavorites([]);
          setSignups([]);
        }
        return;
      }

      const loadedProfile = await readProfile(supabase, user.id);
      if (isActive) setProfile(loadedProfile);

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

      let signupRows: Array<{ id: string | number; opportunity_title?: string; status?: string }> | null = null;
      let signupError: { message?: string } | null = null;

      for (const tableName of signupTableCandidates) {
        const { data, error } = await supabase
          .from(tableName)
          .select("id, opportunity_title, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error) {
          signupRows = data as Array<{ id: string | number; opportunity_title?: string; status?: string }> | null;
          signupError = null;
          break;
        }

        signupError = error;
        if (!isMissingTableError(error)) {
          break;
        }
      }

      if (!isActive) return;

      if (!favoriteError && favoriteRows) {
        const ids = favoriteRows.map((row) => String(row.opportunity_id));

        if (ids.length > 0) {
          const { data: opportunities } = await supabase
            .from("external_opportunities")
            .select("id, title, description, deadline, category")
            .in("id", ids);

          if (opportunities) {
            setFavorites(
              opportunities.map((opp) => ({
                id: String(opp.id),
                title: opp.title ?? "Untitled opportunity",
                description: opp.description ?? "",
                deadline: opp.deadline ?? undefined,
                category: opp.category ?? undefined,
              }))
            );
          } else {
            setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }

      if (!signupError) {
        setSignups(
          (signupRows ?? []).map((row) => ({
            id: String(row.id),
            opportunity_title: row.opportunity_title ?? "Opportunity",
            status: row.status ?? "pending",
          }))
        );
      } else {
        setSignups([]);
      }
    }

    loadProfileData();

    return () => {
      isActive = false;
    };
  }, [supabase]);

  async function handleProfileChange(field: "name" | "email" | "contactNumber", value: string) {
    const nextProfile = { ...profile, [field]: value };
    setProfile(nextProfile);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await saveProfile(supabase, user.id, nextProfile);
  }

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  async function handleRemoveFavorite(id: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let didSucceed = false;

    for (const tableName of favoriteTableCandidates) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("user_id", user.id)
        .eq("opportunity_id", id);

      if (!error) {
        didSucceed = true;
        break;
      }

      if (!isMissingTableError(error)) {
        break;
      }
    }

    if (!didSucceed) {
      return;
    }

    setFavorites((prev) => prev.filter((opp) => opp.id !== id));
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
                value={profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Contact number</label>
              <input
                type="tel"
                value={profile.contactNumber}
                onChange={(e) => handleProfileChange("contactNumber", e.target.value)}
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
          <h2 className="text-2xl font-bold mb-4">Your Favourites</h2>
          {favorites.length === 0 ? (
            <p className="text-sm text-gray-500">No favourites yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favorites.map((opp) => (
                <OpportunityCard key={opp.id} {...opp} isFavorited onToggleFavorite={() => handleRemoveFavorite(opp.id)} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Internal Opportunities</h2>
          {signups.length === 0 ? (
            <p className="text-sm text-gray-500">You haven't signed up for anything yet</p>
          ) : (
            <div className="space-y-3">
              {signups.map((item) => (
                <div key={item.id} className="cards rounded-xl px-5 py-4 flex justify-between items-center">
                  <p className="font-medium">{item.opportunity_title}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    item.status === "confirmed" || item.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
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