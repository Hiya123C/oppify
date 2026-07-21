'use client'

type OpportunityCardProps = {
  title: string;
  description: string;
  deadline?: string;
  category?: string;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
};

export default function OpportunityCard({
  title,
  description,
  deadline = "TBD",
  category,
  isFavorited = false,
  onToggleFavorite,
  onClick,
}: OpportunityCardProps) {
  return (
    <div
      onClick={onClick}
      className="w-72 shrink-0 glass rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.05] transition-all duration-200 cursor-pointer"
    >
      <div className="flex flex-row justify-between items-start">
        {category && (
          <span className="inline-block text-xs font-medium text-gray-600 bg-white/60 border border-gray-300 rounded-full px-3 py-1 mb-3">
            {category}
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          aria-label="Favorite"
          className="hover:scale-110 transition-all duration-200"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0",
              color: isFavorited ? "#e11d48" : "inherit",
            }}
          >
            favorite
          </span>
        </button>
      </div>

      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      {/* <p className="text-xs text-gray-500 mt-3">Deadline: {deadline}</p> */}
    </div>
  );
}