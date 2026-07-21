import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import InternalOpportunitiesClient from "@/components/InternalOpportunitiesClient";

export default async function Page() {
  const supabase = await createClient();

  const { data: opportunities, error } = await supabase
    .from("internal_opportunities")
    .select("*")
    .order("created_at", { ascending: false });

  const normalizedOpportunities = (opportunities ?? []).map((opp) => ({
    id: String(opp.id),
    title: opp.title ?? "Untitled opportunity",
    description: opp.description ?? "",
    deadline: opp.deadline ?? undefined,
    category: opp.category ?? undefined,
    link: opp.link ?? undefined,
    requirements: Array.isArray(opp.requirements) ? opp.requirements : [],
  }));

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Navbar />
      <InternalOpportunitiesClient opportunities={normalizedOpportunities} />
      {error ? (
        <p className="px-10 pb-10 text-sm text-red-600">Unable to load internal opportunities right now.</p>
      ) : null}
    </main>
  );
}