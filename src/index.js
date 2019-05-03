import { render, h } from 'preact';
import { Route } from './router';
import { loadFont, loadScript } from './utils';
import routes from './routes';
import App from './components/App';
// import { Provider, store } from './store';

window.debug = process.env.NODE_ENV === 'development' ? (vars, style = {}) => (
  <pre style={{maxWidth:'100%',overflow:'scroll', ...style}}>{JSON.stringify(vars, null, 2)}</pre>
) : vars => null;

function init() {

  const data = JSON.parse(document.getElementById('data').textContent || '{}');
  console.log(data);

  const assets = [{
    url: 'https://picsum.photos/1200/800/?image=1032',
    type: 'image'
  }, {
    url: 'https://picsum.photos/1200/800/?image=1037',
    type: 'image'
  }, {
    url: 'https://picsum.photos/1200/800/?image=480',
    type: 'image'
  }, {
    url: 'https://picsum.photos/1200/800/?random',
    type: 'image'
  }];

  // assets.push({
  //   type: loadFont,
  //   source: 'google',
  //   families: ['Montserrat:500,800', 'Roboto+Slab:300'],
  // });

  // if (process.env.NODE_ENV) {
  //   assets.push({
  //     type: loadScript,
  //     url: 'https://unpkg.com/dat.gui'
  //   });
  // }

  render(
    <Route render={props => <App {...props} assets={assets} routes={routes} />} />,
    document.body
  );
}

// https://polyfill.io/v2/docs/features/
const features = [];
// ('fetch' in window)             || features.push('fetch');
// ('Promise' in window)           || features.push('Promise');
// ('assign' in Object)            || features.push('Object.assign');
// ('from' in Array)               || features.push('Array.from');
// ('find' in Array.prototype)     || features.push('Array.prototype.find');
// ('includes' in Array.prototype) || features.push('Array.prototype.includes');

if(features.length) {
  const script = document.createElement('script');
  script.src = `//cdn.polyfill.io/v2/polyfill.min.js?features=${features.join(',')}&flags=gated,always&ua=${window.navigator.userAgent}`;
  script.onload = init;
  document.body.appendChild(script);
} else { init() }