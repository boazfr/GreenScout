"use client";

import { User } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Navbar({ user }: { user: User }) {
  return (
    <nav className="flex items-center justify-between bg-green-700 px-6 py-3 text-white">
      <span className="text-xl font-bold">greenScout</span>
      <div className="flex items-center gap-4">
        {user.pictureUrl && (
          <img
            src={user.pictureUrl}
            alt={user.name}
            className="h-8 w-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        )}
        <span className="text-sm">{user.name}</span>
        <a
          href={`${API_URL}/api/auth/logout`}
          className="rounded bg-green-800 px-3 py-1 text-sm hover:bg-green-900 transition"
        >
          Logout
        </a>
      </div>
    </nav>
  );
}
