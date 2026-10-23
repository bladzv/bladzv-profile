import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

// Renders public/favicon.svg into the PNG and ICO icons referenced by src/layouts/Layout.astro.
const publicDir = path.resolve(process.cwd(), 'public');
const svg = await fs.readFile(path.join(publicDir, 'favicon.svg'));

function render(size, { square = false } = {}) {
  let source = svg;
  // Touch and manifest icons get masked by the OS, so fill the corners instead of leaving them transparent.
  if (square) source = Buffer.from(svg.toString().replace(/ rx="[\d.]+"/, ''));
  return sharp(source, { density: (72 * size) / 32 }).resize(size, size).png().toBuffer();
}

/** Packs PNG images into an ICO container (supported by every current browser). */
function toIco(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, entry);
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((img) => img.data)]);
}

const icoSizes = [16, 32, 48];
const ico = toIco(await Promise.all(icoSizes.map(async (size) => ({ size, data: await render(size) }))));
await fs.writeFile(path.join(publicDir, 'favicon.ico'), ico);

const pngs = [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];
for (const [name, size] of pngs) {
  await fs.writeFile(path.join(publicDir, name), await render(size, { square: true }));
}

console.log(`Wrote favicon.ico (${icoSizes.join(', ')}) and ${pngs.map(([name]) => name).join(', ')}`);
