import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import OpportunitiesClient from "@/components/ExternalOpportunitiesClient";

export default async function Page() {
  const supabase = await createClient();

  const { data: external } = await supabase
    .from("external_opportunities")
    .select("*");

  // const { data: , internal } = await supabase
  //   .from("internal_opportunities")
  //   .select("*");

  const newOpportunities = external?.filter((o) => o.type === "new") ?? [];
  const internationalOpportunities = external?.filter((o) => o.type === "international") ?? [];
  const nationalOpportunities = external?.filter((o) => o.type === "national") ?? [];

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Navbar />
      <OpportunitiesClient
        newOpportunities={newOpportunities}
        internationalOpportunities={internationalOpportunities}
        nationalOpportunities={nationalOpportunities}
      />
    </main>
  );
}