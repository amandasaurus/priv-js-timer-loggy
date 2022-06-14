self.addEventListener('install', (e) => {
	console.log("install");
  e.waitUntil(
    caches.open('counter-store').then((cache) => cache.addAll([
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  console.log("fetch", e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
console.log("started")
