import { copyFile, cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const files = [
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "styles.css",
  "vercel.json",
  "firebase.json",
  "firestore.rules",
  "storage.rules",
  "admin.js",
  "app.js",
  "cart.js",
  "catalog.js",
  "checkout.js",
  "detail.js",
  "firebase-config.js",
  "firebase-store.js",
  "home.js",
  "integration-config.js",
  "orders.js",
  "search.js",
  "shop-data.js",
  "sw.js"
];

await mkdir(dist, { recursive: true });

for (const file of files) {
  await mkdir(dirname(join(dist, file)), { recursive: true });
  await copyFile(join(root, file), join(dist, file));
}

await cp(join(root, "assets"), join(dist, "assets"), { recursive: true });
const adminRoutes = [
  "products",
  "categories",
  "inventory",
  "orders",
  "users",
  "reviews",
  "banners",
  "stats"
];

for (const route of adminRoutes) {
  const routeDir = join(dist, "admin", route);
  await mkdir(routeDir, { recursive: true });
  await copyFile(join(root, "admin.html"), join(routeDir, "index.html"));
}
