"use client";

import { User } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Navbar({ user }: { user: User }) {
  return (
    <nav className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
      <span className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md">
        greenScout
      </span>
      <div className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-3 pr-1.5 shadow-md">
        <span className="text-sm text-gray-700">{user.name}</span>
        {user.pictureUrl && (
          <img
            src={user.pictureUrl}
            alt={user.name}
            className="h-7 w-7 rounded-full"
            referrerPolicy="no-referrer"
          />
        )}
        <a
          href={`${API_URL}/api/auth/logout`}
          className="ml-1 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </a>
      </div>
    </nav>
  );
}
