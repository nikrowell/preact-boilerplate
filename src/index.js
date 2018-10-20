import { render, h } from 'preact';
import { Route } from './router';
import routes from './routes';
import App from './components/App';

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