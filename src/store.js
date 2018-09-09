import createStore from 'unistore';
import { Provider, connect } from 'unistore/preact';
import { isUndefined } from './utils';

const store = createStore({
  site: {
    name: 'Preact Boilerplate',
    url: window.location.origin,
    api: 'http://cranium-api.localhost.com/api'
  },
  route: null
});

store.get = (key, fallback) => {

  let value = store.getState();
  if (!key) return value;

  const keys = key.split('.');
  for (let i = 0, prop; value && (prop = keys[i]); i++) {
    value = value[prop];
  }

  return !isUndefined(value) ? value : fallback;
};

const actions = store => ({
  increment(state) {
    return {count: state.count + 1};
  }
});

export { Provider, connect, actions, store };
export default store;