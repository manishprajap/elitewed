"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Toast from "./Toast";

type User = {
  id: number;
  name: string;
  email: string;
  profile_photo: string | null;
};

function subscribe() { return () => {}; }
function useIsMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

// ✅ NEW: default user icon shown when profile_photo is null
function DefaultUserIcon({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[#f0d9c8] flex items-center justify-center border-2 border-[#f0d9c8] flex-shrink-0"
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#a9765a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}

function EliteWedsLogo({ width = 160 }: { width?: number }) {
  const height = Math.round((width / 680) * 220);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 680 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EliteWeds Logo"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="50%" stopColor="#C9952A" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4A843" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="88" fill="none" stroke="url(#goldGrad)" strokeWidth="1.2" strokeDasharray="4 3" />
      <circle cx="110" cy="110" r="80" fill="none" stroke="url(#goldGrad)" strokeWidth="0.6" />
      <circle cx="110" cy="110" r="76" fill="#1a0a00" />
      <circle cx="110" cy="110" r="72" fill="none" stroke="url(#goldGrad)" strokeWidth="1" />
      <g fill="url(#goldGrad2)" opacity="0.95">
        <ellipse cx="110" cy="52" rx="5" ry="12" transform="rotate(0,110,52)" />
        <ellipse cx="91" cy="58" rx="4" ry="10" transform="rotate(-25,91,58)" />
        <ellipse cx="76" cy="70" rx="3.5" ry="8" transform="rotate(-45,76,70)" />
        <ellipse cx="129" cy="58" rx="4" ry="10" transform="rotate(25,129,58)" />
        <ellipse cx="144" cy="70" rx="3.5" ry="8" transform="rotate(45,144,70)" />
        <circle cx="110" cy="42" r="2.5" />
        <circle cx="96" cy="47" r="1.8" />
        <circle cx="124" cy="47" r="1.8" />
      </g>
      <g fill="url(#goldGrad2)" opacity="0.85">
        <ellipse cx="85" cy="155" rx="3.5" ry="9" transform="rotate(35,85,155)" />
        <ellipse cx="135" cy="155" rx="3.5" ry="9" transform="rotate(-35,135,155)" />
        <ellipse cx="97" cy="163" rx="3" ry="7" transform="rotate(15,97,163)" />
        <ellipse cx="123" cy="163" rx="3" ry="7" transform="rotate(-15,123,163)" />
        <path d="M100 170 Q110 178 120 170" fill="none" stroke="url(#goldGrad)" strokeWidth="1.2" />
      </g>
      <polygon points="110,75 113,81 110,87 107,81" fill="url(#goldGrad2)" />
      <polygon points="110,133 113,139 110,145 107,139" fill="url(#goldGrad2)" opacity="0.7" />
      <text x="110" y="122" textAnchor="middle" fontFamily="Georgia, serif" fontSize="32" fontWeight="700" fill="url(#goldGrad)" letterSpacing="2">EW</text>
      <path d="M68 100 Q58 95 55 100 Q52 105 58 108 Q64 111 68 106" fill="none" stroke="url(#goldGrad)" strokeWidth="0.9" opacity="0.7" />
      <path d="M68 120 Q58 115 55 120 Q52 125 58 128 Q64 131 68 126" fill="none" stroke="url(#goldGrad)" strokeWidth="0.9" opacity="0.7" />
      <path d="M152 100 Q162 95 165 100 Q168 105 162 108 Q156 111 152 106" fill="none" stroke="url(#goldGrad)" strokeWidth="0.9" opacity="0.7" />
      <path d="M152 120 Q162 115 165 120 Q168 125 162 128 Q156 131 152 126" fill="none" stroke="url(#goldGrad)" strokeWidth="0.9" opacity="0.7" />
      <text x="310" y="95" textAnchor="middle" fontFamily="Georgia, serif" fontSize="42" fontWeight="700" fill="#1a0a00" letterSpacing="5">ELITE</text>
      <text x="310" y="140" textAnchor="middle" fontFamily="Georgia, serif" fontSize="42" fontWeight="700" fill="#C9952A" letterSpacing="5">WEDS</text>
      <line x1="185" y1="160" x2="248" y2="160" stroke="#C9952A" strokeWidth="0.8" opacity="0.7" />
      <polygon points="310,155 313,160 310,165 307,160" fill="#C9952A" />
      <line x1="372" y1="160" x2="435" y2="160" stroke="#C9952A" strokeWidth="0.8" opacity="0.7" />
      <text x="310" y="185" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fill="#8B6914" letterSpacing="3.5">WHERE HEARTS UNITE</text>
    </svg>
  );
}

export default function Header() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const [browseDropdownOpen, setBrowseDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [clickedOpen, setClickedOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null); // ✅ NEW
  const profileButtonRef = useRef<HTMLDivElement>(null);   // ✅ NEW

  const mounted = useIsMounted();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [browseCategories, setBrowseCategories] = useState<Record<string, string[]>>({});
  const [hoveredCategory, setHoveredCategory] = useState<string>("");

  // ─── Load logged-in user ──────────────────────────────────────────────────
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        if (!res.ok) { setIsLoggedIn(false); setUser(null); return; }
        const data = await res.json();
        setIsLoggedIn(!!data.user);
        setUser(data.user || null);
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      }
    }
    loadUser();
  }, []);

  // ─── Load browse categories ───────────────────────────────────────────────
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/users/categories");
        const json = await res.json();
        const raw = json?.data ?? json;

        const clean: Record<string, string[]> = {};
        for (const [key, val] of Object.entries(raw)) {
          if (Array.isArray(val) && val.length > 0) {
            clean[key] = (val as { id: number; name: string }[]).map((v) => v.name);
          }
        }

        setBrowseCategories(clean);
        const firstKey = Object.keys(clean)[0];
        setHoveredCategory(firstKey || "");
      } catch (err) {
        console.error("Categories fetch error:", err);
        setBrowseCategories({});
        setHoveredCategory("");
      }
    }
    fetchCategories();
  }, []);

  // ─── Close dropdowns on outside click ────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Browse dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setBrowseDropdownOpen(false);
        setClickedOpen(false);
      }

      // ✅ FIX: Profile dropdown now only closes when clicking truly outside
      // (both the toggle button AND the panel itself are excluded)
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  function titleCase(str: string) {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
  }

  const getCategoryItems = (cat: string): string[] => {
    const val = browseCategories[cat];
    return Array.isArray(val) ? val : [];
  };

  const categoryKeys = Object.keys(browseCategories);

  const handleLogout = async () => {
  try {
    const res = await fetch("/api/users/logout", { method: "POST" });
    if (!res.ok) {
      setToast({ message: "Logout failed. Please try again.", type: "error" });
      return;
    }
    setToast({ message: "Logged out successfully!", type: "success" });
    // ✅ FIX: full reload after logout too, so header state resets cleanly
    setTimeout(() => {
      window.location.href = "/login";
    }, 800);
  } catch (err) {
    console.error("Logout error:", err);
    setToast({ message: "Something went wrong during logout.", type: "error" });
  }
};

  return (
    <header className="sticky top-0 z-[100] bg-[rgba(255,248,240,0.97)] backdrop-blur-[12px] border-b border-[#f0d9c8] shadow-[0_2px_20px_rgba(180,80,40,0.06)]">
      <div className="max-w-[1280px] mx-auto px-6 h-[70px] flex items-center justify-between gap-5">

        <Link href="/" className="flex items-center no-underline flex-shrink-0">
          <EliteWedsLogo width={160} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 flex-1">

          {/* Browse Dropdown (unchanged) */}
          <div
            className="relative h-[70px] flex items-center"
            onMouseEnter={() => setBrowseDropdownOpen(true)}
            onMouseLeave={() => { if (!clickedOpen) setBrowseDropdownOpen(false); }}
          >
            <button
              ref={buttonRef}
              onClick={(e) => {
                e.stopPropagation();
                setBrowseDropdownOpen((p) => !p);
                setClickedOpen((p) => !p);
              }}
              className="flex items-center gap-[6px] text-[14px] font-semibold text-[#5a3e36] bg-transparent border-none cursor-pointer p-0 whitespace-nowrap transition-colors hover:text-[#c0392b]"
            >
              Browse Profiles
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: "transform 0.3s", transform: browseDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {browseDropdownOpen && categoryKeys.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 w-[760px] bg-white border border-[#f0d9c8] rounded-2xl shadow-[0_8px_40px_rgba(180,80,40,0.12)] flex overflow-hidden z-[200] animate-[fadeDown_0.18s_ease]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-[200px] border-r border-[#f5ede6] bg-[#fdf8f4] py-2 flex-shrink-0">
                  {categoryKeys.map((cat) => (
                    <div
                      key={cat}
                      onMouseEnter={() => setHoveredCategory(cat)}
                      className={`flex items-center justify-between px-4 py-[9px] text-[13px] font-medium text-[#5a3e36] cursor-pointer transition-all ${
                        hoveredCategory === cat
                          ? "bg-[#fff0e8] text-[#c0392b] font-semibold"
                          : "hover:bg-[#fff0e8] hover:text-[#c0392b]"
                      }`}
                    >
                      {titleCase(cat)}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  ))}
                </div>

                <div className="flex-1 p-4 flex flex-wrap content-start gap-1 max-h-[340px] overflow-y-auto">
                  {getCategoryItems(hoveredCategory).map((item) => (
                    <button
                      key={item}
                      className="w-[calc(33.33%-4px)] text-left px-[10px] py-[6px] text-[13px] text-[#5a3e36] bg-transparent border-none cursor-pointer rounded-lg transition-all hover:bg-[#fff0e8] hover:text-[#c0392b] whitespace-nowrap overflow-hidden text-ellipsis"
                      onClick={() => {
                        const rawKey = hoveredCategory === "Profession" ? "occupation" : hoveredCategory.toLowerCase();
                        router.push(`/search?${new URLSearchParams({ [rawKey]: item })}`);
                        setBrowseDropdownOpen(false);
                        setClickedOpen(false);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white border-[1.5px] border-[#f0d9c8] rounded-full overflow-hidden h-[38px] flex-1 max-w-[340px] transition-all focus-within:border-[#c0392b] focus-within:shadow-[0_0_0_3px_rgba(192,57,43,0.1)]"
          >
            <svg className="ml-3 text-[#bfa99a] flex-shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Name, Caste, Religion…"
              className="flex-1 border-none outline-none px-[10px] text-[13px] text-[#3d2b20] bg-transparent min-w-0 placeholder:text-[#c9b0a4]"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-[#c0392b] to-[#e74c3c] text-white border-none px-4 h-full text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-90 whitespace-nowrap flex-shrink-0"
            >
              Search
            </button>
          </form>

          <Link href="/about-us" className="text-[14px] font-medium text-[#5a3e36] no-underline relative pb-[2px] transition-colors hover:text-[#c0392b] whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#c0392b] after:transition-[width] hover:after:w-full">About</Link>
          <Link href="/contact-us" className="text-[14px] font-medium text-[#5a3e36] no-underline relative pb-[2px] transition-colors hover:text-[#c0392b] whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#c0392b] after:transition-[width] hover:after:w-full">Contact</Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {mounted && !isLoggedIn && (
            <>
              <Link
                href="/login"
                className="hidden md:block text-[14px] font-semibold text-[#c0392b] border-[1.5px] border-[#c0392b] px-[18px] py-[7px] rounded-full no-underline transition-all hover:bg-[#c0392b] hover:text-white whitespace-nowrap"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden md:block text-[14px] font-bold text-white bg-gradient-to-br from-[#c0392b] to-[#e74c3c] px-5 py-2 rounded-full no-underline shadow-[0_4px_15px_rgba(192,57,43,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(192,57,43,0.4)] whitespace-nowrap"
              >
                Register Free
              </Link>
            </>
          )}

          {mounted && isLoggedIn && (
            <div className="relative">
              {/* ✅ FIX: click-only toggle, hover handlers removed */}
              <div
                ref={profileButtonRef}
                className="flex items-center gap-[10px] bg-white border-[1.5px] border-[#f0d9c8] rounded-full py-[5px] pr-3 pl-[5px] cursor-pointer transition-all hover:border-[#e8b4a0] hover:shadow-[0_2px_12px_rgba(180,80,40,0.1)]"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen((p) => !p);
                }}
              >
                {/* ✅ FIX: default icon when no profile_photo */}
                {user?.profile_photo ? (
                  <Image
                    src={user.profile_photo}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full object-cover border-2 border-[#f0d9c8]"
                  />
                ) : (
                  <DefaultUserIcon size={36} />
                )}
                <div className="leading-[1.2]">
                  <p className="text-[13px] font-semibold text-[#2c1810]">{user?.name || "My Profile"}</p>
                  <p className="text-[11px] text-gray-400 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">{user?.email}</p>
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-gray-400"
                  style={{ transition: "transform 0.3s", transform: profileDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {profileDropdownOpen && (
                <div
                  ref={profileDropdownRef}
                  className="absolute right-0 top-[calc(100%+8px)] w-[240px] bg-white border border-[#f0d9c8] rounded-2xl shadow-[0_8px_40px_rgba(180,80,40,0.14)] overflow-hidden z-[200] animate-[fadeDown_0.18s_ease]"
                  onClick={(e) => e.stopPropagation()} // ✅ clicking inside panel won't trigger outside-close
                >
                  <div className="flex items-center gap-[10px] px-4 py-[14px] bg-[#fdf8f4] border-b border-[#f0d9c8]">
                    {user?.profile_photo ? (
                      <Image
                        src={user.profile_photo}
                        alt="Profile"
                        width={44}
                        height={44}
                        className="rounded-full object-cover border-2 border-[#f0d9c8]"
                      />
                    ) : (
                      <DefaultUserIcon size={44} />
                    )}
                    <div>
                      <p className="text-[13px] font-semibold text-[#2c1810]">{user?.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{user?.email}</p>
                    </div>
                  </div>

                  {/* ✅ FIX: only Dashboard + View Profile remain */}
                  <ul className="list-none p-0 m-0 py-[6px]">
                    {[
                      { href: "/", icon: "⊞", label: "Dashboard" },
                      { href: `/profile/${user?.id}`, icon: "◎", label: "View Profile" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-[10px] px-4 py-[9px] text-[13px] text-[#5a3e36] no-underline transition-all hover:bg-[#fff0e8] hover:text-[#c0392b]"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <span className="text-[16px] w-[18px] text-center">{item.icon}</span>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="w-full text-left px-4 py-[10px] text-[13px] font-semibold text-[#c0392b] bg-transparent border-none border-t border-[#f0d9c8] cursor-pointer transition-colors hover:bg-[#fff0e8]"
                    onClick={handleLogout}
                  >
                    ⇤ Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-[2.5px] bg-[#2c1810] rounded" />
            <span className="block w-6 h-[2.5px] bg-[#2c1810] rounded" />
            <span className="block w-6 h-[2.5px] bg-[#2c1810] rounded" />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="flex md:hidden flex-col px-6 pb-4 pt-3 border-t border-[#f0d9c8] gap-0.5 bg-[#fff8f0]">
          <div className="text-[11px] font-bold text-[#c0392b] uppercase tracking-[0.8px] pt-[6px] pb-[2px]">Browse Profiles</div>
          {[
            { href: "/search", label: "All Profiles" },
            { href: "/about-us", label: "About" },
            { href: "/contact-us", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14px] font-medium text-[#5a3e36] no-underline py-[9px] border-b border-[#f5e8de] transition-colors hover:text-[#c0392b] last:border-none"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              <Link href="/login" className="text-[14px] font-medium text-[#5a3e36] no-underline py-[9px] border-b border-[#f5e8de] hover:text-[#c0392b]" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="text-[14px] font-bold text-[#c0392b] no-underline py-[9px] mt-1 hover:text-[#a93224]" onClick={() => setMenuOpen(false)}>Register Free</Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link href="/" className="text-[14px] font-medium text-[#5a3e36] no-underline py-[9px] border-b border-[#f5e8de] hover:text-[#c0392b]" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href={`/profile/${user?.id}`} className="text-[14px] font-medium text-[#5a3e36] no-underline py-[9px] hover:text-[#c0392b]" onClick={() => setMenuOpen(false)}>View Profile</Link>
            </>
          )}
        </nav>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style jsx global>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}