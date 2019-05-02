require('./scss/index.scss');
require('./src');

module.hot && module.hot.accept(() => {
  window.location.reload();
});