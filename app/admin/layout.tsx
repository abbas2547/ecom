import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Layout no longer performs auth redirect; middleware handles protected routes.
  return <div className="min-h-screen bg-slate-950">{children}</div>;
}
