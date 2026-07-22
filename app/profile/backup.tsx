import Navbar from "@/components/Navbar";
import ProfileClient from "@/components/ProfileClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: favorites } = await supabase
    .from("external_favorites")
    .select("opportunity_id, external_opportunities(*)")
    .eq("user_id", user.id);

  const { data: signups } = await supabase
    .from("volunteer_signups")
    .select("id, volunteer_requests(title)")
    .eq("user_id", user.id);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Navbar />
      <ProfileClient
        userId={user.id}
        initialName={profile?.name ?? ""}
        initialInterests={profile?.interests ?? []}
        initialFavorites={favorites ?? []}
        initialSignups={signups ?? []}
      />
    </main>
  );
}