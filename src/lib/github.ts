/**
 * Fetches public repositories from the GitHub API at build time.
 * All string values are sanitized to prevent XSS.
 * No authentication required — uses unauthenticated public API.
 */

export interface GitHubRepo {
  title: string;
  description: string;
  language: string;
  url: string;
  homepage: string;
  visibility: 'public';
  status: 'active';
}

/** Strip HTML tags and limit string length for safety.
 *  Astro auto-escapes template expressions, so we only strip tags here.
 */
function sanitize(input: unknown, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, maxLength);
}

/** Validate a URL string is a safe HTTPS link */
function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string' || !input) return '';
  try {
    const url = new URL(input);
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return url.href;
    }
    return '';
  } catch {
    return '';
  }
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const apiUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=public&sort=updated&per_page=100`;
  const fs = await import('fs');
  const path = await import('path');
  const cachePath = path.resolve(process.cwd(), '.cache', 'github_repos.json');

  async function readCache(): Promise<GitHubRepo[]> {
    try {
      if (fs.existsSync(cachePath)) {
        const raw = fs.readFileSync(cachePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return [];
  }

  async function writeCache(repos: GitHubRepo[]) {
    try {
      const dir = path.dirname(cachePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(cachePath, JSON.stringify(repos, null, 2), 'utf-8');
    } catch (e) {
      // ignore
    }
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'static-profile-builder',
      },
    });

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}: ${response.statusText}`);
      return readCache();
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.warn(`Unexpected content type: ${contentType}`);
      return readCache();
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn('GitHub API did not return an array');
      return readCache();
    }

    const repos = data
      .filter((repo: any) => !repo.fork && !repo.archived)
      .map((repo: any) => ({
        title: sanitize(repo.name, 100),
        description: sanitize(repo.description, 200) || 'No description provided.',
        language: sanitize(repo.language, 50) || 'Unknown',
        url: sanitizeUrl(repo.html_url),
        homepage: sanitizeUrl(repo.homepage),
        visibility: 'public' as const,
        status: 'active' as const,
      }));

    // Update cache for future builds
    await writeCache(repos);

    return repos;
  } catch (err) {
    console.error('Failed to fetch GitHub repos, falling back to cache:', err);
    return readCache();
  }
}
