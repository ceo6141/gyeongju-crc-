const CACHE_NAME = "gyeongju-rotary-v3"
const urlsToCache = [
  "/",
  "/about",
  "/members",
  "/presidents",
  "/organization",
  "/business-plan",
  "/rotary-news",
  "/notices",
  "/gallery",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
]

self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

self.addEventListener("fetch", (event) => {
  // Skip caching for Next.js chunks to prevent loading errors
  if (event.request.url.includes("/_next/static/chunks/")) {
    event.respondWith(fetch(event.request))
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request)
      }),
  )
})
