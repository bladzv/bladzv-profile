/**
 * Notes viewer shared by the /notes/ page and the desktop Notes window:
 * switch notes, search across all notes, and copy commands.
 * Every note is rendered at build time; this only toggles visibility.
 */
interface NotesOptions {
  /** Keep the open note in the URL hash (the /notes/ page) */
  hash: boolean;
  copyLabel: string;
  copiedLabel: string;
  /** Called after a note is opened by the reader */
  onOpen?: () => void;
}

export function initNotes(root: HTMLElement, opts: NotesOptions) {
  const $$ = <T extends Element = HTMLElement>(sel: string, el: ParentNode = root) => [...el.querySelectorAll<T>(sel)];
  const articles = $$('article[data-note]');
  const links = $$('[data-note-link]');
  const input = root.querySelector<HTMLInputElement>('[data-notes-q]');
  if (!articles.length || !input) return;

  let current = articles[0].dataset.note!;
  let q = '';

  const blocksOf = (a: HTMLElement) => $$('[data-block]', a);
  const hitsOf = (a: HTMLElement) => (q ? blocksOf(a).filter((b) => b.dataset.text!.includes(q)) : blocksOf(a));
  const byId = new Map(articles.map((a) => [a.dataset.note!, a]));

  function render() {
    for (const link of links) {
      const a = byId.get(link.dataset.noteLink!)!;
      const hits = hitsOf(a).length;
      const titleHit = !!q && link.dataset.text!.includes(q);
      link.hidden = !!q && !titleHit && hits === 0;
      const badge = link.querySelector('.note-hits');
      if (badge) badge.textContent = q ? String(hits) : '';
      if (link.dataset.noteLink === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    $$('[data-folder]').forEach((f) => {
      const visible = $$('[data-note-link]', f).filter((l) => !l.hidden).length;
      const count = f.querySelector('.folder-count');
      if (count) count.textContent = String(visible);
      const empty = f.querySelector<HTMLElement>('.folder-empty');
      if (empty) empty.hidden = visible > 0;
    });

    const typed = input!.value.trim();
    for (const a of articles) {
      const on = a.dataset.note === current;
      a.hidden = !on;
      if (!on) continue;
      const blocks = blocksOf(a);
      const hits = new Set(hitsOf(a));
      blocks.forEach((b) => (b.hidden = !hits.has(b)));
      const noHits = a.querySelector<HTMLElement>('.no-hits');
      if (noHits) {
        noHits.hidden = !q || hits.size > 0;
        noHits.textContent = `Nothing in this note matches “${typed}”.`;
      }
      const hitLine = a.querySelector<HTMLElement>('.hit-line') ?? root.querySelector<HTMLElement>('.hit-line');
      const hitText = hitLine?.querySelector('.hit-text') ?? hitLine;
      if (hitLine) hitLine.hidden = !q;
      if (hitText) hitText.textContent = opts.hash ? `${hits.size} of ${blocks.length} sections match “${typed}”` : `${hits.size} of ${blocks.length} sections match`;
    }
  }

  function open(id: string) {
    if (!byId.has(id)) return;
    current = id;
    render();
    opts.onOpen?.();
  }

  if (opts.hash) {
    window.addEventListener('hashchange', () => open(decodeURIComponent(location.hash.slice(1))));
    const initial = decodeURIComponent(location.hash.slice(1));
    if (byId.has(initial)) current = initial;
  } else {
    root.addEventListener('click', (e) => {
      const link = (e.target as Element).closest<HTMLElement>('[data-note-link]');
      if (!link) return;
      e.preventDefault();
      open(link.dataset.noteLink!);
    });
  }

  input.addEventListener('input', () => {
    q = input.value.trim().toLowerCase();
    render();
  });
  root.querySelector('.clear-search')?.addEventListener('click', () => {
    input.value = '';
    q = '';
    render();
    input.focus();
  });

  root.addEventListener('click', async (e) => {
    const btn = (e.target as Element).closest<HTMLButtonElement>('.copy-btn');
    if (!btn) return;
    const code = btn.closest('[data-code]')?.querySelector('pre')?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(code);
      btn.textContent = opts.copiedLabel;
      btn.classList.add('text-cyber-green!');
      setTimeout(() => {
        btn.textContent = opts.copyLabel;
        btn.classList.remove('text-cyber-green!');
      }, 1500);
    } catch {
      btn.textContent = 'copy failed';
    }
  });

  render();
}
