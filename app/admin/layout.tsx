import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Check if user is admin
  const client = await clientPromise;
  const db = client.db("zyrox");
  const user = await db.collection("users").findOne({ email: session.user.email });

  if (!user || user.role !== "admin") {
    redirect("/admin/setup");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {children}
    </div>
  );
}
