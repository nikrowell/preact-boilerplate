
export const instances = [];

export function navigate(url, options = {}) {
  if (url === window.location.pathname) return;
  window.history[options.replace ? 'replaceState' : 'pushState']({}, null, url);
  instances.forEach(component => component.forceUpdate());
};

const cache = {};
export function match(path) {

  const url = window.location.pathname.split(/[?#]/)[0];
  let regexp;

  if (cache[path]) {
    regexp = cache[path];
  } else {
    const keys = [];
    regexp = toRegExp(path, keys);
    cache[path] = regexp;
  }

  return url.match(regexp);
};

export function toRegExp(path, keys) {

  if (path[0] !== '/') path = '/' + path;

  path = path
    .concat('/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?|\*/g,

    (match, slash, format, key, capture, optional) => {

      if (match === '*') {
        keys.push(undefined);
        return match;
      }

      keys.push(key);
      slash = slash || '';

      return `${optional ? '' : slash}(?:${optional ? slash : ''}${format || ''}${capture || '([^/]+?)'})${optional || ''}`;
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');

  return new RegExp('^' + path + '$', 'i');
};