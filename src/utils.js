
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