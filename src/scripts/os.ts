/**
 * bladzOS controller: layout mode, window management and section routing
 * for src/components/os/OsShell.astro.
 */
import { initParticles, setMode, typewriter } from './effects';
import { initTerminal } from './terminal';
import { initNotes } from './notes';
import { taglines } from '../data/profile';

type Mode = 'desktop' | 'tablet' | 'phone';
type WinId = 'files' | 'term';
interface Win { x: number; y: number; w: number; h: number; open: boolean; min: boolean; max: boolean }
interface SectionMeta { label: string; file: string; desc: string }

const modeFor = (w: number): Mode => (w >= 1024 ? 'desktop' : w >= 640 ? 'tablet' : 'phone');

export function initOs() {
  const root = document.getElementById('os');
  if (!root) return;
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const $$ = <T extends Element = HTMLElement>(sel: string) => [...root.querySelectorAll<T>(sel)];

  const meta: Record<string, SectionMeta> = JSON.parse(root.dataset.sections || '{}');
  const stage = $('.stage');
  const wins: Record<WinId, HTMLElement> = { files: $('#win-files'), term: $('#win-term') };
  const dialog = $<HTMLDialogElement>('.mode-dialog');

  const state = {
    mode: modeFor(window.innerWidth),
    path: 'home',
    hist: [] as string[],
    tab: 'about',
    phone: null as string | null,
    toast: true,
    laidOut: false,
    z: ['term', 'files'] as WinId[],
    wins: {
      files: { x: 130, y: 24, w: 900, h: 600, open: true, min: false, max: false },
      term: { x: 640, y: 380, w: 520, h: 300, open: true, min: false, max: false },
    } as Record<WinId, Win>,
  };

  const top = () => state.z[state.z.length - 1];
  const label = (id: string) => (id === 'terminal' ? 'Terminal' : meta[id]?.label ?? '');

  /** The section showing in the Files window for the current mode. */
  const current = () => (state.mode === 'desktop' ? state.path : state.mode === 'tablet' ? state.tab : state.phone);

  function layoutWindows(clampOnly = false) {
    if (state.mode !== 'desktop') return;
    const r = stage.getBoundingClientRect();
    const W = r.width;
    const H = r.height;
    const { files: f, term: t } = state.wins;
    if (!clampOnly) {
      f.w = Math.min(960, W - 140);
      f.h = Math.min(640, H - 48);
      f.x = Math.max(110, Math.min(140, W - f.w - 20));
      f.y = 20;
      t.w = Math.min(520, W * 0.4);
      t.h = Math.min(300, H * 0.42);
      t.x = W - t.w - 24;
      t.y = H - t.h - 24;
    }
    for (const o of [f, t]) {
      o.w = Math.min(o.w, W - 20);
      o.h = Math.min(o.h, H - 20);
      o.x = Math.max(0, Math.min(o.x, W - 80));
      o.y = Math.max(0, Math.min(o.y, H - 40));
    }
    state.laidOut = true;
  }

  function render() {
    const { mode } = state;
    root!.dataset.mode = mode;
    const sec = current();

    // Windows
    const showFiles =
      mode === 'desktop' ? state.wins.files.open && !state.wins.files.min : mode === 'tablet' ? state.tab !== 'terminal' : !!state.phone && state.phone !== 'terminal';
    const showTerm =
      mode === 'desktop' ? state.wins.term.open && !state.wins.term.min : mode === 'tablet' ? state.tab === 'terminal' : state.phone === 'terminal';
    wins.files.hidden = !showFiles;
    wins.term.hidden = !showTerm;

    for (const id of ['files', 'term'] as WinId[]) {
      const w = state.wins[id];
      const el = wins[id];
      el.style.setProperty('--x', `${w.x}px`);
      el.style.setProperty('--y', `${w.y}px`);
      el.style.setProperty('--w', `${w.w}px`);
      el.style.setProperty('--h', `${w.h}px`);
      el.style.setProperty('--z', String(10 + state.z.indexOf(id)));
      el.toggleAttribute('data-top', top() === id);
      el.toggleAttribute('data-max', w.max);
      const max = el.querySelector('[data-win-action="max"]');
      max?.setAttribute('aria-pressed', String(w.max));
    }

    // Panels
    $$('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== sec));

    // Titles, path and status
    const info = sec ? meta[sec] : undefined;
    const filesTitle = `Files: ${info ? info.file : 'bladzv'}`;
    $$('[data-files-title]').forEach((e) => (e.textContent = filesTitle));
    $('.path-tail').textContent = info ? `/${info.file}` : '';
    $('.files-status').textContent = info ? `${info.label} · ${info.desc}` : `${Object.keys(meta).length} items`;
    $<HTMLButtonElement>('.files-back').disabled = !state.hist.length;

    // Active navigation
    const navSec = mode === 'desktop' ? state.path : state.tab;
    $$('[data-nav]').forEach((b) => {
      if (b.dataset.nav === navSec) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });

    // Taskbar
    $$('[data-task]').forEach((b) => {
      const id = b.dataset.task as WinId;
      const w = state.wins[id];
      b.hidden = !w.open;
      b.toggleAttribute('data-active', top() === id && !w.min);
      b.toggleAttribute('data-min', w.min);
    });

    // Tablet / phone chrome
    const paneSec = mode === 'tablet' ? state.tab : state.phone;
    $('.pane-title').textContent = paneSec ? label(paneSec) : '';
    $('.pane-path').textContent = paneSec ? `~/${paneSec}` : '';
    $('.pane-head').hidden = mode === 'phone' && !state.phone;
    $('#phone-home').hidden = mode === 'phone' && !!state.phone;

    $('.toast').hidden = !state.toast || dialog.open;
  }

  function focusWin(id: WinId) {
    if (top() !== id) state.z = [...state.z.filter((x) => x !== id), id];
  }

  function show(id: WinId) {
    Object.assign(state.wins[id], { open: true, min: false });
    focusWin(id);
    render();
    if (id === 'term') focusTerm();
  }

  function focusTerm() {
    setTimeout(() => $<HTMLInputElement>('#term-in').focus({ preventScroll: true }), 0);
  }

  function scrollTop() {
    const s = $('.files-scroll');
    s.scrollTop = 0;
  }

  /** After opening a section on tablet or phone, move focus to its heading. */
  function focusPane() {
    if (state.mode === 'desktop') return;
    setTimeout(() => $('.pane-title').focus({ preventScroll: true }), 0);
  }

  function openSection(id: string) {
    state.toast = false;
    if (state.mode === 'desktop') {
      if (id === 'terminal') return show('term');
      if (state.path !== id) state.hist.push(state.path);
      state.path = id;
      show('files');
      scrollTop();
      return;
    }
    if (state.mode === 'tablet') state.tab = id === 'home' ? 'about' : id;
    else state.phone = id === 'home' ? null : id;
    render();
    scrollTop();
    if (id === 'terminal') focusTerm();
    else focusPane();
  }

  function goBack() {
    const prev = state.hist.pop();
    if (prev === undefined) return;
    state.path = prev;
    render();
    scrollTop();
  }

  function winAction(id: WinId, action: string) {
    const w = state.wins[id];
    if (action === 'min') w.min = true;
    if (action === 'max') w.max = !w.max;
    if (action === 'close') w.open = false;
    render();
  }

  function taskClick(id: WinId) {
    const w = state.wins[id];
    if (w.min) return show(id);
    if (top() === id) w.min = true;
    else focusWin(id);
    render();
  }

  async function copyEmail(btn: HTMLButtonElement) {
    try {
      await navigator.clipboard.writeText(btn.dataset.copyEmail!);
      btn.textContent = 'copied ✓';
      btn.classList.add('text-cyber-green!');
    } catch {
      btn.textContent = 'copy failed';
    }
    setTimeout(() => {
      btn.textContent = 'copy email address';
      btn.classList.remove('text-cyber-green!');
    }, 1500);
  }

  // Dragging and resizing (desktop only, pointer only)
  function drag(id: WinId, e: PointerEvent) {
    const w = state.wins[id];
    if (w.max || e.button > 0 || (e.target as Element).closest('button')) return;
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = w.x;
    const oy = w.y;
    const r = stage.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      w.x = Math.max(-w.w + 120, Math.min(r.width - 120, ox + ev.clientX - sx));
      w.y = Math.max(0, Math.min(r.height - 34, oy + ev.clientY - sy));
      render();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  function resize(id: WinId, dir: string, e: PointerEvent) {
    const w = state.wins[id];
    if (w.max || e.button > 0) return;
    e.stopPropagation();
    e.preventDefault();
    focusWin(id);
    const sx = e.clientX;
    const sy = e.clientY;
    const o = { ...w };
    const r = stage.getBoundingClientRect();
    const minW = id === 'term' ? 320 : 420;
    const minH = id === 'term' ? 180 : 260;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (dir.includes('e')) w.w = Math.max(minW, Math.min(r.width - o.x, o.w + dx));
      if (dir.includes('s')) w.h = Math.max(minH, Math.min(r.height - o.y, o.h + dy));
      if (dir.includes('w')) {
        const nw = Math.max(minW, Math.min(o.x + o.w, o.w - dx));
        w.w = nw;
        w.x = o.x + o.w - nw;
      }
      if (dir.includes('n')) {
        const nh = Math.max(minH, Math.min(o.y + o.h, o.h - dy));
        w.h = nh;
        w.y = o.y + o.h - nh;
      }
      render();
    };
    const up = () => {
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  // Events
  root.addEventListener('click', (e) => {
    const t = e.target as Element;
    const open = t.closest<HTMLElement>('[data-open]');
    if (open) return openSection(open.dataset.open!);
    const copy = t.closest<HTMLButtonElement>('[data-copy-email]');
    if (copy) return copyEmail(copy);
    const modeLink = t.closest<HTMLElement>('[data-mode-link]');
    if (modeLink) return setMode('simple');
    const task = t.closest<HTMLElement>('[data-task]');
    if (task) return taskClick(task.dataset.task as WinId);
    const winBtn = t.closest<HTMLElement>('[data-win-action]');
    if (winBtn) return winAction(winBtn.closest<HTMLElement>('[data-win]')!.dataset.win as WinId, winBtn.dataset.winAction!);
    const action = t.closest<HTMLElement>('[data-action]')?.dataset.action;
    if (action === 'home') openSection('home');
    else if (action === 'files') show('files');
    else if (action === 'term') show('term');
    else if (action === 'back') goBack();
    else if (action === 'phone-back') openSection('home');
    else if (action === 'dismiss-toast') {
      state.toast = false;
      render();
    } else if (action === 'dismiss-dialog') dialog.close();
  });

  root.addEventListener('pointerdown', (e) => {
    if (state.mode !== 'desktop') return;
    const t = e.target as Element;
    const win = t.closest<HTMLElement>('[data-win]');
    if (!win) return;
    const id = win.dataset.win as WinId;
    const handle = t.closest<HTMLElement>('[data-resize]');
    if (handle) return resize(id, handle.dataset.resize!, e);
    if (top() !== id) {
      focusWin(id);
      render();
    }
    if (t.closest('[data-drag]')) drag(id, e);
  });

  root.addEventListener('dblclick', (e) => {
    const bar = (e.target as Element).closest<HTMLElement>('[data-drag]');
    if (bar && state.mode === 'desktop') winAction(bar.dataset.drag as WinId, 'max');
  });

  // Clicking anywhere in the terminal (without selecting text) focuses the prompt.
  wins.term.addEventListener('click', (e) => {
    if ((e.target as Element).closest('button, a')) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) focusTerm();
  });

  dialog.addEventListener('close', () => {
    try {
      sessionStorage.setItem('bladzv-mode-seen', '1');
    } catch {
      // ignore
    }
    render();
  });

  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const mode = modeFor(window.innerWidth);
      const changed = mode !== state.mode;
      state.mode = mode;
      root.dataset.mode = mode;
      if (mode === 'desktop') layoutWindows(state.laidOut && !changed);
      render();
      if (changed) initParticles();
    });
  });

  // Clock
  const tick = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
    $$('[data-clock-time]').forEach((e) => (e.textContent = time));
    $$('[data-clock-date]').forEach((e) => (e.textContent = date));
  };
  tick();
  setInterval(tick, 20000);

  // Start
  layoutWindows();
  initTerminal({
    out: $('.term-out'),
    form: $<HTMLFormElement>('.term-form'),
    input: $<HTMLInputElement>('#term-in'),
    open: openSection,
  });
  initNotes($('[data-os-notes]'), {
    hash: false,
    copyLabel: 'copy',
    copiedLabel: 'copied ✓',
    onOpen: () => {
      $('.os-notes-main').scrollTop = 0;
      scrollTop();
    },
  });
  render();
  initParticles();
  typewriter(taglines);

  let seen = false;
  try {
    seen = !!sessionStorage.getItem('bladzv-mode-seen');
  } catch {
    seen = true;
  }
  if (!seen) dialog.showModal();
  render();
  if (state.mode === 'desktop' && !dialog.open) focusTerm();
}
