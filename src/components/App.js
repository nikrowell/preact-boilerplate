import { Component, h } from 'preact';
import { Route, Link } from '../router';
import Transition from '../transition';
import Canvas from './Canvas';
import store from '../store';


// import Header from './Header';
/* import { Component, h } from 'preact';
import { connect, actions } from '../store';

class Header extends Component {

  render() {
    return (
      <header>
        <h1>Header</h1>
        <div>{this.props.count}</div>
      </header>
    );
  }
}

export default connect('count', actions)(Header); */

/*
import { Provider, connect } from 'unistore/preact';

// If actions is a function, it gets passed the store:
let actions = store => ({
  // Actions can just return a state update:
  increment(state) {
    return { count: state.count + 1 };
  },

  // The above example as an Arrow Function:
  increment2: ({ count }) => ({ count: count + 1 }),

  // Async actions are actions that call store.setState():
  incrementAsync(state) {
    setTimeout(() => {
      store.setState({ count: state.count + 1 });
    }, 100);
  }
});

const App = connect("count", actions)(({ count, increment }) => (
  <div>
    <p>Count: {count}</p>
    <button onClick={increment}>Increment</button>
  </div>
));
*/

const debug = (value) => (
  <pre>{JSON.stringify(value, null, 2)}</pre>
);

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
      <div>
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
        {this.props.children}
      </div>
    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {items: [], mode: null};

    store.subscribe(state => this.forceUpdate());
  }

  // shouldComponentUpdate(nextProps, nextState) { }
  // componentWillReceiveProps(nextProps, nextState) { }
  // componentWillMount() { }
  // componentDidMount() { }
  // componentDidUpdate(prevProps, prevState) { }
  // componentWillUnmount() { }

  render() {

    const items = this.state.items;

    // const routes = [{
    //   path: '/',
    //   component: Home
    // }, {
    //   path: '/about',
    //   component: About
    // }, {
    //   path: '/projects/:id',
    //   component: Project
    // }];
    // const content = routes.filter(route => match(route.path)).map(route => <route.component key={route.path} params={{id: 'Did it work?'}} />);

    return (
      <div className="site">
        {/* <Header /> */}
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/projects/brew">Brew</Link>
          <Link to="/projects/argosy">Argosy</Link>
        </nav>

        <div className="content">
          <Route path="/" view={Home} home />
          <Route path="/about" view={About} hello="Colorado" />
          <Route path="/projects/:id" view={props => (
            <Project {...props}><strong>hi {props.params.id}</strong></Project>
          )} />

          {/* <Route path="/projects/:id" view={Project} /> */}
        </div>

        <hr />

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
          {items.map(n => n > 0.5 ? <Tester key={n}>{n}</Tester> : <div key={`key-${n}`}>{n}</div>)}
        </Transition>

        <Canvas />

      </div>
    );
  }
}

export default App;