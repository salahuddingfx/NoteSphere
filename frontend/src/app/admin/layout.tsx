"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-black overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
