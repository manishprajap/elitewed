"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  profile_photo: string | null;
  address: string | null;
  profile_for: string | null;
  gender: string | null;
  marital_status: string | null;
  date_of_birth: string | null;
  mobile: string | null;
  bio: string | null;
  status: string | null;
  mother_tongue: string | null;
  height: string | null;
  weight: string | null;
  annual_income: string | null;
};

/* ─── Format Helpers ─── */

function formatHeight(raw: string | null): string {
  if (!raw) return "—";
  const cm = parseFloat(raw);
  if (isNaN(cm)) return raw;
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn % 12);
  return ft > 0 ? `${ft}'${inches}"` : `${Math.round(cm)} cm`;
}

function formatWeight(raw: string | null): string {
  if (!raw) return "—";
  const kg = parseFloat(raw);
  return isNaN(kg) ? raw : `${Math.round(kg)} kg`;
}

function formatIncome(raw: string | null): string {
  if (!raw) return "—";
  const n = parseFloat(raw);
  if (isNaN(n)) return raw;
  if (n >= 100000) return `₹${(n / 100000).toFixed(0)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatDob(raw: string | null): { display: string; age: number } {
  if (!raw) return { display: "—", age: 0 };
  const d = new Date(raw);
  const age = new Date().getFullYear() - d.getFullYear();
  return {
    display: d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    age,
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ─── Main Component ─── */

export default function ProfileDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        setProfile(data?.id ? data : null);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-red-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading profile…</p>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">Profile not found</p>
          <button
            onClick={() => router.back()}
            className="text-xs text-red-500 underline"
          >
            Go back
          </button>
        </div>
      </div>
    );

  const avatarBg = profile.gender === "female" ? "#c0392b" : "#1565c0";
  const isActive = profile.status?.toLowerCase() === "active";
  const { display: dobDisplay, age } = formatDob(profile.date_of_birth);
  return (
    <div className="min-h-screen bg-gray-50 py-3 px-2">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-gray-600 hover:text-black"
        >
          ← Back
        </button>

        {/* Layout */}
        <div className="grid grid-cols-[260px_1fr] gap-4">

          {/* LEFT */}
          <div className="flex flex-col gap-4">

            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              {profile.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover mb-3 border-2 border-gray-200"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-xl font-semibold mb-3"
                  style={{ background: avatarBg }}
                >
                  {getInitials(profile.name)}
                </div>
              )}

              <h1 className="text-lg font-semibold text-gray-800">
                {profile.name}
              </h1>

              <p className="text-xs text-gray-500 mt-1">
                {[profile.gender, profile.profile_for && `Profile for ${profile.profile_for}`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {profile.marital_status && (
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {profile.marital_status}
                  </span>
                )}
                {isActive && (
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <SectionLabel>Quick Stats</SectionLabel>

              <div className="grid grid-cols-2 gap-3">
                <Stat label="Height" value={formatHeight(profile.height)} />
                <Stat label="Weight" value={formatWeight(profile.weight)} />
                <Stat label="Income" value={formatIncome(profile.annual_income)} />
                <Stat label="Age" value={age ? `${age} yrs` : "—"} />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-4">

            <Section title="Personal Info">
              <Row label="Mobile" value={profile.mobile} />
              <Row label="Mother Tongue" value={profile.mother_tongue} />
              <Row label="Marital Status" value={profile.marital_status} />
              <Row label="Date of Birth" value={dobDisplay} />
              <Row label="Gender" value={profile.gender} />
              <Row label="Status" value={profile.status} />
            </Section>

            <Section title="Address">
              <p className="text-sm text-gray-800">
                {profile.address || "Not provided"}
              </p>
            </Section>

            <Section title="About">
              <p className="text-sm text-gray-800">
                {profile.bio || "No bio available"}
              </p>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}
/* ─── UI Components ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <p className="text-sm font-bold tracking-wide " style={{ color: "#c0392b" }}>
        {children}
      </p>
      <div className="flex-1 h-[2px] bg-pink-100 rounded-full" />
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <SectionLabel>{title}</SectionLabel>
      {children}
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-none">
      <span className="text-xs text-gray-800">{label}</span>
      <span className="text-sm font-medium text-gray-800 capitalize">
        {value || "—"}
      </span>
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-sm font-semibold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}