'use client'

import OpportunityCard from "@/components/OpportunityCard";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  category?: string;
};

type ScrollingRowProps = {
  title: string;
  opportunities: Opportunity[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
};

export default function ScrollingRow({
  title,
  opportunities,
  favorites,
  onToggleFavorite,
}: ScrollingRowProps) {
  // duplicate the list so the loop looks seamless
  const looped = [...opportunities, ...opportunities];

  return (
    <section className="mt-12">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="overflow-hidden">
        <div className="marquee-track flex gap-6 w-max">
          {looped.map((opp, i) => (
            <OpportunityCard
              key={`${opp.id}-${i}`}
              title={opp.title}
              description={opp.description}
              deadline={opp.deadline}
              category={opp.category}
              isFavorited={favorites.has(opp.id)}
              onToggleFavorite={() => onToggleFavorite(opp.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}