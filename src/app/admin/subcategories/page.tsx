"use client";

import { useEffect, useState, useCallback } from "react";

type Category = {
  id: number;
  name: string;
};

type Subcategory = {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  created_at?: string;
};

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {};
const PALETTE = [
  { bg: "#FFF4EA", color: "#C9782A" },
  { bg: "#EEF2FF", color: "#4338CA" },
  { bg: "#F0FDF4", color: "#16A34A" },
  { bg: "#FFF1F2", color: "#BE123C" },
  { bg: "#F0F9FF", color: "#0369A1" },
  { bg: "#FDF4FF", color: "#7E22CE" },
];
let paletteIdx = 0;
const getCategoryColor = (name: string) => {
  if (!CATEGORY_COLORS[name]) {
    CATEGORY_COLORS[name] = PALETTE[paletteIdx % PALETTE.length];
    paletteIdx++;
  }
  return CATEGORY_COLORS[name];
};

export default function SubcategoryPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [nameError, setNameError] = useState("");
  const [catError, setCatError] = useState("");

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.data || []);
  };

  const fetchSubcategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/subcategories?search=${search}`);
      const data = await res.json();
      setSubcategories(data.data || []);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, [fetchSubcategories]);

  const addSubcategory = async () => {
    let valid = true;
    if (!name.trim()) { setNameError("Subcategory name is required."); valid = false; }
    if (!categoryId) { setCatError("Please select a category."); valid = false; }
    if (!valid) return;

    setAdding(true);
    await fetch("/api/subcategories", {
      method: "POST",
      body: JSON.stringify({ name, category_id: Number(categoryId) }),
    });
    setName("");
    setCategoryId("");
    await fetchSubcategories();
    setAdding(false);
  };

  const deleteSubcategory = async (id: number) => {
    if (!confirm("Delete this subcategory?")) return;
    setDeletingId(id);
    await fetch(`/api/subcategories?id=${id}`, { method: "DELETE" });
    await fetchSubcategories();
    setDeletingId(null);
  };

  const fmtDate = (val?: string) =>
    val
      ? new Date(val).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  // Group count by category for the sidebar stat
  const catCounts = subcategories.reduce<Record<string, number>>((acc, s) => {
    acc[s.category_name] = (acc[s.category_name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .mono { font-family: 'DM Mono', monospace; }
        .row-hover:hover { background: #FAFAF8; }
        .btn-add { transition: background 0.15s, transform 0.1s, box-shadow 0.15s; }
        .btn-add:hover { background: #1a1410 !important; box-shadow: 0 4px 12px rgba(0,0,0,0.18); transform: translateY(-1px); }
        .btn-add:active { transform: translateY(0); }
        .delete-btn { transition: color 0.15s, background 0.15s; }
        .delete-btn:hover { color: #be123c; background: #fff1f2; border-radius: 6px; }
        .input-field:focus, .select-field:focus { outline: none; border-color: #C9782A; box-shadow: 0 0 0 3px rgba(201,120,42,0.12); }
        .search-field:focus { outline: none; border-color: #C9782A; box-shadow: 0 0 0 3px rgba(201,120,42,0.12); }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        tbody tr { animation: fadeIn 0.2s ease both; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .select-field { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 14px; padding-right: 36px; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Page Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="mono text-[11px] tracking-widest text-[#C9782A] uppercase mb-1">Configuration</p>
            <h1 className="text-2xl font-semibold text-[#1a1410] leading-tight">Subcategories</h1>
            <p className="text-[13px] text-gray-400 mt-1">Manage subcategories within each category</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center shadow-sm">
              <p className="mono text-[11px] text-gray-400 uppercase tracking-wider">Total</p>
              <p className="text-2xl font-semibold text-[#1a1410]">{subcategories.length}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center shadow-sm">
              <p className="mono text-[11px] text-gray-400 uppercase tracking-wider">Categories</p>
              <p className="text-2xl font-semibold text-[#1a1410]">{Object.keys(catCounts).length}</p>
            </div>
          </div>
        </div>

        {/* Add Form */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C9782A]" />
            <h2 className="text-[13px] font-semibold text-[#1a1410]">Add New Subcategory</h2>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-3 items-start">

              {/* Category Select */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Parent Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => { setCategoryId(e.target.value); setCatError(""); }}
                  className={`select-field input-field w-full border rounded-xl px-4 py-2.5 text-[13px] text-gray-800 bg-white transition-all
                    ${catError ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {catError && <p className="text-[11px] text-rose-500 mt-1.5">⚠ {catError}</p>}
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Subcategory Name
                </label>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && addSubcategory()}
                  placeholder="e.g. Brahmin"
                  className={`input-field w-full border rounded-xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-300 transition-all
                    ${nameError ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-white"}`}
                />
                {nameError && <p className="text-[11px] text-rose-500 mt-1.5">⚠ {nameError}</p>}
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button
                  onClick={addSubcategory}
                  disabled={adding}
                  className="btn-add flex items-center gap-2 bg-[#2C2C2C] text-white text-[13px] font-medium px-5 py-2.5 rounded-xl disabled:opacity-50 whitespace-nowrap"
                >
                  {adding ? (
                    <>
                      <svg className="spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity=".25" />
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Adding…
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-[13px] font-semibold text-[#1a1410]">All Subcategories</h2>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subcategories…"
                className="search-field border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-[12px] text-gray-700 bg-[#FAFAF8] w-60 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
              <svg className="spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".2" />
                <path d="M12 2a10 10 0 0110 10" stroke="#C9782A" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="text-[13px]">Loading subcategories…</span>
            </div>
          ) : subcategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-[14px] font-medium text-gray-600">No subcategories yet</p>
              <p className="text-[12px] text-gray-400 mt-1">Add your first subcategory above</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest w-12">#</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Subcategory</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Created</th>
                  <th className="px-4 py-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {subcategories.map((s, idx) => {
                  const pal = getCategoryColor(s.category_name);
                  return (
                    <tr key={s.id} className="row-hover border-b border-gray-50 last:border-0 transition-colors">
                      <td className="px-6 py-3.5">
                        <span className="mono text-[11px] text-gray-300">{String(idx + 1).padStart(2, "0")}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                          style={{ background: pal.bg, color: pal.color }}
                        >
                          {s.category_name}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1 h-4 rounded-full bg-gray-200" />
                          <span className="text-[13px] font-medium text-[#1a1410]">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="mono text-[11px] text-gray-400">{fmtDate(s.created_at)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => deleteSubcategory(s.id)}
                          disabled={deletingId === s.id}
                          className="delete-btn text-[11px] font-medium text-gray-400 px-2.5 py-1.5 transition-all disabled:opacity-40"
                        >
                          {deletingId === s.id ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!loading && subcategories.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-[#FAFAF8]">
              <p className="mono text-[11px] text-gray-400">
                {subcategories.length} {subcategories.length === 1 ? "subcategory" : "subcategories"} across {Object.keys(catCounts).length} {Object.keys(catCounts).length === 1 ? "category" : "categories"}
                {search && <span> · filtered by &quot;<span className="text-[#C9782A]">{search}</span>&quot;</span>}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}