import { render, h } from 'preact';
import { Route } from './router';
import routes from './routes';
import App from './components/App';
import store from './store';


const unsubscribe = store.subscribe(state => {
  if (state.name === 'Angel') return unsubscribe();
  console.log('store changed:', state);
});

store.set({
  name: 'Nik',
  age: 38,
  location: {
    city: 'Minneapolis',
    state: 'Minnesota',
  }
});

store.set('location', {
  city: 'Denver',
  state: 'Colorado'
});

store.set('name', 'Angel');
store.set('location.city', 'Buena Vista');
store.set(state => ({age: state.age - 6}));

console.log(store.get());
console.log(store.get('location.state'), store.get().location.state);
console.log(store.get('some.nonexistant.key', 'Nothing to see here'));
console.log(`${store.get('name')} is ${store.get('age')} and in ${store.get('location.city')}, ${store.get('location.state')}`);
console.log('------------------------------------------------------');

// store.set(state => ({name: 'Angel'}), state => console.log('store changed!!!!', state));



window.debug = (value, style = {}) => (
  window.DEBUG && <pre style={Object.assign({maxWidth:'100%',overflow:'scroll'},style)}>{JSON.stringify(value,null,2)}</pre>
);

function init() {

  const data = JSON.parse(document.getElementById('data').textContent || '{}');
  console.log(data);

  // const assets = [{
  //   url: 'https://picsum.photos/1024/512/?random',
  //   type: 'image'
  // }];
  const assets = [];

  render(
    <Route render={props => <App {...props} assets={assets} routes={routes} />} />,
    document.body
  );
}

// https://polyfill.io/v2/docs/features/
const features = [];
// ('fetch' in window) || features.push('fetch');
// ('Promise' in window) || features.push('Promise');
// ('assign' in Object) || features.push('Object.assign');
// ('from' in Array) || features.push('Array.from');
// ('find' in Array.prototype) || features.push('Array.prototype.find');
// ('includes' in Array.prototype) || features.push('Array.prototype.includes');

if(features.length) {
  const script = document.createElement('script');
  script.src = `//cdn.polyfill.io/v2/polyfill.min.js?features=${features.join(',')}&flags=gated,always&ua=${window.navigator.userAgent}`;
  script.onload = init;
  document.body.appendChild(script);
} else { init() }