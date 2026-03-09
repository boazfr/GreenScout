"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { User, ActivityLocation } from "@/lib/types";
import Navbar from "@/components/Navbar";
import MapWrapper from "@/components/MapWrapper";
import LocationCard from "@/components/LocationCard";
import LocationListCard from "@/components/LocationListCard";

const DEFAULT_CENTER: [number, number] = [32.0853, 34.7818]; // Tel Aviv

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<ActivityLocation[]>([]);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [selected, setSelected] = useState<ActivityLocation | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const cardRefs = useRef<Record<number, HTMLDivElement>>({});

  useEffect(() => {
    apiFetch<User>("/api/auth/me")
      .then(setUser)
      .catch(() => {
        window.location.href = "/";
      });
  }, []);

  useEffect(() => {
    if (!user) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter([latitude, longitude]);
        fetchLocations(latitude, longitude);
      },
      () => {
        fetchLocations(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
      }
    );
  }, [user]);

  function fetchLocations(lat: number, lon: number) {
    apiFetch<ActivityLocation[]>(
      `/api/locations/nearby?lat=${lat}&lon=${lon}&radius=10000`
    )
      .then(setLocations)
      .finally(() => setLoading(false));
  }

  function handleMarkerSelect(location: ActivityLocation | null) {
    setSelected(location);
    setHighlightedId(location?.id ?? null);
    if (location && cardRefs.current[location.id]) {
      cardRefs.current[location.id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  function handleCardClick(location: ActivityLocation) {
    setSelected(location);
    setHighlightedId(location.id);
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      {/* Map section */}
      <div className="relative h-[60vh] flex-shrink-0">
        {loading ? (
          <div className="flex h-full items-center justify-center bg-gray-50">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          </div>
        ) : (
          <MapWrapper
            center={center}
            locations={locations}
            onSelectLocation={handleMarkerSelect}
            highlightedId={highlightedId}
          />
        )}

        {/* Navbar floating over the map */}
        <div className="absolute top-0 left-0 right-0 z-[1000]">
          <Navbar user={user} />
        </div>

        {/* Selected location card overlay */}
        {selected && (
          <LocationCard
            location={selected}
            onClose={() => {
              setSelected(null);
              setHighlightedId(null);
            }}
          />
        )}
      </div>

      {/* Scrollable list section */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="px-4 py-3">
          <h2 className="text-sm font-medium text-gray-500">
            {locations.length} {locations.length === 1 ? "place" : "places"} nearby
          </h2>
        </div>
        <div className="flex flex-col gap-2 px-4 pb-4">
          {locations.map((loc) => (
            <LocationListCard
              key={loc.id}
              ref={(el) => {
                if (el) cardRefs.current[loc.id] = el;
              }}
              location={loc}
              isHighlighted={highlightedId === loc.id}
              onClick={() => handleCardClick(loc)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
