import React from "react";
import {
  Calendar as CalendarIcon,
  CloudLightning,
  CloudRain,
  ClipboardCopy,
  Cpu,
  Grid,
  Lock,
  PenTool,
  Plus,
  Save
} from "lucide-react";
import { JOURNAL_KEY, MONTHS, PROMPTS_KEY, fallbackCopy, safeStorage } from "./osConfig";
import { SectionLabel, TerminalCard } from "./uiPrimitives";
import { tyroneBot } from "./tyroneBot";

export function AppsModule(props: any) {
  const { activeCategory, activeTab, isCielComplete, handleTabClick, journals, setCurrentJournal, currentJournal, setJournals, setActiveTyroneDialog, promptData, setPromptData, ingestedProfiles } = props;

  return (
    <>
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
                               <button onClick={() => setActiveTyroneDialog(tyroneBot.localOffline())} className="text-[8px] animate-pulse glow tracking-widest uppercase font-black hover:text-[var(--pip-light)] border border-[var(--pip-main)] px-2 py-1">
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


    </>
  );
}
