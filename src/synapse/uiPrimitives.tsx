import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, ChevronDown, Terminal } from "lucide-react";
import { type TyroneDialog } from "./tyroneBot";

export function SectionLabel({ children, rightElement }: any) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--pip-main)] pb-2 mb-4 opacity-90">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--pip-main)] glow">:: {children} ::</div>
      {rightElement}
    </div>
  );
}

export function TerminalCard({ children, className = "" }: any) {
  return (
    <div className={`w-full border border-[var(--pip-main)] bg-[var(--pip-bg)] p-[1px] relative shadow-[0_0_15px_rgba(0,0,0,0.8)] ${className}`}>
      <div className="border border-[var(--pip-main)]/20 p-5 md:p-6 h-full flex flex-col bg-black/40">{children}</div>
    </div>
  );
}

export function Field({ label, value, onChange, type = "text", placeholder = "" }: any) {
  return (
    <label className="block w-full mb-3">
      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--pip-main)] opacity-60 mb-1">&gt; {label}</div>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder={placeholder}
        className="w-full bg-[var(--pip-main)]/5 border-b border-[var(--pip-main)]/50 p-2.5 text-xs font-bold text-[var(--pip-main)] outline-none focus:bg-[var(--pip-main)]/10 focus:border-[var(--pip-main)] transition-none placeholder:opacity-30 glow"
      />
    </label>
  );
}

export function TerminalCombobox({ label, value, options = [], onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full mb-3">
      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--pip-main)] opacity-60 mb-1">&gt; {label}</div>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-[var(--pip-main)]/5 border-b border-[var(--pip-main)]/50 p-2.5 text-left text-xs font-bold uppercase flex justify-between items-center hover:bg-[var(--pip-main)]/10 glow">
        {value || "SELECT..."} <ChevronDown className="h-3 w-3 opacity-50" />
      </button>
      {isOpen && (
        <ul className="absolute z-50 w-full bg-black border border-[var(--pip-main)] max-h-40 overflow-y-auto mt-1 shadow-[0_5px_20px_rgba(0,0,0,0.9)]">
          {options.map((o: string) => (
            <li key={o} onClick={() => { onChange(o); setIsOpen(false); }} className="p-2.5 hover:bg-[var(--pip-main)] hover:text-black cursor-pointer uppercase text-[9px] font-black border-b border-[var(--pip-main)]/20 last:border-0 tracking-widest">{o}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TyroneModal({ dialog, onClose }: { dialog: TyroneDialog | null; onClose: () => void }) {
  const [canAcknowledge, setCanAcknowledge] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollHeight <= clientHeight + 10 || scrollTop + clientHeight >= scrollHeight - 10) setCanAcknowledge(true);
    };
    setTimeout(checkScroll, 200);
  }, [dialog?.body]);

  if (!dialog) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
      <div className="border border-[var(--pip-main)] bg-[var(--pip-bg)] max-w-lg w-full p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative flex flex-col max-h-[80vh]">
        <div className="flex items-center gap-3 mb-4 border-b border-[var(--pip-main)]/30 pb-3 shrink-0">
          <Terminal className="h-6 w-6 text-[var(--pip-main)]" />
          <h2 className="text-sm font-black text-[var(--pip-main)] glow uppercase tracking-[0.2em]">{dialog.title || "TYRONE.BOT"}</h2>
        </div>
        <div ref={contentRef} onScroll={(e: any) => {
          if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 10) setCanAcknowledge(true);
        }} className="text-xs leading-loose text-[var(--pip-main)] font-bold mb-6 glow uppercase whitespace-pre-line overflow-y-auto pr-2 flex-1 scrollbar-thin font-mono">
          &gt; {dialog.body || "AWAITING DATA..."}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {!canAcknowledge && <div className="text-center text-[var(--pip-main)] animate-bounce"><ArrowDown className="h-4 w-4 mx-auto" /></div>}
          <button
            onClick={() => { if (dialog.action) dialog.action(); onClose(); }}
            disabled={!canAcknowledge}
            className={`w-full border py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-none ${canAcknowledge ? "border-[var(--pip-main)] text-[var(--pip-main)] hover:bg-[var(--pip-main)] hover:text-black" : "border-[var(--pip-dim)] opacity-40 cursor-not-allowed"}`}
          >
            {canAcknowledge ? (dialog.actionLabel || "[ ACKNOWLEDGE ]") : "[ SCROLL TO READ ]"}
          </button>
        </div>
      </div>
    </div>
  );
}
