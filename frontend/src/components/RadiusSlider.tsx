"use client";

interface RadiusSliderProps {
  radiusKm: number;
  onChange: (radiusKm: number) => void;
}

export default function RadiusSlider({ radiusKm, onChange }: RadiusSliderProps) {
  return (
    <div className="flex justify-center items-center gap-2.5 px-4 py-2">
      <div className="flex items-center gap-2.5 bg-white rounded-full px-4 py-1.5 shadow-sm">
        <span className="text-xs text-gray-400">1</span>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={radiusKm}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-28 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900"
        />
        <span className="text-xs text-gray-400">30</span>
      </div>
      <span className="text-sm font-medium text-gray-700 tabular-nums">
        {radiusKm} km
      </span>
    </div>
  );
}
