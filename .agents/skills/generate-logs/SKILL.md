---
name: generate-logs
description: Record changes made during the current repository work session in .github/actions.md when asked for an action log.
---

Create a factual, comprehensive session log. Do not attribute pre-existing changes to the current session.

## Step 1 — Check and prepare the log file

Read `.github/actions.md` if it exists so entries are not duplicated. Create it when needed.

## Step 2 — Compare with remote

Inspect the session history and local Git changes. Compare with `origin/main` if that reference is available. If a current remote comparison is needed and repository access is available, refresh it first; otherwise, state the comparison limit. Use this evidence to identify changes made during this session.

## Step 3 — Write log entries

Append an entry for each distinct action from this session that has not already been logged. Use a writing method that preserves Markdown formatting.

Each entry must follow this exact format:

```
# Action: [Short descriptive title]
Timestamp: [YYYY-MM-DD HH:MM:SS UTC]

## Changes Made
- [Detailed description of changes]
- [Another change if applicable]

## Files Modified
- `path/to/file1.js` - [brief description]
- `path/to/file2.css` - [brief description]

## Rationale
[Why these changes were made — business/technical reasoning]

## Technical Notes
- [Important implementation details]
- [Security considerations]
- [Performance implications]
- [Dependencies or follow-up items]

---
```

Fetch the current UTC timestamp programmatically:
```bash
date -u +"%Y-%m-%d %H:%M:%S UTC"
```

Cover all changes, fixes, and additions made during this session. Distinguish completed work from proposed or unverified work.
