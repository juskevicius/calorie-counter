const checkForAppUpdates = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    const newWorker = registration.installing || registration.waiting;
    if (newWorker) {
      newWorker.postMessage('SKIP_WAITING');
    }
  }
};

navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});

export { checkForAppUpdates };
