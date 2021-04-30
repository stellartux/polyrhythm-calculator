self.addEventListener('install', function (e) {
  e.waitUntil(
    caches
      .open('polyrhythm-calculator')
      .then((cache) =>
        cache.addAll([
          '.',
          'index.html',
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .open('polyrhythm-calculator')
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
