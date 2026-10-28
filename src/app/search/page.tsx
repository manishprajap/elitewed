"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
type Profile = {
  id: number;
  name: string;
  date_of_birth?: string | null;
  gender?: string | null;
  religion?: string | null;
  religion_id?: number | null;       // ← for ID-based filtering
  occupation?: string | null;
  profession_id?: number | null;     // ← for ID-based filtering
  city?: string | null;
  annual_income?: string | null;
  profile_photo?: string | null;
  marital_status?: string | null;
  height?: string | null;
  mother_tongue?: string | null;
  is_premium?: boolean;
};

type CategoryItem = { id: number; name: string };
type CategoriesMap = Record<string, CategoryItem[]>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getAge(p: Profile): number {
  if (!p.date_of_birth) return 0;
  const dob = new Date(p.date_of_birth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) age--;
  return age;
}

function formatIncome(val?: string | null): string {
  if (!val) return "";
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} LPA`;
  return `₹${num.toLocaleString("en-IN")}`;
}

const low = (s?: string | null) => (s ?? "").toLowerCase().trim();

// ─── Shared select style ──────────────────────────────────────────────────────
const sel: React.CSSProperties = {
  width: "100%",
  fontSize: 13,
  padding: "8px 10px",
  border: "1.5px solid #f0d9c8",
  borderRadius: 8,
  background: "#fdf8f4",
  color: "#5a3e36",
  outline: "none",
};

// ─── Main inner component ─────────────────────────────────────────────────────
function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const get = (key: string) => searchParams.get(key) ?? "";

  // ── Filter state — store IDs for religion & profession ──
  const [religionId,   setReligionId]   = useState<number | "">(
    get("religion_id") ? Number(get("religion_id")) : ""
  );
  const [professionId, setProfessionId] = useState<number | "">(
    get("profession_id") ? Number(get("profession_id")) : ""
  );
  const [query,    setQuery]    = useState(get("q"));
  const [ageMin,   setAgeMin]   = useState("18");
  const [ageMax,   setAgeMax]   = useState("55");
  const [gender,   setGender]   = useState(get("gender"));
  const [marital,  setMarital]  = useState(get("marital_status"));
  const [sortBy,   setSortBy]   = useState("newest");

  // ── Categories from API ──
  const [religionList,   setReligionList]   = useState<CategoryItem[]>([]);
  const [professionList, setProfessionList] = useState<CategoryItem[]>([]);

  // ── Data state ──
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [profiles,    setProfiles]    = useState<Profile[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 12;

  // ── Fetch categories for dropdowns ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/categories", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (!json.success) return;

        const data: CategoriesMap = json.data;
        const findKey = (target: string) =>
          Object.keys(data).find((k) => k.toLowerCase() === target.toLowerCase());

        const relKey  = findKey("religion");
        const profKey = findKey("profession");

        if (relKey)  setReligionList(data[relKey]);
        if (profKey) setProfessionList(data[profKey]);
      } catch (e) {
        console.error("Categories fetch error:", e);
      }
    })();
  }, []);

  // ── Fetch all profiles once ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/users/search?limit=500", { cache: "no-store" });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        const list: Profile[] = Array.isArray(data)
          ? data
          : data.users ?? data.profiles ?? data.data ?? [];
        setAllProfiles(list);
      } catch (e) {
        console.error(e);
        setError("Could not load profiles. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Client-side filter + sort (ID-based for religion & profession) ───────
  useEffect(() => {
    let list = [...allProfiles];

    // ✅ Match by ID — reliable, works even if names have case/spacing differences
    if (religionId !== "")   list = list.filter((p) => p.religion_id   === religionId);
    if (professionId !== "") list = list.filter((p) => p.profession_id === professionId);

    if (gender)  list = list.filter((p) => low(p.gender)         === low(gender));
    if (marital) list = list.filter((p) => low(p.marital_status) === low(marital));

    if (query) {
      list = list.filter((p) =>
        low(p.name).includes(low(query))       ||
        low(p.religion).includes(low(query))   ||
        low(p.city).includes(low(query))       ||
        low(p.occupation).includes(low(query))
      );
    }

    const minA = parseInt(ageMin) || 0;
    const maxA = parseInt(ageMax) || 99;
    list = list.filter((p) => {
      const a = getAge(p);
      return a === 0 || (a >= minA && a <= maxA);
    });

    if (sortBy === "age_asc")  list.sort((a, b) => getAge(a) - getAge(b));
    if (sortBy === "age_desc") list.sort((a, b) => getAge(b) - getAge(a));

    setCurrentPage(1);
    setProfiles(list);
  }, [allProfiles, religionId, professionId, gender, marital, query, ageMin, ageMax, sortBy]);

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.ceil(profiles.length / PER_PAGE);
  const paginated  = profiles.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // ── Label lookups for active filter tags ─────────────────────────────────
  const religionLabel   = religionList.find((r) => r.id === religionId)?.name   ?? "";
  const professionLabel = professionList.find((p) => p.id === professionId)?.name ?? "";

  const activeTags = [
    { key: "religion",   val: religionLabel,   clear: () => setReligionId(""),   label: "Religion" },
    { key: "profession", val: professionLabel, clear: () => setProfessionId(""), label: "Profession" },
    { key: "gender",     val: gender,           clear: () => setGender(""),       label: "Gender" },
    { key: "marital",    val: marital,          clear: () => setMarital(""),      label: "Marital" },
    { key: "q",          val: query,            clear: () => setQuery(""),        label: "Search" },
  ].filter((t) => t.val);

  function clearAll() {
    setReligionId(""); setProfessionId(""); setQuery("");
    setGender(""); setMarital(""); setAgeMin("18"); setAgeMax("55");
    router.push("/search", { scroll: false });
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#fff8f0", minHeight: "100vh", fontFamily: "inherit" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* Active filter tags */}
        {activeTags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {activeTags.map((t) => (
              <span key={t.key} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#fff0e8", border: "1px solid #f5c4a0",
                borderRadius: 50, padding: "4px 14px",
                fontSize: 13, color: "#c0392b", fontWeight: 500,
              }}>
                {t.label}: <strong>{t.val}</strong>
                <button
                  onClick={t.clear}
                  style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0, marginLeft: 2 }}
                >×</button>
              </span>
            ))}
            <button onClick={clearAll} style={{ fontSize: 12, color: "#9b7b6e", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Clear all
            </button>
          </div>
        )}

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: 14, color: "#7a5c50", margin: 0 }}>
            {loading ? "Searching…" : (
              <><strong style={{ color: "#c0392b" }}>{profiles.length}</strong>{" profiles found"}</>
            )}
          </p>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            style={{ ...sel, width: "auto", borderRadius: 50, padding: "6px 14px" }}>
            <option value="newest">Newest First</option>
            <option value="age_asc">Age: Youngest First</option>
            <option value="age_desc">Age: Oldest First</option>
          </select>
        </div>

        {/* Main layout */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* ── Sidebar ── */}
          <aside style={{ width: 240, flexShrink: 0, position: "sticky", top: 80 }}>
            <div style={{ background: "white", border: "1px solid #f0d9c8", borderRadius: 14, padding: "18px 16px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#5a3e36", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.9px" }}>
                Filter Profiles
              </p>

              <FG label="Gender">
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={sel}>
                  <option value="">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </FG>

              <FG label="Age Range">
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="number" min={18} max={70} value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    style={{ ...sel, width: 62 }} />
                  <span style={{ fontSize: 12, color: "#9b7b6e" }}>to</span>
                  <input type="number" min={18} max={70} value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    style={{ ...sel, width: 62 }} />
                  <span style={{ fontSize: 12, color: "#9b7b6e" }}>yrs</span>
                </div>
              </FG>

              {/* ── Religion — value = sub-category ID ── */}
              <FG label="Religion">
                 {religionList.length > 0 ? (
                <select
                    value={religionId}
                    onChange={(e) => setReligionId(e.target.value ? Number(e.target.value) : "")}
                    style={sel}
                  >
                    <option value="">Any Religion</option>
                    {religionList.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  ) : (
                  <input
                    type="text"
                    placeholder="e.g. Engineer, Doctor…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={sel}
                  />
                )}
              </FG>

              {/* ── Profession — value = sub-category ID ── */}
              <FG label="Profession">
                {professionList.length > 0 ? (
                  <select
                    value={professionId}
                    onChange={(e) => setProfessionId(e.target.value ? Number(e.target.value) : "")}
                    style={sel}
                  >
                    <option value="">Any Profession</option>
                    {professionList.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. Engineer, Doctor…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={sel}
                  />
                )}
              </FG>

              <FG label="Marital Status">
                <select value={marital} onChange={(e) => setMarital(e.target.value)} style={sel}>
                  <option value="">Any</option>
                  <option value="never_married">Never Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </FG>

              <FG label="Mother Tongue">
                <input
                  type="text"
                  placeholder="e.g. Hindi, Tamil…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={sel}
                />
              </FG>

              <button onClick={clearAll} style={{
                width: "100%", padding: "10px 0", marginTop: 14,
                background: "linear-gradient(135deg,#c0392b,#e74c3c)",
                color: "white", border: "none", borderRadius: 50,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>
                Reset Filters
              </button>
            </div>
          </aside>

          {/* ── Profile Grid ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 16 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{
                    height: 290, borderRadius: 16,
                    background: "linear-gradient(90deg,#f5e6d8 25%,#fdf0e8 50%,#f5e6d8 75%)",
                    backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
                  }} />
                ))}
              </div>
            )}

            {!loading && error && (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                <p style={{ color: "#c0392b", fontSize: 15, marginBottom: 12 }}>{error}</p>
                <button onClick={() => window.location.reload()} style={{
                  padding: "8px 24px", background: "#c0392b", color: "white",
                  border: "none", borderRadius: 50, cursor: "pointer", fontSize: 13,
                }}>Retry</button>
              </div>
            )}

            {!loading && !error && paginated.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
                <p style={{ fontSize: 18, fontWeight: 600, color: "#5a3e36", marginBottom: 8 }}>No profiles found</p>
                <p style={{ fontSize: 14, color: "#9b7b6e", marginBottom: 20 }}>Try removing some filters.</p>
                <button onClick={clearAll} style={{
                  padding: "9px 24px", background: "#c0392b", color: "white",
                  border: "none", borderRadius: 50, cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}>Clear Filters</button>
              </div>
            )}

            {!loading && !error && paginated.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 16 }}>
                {paginated.map((p) => <ProfileCard key={p.id} profile={p} />)}
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 36 }}>
                <PBtn onClick={() => setCurrentPage((n) => Math.max(1, n - 1))} disabled={currentPage === 1}>‹</PBtn>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((n) => (
                  <PBtn key={n} onClick={() => setCurrentPage(n)} active={n === currentPage}>{n}</PBtn>
                ))}
                <PBtn onClick={() => setCurrentPage((n) => Math.min(totalPages, n + 1))} disabled={currentPage === totalPages}>›</PBtn>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @media(max-width:768px){ aside{ display:none !important; } }
      `}</style>
    </div>
  );
}

