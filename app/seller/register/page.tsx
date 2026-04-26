"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SellerRegister() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [storeName, setStoreName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!storeName.trim()) {
      setMessage("❌ Error: Store Name cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/seller/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storeName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Success! Seller request submitted for approval. Please wait for an admin to approve your request.");
        setStoreName("");
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch {
      setMessage("❌ Error: Failed to submit seller request.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Not Authenticated</h1>
          <p className="mb-4">Please sign in first to register as a seller.</p>
          <Link
            href="/login"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md rounded-xl p-8 border border-slate-800">
        <h1 className="text-3xl font-bold text-violet-400 mb-6 text-center">Become a Seller</h1>

        <div className="text-center mb-6">
          <p className="text-slate-300 mb-2">Welcome, {session.user?.name}</p>
          <p className="text-sm text-slate-400">{session.user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-slate-300 mb-1">
              Store Name
            </label>
            <input
              type="text"
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-violet-500"
              placeholder="Enter your store name"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-600 rounded-lg transition-colors font-medium"
          >
            {loading ? "Submitting Request..." : "Submit Seller Request"}
          </button>

          {message && (
            <div className="text-center text-sm">
              <p className={message.includes("✅") ? "text-green-400" : "text-red-400"}>
                {message}
              </p>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-violet-400 hover:text-violet-300 text-sm underline"
          >
            Go to Home →
          </Link>
        </div>
      </div>
    </div>
  );
}