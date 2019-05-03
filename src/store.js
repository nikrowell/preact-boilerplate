import createStore from 'unistore';
import { Provider, connect } from 'unistore/preact';

const store = createStore({
  assets: null,
  loading: false
});

// const actions = store => ({
//   setAssets: (state, assets) => ({assets})
// });

export default store;
export { Provider, connect, store };