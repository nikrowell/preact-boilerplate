import createStore from 'unistore';
import { Provider, connect } from 'unistore/preact';

const store = createStore({
  count: 0,
  route: null
});

export { Provider, connect, store };
export default store;