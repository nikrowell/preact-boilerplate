import { Component, render, h } from 'preact';
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

class Transition extends Component {

  constructor(props) {
    super(props);
    const children = this.getChildMapping(this.props.children);
    this.state = {children};
    this.incoming = [];
    this.outgoing = [];
  }

  getChildMapping(children) {
    return children.reduce((result, child) => {
      const key = child.key;
      result[key] = child;
      return result;
    }, {});
  }

  animateIn() {

  }

  animateOut() {

  }

  componentWillReceiveProps(nextProps) {
    const children = Object.assign({}, this.state.children, this.getChildMapping(nextProps.children));
    this.setState({children});
  }

  componentDidUpdate() {

    const incoming = this.incoming;
    const outgoing = this.outgoing;

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

  render() {
    return (
      <div>
        {debug(this.props.mode)}
        {debug(this.state)}
      </div>
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
        <button onClick={e => this.setState({items: items.concat(Math.random())})}>Click Me</button>
        <select value={this.state.mode || 'simultaneous'} onChange={e => this.setState({mode: event.target.value})}>
          <option value="simultaneous">simultaneous</option>
          <option value="in-out">in-out</option>
          <option value="out-in">out-in</option>
        </select>
        <Transition mode={this.state.mode}>
          {items.map(n => <div key={`key-${n}`}>{n}</div>)}
        </Transition>
      </div>
    );
  }
}

render(<App />, document.body);