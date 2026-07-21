//unused

type FilterBarProps = {
  filters?: string[];
};

export default function FilterBar({
  filters = ["Category", "Duration", "Type"],
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {filters.map((filter) => (
        <button
          key={filter}
          className="px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-gray-400 text-sm hover:bg-white/70 transition-all duration-200"
        >
          {filter} ▾
        </button>
      ))}
    </div>
  );
}