"use client";

import { JSX, useEffect, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────
type Profile = {
  id: number;
  name: string;
  age: number | null;
  religion: string;
  location: string;
  status: "active" | "pending" | "blocked" | "inactive" | "banned";
  joined: string;
  initials: string;
};

type Activity = {
  id: number;
  type: "signup" | "match" | "subscription" | "report";
  message: string;
  time: string;
};

type StatItem = {
  label: string;
  value: string;
  change: string;
  up: boolean;
};

// ─── Mock data kept for sections without a backing table yet ──
const activities: Activity[] = [
  { id: 1, type: "signup", message: "Neha Gupta created a new profile", time: "2m ago" },
  { id: 2, type: "match", message: "Match accepted: Zara & Kabir", time: "15m ago" },
  { id: 3, type: "subscription", message: "Rohan Nair upgraded to Gold plan", time: "1h ago" },
  { id: 4, type: "report", message: "Profile reported: ID #4821", time: "2h ago" },
];

const avatarColors = [
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-teal-100 text-teal-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
];

function colorForId(id: number) {
  return avatarColors[id % avatarColors.length];
}

const statusStyle: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  blocked: "bg-rose-50 text-rose-700 border-rose-200",
  banned: "bg-rose-50 text-rose-700 border-rose-200",
  inactive: "bg-gray-50 text-gray-700 border-gray-200",
};

const activityIcon: Record<Activity["type"], { bg: string; icon: JSX.Element }> = {
  signup: {
    bg: "bg-blue-100 text-blue-600",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  match: {
    bg: "bg-rose-100 text-rose-600",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  subscription: {
    bg: "bg-amber-100 text-amber-600",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  report: {
    bg: "bg-red-100 text-red-600",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
};

function StatCard({ stat }: { stat: StatItem }): JSX.Element {
  return (
    <div className="bg-white rounded-2xl border border-[#EDE8E3] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#9C8070] uppercase tracking-wider">{stat.label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-[28px] font-bold text-[#1A0A00] leading-none">{stat.value}</span>
        <span className={`text-[12px] font-semibold px-2 py-1 rounded-lg ${stat.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
          {stat.change}
        </span>
      </div>
      <p className="text-[11px] text-[#9C8070]">vs last month</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdminDashboardPage(): JSX.Element {
  const [profileFilter, setProfileFilter] = useState<"all" | "active" | "pending" | "banned" | "inactive">("all");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatItem[]>([]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        status: profileFilter,
        page: "1",
        limit: "20",
      });
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load users");
      setProfiles(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [profileFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (!json.success) return;
      const d = json.data;
      setStats([
        { label: "Total Profiles", value: d.totalProfiles.toLocaleString(), change: "+4.2%", up: true },
        { label: "Active Profiles", value: d.activeProfiles.toLocaleString(), change: "+2.8%", up: true },
        { label: "Premium Subscriptions", value: d.premiumSubscriptions.toLocaleString(), change: "+2.8%", up: true },
        { label: "Pending Verifications", value: d.pendingVerifications.toLocaleString(), change: "-12%", up: false },
      ]);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="px-6 py-5 space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Middle Row */}
		  {/*  <div className="grid grid-cols-12 gap-4">

        <div className="col-span-12 xl:col-span-8 bg-white rounded-2xl border border-[#EDE8E3] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDE8E3]">
            <h2 className="text-[14px] font-semibold text-[#1A0A00]">Recent Profiles</h2>
            <div className="flex gap-1.5">
              {(["all", "active", "pending", "banned", "inactive"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setProfileFilter(f)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors
                    ${profileFilter === f
                      ? "bg-[#1A0A00] text-white"
                      : "text-[#9C8070] hover:bg-[#FAF8F5]"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="px-5 py-3 text-[13px] text-rose-600 bg-rose-50">{error}</div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAF8F5]">
                  {["Profile", "Age", "Religion", "Location", "Status", "Joined", ""].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[#9C8070] uppercase tracking-wider px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E3]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-6 text-center text-[13px] text-[#9C8070]">
                      Loading profiles...
                    </td>
                  </tr>
                ) : profiles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-6 text-center text-[13px] text-[#9C8070]">
                      No profiles found.
                    </td>
                  </tr>
                ) : (
                  profiles.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${colorForId(p.id)} text-[11px] font-semibold flex items-center justify-center shrink-0`}>
                            {p.initials}
                          </div>
                          <span className="text-[13px] font-medium text-[#1A0A00]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-[#6B5A50]">{p.age ?? "—"}</td>
                      <td className="px-5 py-3 text-[13px] text-[#6B5A50]">{p.religion}</td>
                      <td className="px-5 py-3 text-[13px] text-[#6B5A50]">{p.location}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border capitalize ${statusStyle[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#9C8070]">{p.joined}</td>
                      <td className="px-5 py-3">
                        <button className="text-[#C9782A] text-[12px] font-medium hover:underline">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div> 

         <div className="col-span-12 xl:col-span-4 bg-white rounded-2xl border border-[#EDE8E3] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EDE8E3] flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[#1A0A00]">Live Activity</h2>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="divide-y divide-[#EDE8E3] overflow-y-auto max-h-[340px]">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 px-5 py-3 hover:bg-[#FAF8F5] transition-colors">
                <div className={`w-7 h-7 rounded-full ${activityIcon[a.type].bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  {activityIcon[a.type].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#1A0A00] leading-snug">{a.message}</p>
                  <p className="text-[11px] text-[#9C8070] mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
		  </div> 
      </div>*/}
		  </div>
  );
}