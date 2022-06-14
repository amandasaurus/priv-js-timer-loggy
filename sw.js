function update_cache() {
	// Updating the cache
	caches.open('counter-store').then((cache) => cache.addAll([
		"/alpinejs-persist-3.10.2-cdn.min.js",
		"/alpinejs-3.10.2-cdn.min.js",
		"/style.css",
		"/main.js",
		"/sw.js",
		"/index.html",
		"/counter.webmanifest",
		"/control_knobs_192.png",
		"/"
	]));
}

self.addEventListener('install', (e) => {
	update_cache();
	//e.waitUntil(
	//	update_cache()
	//);
});

self.addEventListener('fetch', (e) => {
	e.respondWith(
		caches.match(e.request).then((response) => {
			if (response) {
				return response ;
			} else {
				throw Error("not in cache", e.request.url);
			}
		}
		),
	);
});

self.addEventListener('message', (e) => {
	if (e.data && e.data.type == 'update_cache') {
		update_cache();
	}
});
