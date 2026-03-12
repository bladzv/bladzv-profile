import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const username = process.env.GITHUB_REPOS_USER || 'bladzv';
const cachePath = path.resolve(process.cwd(), '.cache', 'github_repos.json');

function sanitize(input, maxLength = 200) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').trim().slice(0, maxLength);
}

function sanitizeUrl(input) {
  if (typeof input !== 'string' || !input) return '';
  try {
    const url = new URL(input);
    if (url.protocol === 'https:') return url.href;
    return '';
  } catch {
    return '';
  }
}

async function readExisting() {
  try {
    if (existsSync(cachePath)) {
      return await fs.readFile(cachePath, 'utf8');
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function writeCache(data) {
  try {
    await fs.mkdir(path.dirname(cachePath), { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  } catch (err) {
    console.error('Failed to write cache:', err);
    throw err;
  }
}

async function fetchRepos() {
  const apiUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=public&sort=updated&per_page=100`;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'static-profile-cache-updater',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `token ${token}`;

  try {
    const res = await fetch(apiUrl, { headers });
    if (!res.ok) {
      console.warn(`GitHub API returned ${res.status}: ${res.statusText}`);
      return null;
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.warn('Unexpected content type:', contentType);
      return null;
    }
    const data = await res.json();
    if (!Array.isArray(data)) return null;

    const repos = data
      .filter((r) => !r.fork && !r.archived)
      .map((repo) => ({
        title: sanitize(repo.name, 100),
        description: sanitize(repo.description, 200) || 'No description provided.',
        language: sanitize(repo.language, 50) || 'Unknown',
        url: sanitizeUrl(repo.html_url),
        homepage: sanitizeUrl(repo.homepage),
        visibility: 'public',
        status: 'active',
      }));

    return repos;
  } catch (err) {
    console.error('Failed to fetch GitHub repos:', err);
    return null;
  }
}

async function main() {
  const existingRaw = await readExisting();
  const repos = await fetchRepos();

  if (!repos) {
    console.log('Using existing cache (no API update).');
    process.exit(0);
  }

  const newRaw = JSON.stringify(repos, null, 2) + '\n';
  if (existingRaw === newRaw) {
    console.log('No changes to cache.');
    process.exit(0);
  }

  await writeCache(repos);
  console.log(`Updated cache with ${repos.length} repos.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(0);
});
