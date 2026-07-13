import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { defineConfig } from "vite";

const rootDir = dirname(fileURLToPath(import.meta.url));
const cleanRoutes = {
  "/product-list": "product-list.html",
  "/product-detail": "product-detail.html",
  "/cart": "cart.html",
  "/checkout": "checkout.html",
  "/orders": "orders.html",
  "/search": "search.html",
  "/admin": "admin.html",
  "/admin/products": "admin.html",
  "/admin/categories": "admin.html",
  "/admin/inventory": "admin.html",
  "/admin/orders": "admin.html",
  "/admin/users": "admin.html",
  "/admin/reviews": "admin.html",
  "/admin/banners": "admin.html",
  "/admin/stats": "admin.html"
};

function cleanUrlDevPlugin() {
  return {
    name: "goodform-clean-url-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || "").split("?")[0];

        if (url === "/styles.css") {
          res.setHeader("Content-Type", "text/css; charset=utf-8");
          res.end(readFileSync(resolve(rootDir, "styles.css"), "utf8"));
          return;
        }

        const target = cleanRoutes[url];

        if (!target) {
          next();
          return;
        }

        const filePath = resolve(rootDir, target);
        if (!existsSync(filePath)) {
          next();
          return;
        }

        const html = await server.transformIndexHtml(url, readFileSync(filePath, "utf8"));
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(html);
      });
    }
  };
}

export default defineConfig({
  root: rootDir,
  plugins: [cleanUrlDevPlugin()],
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



