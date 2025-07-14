const CACHE_NAME = "eano-cache-v1";
const OFFLINE_URL = "offline.html";

const FILES_TO_CACHE = [
  "/eano-coin/",
  "/eano-coin/index.html",
  "/eano-coin/chat.html",
  "/eano-coin/dashboard.html",
  "/eano-coin/profile.html",
  "/eano-coin/team.html",
  "/eano-coin/leaderboard.html",
  "/eano-coin/settings.html",
  "/eano-coin/style.css",
  "/eano-coin/chat.js",
  "/eano-coin/ui.js",
  "/eano-coin/firebase.js",
  "/eano-coin/sounds/notify.mp3",
  "/eano-coin/eano-icon-192.png",
  "/eano-coin/manifest.json",
  "/eano-coin/offline.html"
];

// ✅ Install: cache files
self.addEventListener("install", (event) => {
  console.log("🛠️ Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching app shell...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ✅ Activate: cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("⚙️ Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🧹 Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ✅ Fetch: serve from cache if offline
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((response) => {
        return response || caches.match(OFFLINE_URL);
      })
    )
  );
});
