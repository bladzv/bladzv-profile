import type { APIRoute } from 'astro';

// Built from the base path so "Add to Home Screen" opens the site root even if a base path is set again.
const base = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: 'Bloodymer S. Velasco — bladzOS',
      short_name: 'bladzv',
      start_url: base,
      scope: base,
      display: 'standalone',
      background_color: '#0d1117',
      theme_color: '#0d1117',
      icons: [
        { src: `${base}icon-192.png`, sizes: '192x192', type: 'image/png' },
        { src: `${base}icon-512.png`, sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
