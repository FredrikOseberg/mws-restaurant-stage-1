import DBHelper from './dbhelper';

export const addSavedReviews = (callback = () => {}) => {
  if (!navigator.onLine) return;
  const savedReviews = JSON.parse(localStorage.getItem('savedReviews'));

  if (savedReviews && savedReviews.length > 0) {
    savedReviews.forEach(review => DBHelper.createReview(review, () => callback()));
  }

  localStorage.setItem('savedReviews', JSON.stringify([]));
};

export const flashMessage = message => {
  const container = document.createElement('div');
  container.className = 'flash-message';

  const warningImage = document.createElement('img');
  warningImage.src = '../img/exclamation-triangle.svg';
  warningImage.alt = 'exclamation mark';

  const paragraph = document.createElement('p');
  paragraph.textContent = message;

  container.appendChild(warningImage);
  container.appendChild(paragraph);

  const body = document.getElementsByTagName('body')[0];

  body.appendChild(container);
  setTimeout(() => {
    body.removeChild(container);
  }, 3000);
};
