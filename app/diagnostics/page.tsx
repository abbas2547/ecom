"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface HealthStatus {
  status: string;
  database: string;
  timestamp: string;
  error?: string;
}

export default function Diagnostics() {
  const { data: session, status } = useSession();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      setHealth(data);
    } catch {
      setHealth({
        status: "error",
        database: "unknown",
        timestamp: new Date().toISOString(),
        error: "Failed to connect to health check API"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-violet-400 mb-8">System Diagnostics</h1>

        {/* Authentication Status */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-slate-800 mb-6">
          <h2 className="text-xl font-semibold text-violet-400 mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> <span className={status === "authenticated" ? "text-green-400" : "text-red-400"}>{status}</span></p>
            {session && (
              <>
                <p><strong>Name:</strong> {session.user?.name}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Role:</strong> <span className="text-blue-400">Check admin dashboard</span></p>
              </>
            )}
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-slate-800 mb-6">
          <h2 className="text-xl font-semibold text-violet-400 mb-4">Database Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> <span className={health?.status === "healthy" ? "text-green-400" : "text-red-400"}>{health?.status}</span></p>
            <p><strong>Database:</strong> <span className={health?.database === "connected" ? "text-green-400" : "text-red-400"}>{health?.database}</span></p>
            <p><strong>Last Check:</strong> {health?.timestamp ? new Date(health.timestamp).toLocaleString() : "Never"}</p>
            {health?.error && (
              <p><strong>Error:</strong> <span className="text-red-400">{health.error}</span></p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-slate-800 mb-6">
          <h2 className="text-xl font-semibold text-violet-400 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/admin/setup"
              className="px-4 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors text-center"
            >
              Make Me Admin
            </a>
            <a
              href="/admin/dashboard"
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-center"
            >
              Admin Dashboard
            </a>
            <a
              href="/login"
              className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-center"
            >
              Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
}
