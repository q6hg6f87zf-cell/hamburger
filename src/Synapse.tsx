import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle, CheckCircle2, ChevronDown, Lock, 
  Shield, Terminal, Database, Trash2, ArrowDown, 
  Palette, Activity, Heart, Zap, Calendar as CalendarIcon, 
  CloudLightning, Star, Brain, Grid,
  Sun, CloudRain, PenTool, Save, Plus, MapPin, Cpu, User
} from "lucide-react";

// ============================================================================
// SYSTEM CONSTANTS & CONFIG (SAFE MODE)
// ============================================================================

const STORAGE_KEY = "synapse-os-v28-safe";
const ADMIN_CODES_KEY = "synapse-keys-v28";
const ADMIN_PROFILES_KEY = "synapse-profiles-v28";
const JOURNAL_KEY = "synapse-journal-v28";
const PROMPTS_KEY = "synapse-prompts-v28";

const MASTER_ADMIN_CODE = "BRENT-8864";
const BIO_PROMPT_MIN_CHARS = 50;

const BOOT_SEQUENCE_LOGS = [
  "MOON SQUAD UNIFIED OPERATING SYSTEM",
  "COPYRIGHT 2024-2026 MOON SQUAD INC.",
  "S.Y.N.A.P.S.E. CORE v6.5.0-SAFE",
  "System Load... 100%",
  "CPU Diagnostics... NOMINAL",
  "Memory Check... OK",
  "Neural Link established..."
];

const THEMES: Record<string, any> = {
  GREEN: { main: '#1ce600', light: '#89ff73', dim: '#0e7d00', bg: '#031201' },
  AMBER: { main: '#ffb000', light: '#ffcc00', dim: '#996600', bg: '#120a00' },
  BLUE: { main: '#00e5ff', light: '#73faff', dim: '#007a8a', bg: '#000d12' }
};

const MONTHS = [ "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER" ];
const COUNTRY_LIST = [ "NORTH MACEDONIA", "UNITED STATES", "CANADA", "UNITED KINGDOM", "AUSTRALIA", "NEW ZEALAND", "GERMANY", "FRANCE", "JAPAN", "BRAZIL", "MEXICO", "SPAIN", "ITALY", "SOUTH KOREA", "INDIA", "CHINA", "SOUTH AFRICA", "SERBIA" ];

const MASTER_CIEL_SCORES = { ED: 92, PI: 88, CPC: 95, ESR: 78, ASD: 96, CS: 84, SR: 42, AG: 76, LOI: 90, JMT: 85, BAM: 82, RSR: 88 };

const REGION_COORDS: Record<string, {top: string, left: string}> = {
    "NORTH MACEDONIA": { top: "35%", left: "54%" },
    "SERBIA": { top: "33%", left: "53%" },
    "UNITED STATES": { top: "40%", left: "20%" },
    "CANADA": { top: "25%", left: "22%" },
    "UNITED KINGDOM": { top: "30%", left: "48%" },
    "AUSTRALIA": { top: "75%", left: "85%" },
    "JAPAN": { top: "35%", left: "85%" },
    "BRAZIL": { top: "65%", left: "32%" }
};

const MOOD_MATRIX = [
  { icon: '🩷', id: 'PINK', label: 'PEAK RESONANCE', desc: 'Euphoric / Deeply Connected' },
  { icon: '❤️', id: 'RED', label: 'HIGH ALERT', desc: 'Passionate / Agitated / Intense' },
  { icon: '🧡', id: 'ORANGE', label: 'ELEVATED', desc: 'Energetic / Restless / Driven' },
  { icon: '💛', id: 'YELLOW', label: 'STABLE WARMTH', desc: 'Content / Cautiously Optimistic' },
  { icon: '💚', id: 'GREEN', label: 'OPTIMAL BASELINE', desc: 'Grounded / Clear / Focused' },
  { icon: '🩵', id: 'LIGHT_BLUE', label: 'DRIFTING', desc: 'Detached / Daydreaming / Floating' },
  { icon: '💙', id: 'BLUE', label: 'COOL DOWN', desc: 'Melancholy / Processing / Quiet' },
  { icon: '💜', id: 'PURPLE', label: 'MYSTIC', desc: 'Introspective / Searching' },
  { icon: '🖤', id: 'BLACK', label: 'CRITICAL DEPLETION', desc: 'Exhausted / Void / Overwhelmed' }
];

// ============================================================================
// SAFE STORAGE & CLIPBOARD
// ============================================================================

const safeStorage = {
  getItem: (key: string) => { try { return localStorage.getItem(key); } catch (e) { return null; } },
  setItem: (key: string, value: string) => { try { localStorage.setItem(key, value); } catch (e) { /* Ignore */ } },
  clear: () => { try { localStorage.clear(); } catch (e) { /* Ignore */ } }
};

const fallbackCopy = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute'; el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    try { document.execCommand('copy'); alert('PAYLOAD COPIED TO CLIPBOARD'); } 
    catch (err) { alert('SYS.ERR: CLIPBOARD BLOCKED BY BROWSER'); }
    document.body.removeChild(el);
};

// ============================================================================
// LOGIC & UTILITIES
// ============================================================================

function encodeBase64Unicode(str: string) { return btoa(unescape(encodeURIComponent(str || ""))); }
function decodeBase64Unicode(str: string) { return decodeURIComponent(escape(atob(str || ""))); }
function pickFromPool(pool: any[]) { return pool[Math.floor(Math.random() * pool.length)]; }

const BATTERY = [
  { id: "Q1", type: "likert", module: "MOD 01 // Judgment", prompt: "I can revise an important opinion without feeling that I have lost face.", scale: 7, domain: "ED" },
  { id: "Q2", type: "likert", module: "MOD 01 // Judgment", prompt: "I instinctively notice patterns across events that seem unrelated at first.", scale: 7, domain: "PI" },
  { id: "Q3", type: "likert", module: "MOD 01 // Judgment", prompt: "I would rather create tension than perform agreement I do not feel.", scale: 7, domain: "CPC" },
  { id: "Q4", type: "likert", module: "MOD 01 // Judgment", prompt: "I notice changes in tone, pace, or posture before others mention them.", scale: 7, domain: "ESR" },
  { id: "Q5", type: "likert", module: "MOD 01 // Judgment", prompt: "I think best when I have enough freedom to decide my own approach.", scale: 7, domain: "ASD" },
  { id: "Q6", type: "likert", module: "MOD 01 // Judgment", prompt: "I prefer a clear decision to a long period of open ambiguity.", scale: 7, domain: "CS" },
  { id: "Q7", type: "likert", module: "MOD 01 // Judgment", prompt: "Once something important goes wrong, my mind can keep circling it for hours.", scale: 7, domain: "SR" },
  { id: "Q8", type: "likert", module: "MOD 01 // Judgment", prompt: "I value closeness, but I protect my inner space carefully.", scale: 7, domain: "AG" },
  { id: "Q9", type: "likert", module: "MOD 01 // Judgment", prompt: "Loyalty matters most when it is costly, not when it is easy.", scale: 7, domain: "LOI" },
  { id: "Q10", type: "likert", module: "MOD 01 // Judgment", prompt: "Good ends do not automatically justify questionable means.", scale: 7, domain: "JMT" }
];

