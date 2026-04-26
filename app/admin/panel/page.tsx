import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";
  if (!isAdmin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-lg">
        <h1 className="text-2xl font-bold text-violet-400 mb-4">Admin Panel</h1>
        <p className="text-slate-300 mb-4">This is a simple admin panel placeholder page.</p>
        <div className="flex space-x-3">
          <Link href="/admin/dashboard" className="px-4 py-2 bg-violet-600 rounded-md">Dashboard</Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="px-4 py-2 bg-red-600 rounded-md">Logout</button>
          </form>
        </div>
      </div>
    </div>
  );
}
