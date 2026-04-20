# Hamburger Repository

This repository was reorganized to make updates easier to track.

## Current structure

- `src/synapse/index.tsx` — primary React/TypeScript implementation.

## Why this change

Previously, the application code lived in a single root file with no extension, which made it difficult to discover and maintain updates.

Moving code into `src/synapse/` improves:

- clarity of where source files belong,
- future modularization (components/hooks/utils), and
- change review in commits and pull requests.
