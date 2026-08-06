const CACHE_NAME = 'cortina-aberta-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/galeria.html',
  '/historico.html',
  '/presskit.html',
  '/assets/js/main.js',
  '/assets/presskit/data.json',
  '/assets/images/placeholder/image-placeholder.svg'
];

// Instalação do Service Worker e salvamento no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições (Cache First, com fallback para rede)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});