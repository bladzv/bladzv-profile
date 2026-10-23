import { getCollection } from 'astro:content';
import { fetchGitHubRepos } from './github';

export type ProjectGroup = 'security' | 'web3' | 'tools' | 'other';

export interface Project {
  title: string;
  description: string;
  summary: string;
  detail: string;
  group: ProjectGroup;
  language: string;
  url: string;
  homepage: string;
  visibility: 'public' | 'private';
  blur: boolean;
  status: 'active' | 'ongoing' | 'archived';
  order: number;
}

interface GroupMeta {
  /** Simple-mode heading and blurb */
  label: string;
  blurb: string;
  prefix: string;
  /** Desktop Projects window heading, blurb and accent */
  osLabel: string;
  osBlurb: string;
  color: string;
}

export const groupMeta: Record<ProjectGroup, GroupMeta> = {
  security: {
    label: 'Security', blurb: 'Tools that help people and teams stay safe online.', prefix: 'S',
    osLabel: 'Security', osBlurb: 'Monitoring, threat detection, dependency safety', color: '#00ff88',
  },
  web3: {
    label: 'Blockchain', blurb: 'Tools for the Enjin crypto community.', prefix: 'B',
    osLabel: 'Web3 · Enjin', osBlurb: 'Analytics and utilities for the Enjin ecosystem', color: '#a855f7',
  },
  tools: {
    label: 'Everyday apps', blurb: 'Useful side projects.', prefix: 'A',
    osLabel: 'Tools', osBlurb: 'Everyday utilities and side builds', color: '#00d4ff',
  },
  other: {
    label: 'More on GitHub', blurb: 'Other public repositories.', prefix: 'X',
    osLabel: 'More on GitHub', osBlurb: 'Other public repositories', color: '#79c0ff',
  },
};

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  'C++': '#f34b7d',
  Astro: '#ff5a03',
};

export const langColor = (lang: string) => LANG_COLORS[lang] ?? '#8888aa';

const GROUP_ORDER: ProjectGroup[] = ['security', 'web3', 'tools', 'other'];

/**
 * Merges authored project entries with the sanitized GitHub repo list.
 * A non-empty Markdown field wins; otherwise the GitHub value is used.
 * Repos without a Markdown entry land in the "other" group.
 */
export async function getProjects(): Promise<Project[]> {
  const repos = await fetchGitHubRepos('bladzv');
  const entries = await getCollection('projects');
  const byTitle = new Map(repos.map((r) => [r.title.toLowerCase(), r]));
  const seen = new Set<string>();

  const authored: Project[] = entries.map(({ data }) => {
    const key = data.title.toLowerCase();
    const repo = byTitle.get(key);
    seen.add(key);
    const description = data.description || repo?.description || '';
    return {
      title: data.title,
      description,
      summary: data.summary || description,
      detail: data.detail || description,
      group: data.group,
      language: data.language || repo?.language || '',
      url: data.url || repo?.url || '',
      homepage: data.homepage || repo?.homepage || '',
      visibility: repo ? 'public' : data.visibility,
      blur: data.blur,
      status: data.status,
      order: data.order,
    };
  });

  const rest: Project[] = repos
    .filter((r) => !seen.has(r.title.toLowerCase()))
    .map((r, i) => ({
      ...r,
      summary: r.description,
      detail: r.description,
      group: 'other',
      blur: false,
      order: 100 + i,
    }));

  return [...authored, ...rest].sort(
    (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || a.order - b.order
  );
}

export async function getProjectGroups() {
  const projects = await getProjects();
  return GROUP_ORDER.map((id) => ({
    id,
    ...groupMeta[id],
    items: projects.filter((p) => p.group === id),
  })).filter((g) => g.items.length > 0);
}

/** Card seal: what state the project is in. */
export function projectSeal(p: Project) {
  if (p.status === 'ongoing') return { label: 'IN PROGRESS', tone: 'wip' as const };
  if (p.visibility === 'private') return { label: 'PRIVATE', tone: 'private' as const };
  return { label: 'LIVE', tone: 'live' as const };
}

/** Desktop card state: what the project is doing now. */
export function projectState(p: Project) {
  if (p.status === 'ongoing') return { label: '● BUILDING', color: '#fbbf24' };
  if (p.visibility === 'private') return { label: '○ PRIVATE', color: '#7d8794' };
  return { label: '● LIVE', color: '#00ff88' };
}
