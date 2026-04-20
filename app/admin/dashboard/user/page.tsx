"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import Link from "next/link";

export default function Users() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      setUpdatingId(userId);
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        setError("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Error updating user role");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading users...</p>
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
              <h1 className="text-3xl font-bold text-violet-400">ZYROX Admin</h1>
              <p className="text-slate-400">Welcome, {session?.user?.name || "Admin"}</p>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden sm:flex space-x-1">
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 text-slate-400 hover:text-violet-400 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/dashboard/user"
                  className="px-4 py-2 text-violet-400 border-b-2 border-violet-400 hover:text-violet-300"
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
        {/* Title and Search */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-violet-400 mb-6">User Management</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <div className="text-right whitespace-nowrap">
              <p className="text-slate-400 text-sm">
                Total: <span className="font-bold text-violet-400">{users.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => {
                setError("");
                fetchUsers();
              }}
              className="mt-2 text-sm text-red-400 underline hover:text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 overflow-hidden">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-700">
                    <th className="text-left py-4 px-6 font-semibold text-slate-200">User</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-200">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-200">Role</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-200">Joined</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-200">Last Login</th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-200">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center font-bold">
                              {user.name?.[0] || user.email[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-white">{user.name || "No Name"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-300 text-sm">{user.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                            user.role === "admin"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : "bg-slate-700/50 text-slate-300 border border-slate-600/30"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-sm">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-sm">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Never"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <select
                          value={user.role || "user"}
                          onChange={(e) =>
                            user._id &&
                            updateUserRole(
                              user._id,
                              e.target.value as "admin" | "user"
                            )
                          }
                          disabled={updatingId === user._id}
                          className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-700 disabled:opacity-50 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">
                {searchTerm ? "No users found matching your search" : "No users found"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-violet-400 hover:text-violet-300 text-sm underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-violet-400 mt-1">{users.length}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Admins</p>
            <p className="text-2xl font-bold text-red-400 mt-1">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Regular Users</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {users.filter((u) => u.role !== "admin").length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
