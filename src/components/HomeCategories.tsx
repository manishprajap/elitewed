"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_TO_PARAM: Record<string, string> = {
  religion: "religion",
  religions: "religion",
  caste: "caste",
  castes: "caste",
  education: "education",
  educations: "education",
  profession: "occupation",
  professions: "occupation",
  occupation: "occupation",
  occupations: "occupation",
};

const CATEGORY_ICONS: Record<string, string> = {
  religion: "✦",
  religions: "✦",
  caste: "◈",
  castes: "◈",
  education: "◎",
  educations: "◎",
  profession: "◉",
  professions: "◉",
  occupation: "◉",
  occupations: "◉",
};

export default function HomeCategories() {
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
  async function loadCategories() {
    try {
      const res = await fetch("/api/users/categories", { cache: "no-store" });
      const json = await res.json();

      // ✅ Unwrap { success, data: {...} } wrapper
      const raw = json?.data ?? json;

      const clean: Record<string, string[]> = {};
      for (const [key, val] of Object.entries(raw)) {
        if (Array.isArray(val) && val.length > 0) {
          // ✅ val is { id, name }[] — extract just the name strings
          clean[key] = (val as { id: number; name: string }[]).map((v) => v.name);
        }
      }

      console.log("Loaded categories:", clean);
      setCategories(clean);
      setActiveTab(Object.keys(clean)[0] || "");
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }
  loadCategories();
}, []);

  const tabs = Object.keys(categories);

  function formatLabel(str: string) {
    return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function handleClick(category: string, item: string) {
    const param = CATEGORY_TO_PARAM[category.toLowerCase()];
    if (!param) return;
    router.push(`/search?${param}=${encodeURIComponent(item.trim())}`);
  }

  function handleViewAll() {
    const param = CATEGORY_TO_PARAM[activeTab.toLowerCase()];
    if (!param) return;
    router.push(`/search?${param}=all`);
  }

  const getItems = (tab: string): string[] => {
    const val = categories[tab];
    return Array.isArray(val) ? val : [];
  };

  if (tabs.length === 0) return null;

  const activeIndex = tabs.indexOf(activeTab);

  return (
    <section className="bg-[#fdfaf7] py-10 border-t border-b border-[#f0e8e0]">
      <div className="max-w-[1100px] mx-auto px-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-[12px] font-semibold tracking-[2.5px] uppercase text-[#c0392b] m-0 mb-3">Explore Profiles</p>
          <h2 className="text-[36px] font-bold text-[#1a0a00] m-0 mb-3 font-[Georgia,serif] tracking-[-0.5px]">
            Browse by Category
          </h2>
          <p className="text-[15px] text-[#9a7b6e] m-0">
            Find your perfect match by religion, caste, education &amp; more
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex relative bg-white border border-[#f0e0d6] rounded-t-xl overflow-hidden shadow-[0_2px_12px_rgba(180,80,40,0.06)]">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              className={`flex-1 flex items-center justify-center gap-[7px] px-2 py-[18px] text-[13px] font-semibold cursor-pointer border-none border-r border-r-[#f5ede6] last:border-r-0 relative z-[1] transition-all tracking-[0.3px] whitespace-nowrap max-sm:text-[11px] max-sm:py-[14px] max-sm:gap-[3px] ${
                activeTab === tab
                  ? "text-[#c0392b] bg-[#fff8f5]"
                  : "text-[#9a7b6e] bg-transparent hover:bg-[#fff8f5] hover:text-[#c0392b]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="text-[11px] max-sm:hidden">{CATEGORY_ICONS[tab.toLowerCase()] || "◆"}</span>
              {formatLabel(tab)}
            </button>
          ))}
          {/* Active indicator */}
          <div
            className="absolute bottom-0 h-[3px] bg-gradient-to-r from-[#c0392b] to-[#e74c3c] rounded-t transition-[left] duration-300"
            style={{
              left: `calc(${activeIndex} * (100% / ${tabs.length}))`,
              width: `calc(100% / ${tabs.length})`,
            }}
          />
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-[#f0e0d6] border-t-0 rounded-b-xl px-8 pb-7 pt-9 shadow-[0_4px_20px_rgba(180,80,40,0.05)] min-h-[260px] max-sm:px-[14px] max-sm:pt-5">
          <div className="grid grid-cols-4 gap-0.5 max-[900px]:grid-cols-3 max-sm:grid-cols-2">
            {getItems(activeTab).map((item, i) => (
              <button
                key={item}
                className="flex items-center gap-[10px] px-[22px] py-[13px] bg-transparent border-none rounded-lg cursor-pointer text-left transition-colors hover:bg-[#fff0eb] group"
                onClick={() => handleClick(activeTab, item)}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span className="text-[16px] font-medium text-[#3d2b20] flex-1 text-left transition-colors group-hover:text-[#c0392b] group-hover:font-bold border-[#c0392b]">
                  {item}
                </span>
                <span className="text-[12px] text-[#c0392b] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-[3px]">
                  →
                </span>
              </button>
            ))}
          </div>

          {getItems(activeTab).length === 0 && (
            <p className="text-[14px] text-[#9a7b6e] text-center py-10">No items available.</p>
          )}

     
        </div>
      </div>
    </section>
  );
}