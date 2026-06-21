import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG_DIR = join(ROOT, 'public/images/blog');
const LOGO_PATH = join(ROOT, 'public/images/logos/logo.svg');
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;
const LOGO_RATIO = 0.035;
const OPACITY = 0.55;
const MARGIN = 20;

async function findCovers(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const byDir = {};
  const subdirs = [];

  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      subdirs.push(full);
    } else if (/^cover\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
      const ext = entry.name.split('.').pop().toLowerCase();
      byDir[dir] = byDir[dir] || [];
      byDir[dir].push({ ext, full });
    }
  }

  const covers = [];
  for (const [, files] of Object.entries(byDir)) {
    const source = files.find((f) => f.ext !== 'webp') || files[0];
    covers.push(source.full);
  }

  for (const sub of subdirs) {
    covers.push(...(await findCovers(sub)));
  }
  return covers;
}

async function buildLogo(logoWidth) {
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(logoWidth)
    .ensureAlpha()
    .linear([1, 1, 1, OPACITY], [0, 0, 0, 0])
    .png()
    .toBuffer();
  return logoBuffer;
}

async function watermark(coverPath) {
  const logoWidth = Math.round(TARGET_WIDTH * LOGO_RATIO);
  const logoBuffer = await buildLogo(logoWidth);
  const logoMeta = await sharp(logoBuffer).metadata();

  const left = TARGET_WIDTH - logoMeta.width - MARGIN;
  const top = TARGET_HEIGHT - logoMeta.height - MARGIN;

  const outPath = coverPath.replace(/\.(png|jpg|jpeg|webp)$/i, '.webp');

  await sharp(coverPath)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover', position: 'center' })
    .composite([{ input: logoBuffer, left, top }])
    .webp({ quality: 85 })
    .toFile(outPath + '.tmp');

  const { rename } = await import('fs/promises');
  await rename(outPath + '.tmp', outPath);

  console.log(`✓ ${outPath.replace(ROOT, '')}`);
}

async function main() {
  const covers = await findCovers(BLOG_DIR);
  if (covers.length === 0) {
    console.log('No cover images found.');
    return;
  }

  for (const cover of covers) {
    await watermark(cover);
  }
  console.log(`\nDone. ${covers.length} image(s) processed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
