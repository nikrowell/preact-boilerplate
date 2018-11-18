
export function isFunction(value) {
  return typeof value === 'function';
};

export function isNumeric(value) {
  if (typeof value === 'number') return true;
  if (/^0x[0-9a-f]+$/i.test(value)) return true;
  return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(value);
};

export function isUndefined(value) {
  return typeof value === 'undefined';
};

// import webfont from 'webfontloader';
// function loadFont(config) {
//   return new Promise((resolve, reject) => {
//     webfont.load({
//       [config.source]: {families: config.families},
//       classes: false,
//       active: resolve
//     });
//   });
// }

export function loadScript(config) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = config.url;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};