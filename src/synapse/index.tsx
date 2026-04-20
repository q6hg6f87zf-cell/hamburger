import React, { useEffect, useState } from "react";
import {
  ADMIN_CODES_KEY,
  ADMIN_PROFILES_KEY,
  BOOT_SEQUENCE_LOGS,
  MASTER_ADMIN_CODE,
  PROMPTS_KEY,
  SESSION_CODE_KEY,
  STORAGE_KEY,
  THEMES,
  safeStorage
} from "./osConfig";
import { tyroneBot, type TyroneDialog } from "./tyroneBot";
import { TyroneModal } from "./uiPrimitives";
import { FooterBar } from "./FooterBar";
import { LoginScreen } from "./LoginScreen";
import { ShellHeader } from "./ShellHeader";
import { AppsModule } from "./AppsModule";
import { CoreModule } from "./CoreModule";

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
  const [activeTyroneDialog, setActiveTyroneDialog] = useState<TyroneDialog | null>(null);

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
      const sessionCode = safeStorage.getItem(SESSION_CODE_KEY);
      
      if (rawCodes) { setValidCodes(JSON.parse(rawCodes)); } 
      else {
          const defaults = { "ERIC-1": "Eric", "NIKI-5": "Nikolija", "GUEST": "Participant" };
          setValidCodes(defaults); safeStorage.setItem(ADMIN_CODES_KEY, JSON.stringify(defaults));
      }
      
      if (rawProfiles) { const p = JSON.parse(rawProfiles); if(Array.isArray(p)) setIngestedProfiles(p); }
      if (rawTheme) setTheme(JSON.parse(rawTheme).theme || 'GREEN');
      if (rawJournals) { const j = JSON.parse(rawJournals); if(Array.isArray(j)) setJournals(j); }
      if (rawPrompts) setPromptData(JSON.parse(rawPrompts));

      if (sessionCode) {
        const restoredCode = sessionCode.toUpperCase();
        if (restoredCode === MASTER_ADMIN_CODE) {
          setIsAdmin(true);
          setRecipientName("MASTER BRENT");
          setAppStage("shell");
          setActiveCategory("CORE");
          setActiveTab("SYSTEM");
        } else if (rawCodes) {
          const parsedCodes = JSON.parse(rawCodes);
          if (parsedCodes[restoredCode]) {
            setIsAdmin(false);
            setRecipientName(parsedCodes[restoredCode]);
            setAppStage("shell");
            setActiveCategory("CORE");
            setActiveTab("CiEL_PROTOCOL");
          }
        }
      }
    } catch(e) { console.error("Storage load bypassed"); }
    setHydrated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = loginInput.trim().toUpperCase();
    if (code === MASTER_ADMIN_CODE) {
      setIsAdmin(true); setRecipientName("MASTER BRENT"); safeStorage.setItem(SESSION_CODE_KEY, code); setAppStage('shell'); setActiveCategory('CORE'); setActiveTab('SYSTEM');
    } else if (validCodes && validCodes[code]) {
      setIsAdmin(false); setRecipientName(validCodes[code]); safeStorage.setItem(SESSION_CODE_KEY, code); setAppStage('shell'); setActiveCategory('CORE'); setActiveTab('CiEL_PROTOCOL');
      setActiveTyroneDialog(tyroneBot.initiation(validCodes[code]));
    } else { setLoginError(true); setLoginInput(""); }
  };

  const handleTabClick = (tab: string) => {
      if (!isAdmin && !isCielComplete && ['DIRECTORY', 'WEATHER_SYNC', 'NEURAL_JOURNAL', 'PROMPT_FORGE'].includes(tab)) {
          setActiveTyroneDialog(tyroneBot.restrictedApps());
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
      <LoginScreen
        appStage={appStage}
        bootStage={bootStage}
        setBootStage={setBootStage}
        bootLines={bootLines}
        handleLogin={handleLogin}
        loginInput={loginInput}
        setLoginInput={setLoginInput}
        loginError={loginError}
      />

      {/* MAIN SHELL */}
      {appStage === 'shell' && bootStage === 2 && (
         <div className="relative z-10 w-full flex-grow flex flex-col max-w-5xl mx-auto p-4 md:p-6 pb-20 animate-in fade-in duration-700">
            
            {/* DYNAMIC HEADER */}
            <ShellHeader
              isAdmin={isAdmin}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              handleTabClick={handleTabClick}
              isCielComplete={isCielComplete}
            />

            <AppsModule
              activeCategory={activeCategory}
              activeTab={activeTab}
              isCielComplete={isCielComplete}
              handleTabClick={handleTabClick}
              journals={journals}
              setCurrentJournal={setCurrentJournal}
              currentJournal={currentJournal}
              setJournals={setJournals}
              setActiveTyroneDialog={setActiveTyroneDialog}
              promptData={promptData}
              setPromptData={setPromptData}
              ingestedProfiles={ingestedProfiles}
            />

            <CoreModule
              activeCategory={activeCategory}
              activeTab={activeTab}
              isAdmin={isAdmin}
              intake={intake}
              setIntake={setIntake}
              biography={biography}
              setBiography={setBiography}
              activeUserName={activeUserName}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              responses={responses}
              setResponses={setResponses}
              completedAt={completedAt}
              setCompletedAt={setCompletedAt}
              setActiveTyroneDialog={setActiveTyroneDialog}
              setTheme={setTheme}
              theme={theme}
              validCodes={validCodes}
              setValidCodes={setValidCodes}
              ingestedProfiles={ingestedProfiles}
              setIngestedProfiles={setIngestedProfiles}
              isCielComplete={isCielComplete}
            />

           </div>
        )}
      </div>
      
      {/* GLOBAL FOOTER */}
      <FooterBar appStage={appStage as string} bootStage={bootStage} />
    </div>
  );
}

