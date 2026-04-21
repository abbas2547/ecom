"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { DashboardStats, User, Order } from "@/lib/types";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError("Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Error fetching stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh stats every 5 seconds to show new orders
    const interval = setInterval(fetchStats, 5000);
    
    return () => clearInterval(interval);
    // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl font-bold mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError("");
              fetchStats();
            }}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-violet-400">ELUEE Admin</h1>
              <p className="text-slate-400">Welcome, {session?.user?.name || "Admin"}</p>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden sm:flex space-x-1">
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 text-violet-400 border-b-2 border-violet-400 hover:text-violet-300"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/dashboard/user"
                  className="px-4 py-2 text-slate-400 hover:text-violet-400 transition-colors"
                >
                  Users
                </Link>
              </nav>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{stats?.totalUsers || 0}</p>
              </div>
              <div className="text-4xl text-blue-400/40">👥</div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-200 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-violet-400 mt-2">{stats?.totalProducts || 0}</p>
              </div>
              <div className="text-4xl text-violet-400/40">📦</div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">{stats?.totalOrders || 0}</p>
              </div>
              <div className="text-4xl text-emerald-400/40">🛒</div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-amber-400 mt-2">${(stats?.totalRevenue || 0).toFixed(2)}</p>
              </div>
              <div className="text-4xl text-amber-400/40">💰</div>
            </div>
          </div>
        </div>

        {/* Recent Users and Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-violet-400">Recent Users</h2>
              <Link href="/admin/dashboard/user" className="text-sm text-violet-400 hover:text-violet-300">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user: User) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
                          {user.name?.[0] || "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{user.name || "Unknown"}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin" 
                        ? "bg-red-500/20 text-red-400" 
                        : "bg-slate-700 text-slate-300"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">No users yet</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold text-violet-400 mb-6">Recent Orders</h2>
            <div className="space-y-3">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order: Order) => (
                  <div key={order._id} className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">Order #{order._id?.slice(-6)}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {order.products?.length || 0} product{(order.products?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-400">${order.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                          order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                          order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">No orders yet</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
