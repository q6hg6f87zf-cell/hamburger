import React from "react";
import { Heart, Zap } from "lucide-react";

export function FooterBar({ appStage, bootStage }: { appStage: string; bootStage: number }) {
  if (!(appStage === "shell" || appStage === "admin") || bootStage !== 2) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 bg-black/90 border-t border-[var(--pip-dim)] flex justify-between items-center z-40 px-6">
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase"><Heart className="h-3 w-3" /> HP [100]</div>
        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase"><Zap className="h-3 w-3" /> AP [240]</div>
      </div>
      <div className="text-[7px] font-black tracking-[0.4em] uppercase opacity-40 glow hidden sm:block">S.Y.N.A.P.S.E. // Node_Active</div>
    </div>
  );
}
