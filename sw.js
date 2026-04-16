// Service Worker para Gabriel_CodaExpress
const REPO_NAME = 'Gabriel_CodaExpress';
const CACHE_NAME = 'pwa-cache-v1';

const urlsToCache = [
  `/${REPO_NAME}/`,
  `/${REPO_NAME}/index.html`,
  `/${REPO_NAME}/offline.html`,
  `/${REPO_NAME}/manifest.json`,
  `/${REPO_NAME}/favicon.ico`,
  `/${REPO_NAME}/favicon.svg`,
  `/${REPO_NAME}/favicon-16x16.png`,
  `/${REPO_NAME}/favicon-32x32.png`,
  `/${REPO_NAME}/favicon-48x48.png`,
  `/${REPO_NAME}/android-chrome-192x192.png`,
  `/${REPO_NAME}/android-chrome-512x512.png`,
  `/${REPO_NAME}/icono-touch-apple-152x152.png`,
  `/${REPO_NAME}/icono-touch-apple-167x167.png`,
  `/${REPO_NAME}/icono-touch-apple-180x180.png`,
  `/${REPO_NAME}/pestaña-fijada-de-safari.svg`
];

self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match(`/${REPO_NAME}/offline.html`);
          }
        });
      })
  );
});
