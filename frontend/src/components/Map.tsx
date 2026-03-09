"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, CircleMarker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ActivityLocation } from "@/lib/types";

// Default blue marker icon
const locationIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

// Highlighted green marker icon
const highlightedIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 30px; height: 30px;
    background: #10b981;
    border: 3px solid #ffffff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

interface MapProps {
  center: [number, number];
  locations: ActivityLocation[];
  onSelectLocation: (location: ActivityLocation | null) => void;
  highlightedId?: number | null;
}

function MapClickHandler({ onDeselect }: { onDeselect: () => void }) {
  useMapEvents({
    click: () => onDeselect(),
  });
  return null;
}

function PanToHighlighted({
  locations,
  highlightedId,
}: {
  locations: ActivityLocation[];
  highlightedId?: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (highlightedId == null) return;
    const loc = locations.find((l) => l.id === highlightedId);
    if (loc) {
      map.panTo([loc.location.coordinates[1], loc.location.coordinates[0]], {
        animate: true,
        duration: 0.4,
      });
    }
  }, [highlightedId, locations, map]);

  return null;
}

export default function Map({ center, locations, onSelectLocation, highlightedId }: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onDeselect={() => onSelectLocation(null)} />
      <PanToHighlighted locations={locations} highlightedId={highlightedId} />

      {/* User location — pulsing blue dot */}
      <CircleMarker
        center={center}
        radius={8}
        pathOptions={{
          fillColor: "#4285F4",
          fillOpacity: 1,
          color: "#ffffff",
          weight: 3,
        }}
      />

      {/* Attraction markers */}
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[
            loc.location.coordinates[1],
            loc.location.coordinates[0],
          ]}
          icon={loc.id === highlightedId ? highlightedIcon : locationIcon}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e.originalEvent);
              onSelectLocation(loc);
            },
          }}
        />
      ))}
    </MapContainer>
  );
}
