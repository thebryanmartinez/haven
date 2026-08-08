self.addEventListener("install", () => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", () => {
  return self.clients.claim();
});

// Optional: basic caching (can be skipped)
self.addEventListener("fetch", () => {
  // You can leave this empty if you don't want offline caching.
});
