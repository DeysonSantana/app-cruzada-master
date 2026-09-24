/**
 * Service Worker do CruzadaMaster (PWA Offline-First)
 * Permite que o jogo funcione 100% offline sem conexão com a internet.
 */

const CACHE_NAME = 'cruzadamaster-v1.0.0';

const STATIC_ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './js/audio.js',
  './js/crosswordEngine.js',
  './js/puzzles.js',
  './js/gridRenderer.js',
  './js/inputController.js',
  './js/themeManager.js',
  './js/offlineManager.js',
  './js/shareManager.js',
  './js/aiService.js'
];

// 1. Instalação: Pre-cache de todos os arquivos estáticos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching arquivos do CruzadaMaster...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Ativação: Limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removendo cache obsoleto:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Estratégia de Fetch: Cache-First com Fallback para Network
self.addEventListener('fetch', (event) => {
  // Ignora requisições de outras origens não-GET ou da API do Gemini
  if (event.request.method !== 'GET' || event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Se falhar e for navegação, retorna a página inicial
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
