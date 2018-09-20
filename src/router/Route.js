import { Component, h } from 'preact';
import { toRegExp, instances } from './utils';
import { isFunction } from '../utils';

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
  } else if (isNumeric(value)) {
      value = Number(value);
  }

  return value;
}

function isNumeric(value) {
  if (typeof value === 'number') return true;
  if (/^0x[0-9a-f]+$/i.test(value)) return true;
  return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(value);
}

export default class Route extends Component {

  constructor(props) {
    super(props);
    this.keys = [];
    this.regexp = props.path && toRegExp(props.path, this.keys);
    this.popstate = this.popstate.bind(this);
  }

  componentWillMount() {
    window.addEventListener('popstate', this.popstate);
    instances.push(this);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.popstate);
    instances.splice(instances.indexOf(this), 1);
  }

  popstate() {
    this.forceUpdate();
  }

  render() {

    const url = window.location.pathname.split(/[?#]/)[0];
    const matches = url.match(this.regexp);

    if (!matches) {
      return null;
    }

    const { path, render, ...props } = this.props;
    const req = { url, path, params: {} };

    matches.forEach((item, i) => {
      const key = this.keys[i];
      key && (req.params[key] = decode(matches[i + 1]));
    });

    if (Component.isPrototypeOf(render)) {
      return h(render, { ...props, ...req });
    }

    if (isFunction(render)) {
      return render({ ...props, ...req });
    }

    return null;
  }
}