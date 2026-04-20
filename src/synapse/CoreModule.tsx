import React from "react";
import { Calendar as CalendarIcon, ClipboardCopy, Cpu, Database, MapPin, Palette, Shield, User } from "lucide-react";
import { BATTERY, computeScores, decodeBase64Unicode, encodeBase64Unicode } from "./cielBrain";
import { ADMIN_CODES_KEY, ADMIN_PROFILES_KEY, BIO_PROMPT_MIN_CHARS, COUNTRY_LIST, MASTER_CIEL_SCORES, MONTHS, REGION_COORDS, STORAGE_KEY, THEMES, fallbackCopy, safeStorage } from "./osConfig";
import { tyroneBot } from "./tyroneBot";
import { Field, SectionLabel, TerminalCard, TerminalCombobox } from "./uiPrimitives";

export function CoreModule(props: any) {
  const {
    activeCategory, activeTab, isAdmin, intake, setIntake, biography, setBiography, activeUserName, currentIndex, setCurrentIndex, responses, setResponses, completedAt, setCompletedAt,
    setActiveTyroneDialog, setTheme, theme, validCodes, setValidCodes, ingestedProfiles, setIngestedProfiles, isCielComplete
  } = props;

  return (
    <>
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
                                if(!intake.participantName || !intake.country || !intake.birthMonth || !intake.city) return setActiveTyroneDialog(tyroneBot.intakeError());
                                setIntake(p => ({...p, completed: true})); window.scrollTo(0,0);
                             }} className="mt-6 w-full border border-[var(--pip-main)] py-3 font-black text-xs hover:bg-[var(--pip-main)] hover:text-black uppercase tracking-widest shadow-[0_0_10px_var(--pip-main)]">Confirm_Context</button>
                          </TerminalCard>
                       ) : !biography.completed ? (
                          <TerminalCard>
                             <SectionLabel rightElement={<button onClick={() => setActiveTyroneDialog(tyroneBot.linguisticNudge())} className="text-[9px] animate-pulse glow text-[var(--pip-light)] font-bold tracking-widest">[ PING TYRONE ]</button>}>LINGUISTIC_BASELINE</SectionLabel>
                             <textarea value={biography.text} onChange={e => setBiography({...biography, text: e.target.value})} className="w-full h-40 bg-black border border-[var(--pip-main)]/50 p-4 font-mono text-xs text-[var(--pip-main)] outline-none focus:border-[var(--pip-main)] uppercase placeholder:opacity-20 mb-4 leading-relaxed" placeholder="Type narrative here..." />
                             <div className="flex justify-between items-center">
                                <span className={`text-[9px] font-black uppercase ${biography.text.length < BIO_PROMPT_MIN_CHARS ? 'text-amber-500' : 'text-[var(--pip-main)]'}`}>Data: {biography.text.length} / {BIO_PROMPT_MIN_CHARS}</span>
                                <button onClick={() => {
                                    if(biography.text.length < BIO_PROMPT_MIN_CHARS) return setActiveTyroneDialog(tyroneBot.shortBioError());
                                    setActiveTyroneDialog(tyroneBot.baselineSynced(() => { setBiography(p => ({...p, completed: true})); window.scrollTo(0,0); }));
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
                                    else { setCompletedAt(new Date().toISOString()); setActiveTyroneDialog(tyroneBot.complete()); }
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

                 {activeTab === 'PERSONALIZATION' && !isAdmin && (
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
    </>
  );
}
