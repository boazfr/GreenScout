"use client";

import dynamic from "next/dynamic";
import { ActivityLocation } from "@/lib/types";

const Map = dynamic(() => import("./Map"), { ssr: false });

interface MapWrapperProps {
  center: [number, number];
  locations: ActivityLocation[];
}

export default function MapWrapper({ center, locations }: MapWrapperProps) {
  return <Map center={center} locations={locations} />;
}
