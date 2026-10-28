"use client";

import { usePathname } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Login page pe sidebar/header nahi chahiye
  const isLoginPage = pathname === "/admin" || pathname === "/admin/";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#FAF8F5] overflow-hidden">
      {/* Sidebar - ek baar yahan, sab pages pe aayega */}
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - ek baar yahan, sab pages pe aayega */}
        <AdminHeader />

        {/* Page content yahan render hoga */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}