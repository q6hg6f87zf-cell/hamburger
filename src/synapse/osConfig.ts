export const STORAGE_KEY = "synapse-os-v28-safe";
export const ADMIN_CODES_KEY = "synapse-keys-v28";
export const ADMIN_PROFILES_KEY = "synapse-profiles-v28";
export const JOURNAL_KEY = "synapse-journal-v28";
export const PROMPTS_KEY = "synapse-prompts-v28";
export const SESSION_CODE_KEY = "synapse-session-code-v1";

export const MASTER_ADMIN_CODE = "BRENT-8864";
export const BIO_PROMPT_MIN_CHARS = 50;

export const BOOT_SEQUENCE_LOGS = [
  "MOON SQUAD UNIFIED OPERATING SYSTEM",
  "COPYRIGHT 2024-2026 MOON SQUAD INC.",
  "S.Y.N.A.P.S.E. CORE v6.5.0-SAFE",
  "System Load... 100%",
  "CPU Diagnostics... NOMINAL",
  "Memory Check... OK",
  "Neural Link established..."
];

export const THEMES: Record<string, { main: string; light: string; dim: string; bg: string }> = {
  GREEN: { main: "#1ce600", light: "#89ff73", dim: "#0e7d00", bg: "#031201" },
  AMBER: { main: "#ffb000", light: "#ffcc00", dim: "#996600", bg: "#120a00" },
  BLUE: { main: "#00e5ff", light: "#73faff", dim: "#007a8a", bg: "#000d12" }
};

export const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

export const COUNTRY_LIST = ["NORTH MACEDONIA", "UNITED STATES", "CANADA", "UNITED KINGDOM", "AUSTRALIA", "NEW ZEALAND", "GERMANY", "FRANCE", "JAPAN", "BRAZIL", "MEXICO", "SPAIN", "ITALY", "SOUTH KOREA", "INDIA", "CHINA", "SOUTH AFRICA", "SERBIA"];

export const MASTER_CIEL_SCORES = { ED: 92, PI: 88, CPC: 95, ESR: 78, ASD: 96, CS: 84, SR: 42, AG: 76, LOI: 90, JMT: 85, BAM: 82, RSR: 88 };

export const REGION_COORDS: Record<string, { top: string; left: string }> = {
  "NORTH MACEDONIA": { top: "35%", left: "54%" },
  SERBIA: { top: "33%", left: "53%" },
  "UNITED STATES": { top: "40%", left: "20%" },
  CANADA: { top: "25%", left: "22%" },
  "UNITED KINGDOM": { top: "30%", left: "48%" },
  AUSTRALIA: { top: "75%", left: "85%" },
  JAPAN: { top: "35%", left: "85%" },
  BRAZIL: { top: "65%", left: "32%" }
};

export const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  }
};

export function fallbackCopy(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();

  try {
    document.execCommand("copy");
    alert("PAYLOAD COPIED TO CLIPBOARD");
  } catch {
    alert("SYS.ERR: CLIPBOARD BLOCKED BY BROWSER");
  }

  document.body.removeChild(el);
}
