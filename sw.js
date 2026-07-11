const CACHE = 'wc2026-v3';
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
    ).then(() => self.clients.claim())
  );
});

// Network-first: this app tracks a live tournament, so a fresh result always beats a
// fast cached one. Only fall back to cache (for offline use) when the network fails.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      if(res && res.ok){
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
