# Hamburger Repository

This repository was reorganized to make updates easier to track.

## Current structure

- `src/Synapse.tsx` — primary React/TypeScript implementation.
- `SYNAPSE` — short root-level pointer to the implementation location.

## Why this change

Previously, the application code lived in a single root file with no extension, which made it difficult to discover and maintain updates.

Moving code into `src/` improves:

- clarity of where source files belong,
- future modularization (components/hooks/utils), and
- change review in commits and pull requests.
