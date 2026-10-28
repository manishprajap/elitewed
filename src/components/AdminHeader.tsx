"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// ─── Page title map ───────────────────────────────────────────
const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/admin":               { title: "Dashboard",     subtitle: "Welcome back" },
  "/admin/users":         { title: "Users",          subtitle: "Manage all registered members" },
  "/admin/interests":     { title: "Interests",      subtitle: "Track member interest requests" },
  "/admin/matches":       { title: "Matches",        subtitle: "Oversee matched profiles" },
  "/admin/verification":  { title: "Verification",   subtitle: "Review pending documents" },
  "/admin/subscriptions": { title: "Subscriptions",  subtitle: "Manage plans & billing" },
  "/admin/revenue":       { title: "Revenue",        subtitle: "Financial analytics & reports" },
  "/admin/reports":       { title: "Reports",        subtitle: "Flagged content & complaints" },
  "/admin/settings":      { title: "Settings",       subtitle: "Platform configuration" },
};

// ─── Types ────────────────────────────────────────────────────
type Notif = {
  id: number;
  type: "match" | "signup" | "report" | "subscription";
  message: string;
  time: string;
  read: boolean;
};

type AdminInfo = {
  id: number;
  name: string;
  email: string;
  role: string;
};

// ─── Notifications ────────────────────────────────────────────
const initialNotifs: Notif[] = [
  { id: 1, type: "match",        message: "Zara Khan & Kabir Singh accepted each other's interest", time: "2m ago",  read: false },
  { id: 2, type: "report",       message: "Profile #4821 has been flagged for review",              time: "18m ago", read: false },
  { id: 3, type: "signup",       message: "Neha Gupta completed profile verification",               time: "1h ago",  read: false },
  { id: 4, type: "subscription", message: "Vikram Rao upgraded to Platinum plan",                   time: "3h ago",  read: true  },
  { id: 5, type: "signup",       message: "14 new profiles registered today",                        time: "5h ago",  read: true  },
];

