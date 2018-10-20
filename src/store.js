
function createStore(initialState) {

  let state = Object.assign({}, initialState);
  let listeners = [];

  return {

    get(key, fallback) {

      if (!key) return state;

      const keys = key.split('.');
      let target = state;

      for (let i = 0, prop; target && (prop = keys[i]); i++) {
        target = target[prop];
      }

      return typeof target !== 'undefined' ? target : fallback;
    },

    set(key, value) {

      if (typeof key === 'string') {

        const keys = key.split('.');
        const last = keys.pop();
        let target = {};

        while(keys.length) {
          const prop = keys.shift();
          target = (typeof target[prop] !== 'undefined') ? target[prop] : (target[prop] = {});
        }

        target[last] = value;
        key = target;
      }

      state = Object.assign({}, state, typeof key === 'function' ? key(state) : key);
      for (let fn of listeners) fn(state);
    },

    subscribe(fn) {
      listeners.indexOf(fn) < 0 && listeners.push(fn);
      return () => listeners.splice(listeners.indexOf(fn), 1);
    }
  };
};

const instance = createStore();
export default instance;