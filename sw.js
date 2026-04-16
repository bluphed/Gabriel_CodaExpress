// sw.js - Service Worker con caché básico

const CACHE_NAME = 'mi-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.css',      // si tienes CSS
  '/script.js',       // si tienes JS
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// Instalación: guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación: limpia cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepta las peticiones y sirve desde caché si es posible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos el archivo en caché, lo devolvemos
        if (response) {
          return response;
        }
        // Si no, lo buscamos en la red
        return fetch(event.request).catch(() => {
          // Si la red falla y es una navegación, mostramos offline.html
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});