// ─── Profile Card ─────────────────────────────────────────────────────────────
function ProfileCard({ profile: p }: { profile: Profile }) {
  const [saved, setSaved] = useState(false);
  const [sent,  setSent]  = useState(false);
  const age = getAge(p);
  const initials = (p.name ?? "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  async function sendInterest(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await fetch("/api/users/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_user_id: p.id }),
      });
    } catch { /* best effort */ }
    setSent(true);
  }

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await fetch("/api/users/shortlist", {
        method: saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: p.id }),
      });
    } catch { /* best effort */ }
    setSaved((s) => !s);
  }

  const genderColor = p.gender === "female" ? "#c0186a" : p.gender === "male" ? "#1565c0" : "#555";
  const avatarBg = p.gender === "female" ? "#e74c3c" : "#1565c0";

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #f0d9c8",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        const d = e.currentTarget as HTMLDivElement;
        d.style.transform = "translateY(-4px)";
        d.style.boxShadow = "0 10px 32px rgba(180,80,40,0.13)";
      }}
      onMouseLeave={(e) => {
        const d = e.currentTarget as HTMLDivElement;
        d.style.transform = "none";
        d.style.boxShadow = "none";
      }}
    >
      <Link href={`/profile/${p.id}`} style={{ textDecoration: "none", flex: 1, padding: "16px 14px 10px" }}>

        {/* Header row: avatar + name + gender badge + premium */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: avatarBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 16, fontWeight: 700, flexShrink: 0,
            }}
          >
            {initials}
          </div>

          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#2c1810", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {p.name}
            </p>
            {p.gender && (
              <span style={{ fontSize: 11, fontWeight: 600, color: genderColor, background: "rgba(0,0,0,0.05)", borderRadius: 50, padding: "1px 8px" }}>
                {p.gender.charAt(0).toUpperCase() + p.gender.slice(1)}
              </span>
            )}
          </div>

          {p.is_premium && (
            <span style={{ marginLeft: "auto", flexShrink: 0, background: "linear-gradient(135deg,#f39c12,#e67e22)", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50 }}>
              Premium
            </span>
          )}
        </div>

        {/* Details */}
        <div style={{ fontSize: 12, color: "#9b7b6e", lineHeight: 1.9 }}>
          {age > 0 && (
            <><strong style={{ color: "#5a3e36" }}>{age} yrs</strong>{p.height ? ` · ${p.height}` : ""}<br /></>
          )}
          {p.religion ?? "—"}<br />
          {p.occupation ?? "—"}{p.city ? ` · ${p.city}` : ""}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
          {p.marital_status && (
            <span style={{ fontSize: 11, background: "#fdf0e8", color: "#c0392b", borderRadius: 4, padding: "2px 7px" }}>
              {p.marital_status.replace(/_/g, " ")}
            </span>
          )}
          {p.annual_income && (
            <span style={{ fontSize: 11, background: "#fdf0e8", color: "#c0392b", borderRadius: 4, padding: "2px 7px" }}>
              {formatIncome(p.annual_income)}
            </span>
          )}
        </div>
      </Link>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, padding: "0 13px 13px" }}>
        <button
          onClick={sendInterest}
          disabled={sent}
          style={{ flex: 1, padding: "7px 0", fontSize: 12, fontWeight: 600, background: sent ? "#27ae60" : "linear-gradient(135deg,#c0392b,#e74c3c)", color: "white", border: "none", borderRadius: 50, cursor: sent ? "default" : "pointer" }}
        >
          {sent ? "✓ Sent" : "Send Interest"}
        </button>
        <button
          onClick={toggleSave}
          title={saved ? "Unsave" : "Shortlist"}
          style={{ width: 32, height: 32, flexShrink: 0, borderRadius: "50%", border: "1.5px solid #f0d9c8", background: saved ? "#fff0e8" : "white", color: saved ? "#e74c3c" : "#c0392b", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function FG({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={{ display: "block", fontSize: 11, color: "#9b7b6e", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

function PBtn({ onClick, disabled, active, children }: {
  onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width: 36, height: 36, borderRadius: 8, fontSize: 14, cursor: disabled ? "default" : "pointer", border: `1.5px solid ${active ? "#c0392b" : "#f0d9c8"}`, background: active ? "#c0392b" : "white", color: active ? "white" : "#5a3e36", opacity: disabled ? 0.35 : 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
    >
      {children}
    </button>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#fff8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #f0d9c8", borderTopColor: "#c0392b", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "#c0392b", fontSize: 14 }}>Loading profiles…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}