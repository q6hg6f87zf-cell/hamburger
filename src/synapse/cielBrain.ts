export type CielDomain = "ED" | "PI" | "CPC" | "ESR" | "ASD" | "CS" | "SR" | "AG" | "LOI" | "JMT" | "BAM" | "RSR";

export type CielQuestion = {
  id: string;
  type: "likert";
  module: string;
  prompt: string;
  scale: number;
  domain: CielDomain;
};

export const BATTERY: CielQuestion[] = [
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

const INITIAL_DOMAINS: Record<CielDomain, number> = {
  ED: 50,
  PI: 50,
  CPC: 50,
  ESR: 50,
  ASD: 50,
  CS: 50,
  SR: 50,
  AG: 50,
  LOI: 50,
  JMT: 50,
  BAM: 50,
  RSR: 50
};

export function computeScores(responses: Record<string, number>) {
  const domains = { ...INITIAL_DOMAINS };

  for (const item of BATTERY) {
    const response = responses[item.id];
    if (!response) {
      continue;
    }

    const normalized = ((response - 1) / 6) * 100;
    domains[item.domain] = Math.round((domains[item.domain] + normalized) / 2);
  }

  return { domains };
}

export function encodeBase64Unicode(str: string) {
  return btoa(unescape(encodeURIComponent(str || "")));
}

export function decodeBase64Unicode(str: string) {
  return decodeURIComponent(escape(atob(str || "")));
}
