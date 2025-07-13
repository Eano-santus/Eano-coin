const CACHE_NAME = 'eano-cache-v1';
const urlsToCache = [
  '/',
  '/dashboard.html',
  '/style.css',
  '/firebase.js',
  '/auth.js',
  '/dashboard-extras.js',
  '/ui.js',
  '/favicon.ico',
  '/manifest.json',
  // add images or avatar assets as needed
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
