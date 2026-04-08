# AI Academy — Project instructions

## Commands
- Dev server: `cd ai-platform && npm run dev` (port 5173 by default)
- Build: `cd ai-platform && npm run build`
- Deploy: `cd ai-platform && npm run deploy` (GitHub Pages via gh-pages)
- Data scripts: `python ai-platform/src/data/<script>.py` or `node ai-platform/src/data/<script>.cjs`

## Stack
- React 19, functional components with hooks
- Vite 8 (ESM, `type: "module"`)
- Plain JavaScript/JSX — no TypeScript
- Python 3 for data generation/patching scripts
- GitHub Pages for hosting

## Structure
- `ai-platform/src/components/` — shared UI components
- `ai-platform/src/pages/` — page-level components
- `ai-platform/src/data/` — static JSON course data + generation scripts
- `ai-platform/src/hooks/` — custom React hooks

## Rules
- No default exports — use named exports everywhere
- Component files use PascalCase, other files use kebab-case
- Data scripts in `src/data/` are Node (`.cjs`) or Python (`.py`) — never both for the same task
- Course data lives in `modules.json`; patch scripts modify it, never rewrite it from scratch
- Keep components small and focused; extract logic into hooks
