"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ActivityLocation } from "@/lib/types";

// Fix default marker icon paths (Leaflet + bundlers issue)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProps {
  center: [number, number];
  locations: ActivityLocation[];
}

export default function Map({ center, locations }: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-[calc(100vh-8rem)] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[
            loc.location.coordinates[1],
            loc.location.coordinates[0],
          ]}
        >
          <Popup>
            <strong>{loc.name}</strong>
            <br />
            <span className="text-xs text-gray-500">{loc.category}</span>
            <br />
            {loc.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
