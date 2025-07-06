const CACHE_NAME = 'eano-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/dashboard.js',
  '/style.css',
  '/favicon.ico',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
];

self.addEventListener('install', event => {
  console.log('[SW] Installing and caching app shell');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activated');
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      return caches.match('/offline.html');
    })
  );
});
