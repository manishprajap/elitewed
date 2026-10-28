"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, Fragment } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  address: string | null;
  profile_for: string | null;
  gender: "male" | "female" | "other" | null;
  date_of_birth: string | null;
  marital_status: string | null;
  mother_tongue: string | null;
  height: string | null;
  weight: string | null;
  annual_income: string | null;
  profile_photo: string | null;
  bio: string | null;
  role: "user" | "premium" | "admin";
  status: "active" | "inactive" | "pending" | "banned";
  email_verified_at: string | null;
  mobile_verified_at: string | null;
  created_at: string;
  updated_at: string;
  religion: string | null;
  caste: string | null;
  education: string | null;
  profession: string | null;
};

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  active: { label: "Active", bg: "#ECFDF5", color: "#065F46", dot: "#10B981" },
  inactive: { label: "Inactive", bg: "#F8FAFC", color: "#475569", dot: "#94A3B8" },
  pending: { label: "Pending", bg: "#FFFBEB", color: "#92400E", dot: "#F59E0B" },
  banned: { label: "Suspended", bg: "#FFF1F2", color: "#9F1239", dot: "#F43F5E" },
};

const ROLE_CFG = {
  user: { label: "User", bg: "#F1F5F9", color: "#475569" },
  premium: { label: "Premium", bg: "#FDF4FF", color: "#7E22CE" },
  admin: { label: "Admin", bg: "#FFF7ED", color: "#C2410C" },
};

