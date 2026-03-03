"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { User, ActivityLocation } from "@/lib/types";
import Navbar from "@/components/Navbar";
import MapWrapper from "@/components/MapWrapper";

const DEFAULT_CENTER: [number, number] = [32.0853, 34.7818]; // Tel Aviv

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<ActivityLocation[]>([]);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [loading, setLoading] = useState(true);

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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar user={user} />
      <main className="p-4">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">
            Finding activities near you...
          </p>
        ) : (
          <MapWrapper center={center} locations={locations} />
        )}
      </main>
    </div>
  );
}
