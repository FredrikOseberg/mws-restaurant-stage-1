/**
 * Handle update notification click
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

export const initServiceWorker = () => {
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
