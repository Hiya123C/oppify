type OpportunityCardProps = {
  title: string;
  description: string;
  deadline?: string;
  category?: string;
};

export default function OpportunityCard({
  title,
  description,
  deadline = "TBD",
  category,
}: OpportunityCardProps) {
  return (
    <div className="bg-white/50 backdrop-blur-md border border-gray-300 rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200">
      {category && (
        <span className="inline-block text-xs font-medium text-gray-600 bg-white/60 border border-gray-300 rounded-full px-3 py-1 mb-3">
          {category}
        </span>
      )}
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <p className="text-xs text-gray-500 mt-3">Deadline: {deadline}</p>
    </div>
  );
}

