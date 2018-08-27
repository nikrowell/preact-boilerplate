import { Component, render, h } from 'preact';
import { Provider, store } from './store';
import App from './components/App';
import '../scss/index.scss';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.body
);