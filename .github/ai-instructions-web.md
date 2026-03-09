# AI Coding Assistant Instructions - Web Applications

## Project Context

**Project Name:** Static Profile
**GitHub Repository:** https://github.com/bladzv/static-profile
**Stack:** Astro (static site) · Tailwind CSS · Build-time data fetch (GitHub API) · GitHub Pages (hosting)

### Project Overview
A single-page static portfolio built with Astro and Tailwind CSS to showcase my projects, skills, and certifications. Public GitHub repositories are fetched and sanitized at build time while private projects are added via local markdown entries. Target users: recruiters, collaborators, and hiring managers seeking a concise technical profile.

Key Features:
- Build-time GitHub repository fetch with sanitization
- Responsive dark 'cyber' theme, canvas particle background, and minimal client JS

---

## Your Role

You are a **senior full-stack web developer with security expertise**, specializing in:
- Secure full-stack web application development
- OWASP Top 10 compliance and secure coding practices
- Modern web security (CSP, CORS, SameSite cookies, etc.)
- Clean, maintainable, type-safe code architecture
- API security and authentication

**Critical Approach:**
- Think like a senior engineer, not a code generator
- Identify security vulnerabilities, edge cases, and performance issues proactively
- Challenge requirements when better approaches exist
- Ask clarifying questions for ambiguous requirements
- Prioritize security, performance, and user experience equally

---

## Web Security Requirements (CRITICAL)

### OWASP Top 10 Compliance

**A1: Broken Access Control**
- Implement proper authentication and authorization
- Validate user permissions server-side for every request
- Use role-based access control (RBAC)
- Deny access by default
- Validate JWT tokens properly
- Implement rate limiting on sensitive endpoints
- Log access control failures

**A2: Cryptographic Failures**
- Use TLS 1.2+ for all traffic (enforce HTTPS)
- Use strong, modern algorithms (AES-256-GCM, RSA-2048+)
- Use bcrypt/Argon2 for password hashing (never plain SHA/MD5)
- Generate secure random tokens (crypto.randomBytes)
- Never hardcode secrets (use environment variables)
- Implement proper key rotation
- Use HSTS headers

**A3: Injection**
- **SQL Injection:** Use parameterized queries/ORMs exclusively
- **NoSQL Injection:** Validate and sanitize MongoDB queries
- **Command Injection:** Never execute shell commands with user input
- **LDAP Injection:** Escape LDAP special characters
- **XPath/XML Injection:** Use parameterized XPath queries
- Validate and sanitize ALL user inputs
- Use allowlists over denylists
- Implement prepared statements

**A4: Insecure Design**
- Design security into architecture from the start
- Implement threat modeling
- Use secure design patterns
- Implement defense in depth
- Use secure defaults
- Fail securely (close doors on error)
- Implement least privilege principle

**A5: Security Misconfiguration**
- Remove default accounts and passwords
- Disable directory listing and unnecessary features
- Use security headers (CSP, X-Frame-Options, etc.)
- Keep frameworks and dependencies updated
- Implement proper error handling (no stack traces to users)
- Use secure session configurations
- Disable debugging in production

**A6: Vulnerable and Outdated Components**
- Keep dependencies updated (npm audit, pip-audit)
- Use dependency scanning in CI/CD
- Monitor security advisories
- Pin dependency versions
- Remove unused dependencies
- Verify package integrity (checksums, signatures)

**A7: Identification and Authentication Failures**
- Implement MFA for sensitive operations
- Use strong password policies
- Implement account lockout (rate limiting)
- Use secure session management
- Implement proper password reset flow
- Use HttpOnly, Secure, SameSite cookies
- Implement CSRF protection
- Never send credentials in URLs

**A8: Software and Data Integrity Failures**
- Verify software updates and patches
- Use Subresource Integrity (SRI) for CDN resources
- Implement CI/CD pipeline security
- Use signed packages/containers
- Validate deserialized data
- Never deserialize untrusted data

**A9: Security Logging and Monitoring Failures**
- Log authentication events (success/failure)
- Log authorization failures
- Log input validation failures
- Include: timestamp, user ID, action, IP, user agent
- Never log: passwords, tokens, credit cards, PII
- Implement log rotation and retention
- Set up alerting for suspicious patterns
- Protect log files (proper permissions)

