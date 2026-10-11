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

const MIN_CARDS = 8;
const CARD_STEP_PX = 312;
const SPEED_PX_PER_SEC = 40;

export default function ScrollingRow({
  title,
  opportunities,
  favorites,
  onToggleFavorite,
  onSelect,
}: ScrollingRowProps) {
  if (opportunities.length === 0) return null;

  const repeats = Math.ceil(MIN_CARDS / opportunities.length);
  const base = Array.from({ length: repeats }).flatMap(() => opportunities);
  const looped = [...base, ...base];
  const duration = (base.length * CARD_STEP_PX) / SPEED_PX_PER_SEC;

  return (
    <section className="mt-12">
      <h2 className="lg:text-3xl text-2xl font-bold mb-4 px-6 sm:px-10 max-w-7xl mx-auto">{title}</h2>

      <div className="marquee-row w-full overflow-x-hidden overflow-y-visible">
        <div
          className="marquee-track flex w-max py-6"
          style={{ ["--marquee-duration" as string]: `${duration}s` }}
        >
          {looped.map((opp, i) => (
            <div key={`${opp.id}-${i}`} className="pr-6 flex" aria-hidden={i >= base.length}>
              <OpportunityCard
                title={opp.title}
                description={opp.description}
                deadline={opp.deadline}
                category={opp.category}
                isFavorited={favorites.has(String(opp.id))}
                onToggleFavorite={() => onToggleFavorite(String(opp.id))}
                onClick={() => onSelect(opp)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}