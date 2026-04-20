# S.Y.N.A.P.S.E OS (Tyrone Bot + CiEL Brain)

A structured React/TypeScript system organized for fast, safe updates to:

- **Tyrone Bot behavior/dialogue**
- **S.Y.N.A.P.S.E OS configuration/state keys**
- **CiEL protocol logic/scoring (“the brain”)**

This repository intentionally keeps all application logic under `src/synapse/`.

---

## System Architecture

`src/synapse/` is split by responsibility, not by random utility dumping:

- `src/synapse/index.tsx`  
  **Application shell + UI composition layer**.  
  Owns rendering, routing between tabs, and wiring state to modules.

- `src/synapse/tyroneBot.ts`  
  **Tyrone Bot orchestration layer**.  
  Central source of dialog definitions and bot messaging flows.

- `src/synapse/osConfig.ts`  
  **S.Y.N.A.P.S.E OS configuration layer**.  
  Storage keys, theme config, region coordinates, boot logs, and safe browser helpers.

- `src/synapse/cielBrain.ts`  
  **CiEL cognitive logic layer**.  
  Battery questions, score computation, and payload encoding/decoding.

---

## File Tree

```text
src/
  synapse/
    index.tsx        # UI shell + composition
    tyroneBot.ts     # Tyrone dialog models/builders
    osConfig.ts      # OS constants + safe browser helpers
    cielBrain.ts     # CiEL battery + scoring + payload encoding
```

---

## Update Playbook

### 1) Update Tyrone Bot
Edit: `src/synapse/tyroneBot.ts`

Use this file when changing:
- onboarding copy,
- restriction/guardrail messages,
- completion prompts,
- future persona tone adjustments.

### 2) Update S.Y.N.A.P.S.E OS settings
Edit: `src/synapse/osConfig.ts`

Use this file when changing:
- storage key versions,
- theme palettes,
- boot messages,
- country/month/region metadata,
- browser-safe storage/clipboard behavior.

### 3) Update CiEL logic (“brain”)
Edit: `src/synapse/cielBrain.ts`

Use this file when changing:
- questionnaire battery,
- domain scaling/weights,
- score aggregation behavior,
- payload schema encoding logic.

### 4) Update shell behavior or layout
Edit: `src/synapse/index.tsx`

Use this file when changing:
- tab routing,
- component layout,
- state wiring between modules,
- UI interactions.

---

## Design Principles

- **Single-responsibility modules**: one concern per file.
- **Composable architecture**: UI composes dedicated logic modules.
- **Minimal cross-file coupling**: modules expose clear imports for predictable changes.
- **Change safety**: editing Tyrone/CiEL/OS should not require hunting through a monolithic file.

