"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SellerDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== "seller") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="mb-4">You must be an approved seller to access this page.</p>
          <Link
            href="/seller/register"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            Become a Seller
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md rounded-xl p-8 border border-slate-800 text-center">
        <h1 className="text-3xl font-bold text-violet-400 mb-6">Seller Dashboard</h1>
        <p className="text-slate-300 mb-4">Welcome, {session.user?.name} (Seller)</p>
        <p className="text-slate-400 mb-6">This is your seller panel. More features coming soon!</p>
        <Link
          href="/"
          className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors font-medium"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}