function computeScores(responses: Record<string, any>) {
  const domains: Record<string, number> = { ED: 50, PI: 50, CPC: 50, ESR: 50, ASD: 50, CS: 50, SR: 50, AG: 50, LOI: 50, JMT: 50, BAM: 50, RSR: 50 };
  for (const u of BATTERY) {
     if (responses && responses[u.id]) {
         const val = ((responses[u.id] - 1) / 6) * 100;
         domains[u.domain] = Math.round((domains[u.domain] + val) / 2);
     }
  }
  return { domains };
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

function SectionLabel({ children, rightElement }: any) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--pip-main)] pb-2 mb-4 opacity-90">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--pip-main)] glow">:: {children} ::</div>
      {rightElement}
    </div>
  );
}

function TerminalCard({ children, className = "" }: any) {
  return (
    <div className={`w-full border border-[var(--pip-main)] bg-[var(--pip-bg)] p-[1px] relative shadow-[0_0_15px_rgba(0,0,0,0.8)] ${className}`}>
      <div className="border border-[var(--pip-main)]/20 p-5 md:p-6 h-full flex flex-col bg-black/40">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "" }: any) {
    return (
        <label className="block w-full mb-3">
            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--pip-main)] opacity-60 mb-1">&gt; {label}</div>
            <input 
                type={type} value={value || ""} onChange={(e) => onChange(e.target.value.toUpperCase())} placeholder={placeholder}
                className="w-full bg-[var(--pip-main)]/5 border-b border-[var(--pip-main)]/50 p-2.5 text-xs font-bold text-[var(--pip-main)] outline-none focus:bg-[var(--pip-main)]/10 focus:border-[var(--pip-main)] transition-none placeholder:opacity-30 glow"
            />
        </label>
    );
}

function TerminalCombobox({ label, value, options = [], onChange }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const clickOutside = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
      document.addEventListener("mousedown", clickOutside); return () => document.removeEventListener("mousedown", clickOutside);
    }, []);

    return (
      <div ref={wrapperRef} className="relative w-full mb-3">
        <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--pip-main)] opacity-60 mb-1">&gt; {label}</div>
        <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-[var(--pip-main)]/5 border-b border-[var(--pip-main)]/50 p-2.5 text-left text-xs font-bold uppercase flex justify-between items-center hover:bg-[var(--pip-main)]/10 glow">
           {value || 'SELECT...'} <ChevronDown className="h-3 w-3 opacity-50" />
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

