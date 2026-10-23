import { getCollection, type CollectionEntry } from 'astro:content';
import { noteFolders } from '../data/notes';

export type Note = CollectionEntry<'notes'>;
type Block = Note['data']['blocks'][number];

const folderIndex = (f: string) => {
  const i = noteFolders.findIndex(([name]) => name === f);
  return i === -1 ? noteFolders.length : i;
};

/** Notes in folder order, then by `order`; plus the folder list with colors. */
export async function getNotes() {
  const notes = (await getCollection('notes')).sort(
    (a, b) => folderIndex(a.data.folder) - folderIndex(b.data.folder) || a.data.order - b.data.order
  );
  const extra = [...new Set(notes.map((n) => n.data.folder).filter((f) => folderIndex(f) === noteFolders.length))];
  const folders = [...noteFolders, ...extra.map((f): [string, string] => [f, '#8b949e'])].map(([name, color]) => ({
    name,
    color,
    notes: notes.filter((n) => n.data.folder === name),
  }));
  return { notes, folders };
}

/** Lowercased searchable text of one block. */
export const blockText = (b: Block) =>
  [b.sub, b.h, b.p, b.how, b.code, b.out, b.tip, ...(b.items ?? []), ...(b.rows ?? []).map((r) => [r.k, r.v, r.w].join(' '))]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

/** Lowercased searchable text of a note's title, tags and intro. */
export const noteText = (n: Note) => [n.data.title, ...n.data.tags, n.data.intro ?? ''].join(' ').toLowerCase();