const AVATAR_COLORS = [
  { bg: "#FEE2E2", color: "#B91C1C" },
  { bg: "#DBEAFE", color: "#1D4ED8" },
  { bg: "#D1FAE5", color: "#065F46" },
  { bg: "#FEF3C7", color: "#92400E" },
  { bg: "#EDE9FE", color: "#5B21B6" },
  { bg: "#FCE7F3", color: "#9D174D" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const age = (dob: string | null) => {
  if (!dob) return null;
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
};

const fmtDate = (val: string | null) =>
  val ? new Date(val).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fmtIncome = (val: string | null) => {
  if (!val) return "—";
  const n = parseFloat(val);
  if (isNaN(n)) return val;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L/yr`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K/yr`;
  return `₹${n}/yr`;
};

const cap = (s: string | null) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : "—";

// ── Mini components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: User["status"] }) => {
  const c = STATUS_CFG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
};

const RoleBadge = ({ role }: { role: User["role"] }) => {
  const c = ROLE_CFG[role];
  return (
    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | User["status"]>("all");
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female" | "other">("all");
  const [search, setSearch] = useState("");
  const [debSearch, setDebSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // ── Fetch users from the API (same pattern as dashboard page) ──
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = new URLSearchParams();
      if (debSearch) p.set("search", debSearch);
      if (genderFilter !== "all") p.set("gender", genderFilter);
      if (statusFilter !== "all") p.set("status", statusFilter);

      const res = await fetch(`/api/admin/users?${p.toString()}`);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to load users");
      }

      const sortedUsers = (json.data ?? []).sort(
        (a: User, b: User) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setUsers(sortedUsers);
    } catch (e) {
      console.error("Failed to fetch users:", e);
      setError(e instanceof Error ? e.message : "Something went wrong while loading users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [debSearch, genderFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const doAction = async (id: number, action: string) => {
    setBusyId(id);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error(`Action failed with status ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Action failed");
      await fetchUsers();
    } catch (e) {
      console.error("Failed to update user:", e);
      alert(e instanceof Error ? e.message : "Failed to update user");
    } finally {
      setBusyId(null);
    }
  };

  const doDelete = async (id: number) => {
    if (!confirm("Permanently delete this user?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed with status ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Delete failed");
      setUsers((p) => p.filter((u) => u.id !== id));
    } catch (e) {
      console.error("Failed to delete user:", e);
      alert(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setBusyId(null);
    }
  };

  const counts = {
    all: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    banned: users.filter((u) => u.status === "banned").length,
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F5F0]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-[#1a1410]">All Users</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">{counts.all} members registered</p>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "active", "pending", "inactive", "banned"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all
                ${statusFilter === s
                  ? "bg-[#C9782A] text-white border-[#C9782A] shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#C9782A] hover:text-[#C9782A]"
                }`}
            >
              {s === "all" ? "All" : STATUS_CFG[s].label}
              <span className="ml-1.5 font-bold">{counts[s]}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#C9782A] transition-colors"
            />
          </div>
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-0.5">
            {(["all", "male", "female", "other"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1 rounded-lg text-[12px] font-medium capitalize transition-all
                  ${genderFilter === g ? "bg-[#C9782A] text-white" : "text-gray-500 hover:text-gray-800"}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-[13px] text-rose-600">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
              <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".2" />
                <path d="M12 2a10 10 0 0110 10" stroke="#C9782A" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="text-[13px]">Loading…</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="mt-2 text-[14px] font-medium text-gray-600">No users found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["#", "Member", "Personal Info", "Background", "Career", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => {
                  const pal = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  const busy = busyId === u.id;
                  const uAge = age(u.date_of_birth);
                  const expanded = expandedId === u.id;

                  return (
                    <Fragment key={u.id}>
                      <tr
                        className={`border-b border-gray-50 transition-colors
                          ${busy ? "opacity-40 pointer-events-none" : "hover:bg-[#FDFCFB]"}
                          ${expanded ? "bg-[#FDFCFB]" : ""}
                        `}
                      >
                        {/* # */}
                        <td className="px-4 py-3 text-[12px] text-gray-400 font-medium w-8">
                          {idx + 1}
                        </td>

                        {/* Member */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {u.profile_photo ? (
                              <Image
                                src={u.profile_photo}
                                alt={u.name}
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-100"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                                style={{ background: pal.bg, color: pal.color }}>
                                {initials(u.name)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-gray-800 whitespace-nowrap">{u.name}</p>
                              <p className="text-[11px] text-gray-400 truncate max-w-[160px]">{u.email}</p>
                              <p className="text-[11px] text-gray-400">{u.mobile ?? "—"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Personal */}
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-gray-700 font-medium capitalize">
                            {cap(u.gender)}{uAge ? `, ${uAge} yrs` : ""}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{cap(u.marital_status)}</p>
                          <p className="text-[11px] text-gray-400">
                            {u.height ?? "—"} • {u.weight ?? "—"}
                          </p>
                          <p className="text-[11px] text-gray-400">{u.mother_tongue ?? "—"}</p>
                        </td>

                        {/* Background */}
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-gray-700 font-medium">{u.religion ?? "—"}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{u.caste ?? "—"}</p>
                          <p className="text-[11px] text-gray-400 max-w-[160px] truncate" title={u.address ?? ""}>
                            {u.address ?? "—"}
                          </p>
                        </td>

                        {/* Career */}
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-gray-700 font-medium">{u.profession ?? "—"}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{u.education ?? "—"}</p>
                          <p className="text-[11px] text-[#C9782A] font-medium mt-0.5">{fmtIncome(u.annual_income)}</p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <div className="space-y-1.5">
                            <StatusBadge status={u.status} />
                            <div><RoleBadge role={u.role} /></div>
                            <div className="flex gap-1 mt-1">
                              <span title="Email verified" className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${u.email_verified_at ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                                {u.email_verified_at ? "✓ Email" : "✗ Email"}
                              </span>
                              <span title="Mobile verified" className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${u.mobile_verified_at ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                                {u.mobile_verified_at ? "✓ Mobile" : "✗ Mobile"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-[12px] text-gray-700 font-medium">{fmtDate(u.created_at)}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{cap(u.profile_for) !== "—" ? `For: ${cap(u.profile_for)}` : ""}</p>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1 min-w-[90px]">
                            {u.status !== "active" && (
                              <button onClick={() => doAction(u.id, "approve")}
                                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors text-left">
                                ✓ Approve
                              </button>
                            )}
                            {u.status !== "banned" && (
                              <button onClick={() => doAction(u.id, "block")}
                                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors text-left">
                                ⊘ Block
                              </button>
                            )}
                            {u.status === "active" && (
                              <button onClick={() => doAction(u.id, "deactivate")}
                                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors text-left">
                                — Deactivate
                              </button>
                            )}
                            <button onClick={() => setExpandedId(expanded ? null : u.id)}
                              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                              {expanded ? "▲ Less" : "▼ More"}
                            </button>
                            <button onClick={() => doDelete(u.id)}
                              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-left">
                              ✕ Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {expanded && (
                        <tr className="bg-[#FDFCFB] border-b border-gray-100">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Personal</p>
                                <div className="space-y-1">
                                  <p className="text-[12px] text-gray-600"><span className="text-gray-400">DOB:</span> {fmtDate(u.date_of_birth)}</p>
                                  <p className="text-[12px] text-gray-600"><span className="text-gray-400">Mother tongue:</span> {u.mother_tongue ?? "—"}</p>
                                  <p className="text-[12px] text-gray-600"><span className="text-gray-400">Profile for:</span> {cap(u.profile_for)}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</p>
                                <div className="space-y-1">
                                  <p className="text-[12px] text-gray-600 break-all"><span className="text-gray-400">Email:</span> {u.email}</p>
                                  <p className="text-[12px] text-gray-600"><span className="text-gray-400">Mobile:</span> {u.mobile ?? "—"}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Address</p>
                                <p className="text-[12px] text-gray-600 leading-relaxed">{u.address ?? "—"}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Bio</p>
                                <p className="text-[12px] text-gray-600 leading-relaxed">{u.bio ?? "—"}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Footer */}
          {!loading && users.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[12px] text-gray-400">
                Showing <span className="font-semibold text-gray-600">{users.length}</span> user{users.length !== 1 ? "s" : ""}
                {statusFilter !== "all" && (
                  <span> · Filtered: <span className="font-medium" style={{ color: STATUS_CFG[statusFilter as User["status"]].color }}>{STATUS_CFG[statusFilter as User["status"]].label}</span></span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}