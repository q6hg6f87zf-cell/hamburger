import React from "react";
import { TerminalCard } from "./uiPrimitives";

export function LoginScreen(props: any) {
  const { appStage, bootStage, setBootStage, bootLines, handleLogin, loginInput, setLoginInput, loginError } = props;

  if (appStage !== "login") {
    return null;
  }

  return (
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
              {bootLines.map((l: string, i: number) => <div key={i} className="glow">{l}</div>)}
              <div className="animate-pulse">_</div>
            </div>
          )}
          {bootStage === 2 && (
            <form onSubmit={handleLogin} className="w-full flex flex-col items-center animate-in fade-in duration-300">
              <div className="text-[10px] font-black tracking-widest uppercase glow mb-4 opacity-80">AUTHORIZATION REQUIRED</div>
              <input
                autoFocus
                type="password"
                value={loginInput}
                onChange={(e) => setLoginInput((e.target.value || "").toUpperCase())}
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
  );
}
