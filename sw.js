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
  '/icons/icon-192.png',
  '/icons/icon-512.png'
  // Add any other static assets (e.g. images, fonts, avatars) here
];

self.addEventListener('install', event => {
  console.log('✅ Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching app shell...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('❌ Error during caching:', err))
  );
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', event => {
  console.log('⚡ Service Worker activated.');
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('🧹 Removing old cache:', key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim(); // Take control immediately
});

self.addEventListener('fetch', event => {
  // Cache-first, then network fallback
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
