import DBHelper from './dbhelper';
import { addSavedReviews, flashMessage } from './helpers';
import '../css/styles.css';

let restaurants, neighborhoods, cuisines;
var map;
var markers = [];

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });

  document.querySelector;
  updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = restaurants => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers = [];
  self.markers.forEach(m => m.setMap(null));
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Update the heart in the UI
 */
const updateHeart = restaurant => {
  const favoriteButtons = Array.from(document.getElementsByClassName('fav-button-group'));
  const favoriteButton = favoriteButtons[Number(restaurant.id) - 1];
  const favoriteButtonHeart = favoriteButton.firstChild;
  favoriteButton.innerHTML = '';

  const heart = document.createElement('i');
  heart.id = 'heartIcon';
  if (favoriteButtonHeart.classList.contains('favorited')) {
    heart.className = 'far fa-heart unfavorited';
  } else {
    heart.className = 'fas fa-heart favorited';
  }

  favoriteButton.appendChild(heart);
};

/**
 * Handle favorite button click and make database call
 */

const handleFavoriteButtonClick = restaurant => {
  if (navigator.onLine) {
    const apiCall = DBHelper.updateFavoriteRestaurant(restaurant);
    apiCall.then(response => {
      updateRestaurants();
    });
  } else {
    let savedRestaurants = JSON.parse(localStorage.getItem('savedRestaurants'));

    if (savedRestaurants && savedRestaurants.length > 0) {
      const restaurantExists = savedRestaurants.find(savedRestaurant => savedRestaurant.id === restaurant.id);

      if (restaurantExists) {
        savedRestaurants = savedRestaurants.filter(savedRestaurant => !(savedRestaurant.id === restaurant.id));
      } else {
        savedRestaurants.push(restaurant);
      }
      console.log(savedRestaurants);
      localStorage.setItem('savedRestaurants', JSON.stringify(savedRestaurants));
    } else {
      localStorage.setItem('savedRestaurants', JSON.stringify([restaurant]));
    }
    updateHeart(restaurant);

    flashMessage('You are currently offline. Your favorite restaurants will be updated when you go back online.');
  }
};

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = restaurant => {
  if (restaurant.name === 'Casa Enrique') restaurant.photograph = 10;
  const li = document.createElement('li');

  const favoriteButton = document.createElement('button');
  favoriteButton.id = 'restaurant-favorite-button';
  favoriteButton.className = 'fav-button-group';

  const heart = document.createElement('i');
  heart.id = 'heartIcon';
  if (restaurant.is_favorite === 'true') {
    heart.className = 'fas fa-heart favorited';
  } else {
    heart.className = 'far fa-heart unfavorited';
  }

  favoriteButton.appendChild(heart);
  favoriteButton.addEventListener('click', () => handleFavoriteButtonClick(restaurant));

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.srcset = DBHelper.srcsetForRestaurantImage(restaurant);
  image.sizes = DBHelper.imageSizesForRestaurant();
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = restaurant.name;
  li.append(image);

  const container = document.createElement('div');
  container.className = 'restaurant-list-container';
  container.append(favoriteButton);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  container.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  container.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  container.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('role', 'button');
  more.href = DBHelper.urlForRestaurant(restaurant);
  container.append(more);

  li.append(container);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};

/**
 * Handle
 */

const handleUpdateNotificationClick = worker => {
  worker.postMessage({ action: 'skipWaiting' });
  document.getElementsByTagName('body')[0].removeChild(document.getElementsByClassName('version-button')[0]);
};

/**
 * Notify a user that a newer version is available
 */

const updateNotify = worker => {
  const button = document.createElement('button');
  button.textContent = 'There is a new version available. Click here to refresh';
  button.className = 'version-button';
  button.type = 'button';

  document.getElementsByTagName('body')[0].appendChild(button);
  document
    .getElementsByClassName('version-button')[0]
    .addEventListener('click', () => handleUpdateNotificationClick(worker));
};

/**
 * Track installing serviceworker
 */

const trackInstalling = worker => {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      updateNotify(worker);
      return;
    }
  });
};

/**
 * Initialize service worker
 */
const initServiceWorker = () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register('./sw.js')
      .then(reg => {
        if (!navigator.serviceWorker.controller) return;

        if (reg.waiting) {
          updateNotify(reg.waiting);
          return;
        }

        if (reg.installing) {
          trackInstalling(reg.installing);
        }

        reg.addEventListener('updatefound', () => trackInstalling(reg.installing));
      })
      .catch(err => console.log(err));

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
};

const makeSavedRequests = () => {
  if (!navigator.onLine) return;
  const savedRequests = JSON.parse(localStorage.getItem('savedRestaurants'));

  if (savedRequests && savedRequests.length > 0) {
    const promises = Promise.all(savedRequests.map(restaurant => DBHelper.updateFavoriteRestaurant(restaurant)));

    promises.then(() => {
      localStorage.setItem('savedRestaurants', JSON.stringify([]));
      updateRestaurants();
    });
  }
};

const handleOnline = () => {
  addSavedReviews();
  makeSavedRequests();
};

const setupEventListeners = () => {
  document.querySelector('#neighborhoods-select').addEventListener('change', updateRestaurants);
  document.querySelector('#cuisines-select').addEventListener('change', updateRestaurants);
  window.addEventListener('online', handleOnline);
};

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', event => {
  fetchNeighborhoods();
  fetchCuisines();
  initServiceWorker();
  setupEventListeners();
  addSavedReviews();
});
