'use client'

type Opportunity = {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  category?: string;
  link?: string;
  requirements?: string[];
};

type OpportunityModalProps = {
  opportunity: Opportunity | null;
  onClose: () => void;
};

export default function OpportunityModal({ opportunity, onClose }: OpportunityModalProps) {
  if (!opportunity) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg glass rounded-3xl shadow-xl p-8 animate-popup"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-2xl text-gray-500 hover:text-black transition-all duration-200"
          aria-label="Close"
        >
          ✕
        </button>

        {opportunity.category && (
          <span className="inline-block text-xs font-medium text-gray-600 bg-white/60 border border-gray-300 rounded-full px-3 py-1 mb-3">
            {opportunity.category}
          </span>
        )}

        <h2 className="text-2xl font-bold">{opportunity.title}</h2>
        <p className="text-gray-700 mt-3">{opportunity.description}</p>
        <p className="text-sm text-gray-500 mt-4">Deadline: {opportunity.deadline ?? "TBD"}</p>

        {opportunity.requirements && opportunity.requirements.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">Requirements:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              {opportunity.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {opportunity.link && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">Relevant links:</h3>
            <a
              href={opportunity.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline mt-2 inline-block break-all"
            >
              {opportunity.link}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}