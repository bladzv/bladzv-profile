/** Base-path aware link to a page inside the site, e.g. url('notes/'). */
export function url(path = ''): string {
  const base = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;
  return base + path.replace(/^\//, '');
}
