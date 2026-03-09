"use client";

import { ActivityLocation } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/categories";

interface LocationCardProps {
  location: ActivityLocation;
  onClose: () => void;
}

export default function LocationCard({ location, onClose }: LocationCardProps) {
  const cat = CATEGORY_CONFIG[location.category] || {
    label: location.category,
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="absolute bottom-6 left-4 right-4 z-[1000] mx-auto max-w-md animate-slide-up">
      <div className="rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.color}`}
            >
              {cat.label}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">
              {location.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="ml-3 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {location.description}
        </p>
      </div>
    </div>
  );
}
