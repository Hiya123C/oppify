'use client'

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import OpportunityCard from "@/components/OpportunityCard";
import OpportunityModal from "@/components/OpportunityModal";
import { getDefaultProfile, readProfile, saveProfile, cleanLocalDigits, storedToLocal } from "@/utils/profile";
import { createClient } from "@/utils/supabase/client";
import { SkeletonCard, SkeletonSignupRow } from "@/components/Skeletons";


const categories = ["Volunteering", "Hackathon", "Scholarship", "Workshop", "Competition", "Leadership", "Research", "Internship", "STEM", "Computing", "Humanities", "Arts", "Sports", "Community Service"];

type FavoriteOpportunity = {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  category?: string;
  // type?: string;
  link?: string;
  requirements?: string[];
};

type SignupItem = {
  id: string;
  opportunity_title: string;
  status: string;
};

const favoriteTableCandidates = ["external_favorites"];
const signupTableCandidates = ["volunteer_signups"];

// function cleanLocalDigits(value: string) {
//   let digits = value.replace(/\D/g, "");
//   if (value.trim().startsWith("+65")) digits = digits.slice(2);
//   else if (digits.length === 10 && digits.startsWith("65")) digits = digits.slice(2);
//   return digits.slice(0, 8);
// }

// function storedToLocal(stored: string) {
//   return stored.startsWith("+65") ? stored.slice(3) : stored.replace(/\D/g, "").slice(0, 8);
// }

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
  const [selected, setSelected] = useState<FavoriteOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);
  const [showSetup, setShowSetup] = useState(false);

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

      await supabase.from("profiles").upsert({ id: user.id, email: user.email });

      const loadedProfile = await readProfile(supabase, user.id);
      if (isActive) setProfile(loadedProfile);
      if (isActive && (!loadedProfile.name || !loadedProfile.contactNumber)) {
        setShowSetup(true);
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
            .select("id, title, description, deadline, category, type, link, requirements")
            .in("id", ids);

          if (opportunities) {
            setFavorites(
              opportunities.map((opp) => ({
                id: String(opp.id),
                title: opp.title ?? "Untitled opportunity",
                description: opp.description ?? "",
                deadline: opp.deadline ?? "To be determined",
                category: opp.category ?? undefined,
                // type: opp.type ?? undefined,
                link: opp.link ?? undefined,
                requirements: opp.requirements ?? undefined,
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

    loadProfileData().finally(() => {
      if (isActive) setIsLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [supabase]);

  // async function handleProfileChange(field: "name" | "email" | "contactNumber", value: string) {
  //   const nextProfile = { ...profile, [field]: value };
  //   setProfile(nextProfile);

  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();
  //   if (!user) return;

  //   await saveProfile(supabase, user.id, nextProfile);
  // }

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

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  function handleNameChange(value: string) {
    setProfile((p) => ({ ...p, name: value }));
    setSaveStatus("idle");
  }

  function handlePhoneChange(value: string) {
    const digits = cleanLocalDigits(value);
    setProfile((p) => ({ ...p, contactNumber: digits ? `+65${digits}` : "" }));
    setSaveStatus("idle");
  }

  async function handleSave() {
    const digits = storedToLocal(profile.contactNumber);
    if (digits && !/^[89]\d{7}$/.test(digits)) {
      setSaveStatus("error");
      setSaveMessage("Enter a valid 8-digit Singapore number starting with 8 or 9");
      return;
    }

    setSaveStatus("saving");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaveStatus("error");
      setSaveMessage("You're not logged in");
      return;
    }

    const { error } = await saveProfile(supabase, user.id, profile);
    if (error) {
      console.error("save failed", error);
      setSaveStatus("error");
      setSaveMessage("Couldn't save, try again");
    } else {
      setSaveStatus("saved");
      setShowSetup(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Navbar />

      <div className="pt-32 pb-32 px-6 sm:px-10 lg:px-16 max-w-5xl mx-auto space-y-16">

        <section>
          <h1 className="lg:text-5xl text-4xl font-bold mb-6">Your Profile</h1>

          {/* for onboarding */}
          {showSetup && (
            <div className="cards rounded-2xl p-4 mb-4 flex items-start gap-3 border border-[var(--mid-blue)]">
              <span className="material-symbols-outlined text-[var(--mid-blue)]">waving_hand</span>
              <div>
                <p className="font-semibold">Let's finish setting up!</p>
                <p className="text-sm text-gray-600">
                  Add your name and contact number below, then hit Save. You'll only need to do this once, and it pre-fills your sign-ups.
                </p>
              </div>
            </div>
          )}

          <div className="cards rounded-2xl p-6">
            <h3 className="lg:text-xl text-lg font-bold">Personal Information</h3>
            <p className="text-sm text-gray-600">
              This information will be used to sign up for internal school opportunities.
            </p>
            <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 font-bold ">Name (Actual name)</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`${showSetup && !profile.name ? "ring-2 ring-[var(--mid-blue)]" : ""} w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-black/20`}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-bold">Email</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-bold">Contact number</label>
              <div className="flex mt-1">
                <span className="px-4 py-2 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-600">
                  +65
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="91234567"
                  value={storedToLocal(profile.contactNumber)}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`${showSetup && !profile.contactNumber ? "ring-2 ring-[var(--mid-blue)]" : ""} w-full px-4 py-2 rounded-r-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-black/20`}
                />
              </div>
            </div>

            {/* <div>
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
            </div> */}

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className="bg-[var(--mid-blue)] text-white font-semibold py-2 px-5 rounded-xl hover:brightness-90 transition-all duration-200 disabled:opacity-50"
              >
                {saveStatus === "saving" ? "Saving..." : "Save"}
              </button>
              {saveStatus === "saved" && <span className="text-sm text-green-600">Saved!</span>}
              {saveStatus === "error" && <span className="text-sm text-red-600">{saveMessage}</span>}
            </div>
            </div>
          </div>
        </section>

        {/* do this personalisation... later on */}

        {/* <section>
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
        </section> */}

        <section>
          <h2 className="lg:text-2xl text-xl font-bold mb-4">Your Favourites</h2>
          {isLoading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {[0, 1, 2].map((i) => <SkeletonCard key={i} fullWidth />)}
            </div>
          ) : favorites.length === 0 ? (
            <p className="text-sm text-gray-500">No favourites yet</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {favorites.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  {...opp}
                  fullWidth
                  isFavorited
                  onToggleFavorite={() => handleRemoveFavorite(opp.id)}
                  onClick={() => setSelected(opp)}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="lg:text-2xl text-xl font-bold mb-4">Internal Opportunities</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => <SkeletonSignupRow key={i} />)}
            </div>
          ) : signups.length === 0 ? (
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
      <OpportunityModal opportunity={selected} onClose={() => setSelected(null)} />
    </main>
  );
}