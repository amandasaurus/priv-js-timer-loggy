self.addEventListener('install', (e) => {
	e.waitUntil(
		caches.open('counter-store').then((cache) => cache.addAll([
			"alpinejs-persist-4.10.2-cdn.min.js",
			"alpinejs-3.10.2-cdn.min.js",
			"style.css",
			"main.js",
			"sw.js",
			"index.html",
			"counter.webmanifest",
			"control_knobs_192.png"
		]));
	);
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      caches.match(event.request).then(function(response) {
        return response;
      }
    );
  );
});
