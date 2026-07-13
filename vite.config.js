import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: rootDir,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        admin: resolve(rootDir, "admin.html"),
        cart: resolve(rootDir, "cart.html"),
        checkout: resolve(rootDir, "checkout.html"),
        orders: resolve(rootDir, "orders.html"),
        productDetail: resolve(rootDir, "product-detail.html"),
        productList: resolve(rootDir, "product-list.html"),
        search: resolve(rootDir, "search.html")
      }
    }
  }
});
