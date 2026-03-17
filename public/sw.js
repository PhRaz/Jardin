const CACHE_NAME = 'jardin-v1';

// Ressources à pré-cacher à l'installation
const PRECACHE_URLS = [
  '/',
  '/offline'
];

// Patterns à ne jamais mettre en cache
const EXCLUDE_PATTERNS = [
  /^\/api\//,          // données Trefle dynamiques
  /mongo-express/,
  /\/_profiler/,
  /\/_wdt/
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignorer les requêtes non-GET et les patterns exclus
  if (event.request.method !== 'GET') return;
  if (EXCLUDE_PATTERNS.some(p => p.test(url.pathname))) return;
  // Ignorer les requêtes cross-origin
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      // Stratégie network-first pour les pages HTML
      if (event.request.headers.get('accept')?.includes('text/html')) {
        return fetch(event.request)
          .then(response => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            return response;
          })
          .catch(() => cached || caches.match('/offline'));
      }

      // Stratégie cache-first pour les assets statiques
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
