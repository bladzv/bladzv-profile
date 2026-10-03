# Local http-cache-semantics patch

This is the BSD-2-Clause `http-cache-semantics` 4.2.0 source with a local patch
for [GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp).
The package version `4.2.1-profile.0` identifies this repository's fork; it is
not an upstream release. `LICENSE` is copied from the upstream package.

The patch requires revalidation for shared non-public `Set-Cookie` responses,
shared `proxy-revalidate` responses, and `no-cache` responses. Those entries
cannot gain a positive cache lifetime through stale directives or be reused on
an origin error. Regression cases live in `tests/http-cache-semantics.test.cjs`.

When upstream publishes a fix, remove this fork and override, update the lockfile,
and run `npm ci`, `npm run audit`, `npm test`, `npm run lint`, and `npm run build`.
