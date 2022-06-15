function update_cache() {
	console.group("update_cache");
	console.log("start");
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
	console.log("end");
	console.groupEnd();
}

self.addEventListener('install', (e) => {
	console.group("Install");
	update_cache();
	//e.waitUntil(
	//	update_cache()
	//);
	console.log("end");
	console.groupEnd("Install");
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
console.log("I'm in the sw.js");