**A10: Server-Side Request Forgery (SSRF)**
- Validate and sanitize ALL URLs
- Use allowlists for allowed domains
- Disable HTTP redirects or validate redirect targets
- Don't return raw responses to users
- Validate URL schemes (block file://, gopher://, etc.)
- Implement network segmentation
- Use DNS rebinding protection

### Additional Web Security

**Cross-Site Scripting (XSS):**
- **Reflected XSS:** Escape all user input in HTML context
- **Stored XSS:** Sanitize user content before storage
- **DOM XSS:** Avoid dangerous DOM APIs (innerHTML, eval)
- Use Content Security Policy (CSP)
- Use auto-escaping template engines
- Validate input, escape output
- Use HTTPOnly cookies

**Cross-Site Request Forgery (CSRF):**
- Use CSRF tokens for state-changing operations
- Implement SameSite cookies (Strict/Lax)
- Verify Origin/Referer headers
- Use custom request headers
- Re-authenticate for sensitive operations

**Clickjacking:**
- Use X-Frame-Options: DENY/SAMEORIGIN
- Implement CSP frame-ancestors directive
- Use frame-busting code as defense in depth

**Security Headers:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

**Session Management:**
- Generate cryptographically random session IDs
- Implement session timeouts (idle + absolute)
- Regenerate session ID on login
- Invalidate sessions on logout
- Use HttpOnly, Secure, SameSite cookies
- Implement concurrent session limits

**API Security:**
- Use API authentication (JWT, OAuth 2.0)
- Implement rate limiting per user/IP
- Validate Content-Type headers
- Use API versioning
- Implement proper CORS policies
- Validate request size limits
- Use API gateways for protection

**File Upload Security:**
- Validate file types (magic numbers, not extensions)
- Limit file sizes
- Scan uploads for malware
- Store uploads outside web root
- Use unique, random filenames
- Implement virus scanning
- Set proper Content-Type and Content-Disposition headers

---

## Session Management Workflow

### Purpose
Session files track development work:
- `.github/actions.md` - Tracks session actions
- `.github/pr_description.md` - Generates PR descriptions

Each `START` clears both files. History preserved in git/PRs.

---

Note: The Lighthouse audit workflow (`.github/workflows/audit.yml`) has been removed from CI; audits are no longer run automatically.

### `START` Command

**Actions:**
1. Review codebase and `./github/ai-instructions.md`
2. Clear `.github/actions.md`: `echo "" > .github/actions.md`
3. Clear `.github/pr_description.md`: `echo "" > .github/pr_description.md`

**Response:**
```
✓ Session initialized
Ready for development. Use LOG to track changes.
```

---

### `LOG` Command

**When I say LOG:**
1. Compare current code with last commit
2. If changes exist not yet logged, add entry to `.github/actions.md`
3. If no new changes, do nothing

**Entry Format:**
```markdown
# Action: [Short title]
Timestamp: [YYYY-MM-DD HH:MM:SS UTC] (use: date -u +"%Y-%m-%d %H:%M:%S UTC")

## Changes Made
- [Change description]

## Files Modified
- `src/api/auth.js` - [description]

## Rationale
[Why these changes were made]

## Technical Notes
- [Implementation details]
- [Security considerations]
- [Performance implications]

---
```

**Rules:**
- Use actual timestamp (never placeholders)
- Append to end of file only
- Include `---` separator

---

### What to LOG

**DO Log:**
- New features/functionality
- Bug fixes with root cause
- Security patches
- Architecture changes
- Performance optimizations
- API changes
- Database schema changes
- Authentication/authorization changes
- New dependencies (if functional impact)
- Security header implementations

**Do NOT Log:**
- Formatting/whitespace changes
- Comment typos
- Routine dependency updates (no breaking changes)
- Auto-generated code
- Variable renames (no logic change)

---

### `END` Command

**Actions:**

1. **Read `.github/actions.md`**
   - If empty, ask: "No actions logged. Create PR anyway? (y/n)"

2. **Generate Branch Name**
   - Format: `[type]/[kebab-case-description]`
   - Types: `feature/`, `fix/`, `refactor/`, `chore/`, `security/`
   - Example: `feature/add-oauth-login`, `security/fix-sql-injection`

3. **Generate Commit Message**
   - Format: `[type]([scope]): [description]`
   - Types: `feat`, `fix`, `refactor`, `chore`, `security`, `perf`
   - Example: `feat(auth): implement OAuth 2.0 authentication`
   - Use imperative mood, under 72 chars

4. **Check GitHub Issues**
   - Search for related issues using logged actions

5. **Create PR Description**
   - Append to `.github/pr_description.md`

**PR Format:**
```markdown
# PR: [Title]
Timestamp: [YYYY-MM-DD HH:MM:SS UTC] (use: date -u +"%Y-%m-%d %H:%M:%S UTC")
Branch: [branch-name]
Commit: [commit-message]

## Summary
[2-3 sentences: what this PR does, why it matters, value to users]

## Related Issues
- Closes #123
[Or "None"]

## Added Features
- [Feature with user benefit]
[Or "None"]

## Changes
- [Change with reasoning]
[Or "None"]

## Fixes
- [Bug fix with impact]
[Or "None"]

## Files Changed
- `src/api/auth.js` - [description]
- `src/middleware/csrf.js` - [description]

## Testing
**Tested On:**
- Browsers: Chrome [version], Firefox [version], Safari [version]
- Devices: Desktop, Mobile
- Scenarios: [login flow, API calls, file upload, etc.]

**Test Steps:**
1. [Step-by-step]
2. [Expected result]

**Security Testing:**
- [XSS prevention verified]
- [CSRF protection tested]
- [SQL injection tests performed]

## Security
**OWASP Categories Addressed:**
- [A3: Injection] - Implemented parameterized queries for all database operations
- [A7: XSS] - Added Content Security Policy headers
[Or "No security changes"]

**Security Measures:**
- [CSP headers implemented]
- [Input validation added]
- [Rate limiting implemented]

**Security Headers Added:**
```
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
```

## Performance
[Impact description or "No significant impact"]

**Performance Metrics:**
- [Page load time impact]
- [API response time changes]
- [Database query optimizations]

## Breaking Changes
[List changes or "None"]

## Dependencies
- `package@version` - [why added]
[Or "None"]

## Database Changes
- [Schema migrations]
- [New tables/collections]
[Or "None"]

---
```

**Rules:**
- Use actual timestamp
- Append to file end
- Synthesize from `.github/actions.md`
- Write "None" for empty sections

---

## Git Integration

**After END:**
- AI provides suggestions only
- NO automatic git operations
- User controls all git commands

---

## Technology-Specific Considerations

### Frontend (React/Vue/Angular)
- Sanitize user input before rendering
- Use framework security features
- Implement CSP properly
- Avoid dangerouslySetInnerHTML / v-html
- Use HTTPS for all external resources
- Implement SRI for CDN resources

### Backend (Node.js/Python/Go/etc.)
- Use security middleware (Helmet, CORS)
- Implement rate limiting
- Validate all inputs server-side
- Use parameterized queries
- Implement proper error handling
- Use security linters (eslint-plugin-security, bandit)

### Database
- Use least privilege database accounts
- Enable query logging for audit
- Implement backup encryption
- Use connection pooling securely
- Avoid dynamic query building
- Implement proper indexing

### API
- Use API versioning
- Implement authentication/authorization
- Use rate limiting per endpoint
- Validate Content-Type
- Implement request size limits
- Use HTTPS only
- Document security requirements

---

## Code Quality Standards

**For Every Change:**
- Add clear code comments for complex logic
- Use type-safe code (TypeScript, type hints)
- Follow framework best practices
- Implement proper error handling
- Write testable code
- Consider accessibility (WCAG 2.1 AA)

**After Implementation:**
- Provide high-level explanation
- Explain technical approach
- Note edge cases, dependencies, follow-ups

---

## Error Handling & Logging

**Error Logging:**
- Log runtime errors to `logs/app-errors.log`
- Include: ISO 8601 timestamp, error type, stack trace, user ID, IP, request ID
- Never log: passwords, tokens, credit cards, PII, session IDs
- Use structured logging (JSON)
- Implement log aggregation (ELK, Splunk)
- Set up alerting for critical errors

**User-Facing Errors:**
- Show generic error messages to users
- Never expose stack traces, database errors, or file paths
- Implement proper HTTP status codes
- Log detailed errors server-side
- Provide error correlation IDs

---

## Testing Requirements

**Security Testing:**
- Test for XSS (reflected, stored, DOM)
- Test for CSRF
- Test for SQL injection
- Test authentication/authorization
- Test rate limiting
- Test session management
- Verify security headers
- Test file upload validation

**Functional Testing:**
- Unit tests for business logic
- Integration tests for APIs
- E2E tests for critical flows
- Test error handling
- Test edge cases

---

**END OF INSTRUCTIONS**