function TyroneModal({ dialog, onClose }: any) {
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
             className={`w-full border py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-none ${canAcknowledge ? 'border-[var(--pip-main)] text-[var(--pip-main)] hover:bg-[var(--pip-main)] hover:text-black' : 'border-[var(--pip-dim)] opacity-40 cursor-not-allowed'}`}
          >
            {canAcknowledge ? (dialog.actionLabel || "[ ACKNOWLEDGE ]") : "[ SCROLL TO READ ]"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION ROOT
// ============================================================================

export default function App() {
  const [bootStage, setBootStage] = useState(0);
  const [appStage, setAppStage] = useState<'login' | 'shell'>('login');
  
  const [activeCategory, setActiveCategory] = useState<'CORE' | 'APPS'>('CORE');
  const [activeTab, setActiveTab] = useState('CiEL_PROTOCOL');

  const [theme, setTheme] = useState<'GREEN' | 'AMBER' | 'BLUE'>('GREEN');
  const [hydrated, setHydrated] = useState(false);

  // Auth State
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [validCodes, setValidCodes] = useState<Record<string, string>>({});
  const [ingestedProfiles, setIngestedProfiles] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [promptData, setPromptData] = useState({ persona: "", task: "", constraints: "" });
  
  const [recipientName, setRecipientName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTyroneDialog, setActiveTyroneDialog] = useState<any>(null);

  // Flow State
  const [intake, setIntake] = useState({ participantName: "", preferredName: "", age: "", birthMonth: "", birthDay: "", country: "", city: "", occupation: "", completed: false });
  const [biography, setBiography] = useState({ text: "", completed: false });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  
  // App States
  const [loggedMood, setLoggedMood] = useState<string | null>(null);
  const [currentJournal, setCurrentJournal] = useState({ title: "", content: "", tags: "" });

  const activeUserName = intake?.preferredName?.toUpperCase() || (intake?.participantName ? intake.participantName.split(' ')[0].toUpperCase() : "") || recipientName?.toUpperCase() || "USER";
  const isCielComplete = !!completedAt;
  const currentTheme = THEMES[theme] || THEMES.GREEN;

  // Boot Sequence
  const [bootLines, setBootLines] = useState<string[]>([]);
  useEffect(() => {
    if (bootStage !== 1) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_SEQUENCE_LOGS.length) { setBootLines(BOOT_SEQUENCE_LOGS.slice(0, i + 1)); i++; } 
      else { clearInterval(interval); setTimeout(() => setBootStage(2), 500); }
    }, 150);
    return () => clearInterval(interval);
  }, [bootStage]);

  // Safe Persistence Load
  useEffect(() => {
    try {
      const rawCodes = safeStorage.getItem(ADMIN_CODES_KEY);
      const rawProfiles = safeStorage.getItem(ADMIN_PROFILES_KEY);
      const rawTheme = safeStorage.getItem(STORAGE_KEY);
      const rawJournals = safeStorage.getItem(JOURNAL_KEY);
      const rawPrompts = safeStorage.getItem(PROMPTS_KEY);
      
      if (rawCodes) { setValidCodes(JSON.parse(rawCodes)); } 
      else {
          const defaults = { "ERIC-1": "Eric", "NIKI-5": "Nikolija", "GUEST": "Participant" };
          setValidCodes(defaults); safeStorage.setItem(ADMIN_CODES_KEY, JSON.stringify(defaults));
      }
      
      if (rawProfiles) { const p = JSON.parse(rawProfiles); if(Array.isArray(p)) setIngestedProfiles(p); }
      if (rawTheme) setTheme(JSON.parse(rawTheme).theme || 'GREEN');
      if (rawJournals) { const j = JSON.parse(rawJournals); if(Array.isArray(j)) setJournals(j); }
      if (rawPrompts) setPromptData(JSON.parse(rawPrompts));
    } catch(e) { console.error("Storage load bypassed"); }
    setHydrated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = loginInput.trim().toUpperCase();
    if (code === MASTER_ADMIN_CODE) {
      setIsAdmin(true); setRecipientName("MASTER BRENT"); setAppStage('shell'); setActiveCategory('CORE'); setActiveTab('SYSTEM');
    } else if (validCodes && validCodes[code]) {
      setIsAdmin(false); setRecipientName(validCodes[code]); setAppStage('shell'); setActiveCategory('CORE'); setActiveTab('CiEL_PROTOCOL');
      setActiveTyroneDialog({ title: "TYRONE.BOT // INITIATION", body: `Howdy ${validCodes[code].toUpperCase()}. Master Brent authorized your link. I'm Tyrone.Bot. We need your neural baseline before unlocking the system apps.` });
    } else { setLoginError(true); setLoginInput(""); }
  };

  const handleTabClick = (tab: string) => {
      if (!isAdmin && !isCielComplete && ['DIRECTORY', 'WEATHER_SYNC', 'NEURAL_JOURNAL', 'PROMPT_FORGE'].includes(tab)) {
          setActiveTyroneDialog({ title: "TYRONE.BOT // RESTRICTED", body: "Hold your horses! You can't access utility apps until your CiEL battery is locked in." });
          return;
      }
      setActiveTab(tab); window.scrollTo(0,0);
  };

  if (!hydrated) return null;

  return (
    <div 
      className="min-h-screen font-mono relative overflow-hidden transition-colors duration-500 flex flex-col"
      style={{ '--pip-main': currentTheme.main, '--pip-light': currentTheme.light, '--pip-dim': currentTheme.dim, '--pip-bg': currentTheme.bg, backgroundColor: 'black', color: 'var(--pip-main)' } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .scanlines { position: fixed; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 2px, transparent 2px, transparent 4px); z-index: 50; }
        .vignette { position: fixed; inset: 0; pointer-events: none; background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.9) 130%); z-index: 49; }
        .glow { text-shadow: 0 0 8px var(--pip-main); }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--pip-main); }
      `}} />
      <div className="scanlines" /> <div className="vignette" />

      {activeTyroneDialog && <TyroneModal dialog={activeTyroneDialog} onClose={() => setActiveTyroneDialog(null)} />}

      {/* LOGIN SCREEN */}
      {appStage === 'login' && (
         <div className="absolute inset-0 flex flex-col items-center justify-center w-full p-4 z-10">
            <TerminalCard className="w-full max-w-md m-auto">
               <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-2">
                  {bootStage === 0 && (
                      <button onClick={() => setBootStage(1)} className="p-10 border-2 border-[var(--pip-main)] animate-pulse hover:bg-[var(--pip-main)]/5 w-full flex flex-col items-center justify-center transition-none">
                          <h1 className="text-3xl font-black glow uppercase mb-3 tracking-widest">S.Y.N.A.P.S.E.</h1>
                          <p className="text-[10px] tracking-[0.2em] uppercase opacity-70 font-bold">Neural Link Offline. Tap to Sync.</p>
                      </button>
                  )}
                  {bootStage === 1 && (
                      <div className="space-y-1.5 text-left w-full text-[10px] font-bold uppercase animate-in fade-in">
                         {bootLines.map((l, i) => <div key={i} className="glow">{l}</div>)}
                         <div className="animate-pulse">_</div>
                      </div>
                  )}
                  {bootStage === 2 && (
                      <form onSubmit={handleLogin} className="w-full flex flex-col items-center animate-in fade-in duration-300">
                         <div className="text-[10px] font-black tracking-widest uppercase glow mb-4 opacity-80">AUTHORIZATION REQUIRED</div>
                         <input 
                           autoFocus type="password" value={loginInput} onChange={e => setLoginInput((e.target.value || "").toUpperCase())} 
                           className="bg-transparent border-b-2 border-[var(--pip-main)] outline-none text-center text-2xl font-black w-full max-w-[200px] glow uppercase py-2 mb-8 tracking-[0.2em]"
                           placeholder="****"
                         />
                         <button className="border border-[var(--pip-main)] px-12 py-3 text-xs font-black hover:bg-[var(--pip-main)] hover:text-black uppercase tracking-widest transition-none w-full">ACCESS_NODE</button>
                         {loginError && <p className="text-amber-500 animate-pulse text-[10px] font-black tracking-widest uppercase mt-4">SYS.ERR: REJECTED</p>}
                      </form>
                  )}
               </div>
            </TerminalCard>
         </div>
      )}

      {/* MAIN SHELL */}
      {appStage === 'shell' && bootStage === 2 && (
         <div className="relative z-10 w-full flex-grow flex flex-col max-w-5xl mx-auto p-4 md:p-6 pb-20 animate-in fade-in duration-700">
            
            {/* DYNAMIC HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--pip-main)] pb-4 mb-6">
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2 text-[var(--pip-main)]">
                  <Terminal className="h-5 w-5 glow" />
                  <span className="text-sm font-black tracking-[0.3em] glow uppercase leading-none">S.Y.N.A.P.S.E. // {isAdmin ? 'OVERSEER' : 'MEMBER'}</span>
                </div>
                
                <div className="flex gap-2">
                   <button onClick={() => { setActiveCategory('CORE'); setActiveTab(isAdmin ? 'SYSTEM' : 'CiEL_PROTOCOL'); }} className={`px-4 py-1.5 text-[9px] font-black border transition-none uppercase tracking-widest ${activeCategory === 'CORE' ? 'bg-[var(--pip-main)] text-black border-[var(--pip-main)]' : 'border-[var(--pip-dim)] text-[var(--pip-dim)] hover:border-[var(--pip-main)]'}`}>[ CORE ]</button>
                   <button onClick={() => { setActiveCategory('APPS'); setActiveTab('OS_DASHBOARD'); }} className={`px-4 py-1.5 text-[9px] font-black border transition-none uppercase tracking-widest ${activeCategory === 'APPS' ? 'bg-[var(--pip-main)] text-black border-[var(--pip-main)]' : 'border-[var(--pip-dim)] text-[var(--pip-dim)] hover:border-[var(--pip-main)]'}`}>[ APPS ]</button>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mt-1">
                   {activeCategory === 'CORE' && (isAdmin ? ['MASTER_FILE', 'SYSTEM', 'ARCHIVE', 'TACTICAL_MAP'] : ['CiEL_PROTOCOL', 'DIRECTORY', 'PERSONALIZATION']).map(t => (
                     <button key={t} onClick={() => handleTabClick(t)} className={`px-2.5 py-1 text-[8px] font-black border transition-none uppercase tracking-widest ${activeTab === t ? 'bg-[var(--pip-main)] text-black border-[var(--pip-main)]' : 'border-[var(--pip-dim)] text-[var(--pip-dim)] hover:border-[var(--pip-main)] hover:text-[var(--pip-main)]'}`}>
                         {(!isAdmin && !isCielComplete && t === 'DIRECTORY') && <Lock className="h-2 w-2 inline mr-1 -mt-0.5 opacity-50" />}
                         {t.replace('_', ' ')}
                     </button>
                   ))}
                   {activeCategory === 'APPS' && ['OS_DASHBOARD', 'WEATHER_SYNC', 'NEURAL_JOURNAL', 'PROMPT_FORGE', 'CALENDAR'].map(t => (
                     <button key={t} onClick={() => handleTabClick(t)} className={`px-2.5 py-1 text-[8px] font-black border transition-none uppercase tracking-widest ${activeTab === t ? 'bg-[var(--pip-main)] text-black border-[var(--pip-main)]' : 'border-[var(--pip-dim)] text-[var(--pip-dim)] hover:border-[var(--pip-main)] hover:text-[var(--pip-main)]'}`}>
                         {(!isCielComplete && t !== 'CALENDAR' && t !== 'OS_DASHBOARD') && <Lock className="h-2 w-2 inline mr-1 -mt-0.5 opacity-50" />} 
                         {t === 'OS_DASHBOARD' ? 'GRID' : t.replace('_', ' ')}
                     </button>
                   ))}
                </div>
              </div>
              <button onClick={() => window.location.reload()} className="border border-amber-600 px-4 py-1.5 text-[9px] font-black text-amber-500 uppercase hover:bg-amber-600 hover:text-black transition-none whitespace-nowrap">ABORT_LINK</button>
            </div>

            {/* --- APPS CATEGORY --- */}
            {activeCategory === 'APPS' && (
               <div className="flex-grow w-full animate-in slide-in-from-right-4 duration-200">
                  
                  {activeTab === 'OS_DASHBOARD' && (
                      <TerminalCard>
                         <SectionLabel rightElement={<Grid className="h-4 w-4" />}>APPLICATION_GRID</SectionLabel>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                               { id: 'WEATHER_SYNC', label: 'WEATHER SYNC', icon: <CloudRain className="h-6 w-6 mb-2" />, desc: 'Tactical Sat-Link' },
                               { id: 'NEURAL_JOURNAL', label: 'JOURNAL', icon: <PenTool className="h-6 w-6 mb-2" />, desc: 'Encrypted Logs' },
                               { id: 'PROMPT_FORGE', label: 'PROMPT FORGE', icon: <Cpu className="h-6 w-6 mb-2" />, desc: 'LLM Architecture' },
                               { id: 'CALENDAR', label: 'TIMELINE', icon: <CalendarIcon className="h-6 w-6 mb-2" />, desc: 'Squad Events' }
                            ].map(app => (
                               <button 
                                 key={app.id} onClick={() => handleTabClick(app.id)}
                                 className="border border-[var(--pip-dim)] p-4 bg-black flex flex-col items-center justify-center text-center hover:border-[var(--pip-main)] hover:bg-[var(--pip-main)]/10 transition-none group"
                               >
                                  <div className="text-[var(--pip-main)] opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform">{app.icon}</div>
                                  <div className="text-[10px] font-black uppercase glow mb-1 tracking-widest">{app.label}</div>
                                  <div className="text-[8px] opacity-50 uppercase tracking-widest">{app.desc}</div>
                                  {(!isCielComplete && app.id !== 'CALENDAR') && <Lock className="h-3 w-3 mt-2 text-amber-500" />}
                               </button>
                            ))}
                         </div>
                      </TerminalCard>
                  )}

                  {activeTab === 'WEATHER_SYNC' && isCielComplete && (
                     <TerminalCard>
                        <SectionLabel rightElement={<CloudLightning className="h-3 w-3" />}>TACTICAL_WEATHER_SYNC</SectionLabel>
                        <div className="py-6 text-center">
                           <div className="flex flex-col items-center animate-in zoom-in duration-300">
                              <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70 mb-4">MASTER NODE LOCATION: GRANDE CACHE, AB</div>
                              <div className="flex items-center justify-center gap-6 border-2 border-[var(--pip-main)] p-6 bg-[var(--pip-main)]/5 mb-6 shadow-[0_0_15px_var(--pip-main)] w-full max-w-sm">
                                 <CloudRain className="h-10 w-10 glow" />
                                 <div className="text-left">
                                    <div className="text-4xl font-black glow leading-none">2°C</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-2">CHILLY / OVERCAST</div>
                                 </div>
                              </div>
                              <div className="max-w-sm border border-[var(--pip-dim)] p-4 bg-black text-left w-full">
                                  <div className="text-[8px] font-black text-[var(--pip-main)] opacity-70 mb-2 uppercase tracking-widest">TACTICAL DIRECTIVE</div>
                                  <div className="text-xs font-bold uppercase leading-relaxed text-[var(--pip-light)]">
                                     &gt; Environmental variables are poor. Proceed with standard operational tasks indoors. Maintain CiEL discipline.
                                  </div>
                              </div>
                           </div>
                        </div>
                     </TerminalCard>
                  )}

                  {activeTab === 'NEURAL_JOURNAL' && isCielComplete && (
                     <div className="grid md:grid-cols-[1fr_2fr] gap-4">
                        <TerminalCard className="h-full max-h-[60vh] overflow-y-auto scrollbar-thin">
                           <SectionLabel>DATA_LOGS</SectionLabel>
                           <button onClick={() => setCurrentJournal({title: "", content: "", tags: ""})} className="w-full flex items-center justify-center gap-2 border border-[var(--pip-main)] py-2 mb-3 text-[9px] font-black uppercase tracking-widest hover:bg-[var(--pip-main)] hover:text-black transition-none">
                              <Plus className="h-3 w-3" /> NEW_ENTRY
                           </button>
                           <div className="space-y-2">
                              {(!journals || journals.length === 0) ? <p className="text-[9px] uppercase opacity-50 text-center py-4 font-bold tracking-widest">NO LOGS</p> : journals.map((j: any) => (
                                 <div key={j.id} onClick={() => setCurrentJournal(j)} className="p-2 border border-[var(--pip-dim)] bg-black hover:border-[var(--pip-main)] cursor-pointer transition-none">
                                     <div className="text-[10px] font-black uppercase glow truncate">{j.title || "UNTITLED LOG"}</div>
                                     <div className="text-[7px] uppercase opacity-50 mt-1 font-bold tracking-widest">{j.date}</div>
                                 </div>
                              ))}
                           </div>
                        </TerminalCard>
                        <TerminalCard>
                           <SectionLabel rightElement={
                               <button onClick={() => setActiveTyroneDialog({title: "TYRONE // LOCAL", body: "Master Brent has offline systems engaged to preserve API limits. Log your thoughts safely."})} className="text-[8px] animate-pulse glow tracking-widest uppercase font-black hover:text-[var(--pip-light)] border border-[var(--pip-main)] px-2 py-1">
                                   [ PING TYRONE ANALYSIS ]
                               </button>
                           }>EDITOR</SectionLabel>
                           <input value={currentJournal?.title || ""} onChange={e => setCurrentJournal({...currentJournal, title: e.target.value})} placeholder="LOG TITLE..." className="w-full bg-transparent border-b border-[var(--pip-main)] text-sm font-black uppercase glow outline-none pb-2 mb-3 placeholder:opacity-30" />
                           <textarea value={currentJournal?.content || ""} onChange={e => setCurrentJournal({...currentJournal, content: e.target.value})} className="w-full h-40 bg-black border border-[var(--pip-dim)] p-3 font-mono text-[10px] outline-none focus:border-[var(--pip-main)] mb-3 uppercase leading-relaxed placeholder:opacity-30" placeholder="ENTER NEURAL DATA..." />
                           <button onClick={() => {
                               if (!currentJournal?.title || !currentJournal?.content) return;
                               const entry = { ...currentJournal, id: Date.now(), date: new Date().toLocaleDateString() };
                               const next = [entry, ...(Array.isArray(journals) ? journals : [])];
                               setJournals(next); safeStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
                               setCurrentJournal({ title: "", content: "", tags: "" }); alert("LOG SAVED");
                           }} className="w-full border border-[var(--pip-main)] py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[var(--pip-main)] hover:text-black flex justify-center items-center gap-2 transition-none"><Save className="h-3 w-3" /> COMMIT_LOG</button>
                        </TerminalCard>
                     </div>
                  )}

                  {activeTab === 'PROMPT_FORGE' && isCielComplete && (
                     <div className="grid md:grid-cols-2 gap-4">
                        <TerminalCard>
                           <SectionLabel rightElement={<Cpu className="h-3 w-3" />}>FORGE_PARAMETERS</SectionLabel>
                           <div className="space-y-3">
                              <div>
                                 <div className="text-[8px] font-black uppercase text-[var(--pip-main)] opacity-70 mb-1">&gt; SYSTEM PERSONA</div>
                                 <input value={promptData?.persona || ""} onChange={e => {
                                     const next = { ...(promptData || {}), persona: e.target.value };
                                     setPromptData(next as any); safeStorage.setItem(PROMPTS_KEY, JSON.stringify(next));
                                 }} className="w-full bg-black border-b border-[var(--pip-main)] p-2 text-[10px] outline-none uppercase font-bold" placeholder="e.g. Expert Data Analyst" />
                              </div>
                              <div>
                                 <div className="text-[8px] font-black uppercase text-[var(--pip-main)] opacity-70 mb-1">&gt; CORE TASK</div>
                                 <textarea value={promptData?.task || ""} onChange={e => {
                                     const next = { ...(promptData || {}), task: e.target.value };
                                     setPromptData(next as any); safeStorage.setItem(PROMPTS_KEY, JSON.stringify(next));
                                 }} className="w-full h-16 bg-black border border-[var(--pip-dim)] p-2 text-[10px] outline-none uppercase font-bold" placeholder="What needs to be done?" />
                              </div>
                              <div>
                                 <div className="text-[8px] font-black uppercase text-[var(--pip-main)] opacity-70 mb-1">&gt; CONSTRAINTS</div>
                                 <textarea value={promptData?.constraints || ""} onChange={e => {
                                     const next = { ...(promptData || {}), constraints: e.target.value };
                                     setPromptData(next as any); safeStorage.setItem(PROMPTS_KEY, JSON.stringify(next));
                                 }} className="w-full h-16 bg-black border border-[var(--pip-dim)] p-2 text-[10px] outline-none uppercase font-bold" placeholder="Formatting rules, limits..." />
                              </div>
                           </div>
                        </TerminalCard>
                        <TerminalCard>
                           <SectionLabel>COMPILED_OUTPUT</SectionLabel>
                           <div className="w-full h-48 bg-[var(--pip-main)]/5 border border-[var(--pip-main)] p-3 font-mono text-[9px] overflow-y-auto whitespace-pre-wrap leading-relaxed opacity-90 border-l-2 uppercase">
                              {`SYSTEM:\nYou are acting as a ${promptData?.persona || '[PERSONA]'}.\n\nTASK:\n${promptData?.task || '[INSERT TASK]'}\n\nCONSTRAINTS & CONTEXT:\n${promptData?.constraints || '[INSERT CONSTRAINTS]'}`}
                           </div>
                           <button onClick={() => {
                               const p = `SYSTEM:\nYou are acting as a ${promptData?.persona || '[PERSONA]'}.\n\nTASK:\n${promptData?.task || '[INSERT TASK]'}\n\nCONSTRAINTS & CONTEXT:\n${promptData?.constraints || '[INSERT CONSTRAINTS]'}`;
                               fallbackCopy(p);
                           }} className="mt-4 w-full border border-[var(--pip-main)] py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[var(--pip-main)] hover:text-black flex justify-center items-center gap-2"><ClipboardCopy className="h-3 w-3" /> COPY_PROMPT</button>
                        </TerminalCard>
                     </div>
                  )}

                  {activeTab === 'CALENDAR' && (
                    <TerminalCard>
                       <SectionLabel rightElement={<CalendarIcon className="h-3 w-3" />}>COMMUNITY_TIMELINE</SectionLabel>
                       <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
                          {(!Array.isArray(ingestedProfiles) || ingestedProfiles.length === 0) ? <p className="text-center opacity-50 text-[10px] uppercase py-8 font-bold tracking-widest">NO ARCHIVE DATA</p> : (
                            ingestedProfiles
                              .filter(p => p?.participant?.birthMonth)
                              .sort((a,b) => MONTHS.indexOf(a.participant.birthMonth) - MONTHS.indexOf(b.participant.birthMonth))
                              .map((p, i) => (
                                <div key={i} className="border border-[var(--pip-dim)] p-2 bg-black flex justify-between items-center hover:border-[var(--pip-main)] transition-none">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[var(--pip-main)]/10 p-1.5 font-black text-[9px] text-center min-w-[50px] border border-[var(--pip-main)]/30">
                                            <div className="text-[var(--pip-dim)]">{p.participant.birthMonth?.slice(0,3) || "UNK"}</div>
                                            <div className="text-sm glow">{p.participant.birthDay || "--"}</div>
                                        </div>
                                        <div>
                                            <div className="font-black text-xs glow uppercase">{p.participant.preferredName || p.participant.participantName || "UNKNOWN"}</div>
                                            <div className="text-[8px] opacity-60 uppercase tracking-widest">{p.participant.occupation || 'OPERATOR'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                          )}
                       </div>
                    </TerminalCard>
                 )}
               </div>
            )}

            {/* --- CORE CATEGORY (CiEL, ADMIN) --- */}
            {activeCategory === 'CORE' && (
               <div className="flex-grow w-full animate-in slide-in-from-left-4 duration-200">
                 
                 {activeTab === 'CiEL_PROTOCOL' && !isAdmin && (
                    <div className="space-y-4">
                       {!intake.completed ? (
                          <TerminalCard>
                             <SectionLabel>INTAKE_PROTOCOLS</SectionLabel>
                             <div className="grid md:grid-cols-2 gap-x-6 gap-y-1 relative z-20">
                                <Field label="Legal Identity" value={intake.participantName} onChange={(v:any) => setIntake({...intake, participantName: v})} />
                                <Field label="Preferred Alias" value={intake.preferredName} onChange={(v:any) => setIntake({...intake, preferredName: v})} />
                                <Field label="Current Age" type="number" value={intake.age} onChange={(v:any) => setIntake({...intake, age: v})} />
                                <div className="grid grid-cols-2 gap-2">
                                    <TerminalCombobox label="Birth Month" value={intake.birthMonth} options={MONTHS} onChange={(v:any) => setIntake({...intake, birthMonth: v})} />
                                    <TerminalCombobox label="Birth Day" value={intake.birthDay} options={Array.from({length: 31}, (_, i) => String(i + 1))} onChange={(v:any) => setIntake({...intake, birthDay: v})} />
                                </div>
                                <TerminalCombobox label="Base Country" value={intake.country} options={COUNTRY_LIST} onChange={(v:any) => setIntake({...intake, country: v})} />
                                <Field label="City" value={intake.city} onChange={(v:any) => setIntake({...intake, city: v})} />
                                <Field label="Occupation" value={intake.occupation} onChange={(v:any) => setIntake({...intake, occupation: v})} />
                             </div>
                             <button onClick={() => {
                                if(!intake.participantName || !intake.country || !intake.birthMonth || !intake.city) return setActiveTyroneDialog({ title: "TYRONE // ERROR", body: "Fill out the required fields. I need that city for your weather telemetry."});
                                setIntake(p => ({...p, completed: true})); window.scrollTo(0,0);
                             }} className="mt-6 w-full border border-[var(--pip-main)] py-3 font-black text-xs hover:bg-[var(--pip-main)] hover:text-black uppercase tracking-widest shadow-[0_0_10px_var(--pip-main)]">Confirm_Context</button>
                          </TerminalCard>
                       ) : !biography.completed ? (
                          <TerminalCard>
                             <SectionLabel rightElement={<button onClick={() => setActiveTyroneDialog({title: "TYRONE // BASELINE", body: "Don't just give me a resume, partner. Master Brent needs to see how your brain puts words together."})} className="text-[9px] animate-pulse glow text-[var(--pip-light)] font-bold tracking-widest">[ PING TYRONE ]</button>}>LINGUISTIC_BASELINE</SectionLabel>
                             <textarea value={biography.text} onChange={e => setBiography({...biography, text: e.target.value})} className="w-full h-40 bg-black border border-[var(--pip-main)]/50 p-4 font-mono text-xs text-[var(--pip-main)] outline-none focus:border-[var(--pip-main)] uppercase placeholder:opacity-20 mb-4 leading-relaxed" placeholder="Type narrative here..." />
                             <div className="flex justify-between items-center">
                                <span className={`text-[9px] font-black uppercase ${biography.text.length < BIO_PROMPT_MIN_CHARS ? 'text-amber-500' : 'text-[var(--pip-main)]'}`}>Data: {biography.text.length} / {BIO_PROMPT_MIN_CHARS}</span>
                                <button onClick={() => {
                                    if(biography.text.length < BIO_PROMPT_MIN_CHARS) return setActiveTyroneDialog({ title: "TYRONE // ERR", body: "I need more than that. Give me the deep cuts."});
                                    setActiveTyroneDialog({ title: "TYRONE // SYNC", body: "Baseline Secured. Time for the main battery.", action: () => { setBiography(p => ({...p, completed: true})); window.scrollTo(0,0); }});
                                }} className="border border-[var(--pip-main)] px-8 py-2 text-[10px] font-black hover:bg-[var(--pip-main)] hover:text-black uppercase">Seal_Baseline</button>
                             </div>
                          </TerminalCard>
                       ) : !completedAt ? (
                          <TerminalCard>
                            <div className="flex justify-between border-b border-[var(--pip-dim)] pb-2 mb-6">
                               <span className="text-[9px] font-black text-[var(--pip-dim)] uppercase tracking-widest">SUBJECT: {activeUserName} | UNIT [{currentIndex + 1} / {BATTERY.length}]</span>
                            </div>
                            <h2 className="text-xl font-black glow uppercase mb-8 leading-snug">&gt; {BATTERY[currentIndex].prompt}</h2>
                            <div className="space-y-6">
                                {BATTERY[currentIndex].type === 'likert' ? (
                                    <div className="grid grid-cols-7 gap-2">
                                        {[1,2,3,4,5,6,7].map(n => (
                                          <button key={n} onClick={() => { setResponses({...responses, [BATTERY[currentIndex].id]: n}); }} className={`border py-4 font-black text-sm transition-none ${responses[BATTERY[currentIndex].id] === n ? 'bg-[var(--pip-main)] text-black shadow-[0_0_10px_var(--pip-main)]' : 'hover:bg-[var(--pip-main)]/20 border-[var(--pip-dim)]'}`}>{n}</button>
                                        ))}
                                    </div>
                                ) : (
                                    <textarea onChange={e => setResponses({...responses, [BATTERY[currentIndex].id]: e.target.value})} className="w-full h-24 bg-black border border-[var(--pip-dim)] p-3 font-mono uppercase text-xs outline-none focus:border-[var(--pip-main)]" placeholder="AWAITING INPUT..." />
                                )}
                                <button onClick={() => {
                                    if (currentIndex < BATTERY.length - 1) { setCurrentIndex(currentIndex + 1); }
                                    else { setCompletedAt(new Date().toISOString()); setActiveTyroneDialog({ title: "TYRONE // COMPLETE", body: "We're done here. The OS is unlocked."}); }
                                }} disabled={!responses[BATTERY[currentIndex].id]} className="w-full border border-[var(--pip-main)] py-3 font-black text-xs hover:bg-[var(--pip-main)] hover:text-black disabled:opacity-20 uppercase tracking-widest">Execute_Commit</button>
                            </div>
                          </TerminalCard>
                       ) : (
                         <div className="space-y-4 animate-in zoom-in duration-300">
                           <TerminalCard className="text-center py-10">
                              <Shield className="h-10 w-10 mx-auto mb-4 glow" />
                              <h1 className="text-2xl font-black glow uppercase mb-2 tracking-widest">OS UNLOCKED</h1>
                              <p className="text-[9px] uppercase font-bold opacity-70 tracking-widest">Neural baseline secured. Apps module granted.</p>
                           </TerminalCard>
                           <TerminalCard>
                                <SectionLabel>SECURE_PAYLOAD</SectionLabel>
                                <p className="text-[9px] mb-4 uppercase opacity-60 font-bold tracking-widest">Copy and transmit string to Master Brent.</p>
                                <button onClick={() => {
                                    const b64 = encodeBase64Unicode(JSON.stringify({ schema_version: "ciel-v5.0", participant: {...intake, linguistic_baseline: biography.text}, domains: computeScores(responses).domains, completed_at: completedAt }));
                                    fallbackCopy(b64);
                                }} className="w-full border border-[var(--pip-main)] py-3 font-black text-sm hover:bg-[var(--pip-main)] hover:text-black uppercase shadow-[0_0_10px_var(--pip-main)] flex justify-center items-center gap-2">
                                    <ClipboardCopy className="h-4 w-4" /> [ COPY PAYLOAD ]
                                </button>
                           </TerminalCard>
                         </div>
                       )}
                    </div>
                 )}

                 {activeTab === 'DIRECTORY' && !isAdmin && (
                    <TerminalCard className="text-center py-10 opacity-50">
                        <Database className="mx-auto h-8 w-8 mb-4" />
                        <h2 className="text-xl font-black uppercase mb-2">DIRECTORY ACTIVE</h2>
                        <p className="text-[9px] font-bold uppercase tracking-widest">No profiles loaded in local demo. Admin ingestion required.</p>
                    </TerminalCard>
                 )}

                 {activeTab === 'PROFILE_SETTINGS' && !isAdmin && (
                    <TerminalCard>
                       <SectionLabel>OS_Color_Matrix</SectionLabel>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(Object.keys(THEMES) as Array<'GREEN' | 'AMBER' | 'BLUE'>).map(t => (
                             <button key={t} onClick={() => { setTheme(t); safeStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: t })); }} className={`border p-6 flex flex-col items-center gap-3 transition-none ${theme === t ? 'border-[var(--pip-main)] bg-[var(--pip-main)] text-black shadow-[0_0_15px_var(--pip-main)]' : 'border-[var(--pip-dim)] text-[var(--pip-dim)] hover:border-[var(--pip-main)]'}`}>
                                <Palette className="h-6 w-6" />
                                <span className="font-black text-sm uppercase tracking-widest">{t}</span>
                             </button>
                          ))}
                       </div>
                    </TerminalCard>
                 )}

                 {/* ADMIN TABS */}
                 {activeTab === 'MASTER_FILE' && isAdmin && (
                    <TerminalCard>
                       <SectionLabel>MASTER_DOSSIER // BRENT MCDONALD</SectionLabel>
                       <div className="grid md:grid-cols-2 gap-6 mb-4">
                           <div className="space-y-2">
                               <div className="text-[8px] font-black uppercase text-[var(--pip-main)] opacity-50 border-b border-[var(--pip-dim)] pb-1 mb-1">IDENTITY LOG</div>
                               <div className="text-[10px] font-bold leading-relaxed uppercase">
                                   Role: FOUNDER / OVERSEER<br/>
                                   Base: GRANDE CACHE, AB
                               </div>
                           </div>
                           <div className="space-y-2">
                               <div className="text-[8px] font-black uppercase text-[var(--pip-main)] opacity-50 border-b border-[var(--pip-dim)] pb-1 mb-1">RAW_SCORES</div>
                               <div className="grid grid-cols-4 gap-1">
                                  {Object.entries(MASTER_CIEL_SCORES).map(([k,v]: any) => <div key={k} className="text-[8px] border border-[var(--pip-dim)] p-1 text-center font-black bg-[var(--pip-main)]/10">{k}:{v}</div>)}
                               </div>
                           </div>
                       </div>
                    </TerminalCard>
                 )}

                 {activeTab === 'SYSTEM' && isAdmin && (
                    <div className="grid md:grid-cols-2 gap-4">
                       <TerminalCard>
                          <SectionLabel>Key_Generator</SectionLabel>
                          <form onSubmit={(e: any) => {
                             e.preventDefault();
                             const c = e.target.code.value.toUpperCase(); const n = e.target.name.value;
                             if(!c || !n) return;
                             const next = {...validCodes, [c]: n};
                             setValidCodes(next); safeStorage.setItem(ADMIN_CODES_KEY, JSON.stringify(next));
                             e.target.reset();
                          }} className="space-y-2">
                             <input name="code" placeholder="ACCESS CODE" className="w-full bg-black border-b border-[var(--pip-main)] p-2 text-[10px] uppercase outline-none font-bold" />
                             <input name="name" placeholder="TARGET NAME" className="w-full bg-black border-b border-[var(--pip-main)] p-2 text-[10px] outline-none font-bold" />
                             <button className="w-full border border-[var(--pip-main)] py-2 text-[10px] font-black hover:bg-[var(--pip-main)] hover:text-black uppercase tracking-widest mt-2">Issue Key</button>
                          </form>
                       </TerminalCard>
                       <TerminalCard>
                           <SectionLabel>Ingest_Payload</SectionLabel>
                           <textarea id="adminPayloadInput" className="w-full h-12 bg-black border border-[var(--pip-dim)] p-2 font-mono text-[8px] outline-none focus:border-[var(--pip-main)] uppercase mb-2 placeholder:opacity-20" placeholder="PASTE PAYLOAD..." />
                           <button onClick={() => {
                              const val = (document.getElementById('adminPayloadInput') as HTMLTextAreaElement).value;
                              if (!val) return;
                              try {
                                const decoded = JSON.parse(decodeBase64Unicode(val));
                                if (!decoded.schema_version) throw new Error();
                                const next = [decoded, ...(Array.isArray(ingestedProfiles) ? ingestedProfiles : [])];
                                setIngestedProfiles(next); safeStorage.setItem(ADMIN_PROFILES_KEY, JSON.stringify(next));
                                (document.getElementById('adminPayloadInput') as HTMLTextAreaElement).value = "";
                                alert('PROFILE INGESTED SUCCESSFULLY.');
                              } catch (e) { alert('ERR: CORRUPT PAYLOAD'); }
                           }} className="w-full border border-[var(--pip-main)] py-2 text-[10px] font-black hover:bg-[var(--pip-main)] hover:text-black uppercase tracking-widest">Decrypt_Sync</button>
                       </TerminalCard>
                       <TerminalCard className="md:col-span-2">
                           <SectionLabel>Emergency System Override</SectionLabel>
                           <button onClick={() => {
                              if(window.confirm('WIPE ALL DATA? THIS WILL DELETE KEYS AND PROFILES AND RESET OS.')) {
                                 safeStorage.clear(); window.location.reload();
                              }
                           }} className="w-full border border-amber-600 text-amber-500 py-3 text-[10px] font-black hover:bg-amber-600 hover:text-black uppercase tracking-widest">Purge Local Memory</button>
                       </TerminalCard>
                    </div>
                 )}

                 {/* TACTICAL MAP (GLOBAL GRID) */}
                 {activeTab === 'TACTICAL_MAP' && isAdmin && (
                    <TerminalCard>
                       <SectionLabel rightElement={<MapPin className="h-3 w-3" />}>GLOBAL_GRID</SectionLabel>
                       <div className="relative w-full h-[300px] border border-[var(--pip-dim)] bg-black overflow-hidden mt-2">
                           <div className="absolute inset-0 bg-[linear-gradient(rgba(28,230,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(28,230,0,0.1)_1px,transparent_1px)] bg-[length:15px_15px]" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-10 text-[60px] font-black uppercase tracking-widest pointer-events-none">MAP</div>
                           
                           {Array.isArray(ingestedProfiles) && ingestedProfiles.map((p, i) => {
                               const country = p?.participant?.country;
                               if (!country || !REGION_COORDS[country]) return null;
                               const coords = REGION_COORDS[country];
                               return (
                                  <div key={i} className="absolute group" style={{ top: coords.top, left: coords.left }}>
                                     <div className="w-2 h-2 bg-[var(--pip-main)] rounded-full animate-ping shadow-[0_0_8px_var(--pip-main)]" />
                                     <div className="absolute top-3 left-3 bg-black border border-[var(--pip-main)] p-1.5 hidden group-hover:block z-50 w-32 shadow-xl">
                                        <div className="text-[8px] font-black glow uppercase truncate">{p?.participant?.preferredName || p?.participant?.participantName || "UNK"}</div>
                                     </div>
                                  </div>
                               );
                           })}
                       </div>
                    </TerminalCard>
                 )}

                 {activeTab === 'ARCHIVE' && isAdmin && (
                    <TerminalCard>
                       <SectionLabel>INGESTED_DATABANKS ({Array.isArray(ingestedProfiles) ? ingestedProfiles.length : 0})</SectionLabel>
                       <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                          {(!Array.isArray(ingestedProfiles) || ingestedProfiles.length === 0) ? <div className="p-6 text-center opacity-50 text-[10px] font-black">NO DATA FOUND (IN-MEMORY MODE)</div> : ingestedProfiles.map((p, i) => (
                             <div key={i} className="p-2 border border-[var(--pip-dim)] bg-black flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                   <User className="h-6 w-6 opacity-50" />
                                   <div>
                                      <div className="text-[10px] font-black glow uppercase mb-0.5">{p?.participant?.preferredName || p?.participant?.participantName || "UNK"}</div>
                                      <div className="text-[7px] uppercase opacity-60 font-bold tracking-widest">{p?.participant?.occupation || 'OPERATOR'} | {p?.participant?.country || 'UNK'}</div>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </TerminalCard>
                 )}
               </div>
            )}

           </div>
        )}
      </div>
      
      {/* GLOBAL FOOTER */}
      {(appStage === 'shell' || appStage === 'admin') && bootStage === 2 && (
          <div className="fixed bottom-0 left-0 right-0 p-2 bg-black/90 border-t border-[var(--pip-dim)] flex justify-between items-center z-40 px-6">
             <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase"><Heart className="h-3 w-3" /> HP [100]</div>
                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase"><Zap className="h-3 w-3" /> AP [240]</div>
             </div>
             <div className="text-[7px] font-black tracking-[0.4em] uppercase opacity-40 glow hidden sm:block">S.Y.N.A.P.S.E. // Node_Active</div>
          </div>
      )}
    </div>
  );
}


