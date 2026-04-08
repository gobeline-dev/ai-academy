---
description: Reviews code changes for security vulnerabilities, authentication gaps, and injection risks
disable-model-invocation: true
argument-hint: <branch-or-path>
---

## Diff to review

!`git diff $ARGUMENTS`

Audit the changes above for:

1. Injection vulnerabilities (XSS, command injection in data scripts)
2. Hardcoded secrets, API keys, or credentials
3. Unsafe use of `dangerouslySetInnerHTML` or `eval`
4. Exposed sensitive data in JSON files committed to the repo

Use checklist.md in this skill directory for the full review checklist.

Report findings with severity ratings (Critical / High / Medium / Low) and remediation steps.
