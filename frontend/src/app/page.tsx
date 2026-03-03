const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-green-50">
      <h1 className="text-5xl font-bold text-green-800 mb-4">greenScout</h1>
      <p className="text-lg text-green-700 mb-8">
        Find nature activities near you for the whole family.
      </p>
      <a
        href={`${API_URL}/oauth2/authorization/google`}
        className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition"
      >
        Sign in with Google
      </a>
    </main>
  );
}
