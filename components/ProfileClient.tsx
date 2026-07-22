'use client'

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import OpportunityCard from "@/components/OpportunityCard";

const categories = ["Volunteering", "Hackathon", "Scholarship", "Workshop", "Competition", "Leadership"];

type FavoriteRow = {
  opportunity_id: string;
  external_opportunities: {
    id: string; title: string; description: string; deadline?: string; category?: string;
  } | null;
};

type SignupRow = {
  id: string;
  volunteer_requests: { title: string } | null;
};

type ProfileClientProps = {
  userId: string;
  initialName: string;
  initialInterests: string[];
  initialFavorites: FavoriteRow[];
  initialSignups: SignupRow[];
};

export default function ProfileClient({
  userId, initialName, initialInterests, initialFavorites, initialSignups,
}: ProfileClientProps) {
  const supabase = createClient();
  const [name, setName] = useState(initialName);
  const [rollingSpeed, setRollingSpeed] = useState(40);
  const [interests, setInterests] = useState<Set<string>>(new Set(initialInterests));
  const [favorites, setFavorites] = useState(initialFavorites);
  const [signups, setSignups] = useState(initialSignups);
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ name, interests: Array.from(interests) })
      .eq("id", userId);
    setSaving(false);
  }

  function toggleInterest(cat: string) {
    setInterests((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  async function removeFavorite(opportunityId: string) {
    await supabase
      .from("external_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("opportunity_id", opportunityId);
    setFavorites((prev) => prev.filter((f) => f.opportunity_id !== opportunityId));
  }

  async function removeSignup(signupId: string) {
    await supabase.from("volunteer_signups").delete().eq("id", signupId);
    setSignups((prev) => prev.filter((s) => s.id !== signupId));
  }

  return (
    <div className="pt-32 pb-32 px-6 sm:px-10 max-w-4xl mx-auto space-y-16">

      <section>
        <h1 className="text-4xl font-bold mb-6">Your Profile</h1>

        <div className="glass rounded-2xl p-6 space-y-5">
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
            <label className="text-sm font-medium text-gray-700">Card scroll speed</label>
            <div className="flex items-center gap-4 mt-2">
              <button onClick={() => setRollingSpeed((s) => Math.min(s + 5, 80))} className="glass w-9 h-9 rounded-full flex items-center justify-center text-lg hover:scale-105 transition-all duration-200">−</button>
              <span className="text-sm w-20 text-center">{rollingSpeed}s / loop</span>
              <button onClick={() => setRollingSpeed((s) => Math.max(s - 5, 15))} className="glass w-9 h-9 rounded-full flex items-center justify-center text-lg hover:scale-105 transition-all duration-200">+</button>
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="bg-black text-white rounded-xl px-6 py-2 text-sm font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Your Interests</h2>
        <p className="text-sm text-gray-600 mb-4">
          Opportunities matching these will show first in your feed.
        </p>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleInterest(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                interests.has(cat) ? "bg-black text-white" : "glass text-gray-700 hover:bg-white/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-sm text-gray-500">No favorites yet — go explore opportunities!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {favorites.map((f) => f.external_opportunities && (
              <div key={f.opportunity_id} className="relative">
                <OpportunityCard {...f.external_opportunities} isFavorited onToggleFavorite={() => removeFavorite(f.opportunity_id)} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Volunteering You&apos;ve Signed Up For</h2>
        {signups.length === 0 ? (
          <p className="text-sm text-gray-500">You haven&apos;t signed up for anything yet.</p>
        ) : (
          <div className="space-y-3">
            {signups.map((s) => (
              <div key={s.id} className="glass rounded-xl px-5 py-4 flex justify-between items-center">
                <p className="font-medium">{s.volunteer_requests?.title}</p>
                <button
                  onClick={() => removeSignup(s.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Withdraw
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}