import { render, h } from 'preact';
import { Provider, store } from './store';
import App from './components/App';
import '../scss/index.scss';

window.debug = (value, style = {}) => (
  window.DEBUG && <pre style={style}>{JSON.stringify(value, null, 2)}</pre>
);



import events from './events';
events.on('route', console.log);

setTimeout(function() {
  events.emit('route', {name: 'this is a route yo!'});
}, 2000);

function init() {

  const data = JSON.parse(document.getElementById('data').textContent || '{}');
  console.log(data);

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.body
  );
}

init();