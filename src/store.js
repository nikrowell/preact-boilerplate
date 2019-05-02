import createStore from 'unistore';
import { Provider, connect } from 'unistore/preact';

const store = createStore({
  assets: null
});

// const actions = store => ({
//   setAssets: (state, assets) => ({assets})
// });

export default store;
export { Provider, connect, store };