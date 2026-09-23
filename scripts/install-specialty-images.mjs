import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public/specialties");
fs.mkdirSync(outDir, { recursive: true });

const brainDir = "C:/Users/waelb/.gemini/antigravity-ide/brain/f6677139-6f13-4373-9086-2e42d54cb5b0";

const mapping = [
  { id: "consultation", file: "spec_consultation_1790108904477.jpg" },
  { id: "cataracte", file: "spec_cataracte_1790108927096.jpg" },
  { id: "refractive", file: "spec_refractive_1790108943173.jpg" },
  { id: "cornee", file: "spec_cornee_1790108966473.jpg" },
  { id: "retine-glaucome", file: "spec_retine_1790108984464.jpg" },
  { id: "pediatrie", file: "spec_pediatrie_1790109004375.jpg" },
];

for (const { id, file } of mapping) {
  const src = path.join(brainDir, file);
  if (!fs.existsSync(src)) {
    console.error(`Missing ${src}`);
    continue;
  }

  // 1. WebP (560x700, 4:5 aspect ratio)
  await sharp(src)
    .resize(560, 700, { fit: "cover", position: "center" })
    .webp({ quality: 88 })
    .toFile(path.join(outDir, `${id}.webp`));

  // 2. AVIF (560x700)
  await sharp(src)
    .resize(560, 700, { fit: "cover", position: "center" })
    .avif({ quality: 80 })
    .toFile(path.join(outDir, `${id}.avif`));

  // 3. JPEG fallback (560x700)
  await sharp(src)
    .resize(560, 700, { fit: "cover", position: "center" })
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, `${id}.jpg`));

  console.log(`✓ Processed ${id} (.webp, .avif, .jpg)`);
}

console.log("All 6 real specialty images installed successfully!");
