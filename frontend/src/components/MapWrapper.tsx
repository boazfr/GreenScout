"use client";

import dynamic from "next/dynamic";
import { ActivityLocation } from "@/lib/types";

const Map = dynamic(() => import("./Map"), { ssr: false });

interface MapWrapperProps {
  center: [number, number];
  locations: ActivityLocation[];
  onSelectLocation: (location: ActivityLocation | null) => void;
  highlightedId?: number | null;
}

export default function MapWrapper({ center, locations, onSelectLocation, highlightedId }: MapWrapperProps) {
  return <Map center={center} locations={locations} onSelectLocation={onSelectLocation} highlightedId={highlightedId} />;
}
