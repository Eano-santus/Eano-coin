// service-worker.js
const CACHE_NAME = "eano-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/dashboard.html",
  "manifest.json",
  "announcement-image.jpg",
  "/style.css",
  "/lang.js",
  "/ui.js",
  "/eano-icon-192.png",
  "/eano-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request);
    })
  );
});
