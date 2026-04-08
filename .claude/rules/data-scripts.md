---
paths:
  - "ai-platform/src/data/**"
---

# Data Scripts Rules

- Patch scripts must be idempotent — running them twice must not corrupt the data
- Always read `modules.json`, apply targeted modifications, and write back — never regenerate from scratch
- Node scripts must use `.cjs` extension (the project is ESM by default)
- Python scripts must include a `if __name__ == "__main__":` guard
- Log what you modified: print the module id and slug affected
- Keep a backup strategy: work on a copy or validate with `JSON.parse` before overwriting
