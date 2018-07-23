import idb from 'idb';

const generateId = () => Math.random() * Math.random() * 1;

const staticCacheName = `restaurants-cache-v${generateId()}`;
const API_URL = 'http://localhost:1337/restaurants';

const dbPromise = idb.open('mws-restaurant-2', 1, upgradeDb => {
  upgradeDb.createObjectStore('restaurants');
});

const putRestaurantsToDb = restaurants => {
  return dbPromise.then(db => {
    const tx = db.transaction('restaurants', 'readwrite');
    tx.objectStore('restaurants').put(restaurants, 'restaurants');
    return tx.complete;
  });

  return restaurants;
};

self.addEventListener('install', event => {
  const urlsToCache = [
    '/',
    '/js/dbhelper.js',
    '/js/fontawesome-all.min.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/restaurant.html',
    '/css/styles.css'
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
  if (event.request.url.includes(API_URL)) {
    event.respondWith(
      dbPromise
        .then(db =>
          db
            .transaction('restaurants')
            .objectStore('restaurants')
            .get('restaurants')
        )
        .then(data => {
          if (data && data.length > 0) {
            return data;
          } else {
            return fetch(event.request)
              .then(data => data.json())
              .then(restaurants => {
                return putRestaurantsToDb(restaurants);
              });
          }
        })
        .then(response => {
          console.log(response, 'response');
          return new Response(JSON.stringify(response));
        })
    );
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then(response => {
          if (response) return response;
          return fetch(event.request);
        })
        .catch(() => fetch(event.request))
    );
  }
});

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
