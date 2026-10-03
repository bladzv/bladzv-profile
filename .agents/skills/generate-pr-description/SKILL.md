---
name: generate-pr-description
description: Draft a PR description from the session action log and verified repository changes when asked to prepare a pull request description.
---

Use the action log and repository state as evidence. Do not claim that a branch, commit, push, pull request, issue link, or test exists unless verified.

## Step 1 — Read session actions

Read the **entire** contents of `.github/actions.md`. If it is missing or incomplete, inspect the current session and Git diff before drafting; identify any information that remains unknown.

## Step 2 — Generate a semantic branch name

Analyze the changes and pick an appropriate type:

| Prefix | When to use |
|---|---|
| `feature` | New functionality or capabilities |
| `fix` | Bug fixes or corrections |
| `refactor` | Code restructuring without feature changes |
| `chore` | Maintenance tasks (dependencies, configs) |
| `docs` | Documentation-only changes |
| `security` | Security improvements or patches |

Format a suggested new branch as `codex/[type]-[kebab-case-description]`. If work already has a branch, report its actual name.
Rules: keep under 50 characters, be specific but concise, use descriptive verbs (add, implement, fix, improve), avoid articles (the, a, an).

## Step 3 — Generate a conventional commit message

One-line summary in the format: `[type]([scope]): [description]`

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `security`, `perf`, `test`

Rules: imperative mood ("Add" not "Added"), under 72 characters, no trailing period, lowercase description.

## Step 4 — Check GitHub Issues

Check available repository issues for a verified match. If issue access is unavailable or there is no clear match, write `None verified` and do not invent issue numbers.

## Step 5 — Create and write the PR description

Create `.github/pr_description.md` if needed. Append the new description without altering earlier entries. Avoid appending the same draft twice.

Fetch the current UTC timestamp:
```bash
date -u +"%Y-%m-%d %H:%M:%S UTC"
```

Use this template, omitting empty optional subsections when that makes the draft clearer. Report only tests actually run and outcomes actually observed.

```
# PR: [Descriptive title — short imperative summary of what this PR does]
Timestamp: [YYYY-MM-DD HH:MM:SS UTC]
Branch: [actual branch or explicitly labeled suggestion]
Suggested Commit Message: [conventional commit message]

---

## Summary
[2–4 sentence paragraph: what changed, why it matters, most important outcomes. No bullet points.]

---

## Related Issues
[List verified GitHub Issues this PR addresses. If none, write "None verified"]
- Closes #N
- Fixes #N
- Related to #N

---

## Added Features
[New functionality. If none, write "None"]

### [Feature Area / Component]
- **[Feature name]**: [Description of what it does and why it matters.]

---

## Changes
[Modifications to existing functionality or refactoring — not new features, not bug fixes. If none, write "None"]
- **[Component/area — change name]**: [What changed and why.]

---

## Fixes
[Bugs or issues resolved. If none, write "None"]
- **[Short fix name]**: [Root cause, what was broken, what the fix does.]

---

## Files Changed

| File | Change |
|---|---|
| `path/to/file.ext` | [One-line description] |
| `path/to/file.ext` | **NEW**: [Description] |

---

## Testing Notes
[Tests actually run, observed outcomes, and any checks still needed]

**How to Test:**
1. [Step-by-step instruction]
2. [Expected result]

**Test Coverage:**
- [Browsers tested]
- [Scenarios validated]

---

## Security Considerations
[Security-related changes, if any]

**Security Measures:**
- **[OWASP category or concern]**: [What was done.]

If no security changes: "No security changes in this PR"

---

## Performance Impact
[Observed impact or expected effect, clearly labeled]

If no impact: "No significant performance impact"

---

## Breaking Changes
[List any breaking changes and migration path. If none, write "None"]

---

## Dependencies
[New or updated packages. If none, write "None"]
- `package@version` — [Why added/updated]

---

## Follow-up Items
[Tasks for future PRs. If none, write "None"]
- [ ] [Task description]

---
```

## Step 6 — Report the result

Provide the draft file path, the actual or suggested branch name, the suggested conventional commit message, and any unverified issues or checks. Leave branch creation, commits, pushes, and PR creation to a separate request.
