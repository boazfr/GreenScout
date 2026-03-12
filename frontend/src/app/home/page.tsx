"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { User, ActivityLocation } from "@/lib/types";
import Navbar from "@/components/Navbar";
import MapWrapper from "@/components/MapWrapper";
import LocationCard from "@/components/LocationCard";
import LocationListCard from "@/components/LocationListCard";
import CategoryFilter from "@/components/CategoryFilter";
import RadiusSlider from "@/components/RadiusSlider";

const DEFAULT_CENTER: [number, number] = [32.0853, 34.7818]; // Tel Aviv
const DEFAULT_RADIUS_KM = 10;

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<ActivityLocation[]>([]);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [selected, setSelected] = useState<ActivityLocation | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [loading, setLoading] = useState(true);
  const centerRef = useRef<[number, number]>(DEFAULT_CENTER);
  const radiusRef = useRef(DEFAULT_RADIUS_KM);
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
        centerRef.current = [latitude, longitude];
        fetchLocations(latitude, longitude, null, DEFAULT_RADIUS_KM);
      },
      () => {
        fetchLocations(DEFAULT_CENTER[0], DEFAULT_CENTER[1], null, DEFAULT_RADIUS_KM);
      }
    );
  }, [user]);

  function fetchLocations(lat: number, lon: number, category: string | null, km: number) {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      radius: String(km * 1000),
    });
    if (category) params.set("category", category);

    apiFetch<ActivityLocation[]>(`/api/locations/nearby?${params}`)
      .then(setLocations)
      .finally(() => setLoading(false));
  }

  function handleCategoryChange(category: string | null) {
    setActiveCategory(category);
    setSelected(null);
    setHighlightedId(null);
    setLoading(true);
    fetchLocations(centerRef.current[0], centerRef.current[1], category, radiusRef.current);
  }

  function handleRadiusChange(km: number) {
    setRadiusKm(km);
    radiusRef.current = km;
    setSelected(null);
    setHighlightedId(null);
    setLoading(true);
    fetchLocations(centerRef.current[0], centerRef.current[1], activeCategory, km);
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
      {/* Navbar */}
      <div className="z-[1000] flex-shrink-0">
        <Navbar user={user} />
      </div>

      {/* Main content: sidebar left, map right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: filters + list */}
        <div className="w-96 flex-shrink-0 overflow-y-auto bg-gray-50 border-r border-gray-200">
          <CategoryFilter selected={activeCategory} onChange={handleCategoryChange} />
          <RadiusSlider radiusKm={radiusKm} onChange={handleRadiusChange} />
          <div className="pb-1 text-center">
            <h2 className="text-sm font-medium text-gray-500">
              {locations.length} {locations.length === 1 ? "place" : "places"} within {radiusKm} km
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

        {/* Right: map */}
        <div className="relative flex-1">
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
      </div>
    </div>
  );
}
