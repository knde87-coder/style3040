import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html"),
        cart: resolve(__dirname, "cart.html"),
        checkout: resolve(__dirname, "checkout.html"),
        orders: resolve(__dirname, "orders.html"),
        productDetail: resolve(__dirname, "product-detail.html"),
        productList: resolve(__dirname, "product-list.html"),
        search: resolve(__dirname, "search.html")
      }
    }
  }
});

