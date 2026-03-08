import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    language: z.string(),
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
  type: 'content',
  schema: z.object({
    category: z.string(),
    icon: z.enum(['shield', 'code', 'cloud']),
    color: z.enum(['cyber-green', 'cyber-blue', 'cyber-purple']),
    skills: z.array(z.string()),
    order: z.number().optional().default(99),
  }),
});

const certifications = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    verify: z.string().optional().default(''),
    order: z.number().optional().default(99),
  }),
});

export const collections = { projects, skills, certifications };
