import webfont from 'webfontloader';

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

export const loadFont = config => new Promise((resolve, reject) => {
  webfont.load({
    [config.source]: {families: config.families},
    active: resolve,
    inactive: reject,
    classes: false
  });
});

export const loadScript = config => new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = config.url;
  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
});

export function crop(img, width, height, alignX, alignY) {

  const ratio = img.width / img.height;
  const rect = {x: 0, y: 0, width, height};

  if (ratio > (width / height)) {
    rect.width = img.width * (height / img.height);
    rect.x = (width - rect.width) * alignX;
  } else {
    rect.height = img.height * (width / img.width);
    rect.y = (height - rect.height) * alignY;
  }

  return rect;
};