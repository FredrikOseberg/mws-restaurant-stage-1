const generateId = () => Math.random() * Math.random() * 1;

const staticCacheName = `restaurants-cache-v${generateId()}`;

self.addEventListener('install', event => {
  const urlsToCache = [
    '/',
    '/js/dbhelper.js',
    '/js/fontawesome-all.min.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/restaurant.html',
    '/css/styles.css',
    '/data/restaurants.json'
  ];

  event.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => cache.addAll(urlsToCache))
      .catch(() => console.log('caching failed'))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(cacheName => cacheName.startsWith('restaurants') && cacheName !== staticCacheName)
            .map(cacheName => caches.delete(cacheName))
        )
      )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request);
      })
      .catch(() => fetch(event.request))
  );
});

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
