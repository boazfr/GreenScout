"use client";

import { CATEGORY_CONFIG } from "@/lib/categories";

interface CategoryFilterProps {
  selected: string | null;
  onChange: (category: string | null) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex justify-center gap-2 flex-wrap px-4 py-3">
      <button
        onClick={() => onChange(null)}
        className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
          selected === null
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-600 shadow-sm hover:shadow-md"
        }`}
      >
        All
      </button>
      {Object.entries(CATEGORY_CONFIG).map(([key, { label, icon }]) => (
        <button
          key={key}
          onClick={() => onChange(selected === key ? null : key)}
          className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            selected === key
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600 shadow-sm hover:shadow-md"
          }`}
        >
          <span className="mr-1">{icon}</span>{label}
        </button>
      ))}
    </div>
  );
}
