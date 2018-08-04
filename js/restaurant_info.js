import DBHelper from './dbhelper';
import { addSavedReviews, flashMessage } from './helpers';
import { initServiceWorker } from './initSw';
import '../css/styles.css';

let restaurant;
let reviewsArray = [];
var map;

/**
 * Initialize Google map, called from HTML.
 */
const initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
};

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = callback => {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.alt = restaurant.name;
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = reviews => {
  const container = document.getElementById('reviews-container');
  container.innerHTML = null;
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.createElement('ul');
  ul.id = 'reviews-list';
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Get a list of star ratings
 */
const createStarRatingHTML = stars => {
  const rating = document.createElement('div');
  rating.className = 'review-rating-container';

  for (let i = 0; i < stars; i++) {
    const star = document.createElement('span');
    star.innerHTML = '&#9733;';
    star.className = 'reviews-star';
    rating.appendChild(star);
  }

  return rating;
};

/**
 * Format date
 */
const formatDate = unixDate => {
  const date = new Date(unixDate);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = review => {
  const li = document.createElement('li');
  const personIcon = document.createElement('img');
  personIcon.alt = 'User';
  personIcon.src = '../img/user.svg';

  const personIconContainer = document.createElement('div');
  personIconContainer.className = 'review-person-icon';
  personIconContainer.appendChild(personIcon);

  const name = document.createElement('p');
  const nameText = document.createTextNode(review.name);
  name.appendChild(personIconContainer);
  name.appendChild(nameText);
  name.className = 'review-person-name';
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = formatDate(review.updatedAt);
  date.className = 'review-date';
  li.appendChild(date);

  const rating = createStarRatingHTML(review.rating);
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.className = 'review-comment';
  li.appendChild(comments);

  return li;
};
/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const getRestaurantId = () =>
  window.location.href
    .split('?')
    .pop()
    .split('=')
    .pop();

const getReviews = (offline = false) => {
  const id = getRestaurantId();

  if (offline) {
    return fillReviewsHTML(reviewsArray);
  }

  DBHelper.fetchReviewsById(id, (error, reviews) => {
    if (reviews) {
      const filteredReviews = reviews.filter(review => !reviewsArray.find(rev => rev.id === review.id));

      reviewsArray = reviewsArray.filter(review => review.createdAt).concat(filteredReviews);
      fillReviewsHTML(reviewsArray);
    } else if (error) {
      console.log(error);
    }
  });
};

const handleSubmit = e => {
  e.preventDefault();
  const restaurant_id = getRestaurantId();
  const name = document.getElementById('name').value;
  const rating = document.getElementById('rating').value;
  const comments = document.getElementById('comments').value;

  const review = {
    name,
    rating,
    comments,
    restaurant_id
  };

  if (navigator.onLine) {
    DBHelper.createReview(review, () => getReviews());
  } else {
    review.updatedAt = Date.now();
    reviewsArray.push(review);
    getReviews(true);

    delete review.updatedAt;

    const savedReviews = JSON.parse(localStorage.getItem('savedReviews'));

    if (savedReviews && savedReviews.length > 0) {
      savedReviews.push(review);
      localStorage.setItem('savedReviews', JSON.stringify(savedReviews));
    } else {
      localStorage.setItem('savedReviews', JSON.stringify([review]));
    }

    flashMessage('You are currently offline. Your comment will be updated on the server once you go back online.');
  }

  [name, rating, value].forEach(node => (node.value = null));
};

const handleOnline = () => addSavedReviews(getReviews);

const setupEventListeners = () => {
  document.addEventListener('submit', handleSubmit);
  document.querySelector('#show-map').addEventListener('click', initMap);
  window.addEventListener('online', handleOnline);
};

document.addEventListener('DOMContentLoaded', event => {
  initServiceWorker();
  getReviews();
  setupEventListeners();
  fetchRestaurantFromURL(() => fillBreadcrumb());
  addSavedReviews(getReviews);
});
