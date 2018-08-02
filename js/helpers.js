import DBHelper from './dbhelper';

export const addSavedReviews = (callback = () => {}) => {
  if (!navigator.onLine) return;
  const savedReviews = JSON.parse(localStorage.getItem('savedReviews'));

  if (savedReviews && savedReviews.length > 0) {
    savedReviews.forEach(review => DBHelper.createReview(review, () => callback()));
  }

  localStorage.setItem('savedReviews', JSON.stringify([]));
};
