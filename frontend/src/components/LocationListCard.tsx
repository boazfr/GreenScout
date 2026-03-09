"use client";

import React from "react";
import { ActivityLocation } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/categories";

interface LocationListCardProps {
  location: ActivityLocation;
  isHighlighted: boolean;
  onClick: () => void;
}

const LocationListCard = React.forwardRef<HTMLDivElement, LocationListCardProps>(
  ({ location, isHighlighted, onClick }, ref) => {
    const cat = CATEGORY_CONFIG[location.category] || {
      label: location.category,
      color: "bg-gray-100 text-gray-700",
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`cursor-pointer rounded-xl bg-white p-4 transition ${
          isHighlighted
            ? "ring-2 ring-emerald-500 shadow-md"
            : "hover:shadow-md"
        }`}
      >
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.color}`}
        >
          {cat.label}
        </span>
        <h3 className="mt-1.5 text-sm font-semibold text-gray-900">
          {location.name}
        </h3>
        {location.description && (
          <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2">
            {location.description}
          </p>
        )}
      </div>
    );
  }
);

LocationListCard.displayName = "LocationListCard";

export default LocationListCard;
