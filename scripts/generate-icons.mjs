/**
 * Generate PWA PNG icons from the SVG source.
 * Usage: node scripts/generate-icons.mjs
 * Requires: sharp (already installed via next)
 */
import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const svgBuffer = readFileSync(join(publicDir, "icon.svg"));

const sizes = [192, 512];

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, `icon-${size}.png`));
  console.log(`Generated icon-${size}.png`);
}

// Also generate apple-touch-icon (180x180)
await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(join(publicDir, "apple-touch-icon.png"));
console.log("Generated apple-touch-icon.png");

// Favicon 32x32
await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(join(publicDir, "favicon-32.png"));
console.log("Generated favicon-32.png");

console.log("Done!");
