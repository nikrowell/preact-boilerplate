import { Component, render, h } from 'preact';
import '../scss/index.scss';

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

const isFunction = (value) => typeof value === 'function';

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

class Link extends Component {

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

class Redirect extends Component {

  componentDidMount() {
    navigate(this.props.to, {replace: true});
  }

  render() {
    return null
  }
}

class Route extends Component {

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

const About = (props) => (
  <div>
    <h3>ABOUT</h3>
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>
);

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );
  }
}

class Project extends Component {
  render() {
    if (this.props.params.id === 'argosy') {
      return <Redirect to="/" />;
    }
    return (
      <small>{this.props.params.id}</small>
    );
  }
}

export default Home;

class App extends Component {

  // shouldComponentUpdate(nextProps, nextState) { }
  // componentWillReceiveProps(nextProps, nextState) {
  //   this.props // Previous props
  //   this.state // Previous state
  // }
  // componentWillMount() { }
  // componentDidMount() { }
  // componentDidUpdate(prevProps, prevState) { }
  // componentWillUnmount() {
  //   this.props // Current props
  //   this.state // Current state
  // }

  render(props, { results = [] }) {
    return (
      <div className="site">
        <nav>
          <Link to="/">Home</Link><br />
          <Link to="/about">About</Link><br />
          <Link to="/projects/brew">Brew</Link><br />
          <Link to="/projects/argosy">Argosy</Link><br />
        </nav>
        <div className="content">
          <Route path="/" view={Home} home />
          <Route path="/about" view={About} hello="Colorado" />
          <Route path="/about" view={props => <pre>{JSON.stringify(props, null, 2)}</pre>} />
          <Route path="/projects/:id" view={request => <pre>{JSON.stringify(request, null, 2)}</pre>} />
          <hr />
          <Route path="/projects/:id" view={Project} />
        </div>
      </div>
    );
  }
}

render(<App />, document.body);