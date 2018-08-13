import { Component, h } from 'preact';
import { isFunction } from './utils';

const instances = [];

const register = (component) => {
  instances.push(component);
};

const unregister = (component) => {
  instances.splice(instances.indexOf(component), 1);
};

const navigate = (url, options = {}) => {
  if (url === window.location.pathname) return;
  window.history[options.replace ? 'replaceState' : 'pushState']({}, null, url);
  instances.forEach(component => component.forceUpdate());
};

function decode(value) {

  value = decodeURIComponent(value);

  if (value === 'true') {
      value = true;
  } else if (value === 'false') {
      value = false;
  } else if (value === 'null') {
      value = null;
  } else if (value === 'undefined') {
      value = undefined;
  } else if (isNaN(value) === false) {
      value = Number(value);
  }

  return value;
}

function toRegExp(path, keys) {

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
}

export class Link extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    event.preventDefault();
    navigate(this.props.to);
  }

  render() {
    const { to, children } = this.props;
    return <a href={to} onClick={this.onClick}>{children}</a>;
  }
}

export class Route extends Component {

  constructor(props) {
    super(props);
    this.keys = [];
    this.regexp = toRegExp(this.props.path, this.keys);
    this.update = this.update.bind(this);
  }

  componentWillMount() {
    window.addEventListener('popstate', this.update);
    register(this);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.update);
    unregister(this);
  }

  update() {
    this.setState({});
  }

  render() {

    const url = window.location.pathname.split(/[?#]/)[0];
    const matches = url.match(this.regexp);

    if (!matches) {
      return null;
    }

    const { path, view, ...props } = this.props;
    const params = {};

    matches.forEach((item, i) => {
      const key = this.keys[i];
      key && (params[key] = decode(matches[i + 1]));
    });

    if (Component.isPrototypeOf(view)) {
      return h(view, { ...props, url, path, params });
    }

    if (isFunction(view)) {
      return view({ ...props, url, path, params });
    }

    return null;
  }
}