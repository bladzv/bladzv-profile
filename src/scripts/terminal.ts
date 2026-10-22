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
const AMBER = '#fbbf24';
const MAX_LINES = 60;
const APPS = ['about', 'route', 'projects', 'training', 'writeups', 'notes', 'contact'];
const HELP = [
  'whoami         who is this?',
  'ls             list my profile files',
  'open <name>    open a file, e.g. open projects',
  'sudo hire-me   get in touch',
  'system-cleaner free up disk space',
  'clear          clear the screen',
].join('\n');

type Os = 'windows' | 'mac' | 'linux';

/** system-cleaner: a security-awareness joke. The "cleanup" command only echoes a message. */
const JOKE = 'You just ran a command from a stranger on the internet. Lesson 1 of security awareness: never do that. Hire me:';
const jokeCommand = (os: Os, email: string) => (os === 'windows' ? `echo ${JOKE} ${email}` : `echo "${JOKE} ${email}"`);
const OPEN_TERMINAL: Record<Os, string> = {
  windows: '1. press Win + R, type cmd, press Enter\n2. paste the command below, press Enter',
  mac: '1. press Cmd + Space, type Terminal, press Enter\n2. paste the command below, press Enter',
  linux: '1. press Ctrl + Alt + T to open a terminal\n2. paste the command below, press Enter',
};
const pickOs = (c: string): Os | null =>
  /^(1|win|windows)$/.test(c) ? 'windows' : /^(2|mac|macos|osx)$/.test(c) ? 'mac' : /^(3|linux)$/.test(c) ? 'linux' : null;

export function initTerminal(o: TerminalOptions) {
  const scroller = o.form.parentElement!;
  let askingOs = false;
  let jokeCmd = '';

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
    if (c === 'clear') {
      askingOs = false;
      return o.out.replaceChildren();
    }
    print(`guest@${person.handle}:~$ ${cmd}`, WHITE);
    if (askingOs && c) {
      const os = pickOs(c);
      if (!os) return print('pick 1, 2 or 3 (or type windows / mac / linux)', ERR);
      askingOs = false;
      jokeCmd = jokeCommand(os, person.email);
      print(`Scanning ${os} for junk files… 4.2 GB found.\nTo clean it up:\n${OPEN_TERMINAL[os]}\n`, GREY);
      print(jokeCmd, AMBER);
      return print('\ntype "copy" to copy it.', GREY);
    }
    if (c === 'system-cleaner' || c === 'system cleaner') {
      askingOs = true;
      return print('bladzOS Optimizer. Which OS are you on?\n  1) windows\n  2) mac\n  3) linux', GREY);
    }
    if (c === 'copy' && jokeCmd) {
      navigator.clipboard?.writeText(jokeCmd).catch(() => {});
      return print('copied ✓  (you did not even check what it does...)', OK);
    }
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
