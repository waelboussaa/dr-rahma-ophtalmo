import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const src = "C:/Users/waelb/.gemini/antigravity-ide/brain/f6677139-6f13-4373-9086-2e42d54cb5b0/.user_uploaded/media_1790108601918.png";

// 1. Copy raw file
fs.copyFileSync(src, path.join(root, "public/brand/logo.png"));
fs.copyFileSync(src, path.join(root, "public/brand/logo-original.png"));

// 2. Build transparent high-res PNG
const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
const bgR = 249, bgG = 242, bgB = 234;
const out = Buffer.alloc(info.width * info.height * 4);

for (let i = 0; i < info.width * info.height; i++) {
  const r = data[i * 4];
  const g = data[i * 4 + 1];
  const b = data[i * 4 + 2];
  
  const diff = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));
  
  let alpha = 255;
  if (diff < 14) {
    alpha = 0;
  } else if (diff < 38) {
    alpha = Math.round(((diff - 14) / (38 - 14)) * 255);
  }
  
  const x = i % info.width;
  const y = Math.floor(i / info.width);
  const distFromPupil = Math.hypot(x - 49, y - 43);
  if (distFromPupil < 5 && r > 210 && g > 210 && b > 210) {
    alpha = 255;
  }
  
  out[i * 4] = r;
  out[i * 4 + 1] = g;
  out[i * 4 + 2] = b;
  out[i * 4 + 3] = alpha;
}

await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .toFile(path.join(root, "public/brand/logo-transparent.png"));

// 3. Crisp upscaled transparent versions
await sharp(path.join(root, "public/brand/logo-transparent.png"))
  .resize(256, 256, { kernel: "lanczos3", fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(root, "public/brand/logo-256.png"));

await sharp(path.join(root, "public/brand/logo-transparent.png"))
  .resize(512, 512, { kernel: "lanczos3", fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(root, "public/brand/logo-512.png"));

await sharp(path.join(root, "public/brand/logo-256.png"))
  .webp({ quality: 95 })
  .toFile(path.join(root, "public/brand/logo.webp"));

// 4. Update Favicon SVG with clean transparent logo on cream background
const logoB64 = fs.readFileSync(path.join(root, "public/brand/logo-transparent.png")).toString("base64");
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#f8f5ef"/>
  <image href="data:image/png;base64,${logoB64}" x="5" y="5" width="54" height="54" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
fs.writeFileSync(path.join(root, "public/brand/favicon.svg"), faviconSvg);

// 5. Update Apple touch icon and app icons
await sharp(Buffer.from(faviconSvg))
  .resize(180, 180)
  .png()
  .toFile(path.join(root, "public/brand/apple-touch-icon.png"));

await sharp(Buffer.from(faviconSvg))
  .resize(192, 192)
  .png()
  .toFile(path.join(root, "public/brand/icon-192.png"));

await sharp(Buffer.from(faviconSvg))
  .resize(512, 512)
  .png()
  .toFile(path.join(root, "public/brand/icon-512.png"));

console.log("Brand assets generated successfully!");
