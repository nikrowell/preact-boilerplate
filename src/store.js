import createStore from 'unistore';
import { Provider, connect } from 'unistore/preact';

const store = createStore({
  count: 0,
  route: null
});

const actions = store => ({
  increment(state) {
    return {count: state.count + 1};
  }
});

export { Provider, connect, actions, store };
export default store;