"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
    open: boolean;
    onToggle: () => void;
};

const masterItems = [
    {
        label: "Category",
        href: "/admin/categories",
        icon: (
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    {
        label: "Sub Category",
        href: "/admin/subcategories",
        icon: (
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    
];

export default function AdminSidebar({ open, onToggle }: Props) {
    const pathname = usePathname();
    const [mastersOpen, setMastersOpen] = useState(
        masterItems.some((i) => pathname === i.href)
    );

    const isMastersActive = masterItems.some((i) => pathname === i.href);

    return (
        <aside
            className={`
                ${open ? "w-[220px]" : "w-[60px]"}
                bg-[#130800] flex flex-col shrink-0
                transition-all duration-300 ease-in-out
            `}
        >
            {/* Logo */}
            <div className={`h-14 flex items-center border-b border-white/10 ${!open ? "justify-center px-0" : "px-4 gap-3"}`}>
                <button
                    onClick={onToggle}
                    className="w-8 h-8 rounded-xl bg-[#C9782A] flex items-center justify-center shrink-0"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-4.5 6a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm9 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-4.5 4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                    </svg>
                </button>
                {open && (
                    <div>
                        <p className="text-white text-[13px] font-bold leading-none">EliteWedding</p>
                        <p className="text-[#C9782A] text-[9px] tracking-widest uppercase font-medium mt-0.5">Admin Panel</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">

                {/* ── 1. Dashboard ── */}
                {open && (
                    <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest px-2 pb-1 pt-2">
                        Overview
                    </p>
                )}
                <Link
                    href="/admin/dashboard"
                    title={!open ? "Dashboard" : undefined}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all
                        ${pathname === "/admin/dashboard"
                            ? "bg-[#C9782A] text-white"
                            : "text-white/50 hover:text-white hover:bg-white/8"
                        }
                        ${!open ? "justify-center" : ""}
                    `}
                >
                    <span className={`shrink-0 ${pathname === "/admin/dashboard" ? "text-white" : "text-white/40"}`}>
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </span>
                    {open && <span className="flex-1 truncate">Dashboard</span>}
                </Link>

                {/* ── 2. Users ── */}
                {open && (
                    <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest px-2 pb-1 pt-3">
                        Members
                    </p>
                )}
                <Link
                    href="/admin/users"
                    title={!open ? "All Users" : undefined}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all
                        ${pathname === "/admin/users"
                            ? "bg-[#C9782A] text-white"
                            : "text-white/50 hover:text-white hover:bg-white/8"
                        }
                        ${!open ? "justify-center" : ""}
                    `}
                >
                    <span className={`shrink-0 ${pathname === "/admin/users" ? "text-white" : "text-white/40"}`}>
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </span>
                    {open && <span className="flex-1 truncate">All Users</span>}
                </Link>

                {/* ── 3. Masters (collapsible) ── */}
                {open && (
                    <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest px-2 pb-1 pt-3">
                        Masters
                    </p>
                )}
                <button
                    onClick={() => open && setMastersOpen((p) => !p)}
                    title={!open ? "Masters" : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all
                        ${isMastersActive
                            ? "bg-[#C9782A]/15 text-[#C9782A]"
                            : "text-white/50 hover:text-white hover:bg-white/8"
                        }
                        ${!open ? "justify-center" : ""}
                    `}
                >
                    <span className={`shrink-0 ${isMastersActive ? "text-[#C9782A]" : "text-white/40"}`}>
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </span>
                    {open && (
                        <>
                            <span className="flex-1 text-left truncate">Masters</span>
                            <svg
                                width="13" height="13" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" strokeWidth={2}
                                className={`shrink-0 transition-transform duration-200 ${mastersOpen ? "rotate-180" : ""}`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </>
                    )}
                </button>

                {/* Masters dropdown */}
                {open && mastersOpen && (
                    <div className="ml-3 pl-3 border-l border-white/10 space-y-0.5">
                        {masterItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all
                                        ${isActive
                                            ? "text-[#C9782A] bg-[#C9782A]/10"
                                            : "text-white/40 hover:text-white hover:bg-white/8"
                                        }
                                    `}
                                >
                                    <span className={`shrink-0 ${isActive ? "text-[#C9782A]" : "text-white/30"}`}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                )}

            </nav>

            {/* Bottom admin info */}
            {open && (
                <div className="p-3 border-t border-white/10">
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="w-7 h-7 rounded-full bg-[#C9782A]/25 border border-[#C9782A]/40 flex items-center justify-center text-[#C9782A] text-[10px] font-bold shrink-0">
                            SA
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-white text-[12px] font-semibold truncate leading-none">Super Admin</p>
                            <p className="text-white/35 text-[10px] truncate mt-0.5">admin@elitewedding.com</p>
                        </div>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="text-white/25 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                </div>
            )}
        </aside>
    );
}