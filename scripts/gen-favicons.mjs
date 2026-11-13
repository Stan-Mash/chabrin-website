/**
 * gen-favicons.mjs
 * Generates all favicon / app-icon sizes from /public/logo-icon.png
 * with a solid #FFFFFF background and 14% safe-zone padding.
 *
 * Run:  node scripts/gen-favicons.mjs
 * Requires: sharp  (already in project dependencies)
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT    = path.resolve(__dirname, "..");
const PUBLIC  = path.join(ROOT, "public");
const LOGO    = path.join(PUBLIC, "logo-icon.png");

// Source metadata
const { width: SRC_W, height: SRC_H } = await sharp(LOGO).metadata();
const ASPECT = SRC_H / SRC_W;          // ≈ 0.929 for the CAL emblem

/**
 * Composite the CAL logo centred on a solid-white square canvas.
 * logoWidth = size * 0.72  (14% padding each side → 72% coverage)
 */
async function makeIcon(size) {
  const logoW  = Math.round(size * 0.72);
  const logoH  = Math.round(logoW * ASPECT);
  const left   = Math.round((size - logoW) / 2);
  const top    = Math.round((size - logoH) / 2);

  const resized = await sharp(LOGO)
    .resize(logoW, logoH, { fit: "fill" })
    .toBuffer();

  return sharp({
    create: {
      width:      size,
      height:     size,
      channels:   3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: resized, left, top }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Wrap an array of PNG buffers as a valid multi-image .ico */
function buildIco(entries) {
  // entries: [{ size, buf }]  size = 48 | 32 | 16
  const count      = entries.length;
  const dirBytes   = 6 + count * 16;
  let   dataOffset = dirBytes;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = ICO
  header.writeUInt16LE(count, 4);

  const dirs = entries.map(({ size, buf }) => {
    const d = Buffer.alloc(16);
    d.writeUInt8(size === 256 ? 0 : size, 0); // width  (0 means 256)
    d.writeUInt8(size === 256 ? 0 : size, 1); // height
    d.writeUInt8(0,  2); // colour count
    d.writeUInt8(0,  3); // reserved
    d.writeUInt16LE(1,  4); // colour planes
    d.writeUInt16LE(32, 6); // bits per pixel (hint; PNG stores its own depth)
    d.writeUInt32LE(buf.length, 8);
    d.writeUInt32LE(dataOffset, 12);
    dataOffset += buf.length;
    return d;
  });

  return Buffer.concat([header, ...dirs, ...entries.map((e) => e.buf)]);
}

console.log("Generating favicons from:", LOGO);
console.log(`Source: ${SRC_W}×${SRC_H} (aspect ${ASPECT.toFixed(4)})\n`);

// ── PNG icons ────────────────────────────────────────────────────────────────
const specs = [
  { size: 512, name: "icon.png"             },
  { size: 192, name: "icon-192.png"         },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 96,  name: "icon-96.png"          },
  { size: 48,  name: "icon-48.png"          },
];

for (const { size, name } of specs) {
  const buf = await makeIcon(size);
  fs.writeFileSync(path.join(PUBLIC, name), buf);
  console.log(`✓  ${name.padEnd(28)} ${size}×${size} px  (${buf.length} bytes)`);
}

// ── favicon.ico (3-size: 48, 32, 16) ─────────────────────────────────────────
const ico = buildIco([
  { size: 48, buf: await makeIcon(48) },
  { size: 32, buf: await makeIcon(32) },
  { size: 16, buf: await makeIcon(16) },
]);
fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), ico);
console.log(`✓  favicon.ico                   (48/32/16 px layers, ${ico.length} bytes)`);

// ── icon.svg  (white square + embedded PNG for universal fallback) ────────────
const icon192buf = fs.readFileSync(path.join(PUBLIC, "icon-192.png"));
const b64        = icon192buf.toString("base64");
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="64" fill="#FFFFFF"/>
  <image x="72" y="38" width="368" height="436"
         xlink:href="data:image/png;base64,${b64}"/>
</svg>`;
fs.writeFileSync(path.join(PUBLIC, "icon.svg"), svgContent, "utf8");
console.log(`✓  icon.svg                       (512×512 white rect + embedded 192px PNG)`);

console.log("\nDone — all icons written to /public");
