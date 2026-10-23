import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    // description and language may be left empty for public repos; the GitHub cache fills them in.
    description: z.string().optional().default(''),
    // Plain-language one-liner shown on project cards; falls back to description.
    summary: z.string().optional().default(''),
    // Technical one-liner shown in the desktop Projects window; falls back to description.
    detail: z.string().optional().default(''),
    group: z.enum(['security', 'web3', 'tools', 'other']).default('other'),
    language: z.string().optional().default(''),
    stack: z.string().optional().default(''),
    url: z.string().optional().default(''),
    homepage: z.string().optional().default(''),
    visibility: z.enum(['public', 'private']).default('private'),
    blur: z.boolean().optional().default(false),
    status: z.enum(['active', 'ongoing', 'archived']).default('active'),
    order: z.number().optional().default(99),
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/skills' }),
  schema: z.object({
    category: z.string(),
    // Shorter label used in the desktop Training window; falls back to category.
    shortCategory: z.string().optional().default(''),
    icon: z.enum(['shield', 'code', 'cloud']),
    color: z.enum(['cyber-green', 'cyber-blue', 'cyber-purple']),
    skills: z.array(z.string()),
    order: z.number().optional().default(99),
  }),
});

const certifications = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/certifications' }),
  schema: z.object({
    name: z.string(),
    // Short label for the certificate stamp, e.g. "Security+ SY0-701".
    short: z.string().optional().default(''),
    issuer: z.string(),
    date: z.string(),
    verify: z.string().optional().default(''),
    order: z.number().optional().default(99),
  }),
});

const writeups = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/writeups' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['TryHackMe', 'Homelab', 'Investigations', 'Tooling']),
    platform: z.string().optional().default(''),
    difficulty: z.string().optional().default(''),
    tools: z.array(z.string()).default([]),
    date: z.string().optional().default(''),
    summary: z.string(),
    status: z.enum(['draft', 'published']).default('draft'),
    order: z.number().optional().default(99),
  }),
});

const httpsUrl = z
  .string()
  .url()
  .refine((u) => u.startsWith('https://'), 'Links must use https');

const noteBlock = z.object({
  sub: z.string().optional(),
  h: z.string(),
  p: z.string().optional(),
  how: z.string().optional(),
  items: z.array(z.string()).optional(),
  rows: z.array(z.object({ k: z.string(), v: z.string().optional(), w: z.string().optional() })).optional(),
  code: z.string().optional(),
  out: z.string().optional(),
  tip: z.string().optional(),
  tipLabel: z.string().optional(),
  link: z.union([httpsUrl, z.literal('')]).optional(),
});

const notes = defineCollection({
  loader: glob({ pattern: '[^_]*.json', base: './src/content/notes' }),
  schema: z.object({
    folder: z.string(),
    slug: z.string(),
    title: z.string(),
    tags: z.array(z.string()).default([]),
    src: z.string().optional(),
    intro: z.string().optional(),
    order: z.number().optional().default(99),
    blocks: z.array(noteBlock),
  }),
});

export const collections = { projects, skills, certifications, writeups, notes };
