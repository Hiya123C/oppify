'use client'

import OpportunityCard from "./OpportunityCard";

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
  onSelect: (opp: Opportunity) => void;
};

export default function ScrollingRow({
  title,
  opportunities,
  favorites,
  onToggleFavorite,
  onSelect,
}: ScrollingRowProps) {
  const looped = [...opportunities, ...opportunities];

  return (
    <section className="mt-12">
      <h1 className="text-3xl font-bold mb-4 px-10 max-w-7xl mx-auto">{title}</h1>

      {/* full-bleed wrapper, breaks out of the padded container */}
      <div className="w-full overflow-x-hidden overflow-y-visible">
        <div className="marquee-track flex gap-6 w-max py-6 px-10">
          {looped.map((opp, i) => (
            <OpportunityCard
              key={`${opp.id}-${i}`}
              title={opp.title}
              description={opp.description}
              deadline={opp.deadline}
              category={opp.category}
              isFavorited={favorites.has(opp.id)}
              onToggleFavorite={() => onToggleFavorite(opp.id)}
              onClick={() => onSelect(opp)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}