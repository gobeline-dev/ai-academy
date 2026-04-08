# Security Review Checklist

## Frontend (React/JSX)
- [ ] No use of `dangerouslySetInnerHTML` without sanitization
- [ ] No `eval()` or `new Function()` with user-controlled input
- [ ] No sensitive data (tokens, keys) in component state or localStorage

## Data Scripts (Python / Node)
- [ ] No hardcoded credentials or API tokens
- [ ] File paths validated before read/write operations
- [ ] JSON data validated before writing back to modules.json
- [ ] No shell command construction from user input (subprocess, exec)

## General
- [ ] No secrets committed to git (check .env files are gitignored)
- [ ] Dependencies free of known critical CVEs (`npm audit`)
- [ ] GitHub token references use `${GITHUB_TOKEN}` env var, not inline
