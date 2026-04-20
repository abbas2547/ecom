"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AdminSetup() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const makeMeAdmin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Success! You are now an admin. Please logout and login again to access /admin/dashboard");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch {
      setMessage("❌ Error: Failed to set up admin access");
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
          <p className="mb-4">Please sign in first to set up admin access.</p>
          <a
            href="/login"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md rounded-xl p-8 border border-slate-800">
        <h1 className="text-3xl font-bold text-violet-400 mb-6 text-center">Admin Setup</h1>

        <div className="text-center mb-6">
          <p className="text-slate-300 mb-2">Welcome, {session.user?.name}</p>
          <p className="text-sm text-slate-400">{session.user?.email}</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-300 text-center">
            Click the button below to grant yourself admin access to the dashboard.
          </p>

          <button
            onClick={makeMeAdmin}
            disabled={loading}
            className="w-full px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-600 rounded-lg transition-colors font-medium"
          >
            {loading ? "Setting up..." : "Make Me Admin"}
          </button>

          {message && (
            <div className="text-center text-sm">
              <p className={message.includes("✅") ? "text-green-400" : "text-red-400"}>
                {message}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/admin/dashboard"
            className="text-violet-400 hover:text-violet-300 text-sm underline"
          >
            Go to Admin Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
