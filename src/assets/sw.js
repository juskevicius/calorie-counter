const cacheName = 'v1';

const appShellFiles = ['/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(appShellFiles);
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const resource = await caches.match(event.request);
      if (resource) {
        return resource;
      }
      const response = await fetch(event.request);
      const cache = await caches.open(cacheName);
      cache.put(event.request, response.clone());
      return response;
    })(),
  );
});
