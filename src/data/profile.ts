/**
 * Profile facts shared by the OS desktop and the simple page.
 * Projects, skills and certifications live in src/content/.
 */

export const person = {
  name: 'Bloodymer S. Velasco',
  first: 'Bloodymer',
  last: 'S.Velasco',
  initials: 'BV',
  handle: 'bladzv',
  role: 'Aspiring cybersecurity analyst',
  email: 'bladzvelasco1994@gmail.com',
  linkedin: 'https://www.linkedin.com/in/bloodyvelasco/',
  github: 'https://github.com/bladzv',
  replyTime: 'usually within a day',
  status: 'open to work',
};

export const taglines = [
  'Aspiring Cybersecurity Analyst',
  'Team Lead, Twice Over',
  'Calm Under Pressure',
  'Security+ Certified',
  'Builder of Free Security Tools',
];

export const intro =
  'Seven years in customer support, operations and security monitoring, twice as team lead. Now working toward my first cybersecurity role, with a certification and hands-on projects to show for it.';

/** About text. Odd-indexed parts are the redacted phrases on the simple page. */
export const aboutParts = [
  "For seven years, in support and operations roles at fintech and blockchain companies, I've been the person teams ",
  'turn to when something breaks',
  ". Now I'm working toward a career in cybersecurity. At home I run a lab where I practise ",
  'spotting cyber attacks',
  '. I hold the ',
  'CompTIA Security+',
  ' certification and rank in the ',
  'top 6%',
  ' of learners on TryHackMe, a cybersecurity training site.',
];

/** Desktop (bladzOS) copy. */
export const os = {
  name: 'Bloodymer Velasco',
  subtitle: 'Cybersecurity analyst · Security+ certified · Philippines',
  about:
    "For seven years, in support and operations roles at fintech and blockchain companies, I've been the person teams turn to when something breaks, twice as team lead. Now I'm moving into cybersecurity. I run a home lab where I practise spotting attacks, hold CompTIA Security+, and rank in the top 6% on TryHackMe.",
  strengths: [
    { h: 'Stays calm in a crisis', p: 'Led a 24/7 alarm monitoring team for two years.' },
    { h: 'Makes teams faster', p: 'Cut call response time by ~90% as team lead.' },
    { h: 'Cuts through noise', p: 'Reduced false alarms by 40%.' },
  ],
  homeLab:
    'I run Wazuh, Suricata and Grafana on Linux to practise detecting attacks, and train on TryHackMe, where I rank in the top 6% of learners.',
  contact: 'Open to entry-level SOC and security analyst roles, remote or Philippines-based.',
  whoami: 'bloodymer.velasco: support team lead turned cybersecurity analyst',
};

export const homeLab = {
  title: 'I built a small security operations center at home.',
  body: 'A personal server that watches for attacks, flags suspicious network traffic and tracks system health, so I can practise the work an analyst does every day.',
  tools: ['Wazuh', 'Suricata', 'Grafana', 'Linux'],
};

export const practice = {
  stat: 'Top 6%',
  body: 'of learners on TryHackMe, a hands-on cybersecurity training site. Now working through the SOC Analyst path.',
};

export interface Role {
  role: string;
  company: string;
  period: string;
  /** Fractional years, used to draw the timeline. */
  start: number;
  end: number;
  impact: string;
  /** Shorter impact line for the desktop experience.log, when it differs. */
  osImpact?: string;
  active?: boolean;
}

/** Newest first. */
export const roles: Role[] = [
  {
    role: 'Support & Marketing Specialist',
    company: 'NFTech Pte. Ltd. (Enjin.io)',
    period: 'May 2024 – Present',
    start: 2024.33,
    end: 2026.8,
    impact: 'Troubleshoot integration issues for users and developers, escalate security-relevant reports, and test new features before release.',
    active: true,
  },
  {
    role: 'Partners, Tech & Voice Support — Team Lead',
    company: 'Betur Inc. (Coins.ph)',
    period: 'Jul 2023 – Apr 2024',
    start: 2023.5,
    end: 2024.3,
    impact: 'Cut inbound call response time by ~90%. Reviewed partner API usage and SLA compliance, and coached the support team.',
  },
  {
    role: 'Operations Associate',
    company: 'Coins.ph (Betur Inc.)',
    period: 'Sep 2021 – Jun 2023',
    start: 2021.67,
    end: 2023.45,
    impact: 'Resolved customer tickets, worked with engineering on product issues, and managed the knowledge base and team scheduling.',
  },
  {
    role: 'Alarm Monitoring Center — Team Lead',
    company: 'Personal Security Systems, Inc. · client: JPMorgan Chase & Co.',
    period: 'Jun 2019 – Sep 2021',
    start: 2019.42,
    end: 2021.67,
    impact: 'Cut monthly false alarms by 40% through process improvement. Wrote SOPs and trained the team.',
  },
  {
    role: 'Part-time System Administrator & Proofreader',
    company: 'Philippine Center for Investigative Journalism',
    period: 'Feb 2017 – Nov 2018',
    start: 2017.08,
    end: 2018.9,
    impact: 'Kept an office network of ~20 workstations, a server and a printer running. Started as a data encoder.',
    osImpact: 'Kept an office network of ~20 workstations, a server and a printer running.',
  },
];

/** Section ids shared by the desktop, tablet and phone views and the terminal. */
export const sections = [
  { id: 'about', label: 'About me', file: 'about.txt', glyph: '~', color: '#00ff88', desc: 'Who I am in 30 seconds', kind: 'file' },
  { id: 'route', label: 'Experience', file: 'experience.log', glyph: '→', color: '#00d4ff', desc: 'Work history, 2017 → now', kind: 'file' },
  { id: 'projects', label: 'Projects', file: 'projects/', glyph: '{}', color: '#a855f7', desc: 'things I built', kind: 'dir' },
  { id: 'training', label: 'Training', file: 'training/', glyph: '✓', color: '#fbbf24', desc: 'Certs, home lab, skills', kind: 'dir' },
  { id: 'writeups', label: 'Write-ups', file: 'writeups/', glyph: '✎', color: '#ff7b72', desc: 'Security challenges, explained', kind: 'dir' },
  { id: 'notes', label: 'Notes', file: 'notes/', glyph: '#', color: '#79c0ff', desc: 'My open study notes', kind: 'dir' },
  { id: 'contact', label: 'Contact', file: 'contact.vcf', glyph: '@', color: '#00ff88', desc: 'Email, LinkedIn, GitHub', kind: 'file' },
] as const;

export type SectionId = (typeof sections)[number]['id'];
