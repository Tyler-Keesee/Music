'use strict';
const CACHE_NAME = 'music-player-v3';
const SCOPE = self.registration.scope;
const shell = ['index.html', 'style.css', 'manifest.json', 'app-icon.svg']
  .map(path => new URL(path, SCOPE).href);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(shell))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(name => name.startsWith('music-player-') && name !== CACHE_NAME)
        .map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(SCOPE)) return;

  // Do not cache videos/audio as if they were complete files when they may be
  // Git LFS pointers or 206 Partial Content. Imported files use IndexedDB.
  if (request.destination === 'audio' || request.destination === 'video' ||
      request.headers.has('range')) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(new URL('index.html', SCOPE).href)) || Response.error();
    }));
    return;
  }

  event.respondWith(caches.match(request).then(async cached => {
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.status === 200 &&
        ['style', 'script', 'image', 'manifest', 'font'].includes(request.destination)) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  }));
});
