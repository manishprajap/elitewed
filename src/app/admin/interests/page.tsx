"use client";

import { useState } from "react";

type Interest = {
  id: number;
  from: string;
  fromAge: number;
  fromLocation: string;
  to: string;
  toAge: number;
  toLocation: string;
  status: "pending" | "accepted" | "declined" | "shortlisted";
  sentOn: string;
  religion: string;
};

const interests: Interest[] = [
  { id: 1, from: "Priya Sharma", fromAge: 27, fromLocation: "Delhi", to: "Arjun Mehta", toAge: 30, toLocation: "Mumbai", status: "pending", sentOn: "Apr 2, 2025", religion: "Hindu" },
  { id: 2, from: "Zara Khan", fromAge: 25, fromLocation: "Hyderabad", to: "Kabir Singh", toAge: 29, toLocation: "Chandigarh", status: "accepted", sentOn: "Mar 30, 2025", religion: "Muslim/Sikh" },
  { id: 3, from: "Rohan Nair", fromAge: 32, fromLocation: "Bangalore", to: "Priya Sharma", toAge: 27, toLocation: "Delhi", status: "shortlisted", sentOn: "Apr 1, 2025", religion: "Hindu" },
  { id: 4, from: "Ananya Patel", fromAge: 26, fromLocation: "Ahmedabad", to: "Rohan Nair", toAge: 32, toLocation: "Bangalore", status: "declined", sentOn: "Mar 28, 2025", religion: "Hindu" },
  { id: 5, from: "Kabir Singh", fromAge: 29, fromLocation: "Chandigarh", to: "Ananya Patel", toAge: 26, toLocation: "Ahmedabad", status: "accepted", sentOn: "Mar 25, 2025", religion: "Sikh/Hindu" },
  { id: 6, from: "Neha Gupta", fromAge: 24, fromLocation: "Jaipur", to: "Vikram Rao", toAge: 28, toLocation: "Chennai", status: "pending", sentOn: "Apr 3, 2025", religion: "Hindu" },
  { id: 7, from: "Sunita Reddy", fromAge: 31, fromLocation: "Pune", to: "Arun Kumar", toAge: 33, toLocation: "Delhi", status: "shortlisted", sentOn: "Mar 22, 2025", religion: "Hindu" },
];

const statusConfig = {
  pending: { label: "Pending", class: "bg-amber-50 text-amber-700 border-amber-200" },
  accepted: { label: "Accepted", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  declined: { label: "Declined", class: "bg-rose-50 text-rose-700 border-rose-200" },
  shortlisted: { label: "Shortlisted", class: "bg-blue-50 text-blue-700 border-blue-200" },
};

const summaryStats = [
  { label: "Total Interests", value: 1284, icon: "💌", color: "text-rose-600 bg-rose-50" },
  { label: "Accepted", value: 487, icon: "✅", color: "text-emerald-600 bg-emerald-50" },
  { label: "Pending", value: 312, icon: "⏳", color: "text-amber-600 bg-amber-50" },
  { label: "Declined", value: 485, icon: "❌", color: "text-slate-600 bg-slate-50" },
];

export default function InterestsPage() {
  const [filter, setFilter] = useState<"all" | Interest["status"]>("all");
  const [search, setSearch] = useState("");

  const filtered = interests.filter((i) => {
    const matchesFilter = filter === "all" || i.status === filter;
    const matchesSearch =
      search === "" ||
      i.from.toLowerCase().includes(search.toLowerCase()) ||
      i.to.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="h-14 bg-white border-b border-[#EDE8E3] flex items-center px-6 gap-4 shrink-0">
        <div>
          <h1 className="text-[15px] font-semibold text-[#1A0A00]">Interests</h1>
          <p className="text-[11px] text-[#9C8070]">Manage member interest requests</p>
        </div>
        <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#C9782A] text-white rounded-xl text-[13px] font-medium hover:bg-[#B56820] transition-colors">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#EDE8E3] p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-lg`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[22px] font-bold text-[#1A0A00] leading-none">{s.value.toLocaleString()}</p>
                <p className="text-[11px] text-[#9C8070] mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#EDE8E3] overflow-hidden">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-[#EDE8E3]">
            <div className="relative flex-1 max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C8070]" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-8 pr-4 py-1.5 text-[13px] bg-[#FAF8F5] border border-[#EDE8E3] rounded-lg text-[#1A0A00] placeholder:text-[#9C8070]/60 outline-none focus:border-[#C9782A] transition-colors"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "pending", "accepted", "declined", "shortlisted"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold capitalize transition-colors
                    ${filter === f ? "bg-[#1A0A00] text-white" : "text-[#9C8070] hover:bg-[#FAF8F5] border border-[#EDE8E3]"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAF8F5]">
                  {["From", "To", "Religion", "Status", "Sent On", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[#9C8070] uppercase tracking-wider px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E3]">
                {filtered.map((i) => (
                  <tr key={i.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-semibold text-[#1A0A00]">{i.from}</p>
                      <p className="text-[11px] text-[#9C8070]">{i.fromAge} · {i.fromLocation}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-medium text-[#1A0A00]">{i.to}</p>
                      <p className="text-[11px] text-[#9C8070]">{i.toAge} · {i.toLocation}</p>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[#6B5A50]">{i.religion}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${statusConfig[i.status].class}`}>
                        {statusConfig[i.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[#9C8070]">{i.sentOn}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-[11px] text-[#C9782A] font-medium hover:underline">View</button>
                        {i.status === "pending" && (
                          <>
                            <span className="text-[#EDE8E3]">·</span>
                            <button className="text-[11px] text-emerald-600 font-medium hover:underline">Accept</button>
                            <span className="text-[#EDE8E3]">·</span>
                            <button className="text-[11px] text-rose-500 font-medium hover:underline">Decline</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#9C8070] text-[13px]">
                No interests found matching your filters.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#EDE8E3]">
            <p className="text-[12px] text-[#9C8070]">Showing {filtered.length} of {interests.length} results</p>
            <div className="flex gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-colors
                    ${p === 1 ? "bg-[#1A0A00] text-white" : "text-[#9C8070] hover:bg-[#FAF8F5]"}`}
                >
                  {p}
                </button>
              ))}
              <button className="w-8 h-8 rounded-lg text-[12px] text-[#9C8070] hover:bg-[#FAF8F5] transition-colors">→</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}