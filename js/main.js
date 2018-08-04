import DBHelper from './dbhelper';
import { addSavedReviews, flashMessage } from './helpers';
import { initServiceWorker } from './initSw';
import '../css/styles.css';

let restaurants, neighborhoods, cuisines;
let firstLoad = true;
let displayMap = false;
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

const initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  displayMap = true;
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
  initLazyLoad();
  if (displayMap) {
    addMarkersToMap();
  }
};

/**
 * Update the heart in the UI
 */
const updateHeart = restaurant => {
  const favoriteButtons = Array.from(document.getElementsByClassName('fav-button-group'));
  const favoriteButton = favoriteButtons[Number(restaurant.id) - 1];
  const favoriteButtonHeart = favoriteButton.firstChild;
  favoriteButton.setAttribute('aria-label', 'FavoriteButton');
  favoriteButton.innerHTML = '';

  const heart = document.createElement('img');
  heart.alt = 'heart';

  if (favoriteButtonHeart.classList.contains('favorited')) {
    heart.src = '../img/heart.svg';
    heart.className = 'heartIcon unfavorited';
  } else {
    heart.src = '../img/heartSolid.svg';
    heart.className = 'heartIcon favorited';
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
  favoriteButton.className = 'restaurant-favorite-button fav-button-group';

  const heart = document.createElement('img');
  heart.alt = 'heart';
  if (restaurant.is_favorite === 'true') {
    heart.src = '../img/heartSolid.svg';
    heart.className = 'heartIcon favorited';
  } else {
    heart.src = '../img/heart.svg';
    heart.className = 'heartIcon unfavorited';
  }

  favoriteButton.appendChild(heart);
  favoriteButton.addEventListener('click', () => handleFavoriteButtonClick(restaurant));

  const image = document.createElement('img');
  image.dataset.sizes = DBHelper.imageSizesForRestaurant();

  if (firstLoad) {
    image.src = '../img/placeholder.png';
    image.dataset.srcset = DBHelper.srcsetForRestaurantImage(restaurant);
    image.dataset.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.className = 'restaurant-img lazy-img';
  } else {
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.srcset = DBHelper.srcsetForRestaurantImage(restaurant);
    image.className = 'restaurant-img';
  }
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
  document.querySelector('#show-map').addEventListener('click', initMap);
  window.addEventListener('online', handleOnline);
};

const initLazyLoad = () => {
  var imagesToLoad = [].slice.call(document.querySelectorAll('.lazy-img'));

  if ('IntersectionObserver' in window) {
    let imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove('lazy-img');
          imageObserver.unobserve(lazyImage);
        }
      });
    });

    imagesToLoad.forEach(function(lazyImage) {
      imageObserver.observe(lazyImage);
    });

    firstLoad = false;
  }
};

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', event => {
  fetchNeighborhoods();
  fetchCuisines();
  setupEventListeners();
  updateRestaurants();
  initServiceWorker();
  addSavedReviews();
});
