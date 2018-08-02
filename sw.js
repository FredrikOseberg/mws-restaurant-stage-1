import idb from 'idb';

const generateId = () => Math.random() * Math.random() * 1;
let numberOfRequests = 1;

const staticCacheName = `restaurants-cache-v${generateId()}`;
const RESTAURANT_URL = 'http://localhost:1337/restaurants';
const REVIEWS_POST_URL = 'http://localhost:1337/reviews';
const REVIEWS_GET_URL = 'http://localhost:1337/reviews/?restaurant_id';

const imageUrls = (function() {
  const urls = [];
  const baseUrl = '/img';

  for (let i = 1; i <= 10; i++) {
    urls.push(`${baseUrl}/${i}-320w.jpg`, `${baseUrl}/${i}-480w.jpg`, `${baseUrl}/${i}-800w.jpg`);
  }

  return urls;
})();

const dbPromise = idb.open('mws-restaurant-2', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('restaurants');
    case 1:
      upgradeDB.createObjectStore('reviews');
    case 2:
      upgradeDB.createObjectStore('requests');
  }
});

const putRequestToDb = requests => {
  return dbPromise.then(db => {
    const tx = db.transaction('requests', 'readwrite');
    tx.objectStore('requests').put(requests, numberOfRequests);
    numberOfRequests += 1;
    return tx.complete;
  });

  return request;
};

const putRestaurantsToDb = restaurants => {
  return dbPromise.then(db => {
    const tx = db.transaction('restaurants', 'readwrite');
    tx.objectStore('restaurants').put(restaurants, 'restaurants');
    return restaurants;
  });
};

const putReviewsToDb = (reviews, request) => {
  return dbPromise.then(db => {
    const id = request.url.split('=').pop();

    const tx = db.transaction('reviews', 'readwrite');
    tx.objectStore('reviews').put(reviews, id);

    return reviews;
  });
};

const handleFetch = (request, store, getId, callback) =>
  dbPromise.then(db =>
    db
      .transaction(store)
      .objectStore(store)
      .get(getId)
      .then(data => {
        if (data && data.length > 0) {
          return data;
        } else {
          return fetch(request)
            .then(data => data.json())
            .then(json => callback(json, request));
        }
      })
      .then(response => {
        console.log('response', response);
        return new Response(JSON.stringify(response));
      })
  );

const handleReviewsFetch = request => {
  const id = request.url.split('=').pop();
  console.log(id);
  return handleFetch(request, 'reviews', id, putReviewsToDb);
};

const handleRestaurantFetch = request => handleFetch(request, 'restaurants', 'restaurants', putRestaurantsToDb);

const handleReviewPost = request => {
  console.log('running handlereview');
  return fetch(request)
    .then(() => console.log('fetching'))
    .catch(() => {
      console.log('failed fetch');
      putRequestToDb(request);
      // Post message from service worker to handle ui update
    });
};

self.addEventListener('install', event => {
  const urlsToCache = [
    '/',
    '/js/dbhelper.js',
    '/js/fontawesome-all.min.js',
    '/dist/main.js',
    '/dist/restaurant_info.js',
    '/restaurant.html',
    '/img/1-320w.jpg',
    '/css/styles.css'
  ].concat(imageUrls);

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
  const { request } = event;
  // console.log('fetch', request);
  if (request.url.includes(RESTAURANT_URL)) {
    event.respondWith(handleRestaurantFetch(request));
  } else if (request.url.includes(REVIEWS_POST_URL)) {
    if (request.method === 'POST') {
      event.respondWith(handleReviewPost(request));
    } else if (request.method === 'GET') {
      console.log('Getting reviews');
      event.respondWith(handleReviewsFetch(request));
      // Save responses
      // Serve from idb if there are responses
      // Fallback to network
    }
  } else {
    event.respondWith(
      caches
        .match(request, { ignoreSearch: true })
        .then(response => {
          if (response) return response;
          return fetch(request);
        })
        .catch(() => fetch(request))
    );
  }
});

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
