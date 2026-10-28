"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────
export type UserCardData = {
  id: number;
  name: string;
  age: number;
  gender: "Male" | "Female";
  religion: string;
  caste?: string;
  location: string;
  occupation: string;
  education: string;
  plan: "Free" | "Silver" | "Gold" | "Platinum";
  status: "active" | "pending" | "blocked";
  joinedDate: string;
  lastActive: string;
  profilePhoto?: string;   // URL — falls back to initials
  verified: boolean;
  interests: number;       // count of interests sent/received
  matches: number;
  horoscope?: string;
  motherTongue?: string;
};

type UserCardProps = {
  user: UserCardData;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onBlock?: (id: number) => void;
  onDelete?: (id: number) => void;
  variant?: "grid" | "list";
};

// ─── Helpers ──────────────────────────────────────────────────
const planConfig: Record<UserCardData["plan"], { label: string; bg: string; text: string; border: string }> = {
  Free:     { label: "Free",     bg: "bg-slate-100",  text: "text-slate-500",  border: "border-slate-200" },
  Silver:   { label: "Silver",   bg: "bg-gray-100",   text: "text-gray-500",   border: "border-gray-200"  },
  Gold:     { label: "Gold",     bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-200" },
  Platinum: { label: "Platinum", bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200"},
};

const statusConfig: Record<UserCardData["status"], { label: string; dot: string; text: string; bg: string }> = {
  active:  { label: "Active",  dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50"  },
  pending: { label: "Pending", dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50"   },
  blocked: { label: "Blocked", dot: "bg-rose-500",    text: "text-rose-700",    bg: "bg-rose-50"    },
};

// Deterministic pastel from name initials
const avatarPalette = [
  "bg-rose-100   text-rose-700",
  "bg-amber-100  text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-teal-100   text-teal-700",
  "bg-pink-100   text-pink-700",
  "bg-orange-100 text-orange-700",
  "bg-blue-100   text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-indigo-100 text-indigo-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
}

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Stat pill ────────────────────────────────────────────────
function StatPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center px-3 py-1.5 bg-[#FAF8F5] rounded-xl border border-[#EDE8E3]">
      <span className="text-[15px] font-bold text-[#1A0A00] leading-none">{value}</span>
      <span className="text-[10px] text-[#9C8070] mt-0.5">{label}</span>
    </div>
  );
}

// ─── Action button ────────────────────────────────────────────
function ActionBtn({
  label,
  onClick,
  variant = "default",
}: {
  label: string;
  onClick?: () => void;
  variant?: "default" | "danger" | "primary";
}) {
  const styles = {
    default:  "bg-[#FAF8F5] text-[#6B5A50] border-[#EDE8E3] hover:bg-[#EDE8E3] hover:text-[#1A0A00]",
    danger:   "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100",
    primary:  "bg-[#C9782A] text-white border-[#C9782A] hover:bg-[#B56820]",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-colors ${styles[variant]}`}
    >
      {label}
    </button>
  );
}

// ─── GRID variant ─────────────────────────────────────────────
function GridCard({ user, onView, onEdit, onBlock, onDelete }: Omit<UserCardProps, "variant">) {
  const [menuOpen, setMenuOpen] = useState(false);
  const plan = planConfig[user.plan];
  const status = statusConfig[user.status];
  const avatarColor = getAvatarColor(user.name);

  return (
    <div className="bg-white border border-[#EDE8E3] rounded-2xl overflow-hidden hover:border-[#D4C8BE] hover:shadow-sm transition-all group">
      {/* Top strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#C9782A] via-[#E8A96A] to-[#C9782A] opacity-80" />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          {/* Avatar */}
          <div className="relative">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-[15px] font-bold border-2 border-white shadow-sm`}>
                {getInitials(user.name)}
              </div>
            )}
            {/* Verified badge */}
            {user.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#C9782A] rounded-full border-2 border-white flex items-center justify-center">
                <svg width="9" height="9" fill="white" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
            )}
          </div>

          {/* Plan + status */}
          <div className="flex flex-col items-end gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${plan.bg} ${plan.text} ${plan.border}`}>
              {plan.label}
            </span>
            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg ${status.bg} ${status.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
        </div>

        {/* Name & meta */}
        <div className="mb-3">
          <h3 className="text-[14px] font-bold text-[#1A0A00] leading-tight">{user.name}</h3>
          <p className="text-[11px] text-[#9C8070] mt-0.5">
            {user.age} yrs · {user.gender} · {user.religion}
            {user.caste ? ` · ${user.caste}` : ""}
          </p>
        </div>

        {/* Detail rows */}
        <div className="space-y-1.5 mb-3">
          {[
            {
              icon: (
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              value: user.location,
            },
            {
              icon: (
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              value: user.occupation,
            },
            {
              icon: (
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              ),
              value: user.education,
            },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#9C8070] shrink-0">{row.icon}</span>
              <span className="text-[11px] text-[#6B5A50] truncate">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-2 mb-4">
          <StatPill label="Interests" value={user.interests} />
          <StatPill label="Matches" value={user.matches} />
          <StatPill label="Joined" value={user.joinedDate.split(",")[0]} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ActionBtn label="View Profile" variant="primary" onClick={() => onView?.(user.id)} />
          <ActionBtn label="Edit" onClick={() => onEdit?.(user.id)} />

          {/* More menu */}
          <div className="relative ml-auto">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1.5 rounded-xl text-[#9C8070] hover:text-[#1A0A00] hover:bg-[#FAF8F5] border border-transparent hover:border-[#EDE8E3] transition-all"
            >
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-40 bg-white border border-[#EDE8E3] rounded-xl shadow-lg overflow-hidden z-10">
                <button
                  onClick={() => { onBlock?.(user.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 text-[12px] text-[#6B5A50] hover:bg-[#FAF8F5] transition-colors"
                >
                  {user.status === "blocked" ? "Unblock User" : "Block User"}
                </button>
                <button
                  onClick={() => { onDelete?.(user.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 text-[12px] text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  Delete Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LIST variant ─────────────────────────────────────────────
function ListCard({ user, onView, onEdit, onBlock }: Omit<UserCardProps, "variant">) {
  const plan = planConfig[user.plan];
  const status = statusConfig[user.status];
  const avatarColor = getAvatarColor(user.name);

  return (
    <div className="bg-white border border-[#EDE8E3] rounded-2xl px-5 py-3.5 flex items-center gap-4 hover:border-[#D4C8BE] hover:shadow-sm transition-all group">
      {/* Avatar */}
      <div className="relative shrink-0">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-[13px] font-bold`}>
            {getInitials(user.name)}
          </div>
        )}
        {user.verified && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#C9782A] rounded-full border-2 border-white flex items-center justify-center">
            <svg width="7" height="7" fill="white" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>
        )}
      </div>

      {/* Name block */}
      <div className="min-w-0 w-40 shrink-0">
        <p className="text-[13px] font-semibold text-[#1A0A00] truncate">{user.name}</p>
        <p className="text-[10px] text-[#9C8070] truncate">{user.age} · {user.gender} · {user.location}</p>
      </div>

      {/* Religion & occupation */}
      <div className="hidden md:block min-w-0 flex-1">
        <p className="text-[12px] text-[#6B5A50] truncate">{user.religion}{user.caste ? ` · ${user.caste}` : ""}</p>
        <p className="text-[11px] text-[#9C8070] truncate">{user.occupation}</p>
      </div>

      {/* Stats */}
      <div className="hidden lg:flex items-center gap-3 shrink-0">
        <div className="text-center">
          <p className="text-[13px] font-bold text-[#1A0A00] leading-none">{user.interests}</p>
          <p className="text-[9px] text-[#9C8070]">Interests</p>
        </div>
        <div className="w-px h-6 bg-[#EDE8E3]" />
        <div className="text-center">
          <p className="text-[13px] font-bold text-[#1A0A00] leading-none">{user.matches}</p>
          <p className="text-[9px] text-[#9C8070]">Matches</p>
        </div>
      </div>

      {/* Plan */}
      <span className={`hidden sm:inline-block shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${plan.bg} ${plan.text} ${plan.border}`}>
        {plan.label}
      </span>

      {/* Status */}
      <span className={`shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg ${status.bg} ${status.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
        {status.label}
      </span>

      {/* Last active */}
      <p className="hidden xl:block text-[11px] text-[#9C8070] shrink-0 w-24 text-right">{user.lastActive}</p>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <ActionBtn label="View" variant="primary" onClick={() => onView?.(user.id)} />
        <ActionBtn label="Edit" onClick={() => onEdit?.(user.id)} />
        <ActionBtn
          label={user.status === "blocked" ? "Unblock" : "Block"}
          variant="danger"
          onClick={() => onBlock?.(user.id)}
        />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────
export default function UserCard({
  user,
  onView,
  onEdit,
  onBlock,
  onDelete,
  variant = "grid",
}: UserCardProps) {
  if (variant === "list") {
    return (
      <ListCard
        user={user}
        onView={onView}
        onEdit={onEdit}
        onBlock={onBlock}
        onDelete={onDelete}
      />
    );
  }
  return (
    <GridCard
      user={user}
      onView={onView}
      onEdit={onEdit}
      onBlock={onBlock}
      onDelete={onDelete}
    />
  );
}

// ─── Demo page (for quick preview — remove in production) ─────
export function UserCardDemo() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sampleUsers: UserCardData[] = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 27,
      gender: "Female",
      religion: "Hindu",
      caste: "Brahmin",
      location: "New Delhi",
      occupation: "Software Engineer",
      education: "B.Tech, IIT Delhi",
      plan: "Gold",
      status: "active",
      joinedDate: "Jan 12, 2025",
      lastActive: "2h ago",
      verified: true,
      interests: 24,
      matches: 6,
      motherTongue: "Hindi",
      horoscope: "Virgo",
    },
    {
      id: 2,
      name: "Arjun Mehta",
      age: 30,
      gender: "Male",
      religion: "Hindu",
      caste: "Kshatriya",
      location: "Mumbai",
      occupation: "Finance Manager",
      education: "MBA, IIM Ahmedabad",
      plan: "Platinum",
      status: "active",
      joinedDate: "Feb 3, 2025",
      lastActive: "5m ago",
      verified: true,
      interests: 18,
      matches: 4,
    },
    {
      id: 3,
      name: "Zara Khan",
      age: 25,
      gender: "Female",
      religion: "Muslim",
      location: "Hyderabad",
      occupation: "Doctor",
      education: "MBBS, AIIMS",
      plan: "Silver",
      status: "pending",
      joinedDate: "Mar 17, 2025",
      lastActive: "1d ago",
      verified: false,
      interests: 9,
      matches: 2,
    },
    {
      id: 4,
      name: "Rohan Nair",
      age: 32,
      gender: "Male",
      religion: "Hindu",
      caste: "Nair",
      location: "Bangalore",
      occupation: "Product Manager",
      education: "B.E, NIT Calicut",
      plan: "Free",
      status: "blocked",
      joinedDate: "Jan 28, 2025",
      lastActive: "3d ago",
      verified: false,
      interests: 31,
      matches: 0,
    },
    {
      id: 5,
      name: "Ananya Patel",
      age: 26,
      gender: "Female",
      religion: "Hindu",
      caste: "Patel",
      location: "Ahmedabad",
      occupation: "Chartered Accountant",
      education: "CA, ICAI",
      plan: "Gold",
      status: "active",
      joinedDate: "Dec 9, 2024",
      lastActive: "Just now",
      verified: true,
      interests: 14,
      matches: 3,
    },
    {
      id: 6,
      name: "Kabir Singh",
      age: 29,
      gender: "Male",
      religion: "Sikh",
      location: "Chandigarh",
      occupation: "Civil Engineer",
      education: "B.Tech, PU Chandigarh",
      plan: "Silver",
      status: "pending",
      joinedDate: "Apr 1, 2025",
      lastActive: "12h ago",
      verified: false,
      interests: 7,
      matches: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6">
      {/* Demo header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[18px] font-bold text-[#1A0A00]">UserCard Component</h1>
          <p className="text-[12px] text-[#9C8070] mt-0.5">Grid & List variants — EliteWedding Admin</p>
        </div>
        <div className="flex gap-1.5 bg-white border border-[#EDE8E3] rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1.5
              ${viewMode === "grid" ? "bg-[#1A0A00] text-white" : "text-[#9C8070] hover:text-[#1A0A00]"}`}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1.5
              ${viewMode === "list" ? "bg-[#1A0A00] text-white" : "text-[#9C8070] hover:text-[#1A0A00]"}`}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            List
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleUsers.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              variant="grid"
              onView={(id) => alert(`Viewing profile #${id}`)}
              onEdit={(id) => alert(`Editing profile #${id}`)}
              onBlock={(id) => alert(`Toggling block on #${id}`)}
              onDelete={(id) => alert(`Deleting profile #${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sampleUsers.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              variant="list"
              onView={(id) => alert(`Viewing profile #${id}`)}
              onEdit={(id) => alert(`Editing profile #${id}`)}
              onBlock={(id) => alert(`Toggling block on #${id}`)}
              onDelete={(id) => alert(`Deleting profile #${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}