const notifIcon: Record<Notif["type"], { bg: string; el: React.ReactNode }> = {
  match:        { bg: "bg-rose-100 text-rose-600",  el: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
  signup:       { bg: "bg-blue-100 text-blue-600",  el: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  report:       { bg: "bg-red-100 text-red-600",    el: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
  subscription: { bg: "bg-amber-100 text-amber-600",el: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
};

// ─── Helpers ──────────────────────────────────────────────────
function getAdminFromCookie(): AdminInfo | null {
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_token="));
    if (!match) return null;
    const encoded = match.split("=")[1];
    return JSON.parse(atob(encoded)) as AdminInfo;
  } catch {
    return null;
  }
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Props ────────────────────────────────────────────────────
type AdminHeaderProps = { onMenuToggle?: () => void };

// ─── Component ────────────────────────────────────────────────
export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const meta     = pageMeta[pathname] ?? { title: "Admin", subtitle: "EliteWedding Panel" };

  const [admin, setAdmin]               = useState<AdminInfo | null>(null);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [notifOpen, setNotifOpen]       = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [notifs, setNotifs]             = useState(initialNotifs);
  const [signingOut, setSigningOut]     = useState(false);

  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef  = useRef<HTMLInputElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  // Read admin info from cookie on mount
  useEffect(() => {
    const info = getAdminFromCookie();
    if (info) setAdmin(info);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch { /* ignore */ } finally {
      router.push("/admin");
      router.refresh();
    }
  }

  // Derived display values from cookie
  const displayName     = admin?.name  ?? "Admin";
  const displayEmail    = admin?.email ?? "";
  const displayRole     = admin?.role  ?? "admin";
  const displayInitials = getInitials(displayName);

  return (
    <header className="h-14 bg-white border-b border-[#EDE8E3] flex items-center px-5 gap-3 shrink-0 relative z-30">

      {/* Hamburger */}
      <button onClick={onMenuToggle} className="p-1.5 rounded-lg text-[#9C8070] hover:text-[#1A0A00] hover:bg-[#FAF8F5] transition-colors shrink-0" aria-label="Toggle sidebar">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* Page title */}
      <div className={`${searchOpen ? "hidden sm:block" : "block"} min-w-0`}>
        <h1 className="text-[14px] font-semibold text-[#1A0A00] leading-none truncate">{meta.title}</h1>
        <p className="text-[10px] text-[#9C8070] mt-0.5 truncate">
          {pathname === "/admin" ? `Welcome back, ${displayName}` : meta.subtitle}
        </p>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative flex items-center">
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#C9782A] rounded-xl px-3 py-1.5 w-56 sm:w-72">
            <svg width="13" height="13" className="text-[#9C8070] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input ref={searchRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search profiles, users..." className="flex-1 bg-transparent text-[13px] text-[#1A0A00] placeholder:text-[#9C8070]/60 outline-none" />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-[#9C8070] hover:text-[#1A0A00]">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)} className="p-2 rounded-xl text-[#9C8070] hover:text-[#1A0A00] hover:bg-[#FAF8F5] transition-colors">
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }} className="relative p-2 rounded-xl text-[#9C8070] hover:text-[#1A0A00] hover:bg-[#FAF8F5] transition-colors">
          <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border border-white">{unread}</span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#EDE8E3] rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDE8E3]">
              <div>
                <p className="text-[13px] font-semibold text-[#1A0A00]">Notifications</p>
                {unread > 0 && <p className="text-[11px] text-[#9C8070]">{unread} unread</p>}
              </div>
              {unread > 0 && <button onClick={markAllRead} className="text-[11px] text-[#C9782A] font-medium hover:underline">Mark all read</button>}
            </div>
            <div className="divide-y divide-[#EDE8E3] max-h-72 overflow-y-auto">
              {notifs.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[#FAF8F5] transition-colors ${!n.read ? "bg-[#FDF9F5]" : ""}`} onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}>
                  <div className={`w-7 h-7 rounded-full ${notifIcon[n.type].bg} flex items-center justify-center shrink-0 mt-0.5`}>{notifIcon[n.type].el}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] leading-snug ${!n.read ? "text-[#1A0A00] font-medium" : "text-[#6B5A50]"}`}>{n.message}</p>
                    <p className="text-[10px] text-[#9C8070] mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 bg-[#C9782A] rounded-full shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-[#EDE8E3]">
              <button className="w-full text-[12px] text-[#C9782A] font-medium hover:underline">View all notifications →</button>
            </div>
          </div>
        )}
      </div>

      {/* Profile dropdown */}
      <div className="relative" ref={profileRef}>
        <button onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-[#FAF8F5] transition-colors">
          {/* Dynamic initials */}
          <div className="w-7 h-7 rounded-full bg-[#C9782A] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {displayInitials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[12px] font-semibold text-[#1A0A00] leading-none capitalize">{displayName}</p>
            <p className="text-[10px] text-[#9C8070] capitalize">{displayRole}</p>
          </div>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={`text-[#9C8070] transition-transform ${profileOpen ? "rotate-180" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#EDE8E3] rounded-2xl shadow-xl overflow-hidden">
            {/* Dynamic user info */}
            <div className="px-4 py-3 border-b border-[#EDE8E3]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C9782A] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  {displayInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#1A0A00] truncate capitalize">{displayName}</p>
                  <p className="text-[10px] text-[#9C8070] truncate">{displayEmail}</p>
                </div>
              </div>
            </div>

            <div className="py-1">
              {[
                { label: "My Profile",    icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
                { label: "Settings",      icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                { label: "Activity Log",  icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
              ].map((item) => (
                <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#6B5A50] hover:bg-[#FAF8F5] hover:text-[#1A0A00] transition-colors text-left">
                  <span className="text-[#9C8070]">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-[#EDE8E3] py-1">
              <button onClick={handleSignOut} disabled={signingOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-rose-500 hover:bg-rose-50 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed">
                {signingOut ? (
                  <><svg width="14" height="14" className="animate-spin text-rose-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Signing out...</>
                ) : (
                  <><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Sign Out</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}