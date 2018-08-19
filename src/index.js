import { Component, render, cloneElement, h } from 'preact';
import { Route, Link } from './router';
import { isFunction } from './utils';
import Canvas from './canvas';
import '../scss/index.scss';

const debug = (value) => (
  <pre>{JSON.stringify(value, null, 2)}</pre>
);

class Transition extends Component {

  constructor(props) {

    super(props);

    const children = this.getChildMapping(this.props.children);
    this.state = {children};

    this.refs = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
    this.entering = {};
    this.leaving = {};

    this.enter = this.enter.bind(this);
    this.leave = this.leave.bind(this);
  }

  componentDidMount() {
    const children = this.state.children;
    for (let key in children) this.enter(key);
  }

  componentWillReceiveProps(nextProps) {

    const prevChildren = this.state.children;
    const nextChildren = this.getChildMapping(nextProps.children);

    this.setState({
      children: Object.assign({}, prevChildren, nextChildren)
    });

    for (let key in nextChildren) {
      const hasPrev = prevChildren.hasOwnProperty( key);
      if (nextChildren[key] && (!hasPrev || this.leaving[key])) {
        this.keysToEnter.push(key);
      }
    }

    for (let key in prevChildren) {
      const hasNext = nextChildren.hasOwnProperty(key);
      if (prevChildren[key] && !hasNext) {
        this.keysToLeave.push(key);
      }
    }
  }

  componentDidUpdate() {

    const keysToEnter = this.keysToEnter;
    const keysToLeave = this.keysToLeave;

    switch (this.props.mode) {

      case 'out-in':

        this.keysToLeave = [];

        if (keysToLeave.length) {
          keysToLeave.forEach(this.leave);
        } else {
          this.keysToEnter = [];
          keysToEnter.forEach(this.animateIn);
        }
        break;

      case 'in-out':

        this.keysToEnter = [];
        this.keysToLeave = [];

        if (keysToEnter.length) {
          Promise.all(keysToEnter.map(this.enter)).then(() => keysToLeave.forEach(this.leave));
        } else {
          keysToLeave.forEach(this.leave);
        }

        break;

      default:
        this.keysToEnter = [];
        this.keysToLeave = [];
        keysToEnter.forEach(this.enter);
        keysToLeave.forEach(this.leave);
        break;
    }
  }

  getChildMapping(children) {
    return children.reduce((result, child) => {
      const key = child.key;
      result[key] = child;
      return result;
    }, {});
  }

  enter(key) {

    const component = this.refs[key];
    const complete = this.enterComplete.bind(this, key);

    const promise = new Promise(resolve => {
      isFunction(component.animateIn) ? component.animateIn(resolve) : resolve();
    }).then(complete);

    this.entering[key] = promise;
    return promise;
  }

  enterComplete(key) {
    delete this.entering[key];
    const currentChildren = this.state.children;
    if (!currentChildren.hasOwnProperty(key)) {
      this.leave(key);
    }
  }

  leave(key) {

    const component = this.refs[key];
    const complete = this.leaveComplete.bind(this, key);

    const promise = new Promise(resolve => {
      isFunction(component.animateOut) ? component.animateOut(resolve) : resolve();
    }).then(complete);

    this.leaving[key] = promise;
    return promise;
  }

  leaveComplete(key) {
    const children = this.state.children;
    delete children[key];
    delete this.leaving[key];
    this.setState({children});
  }

  render() {

    const children = this.state.children;

    return (
      <div>

        {Object.keys(children).map(key => {
          return cloneElement(children[key], {ref: el => this.refs[key] = el});
        })}

        {debug(this.props.mode)}
        {debug(this.state)}
      </div>
    );
  }
}

class Tester extends Component {

  animateIn(done) {
    const el = this.base;
    el.style.opacity = 0;
    el.style.transition = 'opacity 1s ease';
    el.addEventListener('transitionend', done);
    setTimeout(() => el.style.opacity = 1, 500);
  }

  animateOut(done) {
    setTimeout(done, 1000);
  }

  render() {
    return <div>I'm a component with animateIn <strong>{this.props.children}</strong></div>
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
    return (
      <small>{this.props.params.id}</small>
    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {items: [], mode: null};
  }

  // shouldComponentUpdate(nextProps, nextState) { }
  // componentWillReceiveProps(nextProps, nextState) { }
  // componentWillMount() { }
  // componentDidMount() { }
  // componentDidUpdate(prevProps, prevState) { }
  // componentWillUnmount() { }

  render() {
    const items = this.state.items;
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

        <button onClick={e => {
          this.setState({items: items.concat(Math.random())})
        }}>Add One</button>

        <button onClick={e => {
          const index = Math.floor(Math.random() * items.length);
          this.setState({items: [...items.slice(0, index), ...items.slice(index + 1)]})
        }}>Remove One</button>

        <select value={this.state.mode || 'simultaneous'} onChange={e => this.setState({mode: event.target.value})}>
          <option value="simultaneous">simultaneous</option>
          <option value="in-out">in-out</option>
          <option value="out-in">out-in</option>
        </select>
        <Transition mode={this.state.mode}>
          <Tester key="comp" />
          {items.map(n => n > 0.5 ? <Tester key={n}>{n}</Tester> : <div key={`key-${n}`}>{n}</div>)}
        </Transition>
        {/* <Canvas /> */}
        {debug(items)}
      </div>
    );
  }
}

render(<App />, document.body);