'use client'

import { useState, useMemo } from "react";

type SearchableItem = {
  id: string;
  title: string;
  description: string;
  category?: string;
};

type SearchBarProps<T extends SearchableItem> = {
  items: T[];
  onSelect: (item: T) => void;
};

export default function SearchBar<T extends SearchableItem>({ items, onSelect }: SearchBarProps<T>) {
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
    );
  }, [search, items]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      {results.length > 0 && (
        <div className="glass rounded-2xl shadow-lg mb-3 max-h-64 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item);
                setSearch("");
              }}
              className="w-full text-left px-5 py-3 hover:bg-white/60 transition-all duration-200 border-b border-white/40 last:border-none"
            >
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-gray-600 truncate">{item.description}</p>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          search
        </span>
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-6 py-3 rounded-full glass shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
        />
      </div>
    </div>
  );
}