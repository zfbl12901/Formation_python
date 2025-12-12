// Service Worker pour le mode hors ligne
const CACHE_NAME = 'formation-python-v1'
const RUNTIME_CACHE = 'formation-python-runtime-v1'

// Déterminer le base path depuis l'URL du Service Worker
const getBasePath = () => {
  const swUrl = self.location.pathname
  // Si le Service Worker est dans /Formation_python/sw.js, le base path est /Formation_python/
  if (swUrl.includes('/Formation_python/')) {
    return '/Formation_python/'
  }
  return '/'
}

const BASE_PATH = getBasePath()

// Fichiers à mettre en cache au moment de l'installation
const PRECACHE_URLS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'icon-192.png',
  BASE_PATH + 'icon-512.png'
]

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache ouvert')
        return cache.addAll(PRECACHE_URLS)
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.error('Service Worker: Erreur lors de la mise en cache', err)
      })
  )
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
          })
          .map((cacheName) => {
            console.log('Service Worker: Suppression du cache', cacheName)
            return caches.delete(cacheName)
          })
      )
    })
    .then(() => self.clients.claim())
  )
})

// Stratégie: Network First, puis Cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return
  }

  // Ignorer les requêtes vers l'API (elles doivent toujours être en ligne)
  if (event.request.url.includes('/api/')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Vérifier si la réponse est valide
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Cloner la réponse pour la mettre en cache
        const responseToCache = response.clone()

        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
      .catch(() => {
        // Si le réseau échoue, essayer le cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // Si c'est une navigation, retourner la page d'accueil en cache
          if (event.request.mode === 'navigate') {
            return caches.match(BASE_PATH + 'index.html')
          }

          // Sinon, retourner une réponse d'erreur
          return new Response('Mode hors ligne - Contenu non disponible', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          })
        })
      })
  )
})

// Gestion des messages depuis l'application
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

