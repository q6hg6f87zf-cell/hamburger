import React from "react";
import { Lock, Terminal } from "lucide-react";

export function ShellHeader(props: any) {
  const {
    isAdmin,
    activeCategory,
    setActiveCategory,
    setActiveTab,
    activeTab,
    handleTabClick,
    isCielComplete
  } = props;

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--pip-main)] pb-4 mb-6">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center gap-2 text-[var(--pip-main)]">
          <Terminal className="h-5 w-5 glow" />
          <span className="text-sm font-black tracking-[0.3em] glow uppercase leading-none">S.Y.N.A.P.S.E. // {isAdmin ? "OVERSEER" : "MEMBER"}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setActiveCategory("CORE"); setActiveTab(isAdmin ? "SYSTEM" : "CiEL_PROTOCOL"); }} className={`px-4 py-1.5 text-[9px] font-black border transition-none uppercase tracking-widest ${activeCategory === "CORE" ? "bg-[var(--pip-main)] text-black border-[var(--pip-main)]" : "border-[var(--pip-dim)] text-[var(--pip-dim)] hover:border-[var(--pip-main)]"}`}>[ CORE ]</button>
          <button onClick={() => { setActiveCategory("APPS"); setActiveTab("OS_DASHBOARD"); }} className={`px-4 py-1.5 text-[9px] font-black border transition-none uppercase tracking-widest ${activeCategory === "APPS" ? "bg-[var(--pip-main)] text-black border-[var(--pip-main)]" : "border-[var(--pip-dim)] text-[var(--pip-dim)] hover:border-[var(--pip-main)]"}`}>[ APPS ]</button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-1">
          {activeCategory === "CORE" && (isAdmin ? ["MASTER_FILE", "SYSTEM", "ARCHIVE", "TACTICAL_MAP"] : ["CiEL_PROTOCOL", "DIRECTORY", "PERSONALIZATION"]).map((t) => (
            <button key={t} onClick={() => handleTabClick(t)} className={`px-2.5 py-1 text-[8px] font-black border transition-none uppercase tracking-widest ${activeTab === t ? "bg-[var(--pip-main)] text-black border-[var(--pip-main)]" : "border-[var(--pip-dim)] text-[var(--pip-dim)] hover:border-[var(--pip-main)] hover:text-[var(--pip-main)]"}`}>
              {(!isAdmin && !isCielComplete && t === "DIRECTORY") && <Lock className="h-2 w-2 inline mr-1 -mt-0.5 opacity-50" />}
              {t.replace("_", " ")}
            </button>
          ))}
          {activeCategory === "APPS" && ["OS_DASHBOARD", "WEATHER_SYNC", "NEURAL_JOURNAL", "PROMPT_FORGE", "CALENDAR"].map((t) => (
            <button key={t} onClick={() => handleTabClick(t)} className={`px-2.5 py-1 text-[8px] font-black border transition-none uppercase tracking-widest ${activeTab === t ? "bg-[var(--pip-main)] text-black border-[var(--pip-main)]" : "border-[var(--pip-dim)] text-[var(--pip-dim)] hover:border-[var(--pip-main)] hover:text-[var(--pip-main)]"}`}>
              {(!isCielComplete && t !== "CALENDAR" && t !== "OS_DASHBOARD") && <Lock className="h-2 w-2 inline mr-1 -mt-0.5 opacity-50" />}
              {t === "OS_DASHBOARD" ? "GRID" : t.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => window.location.reload()} className="border border-amber-600 px-4 py-1.5 text-[9px] font-black text-amber-500 uppercase hover:bg-amber-600 hover:text-black transition-none whitespace-nowrap">ABORT_LINK</button>
    </div>
  );
}
