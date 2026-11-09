/**
 * The bladzOS terminal: the command set from the design's AppContent.
 * Output is plain text (textContent) only.
 */
import { os, person } from '../data/profile';

interface TerminalOptions {
  out: HTMLElement;
  form: HTMLFormElement;
  input: HTMLInputElement;
  open(id: string): void;
}

const GREY = '#8b949e';
const WHITE = '#e6edf3';
const OK = '#00ff88';
const BLUE = '#79c0ff';
const ERR = '#ff7b72';
const MAX_LINES = 60;
const APPS = ['about', 'route', 'projects', 'training', 'writeups', 'notes', 'contact'];
const HELP = [
  'whoami         who is this?',
  'ls             list my profile files',
  'open <name>    open a file, e.g. open projects',
  'sudo hire-me   get in touch',
  'clear          clear the screen',
].join('\n');

export function initTerminal(o: TerminalOptions) {
  const scroller = o.form.parentElement!;

  function print(t: string, color: string) {
    const row = document.createElement('div');
    row.className = 'whitespace-pre-wrap break-words';
    row.style.color = color;
    row.textContent = t;
    o.out.append(row);
    while (o.out.childElementCount > MAX_LINES) o.out.firstElementChild!.remove();
    // Scroll only the terminal pane; scrollIntoView would also shift the desktop.
    scroller.scrollTop = scroller.scrollHeight;
  }

  function run(cmd: string) {
    const c = cmd.trim().toLowerCase();
    const target = c
      .replace(/^(open|cat|cd)\s+/, '')
      .replace(/\.(txt|log|vcf)$|\/$/g, '')
      .replace(/^(experience|work)$/, 'route');
    if (c === 'clear') return o.out.replaceChildren();
    print(`guest@${person.handle}:~$ ${cmd}`, WHITE);
    if (c === 'help') print(HELP, GREY);
    else if (c === 'whoami') print(os.whoami, OK);
    else if (c === 'ls' || c === 'ls -la') print('about.txt  experience.log  projects/  training/  writeups/  notes/  contact.vcf', BLUE);
    else if (APPS.includes(target)) {
      print(`opening ${target}…`, OK);
      o.open(target);
    } else if (c === 'sudo hire-me' || c === 'sudo hire me') {
      print(`[sudo] password for recruiter: ********\naccess granted ✓  opening your email app → ${person.email}`, OK);
      window.location.href = `mailto:${person.email}`;
    } else if (c) print(`command not found: ${c}  (try "help")`, ERR);
  }

  o.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cmd = o.input.value;
    o.input.value = '';
    run(cmd);
  });

  print('bladzOS terminal. Type "help" to see what you can do.', GREY);
}
