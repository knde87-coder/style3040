const CACHE_NAME = "goodform-v2";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/product-list.html",
  "/product-detail.html",
  "/cart.html",
  "/checkout.html",
  "/orders.html",
  "/search.html",
  "/admin.html",
  "/styles.css",
  "/shop-data.js",
  "/catalog.js",
  "/detail.js",
  "/cart.js",
  "/checkout.js",
  "/orders.js",
  "/search.js",
  "/admin.js",
  "/integration-config.js",
  "/manifest.webmanifest",
  "/assets/icon-192.svg",
  "/assets/icon-512.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match("/index.html")))
  );
});


