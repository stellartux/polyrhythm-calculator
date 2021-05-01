const CACHE_VERSION = 'v1.0.0'
const CURRENT_CACHES = {
  'polyrhythm-calculator': 'polyrhythm-calculator-' + CACHE_VERSION,
}

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches
      .open(CURRENT_CACHES['polyrhythm-calculator'])
      .then((cache) =>
        cache.addAll([
          '.',
          'polyrhythm-calculator.js',
          'images/background.webp',
          'images/favicon.svg',
          'images/favicon512x512.png',
          'images/favicon192x192.png',
          'manifest.json',
        ])
      )
  )
})

self.addEventListener('activate', function (event) {
  const expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES))
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (!expectedCacheNamesSet.has(cacheName)) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .open(CURRENT_CACHES['polyrhythm-calculator'])
      .then((cache) =>
        cache.match(event.request).then(
          (response) =>
            response ||
            fetch(event.request.clone()).then((response) => {
              if (response.status === 200) {
                cache.put(event.request, response.clone())
              }
              return response
            })
        )
      )
      .catch(console.warn)
  )
})
