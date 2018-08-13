import { Component, render, cloneElement, h } from 'preact';
import { Route, Link } from './router';
import '../scss/index.scss';

const debug = (value) => (
  <pre>{JSON.stringify(value, null, 2)}</pre>
);

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



import { isFunction } from './utils';


class Transition extends Component {

  constructor(props) {
    super(props);
    const mapping = this.getChildMapping(this.props.children);
    this.state = {mapping};
    this.entering = {};
    // this.leaving = {};
    this.refs = {};
  }

  componentDidMount() {
    const mapping = this.state.mapping;
    for (let key in mapping) this.animateIn(key);
  }

  componentWillReceiveProps(nextProps) {

    const prevChildren = this.state.children;
    const nextChildren = this.getChildMapping(nextProps.children);
    const mapping = Object.assign({}, prevChildren, nextChildren);

    this.setState({mapping});

    for (let key in prevChildren) {
      // this.outgoing.push(key);
    }

    for (let key in nextChildren) {
      // this.incoming.push(key);
    }
  }

  componentDidUpdate() {

    // const incoming = this.incoming;
    // const outgoing = this.outgoing;

    switch (this.props.mode) {
      case 'in-out':
        break;
      case 'out-in':
        break;
      default:
        // this.incoming = [];
        // this.outgoing = [];
        // incoming.forEach(this.animateIn);
        // outgoing.forEach(this.animateOut);
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

  animateIn(key) {
    const component = this.refs[key];
    if (isFunction(component.animateIn)) {
      this.entering[key] = true;
      component.animateIn(() => delete this.entering[key]);
    }
  }

  animateOut(key) {
    console.log('animateOut', key);
  }

  render() {

    const mapping = this.state.mapping;
    const children = Object.keys(mapping).map(key => {
      return cloneElement(mapping[key], {ref: el => this.refs[key] = el});
    });

    return (
      <div>
        {children}
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
    // setTimeout(done, 1000);
  }

  render() {
    return <div>I'm a component with animateIn <strong>{this.props.children}</strong></div>
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
        <button onClick={e => this.setState({items: items.concat(Math.random())})}>Click Me</button>
        <select value={this.state.mode || 'simultaneous'} onChange={e => this.setState({mode: event.target.value})}>
          <option value="simultaneous">simultaneous</option>
          <option value="in-out">in-out</option>
          <option value="out-in">out-in</option>
        </select>
        <Transition mode={this.state.mode}>
          <div key="func">func</div>
          <Tester key="comp" />
          {items.map(n => n > 0.5 ? <Tester key={n}>{n}</Tester> : <div key={`key-${n}`}>{n}</div>)}
        </Transition>
      </div>
    );
  }
}

render(<App />, document.body);