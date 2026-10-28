"use client";

import { useEffect, useState, useCallback } from "react";

type Category = {
  id: number;
  name: string;
  created_at?: string;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/categories?search=${search}`);
      const data = await res.json();
      const sorted = (data.data || []).sort(
        (a: Category, b: Category) => b.id - a.id
      );
      setCategories(sorted);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async () => {
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setError("");
    setAdding(true);
    await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    setName("");
    await fetchCategories();
    setAdding(false);
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    setDeletingId(id);
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    await fetchCategories();
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
        .input-field:focus { outline: none; border-color: #C9782A; box-shadow: 0 0 0 3px rgba(201,120,42,0.12); }
        .search-field:focus { outline: none; border-color: #C9782A; box-shadow: 0 0 0 3px rgba(201,120,42,0.12); }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        tbody tr { animation: fadeIn 0.2s ease both; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="mono text-[11px] tracking-widest text-[#C9782A] uppercase mb-1">Configuration</p>
            <h1 className="text-2xl font-semibold text-[#1a1410] leading-tight">Categories</h1>
            <p className="text-[13px] text-gray-400 mt-1">Manage top-level listing categories</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-center shadow-sm">
            <p className="mono text-[11px] text-gray-400 uppercase tracking-wider">Total</p>
            <p className="text-2xl font-semibold text-[#1a1410]">{categories.length}</p>
          </div>
        </div>

        {/* Add Form */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C9782A]" />
            <h2 className="text-[13px] font-semibold text-[#1a1410]">Add New Category</h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && addCategory()}
                  placeholder="e.g. Hindu Matrimony"
                  className={`input-field w-full border rounded-xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-300 transition-all
                    ${error ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-white"}`}
                />
                {error && (
                  <p className="text-[11px] text-rose-500 mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {error}
                  </p>
                )}
              </div>
              <div className="pt-6">
                <button
                  onClick={addCategory}
                  disabled={adding}
                  className="btn-add flex items-center gap-2 bg-[#2C2C2C] text-white text-[13px] font-medium px-5 py-2.5 rounded-xl disabled:opacity-50"
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

        {/* List */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-[13px] font-semibold text-[#1a1410]">All Categories</h2>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories…"
                className="search-field border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-[12px] text-gray-700 bg-[#FAFAF8] w-56 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
              <svg className="spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".2" />
                <path d="M12 2a10 10 0 0110 10" stroke="#C9782A" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="text-[13px]">Loading categories…</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                </svg>
              </div>
              <p className="text-[14px] font-medium text-gray-600">No categories yet</p>
              <p className="text-[12px] text-gray-400 mt-1">Add your first category above</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest w-12">#</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Created</th>
                  <th className="px-4 py-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {categories.map((c, idx) => (
                  <tr key={c.id} className="row-hover border-b border-gray-50 last:border-0 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="mono text-[11px] text-gray-300">{String(idx + 1).padStart(2, "0")}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#FFF4EA] flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] font-bold text-[#C9782A]">{c.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-[13px] font-medium text-[#1a1410]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="mono text-[11px] text-gray-400">{fmtDate(c.created_at)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => deleteCategory(c.id)}
                        disabled={deletingId === c.id}
                        className="delete-btn text-[11px] font-medium text-gray-400 px-2.5 py-1.5 transition-all disabled:opacity-40"
                      >
                        {deletingId === c.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && categories.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-[#FAFAF8]">
              <p className="mono text-[11px] text-gray-400">
                {categories.length} {categories.length === 1 ? "category" : "categories"} total
                {search && <span> · filtered by &quot;<span className="text-[#C9782A]">{search}</span>&quot;</span>}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}