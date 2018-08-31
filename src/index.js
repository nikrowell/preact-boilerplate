import { Component, render, h } from 'preact';
import { Provider, store } from './store';
import App from './components/App';
import '../scss/index.scss';

import events from './events';
events.on('route', console.log);

setTimeout(function() {
  events.emit('route', {name: 'this is a route yo!'});
}, 2000);

// const store = createStore({

// });

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.body
);