const CACHE_NAME = "gyeongju-rotary-v1"
const urlsToCache = [
  "/",
  "/about",
  "/members",
  "/presidents",
  "/organization",
  "/business-plan",
  "/rotary-news",
  "/notices",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})
