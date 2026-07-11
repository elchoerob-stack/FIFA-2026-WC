const CACHE = 'wc2026-v2';
const URL = '/FIFA-2026-WC/wc2026.html';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([URL]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Stale-while-revalidate: serve the cached copy instantly (fast + offline-capable),
// but always fetch a fresh copy in the background so the next load picks up updates
// without waiting on a full service-worker version bump.
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      const network = fetch(e.request).then(res => {
        if(res && res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
