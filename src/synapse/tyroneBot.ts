export type TyroneDialog = {
  title: string;
  body: string;
  actionLabel?: string;
  action?: () => void;
};

export const tyroneBot = {
  initiation: (name: string): TyroneDialog => ({
    title: "TYRONE.BOT // INITIATION",
    body: `Howdy ${name.toUpperCase()}. Master Brent authorized your link. I'm Tyrone.Bot. We need your neural baseline before unlocking the system apps.`
  }),
  restrictedApps: (): TyroneDialog => ({
    title: "TYRONE.BOT // RESTRICTED",
    body: "Hold your horses! You can't access utility apps until your CiEL battery is locked in."
  }),
  intakeError: (): TyroneDialog => ({
    title: "TYRONE // ERROR",
    body: "Fill out the required fields. I need that city for your weather telemetry."
  }),
  linguisticNudge: (): TyroneDialog => ({
    title: "TYRONE // BASELINE",
    body: "Don't just give me a resume, partner. Master Brent needs to see how your brain puts words together."
  }),
  shortBioError: (): TyroneDialog => ({
    title: "TYRONE // ERR",
    body: "I need more than that. Give me the deep cuts."
  }),
  baselineSynced: (onAcknowledge: () => void): TyroneDialog => ({
    title: "TYRONE // SYNC",
    body: "Baseline Secured. Time for the main battery.",
    action: onAcknowledge
  }),
  complete: (): TyroneDialog => ({
    title: "TYRONE // COMPLETE",
    body: "We're done here. The OS is unlocked."
  }),
  localOffline: (): TyroneDialog => ({
    title: "TYRONE // LOCAL",
    body: "Master Brent has offline systems engaged to preserve API limits. Log your thoughts safely."
  })
};
