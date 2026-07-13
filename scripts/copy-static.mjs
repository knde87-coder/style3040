import { copyFile, cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const files = [
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "vercel.json",
  "firebase.json",
  "firestore.rules",
  "storage.rules"
];

await mkdir(dist, { recursive: true });

for (const file of files) {
  await mkdir(dirname(join(dist, file)), { recursive: true });
  await copyFile(join(root, file), join(dist, file));
}

await cp(join(root, "assets"), join(dist, "assets"), { recursive: true });
