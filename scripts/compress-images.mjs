import sharp from "sharp";
import { existsSync, statSync } from "fs";
import { resolve } from "path";

const assetsDir = resolve("public/assets");

const images = [
  {
    input: `${assetsDir}/school-building-1.jpeg`,
    outputWebp: `${assetsDir}/school-building-1.webp`,
    outputJpeg: `${assetsDir}/school-building-1.jpeg`,
    width: 1600,
    quality: 82,
    label: "About Section Image (school-building-1)",
  },
  {
    input: `${assetsDir}/school-building-2.jpeg`,
    outputWebp: `${assetsDir}/school-building-2.webp`,
    outputJpeg: `${assetsDir}/school-building-2.jpeg`,
    width: 1920,
    quality: 82,
    label: "Hero Background Image (school-building-2)",
  },
];

for (const img of images) {
  if (!existsSync(img.input)) {
    console.warn(`⚠ Skipping (not found): ${img.input}`);
    continue;
  }

  const originalSize = (statSync(img.input).size / 1024 / 1024).toFixed(2);
  console.log(`\nProcessing: ${img.label}`);
  console.log(`  Original: ${originalSize} MB`);

  // Output compressed WebP
  await sharp(img.input)
    .resize({ width: img.width, withoutEnlargement: true })
    .webp({ quality: img.quality })
    .toFile(img.outputWebp);

  const webpSize = (statSync(img.outputWebp).size / 1024 / 1024).toFixed(2);
  console.log(`  WebP output: ${webpSize} MB → ${img.outputWebp}`);

  // Also overwrite the original JPEG with a compressed version (fallback)
  await sharp(img.input)
    .resize({ width: img.width, withoutEnlargement: true })
    .jpeg({ quality: img.quality, progressive: true, mozjpeg: true })
    .toFile(img.outputJpeg + ".optimized.jpg");

  const jpegSize = (
    statSync(img.outputJpeg + ".optimized.jpg").size /
    1024 /
    1024
  ).toFixed(2);
  console.log(
    `  JPEG fallback: ${jpegSize} MB → ${img.outputJpeg}.optimized.jpg`
  );
}

console.log("\n✅ Done! Now update your image src to use .webp files.");
