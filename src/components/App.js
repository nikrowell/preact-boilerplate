import { Component, h } from 'preact';
import { Route } from '../router';
import Transition from '../transition';
import Header from './Header';
import Footer from './Footer';
import Canvas from './Canvas';
import Nav from './Nav';
import store from '../store';

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
    {debug(props)}
  </div>
);

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        {debug(this.props, {color:'#F4E',fontSize:17})}
      </div>
    );
  }
}

class Project extends Component {
  render() {
    return (
      <div>
        {debug(this.props)}
        {this.props.children}
      </div>
    );
  }
}



class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content: null,
      items: [],
      mode: null
    };
  }

  componentWillMount() {
    // fetch(`${store.get('site.api')}/pages/home`)
    //   .then(res => res.json())
    //   .then(res => this.setState({content: res.content}));
  }

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
        <Header />
        <Nav />
        {debug(store.getState())}
        <div dangerouslySetInnerHTML={{__html: this.state.content}} />

        <div className="content">
          <Route path="/" render={Home} home />
          <Route path="/about" render={About} hello="Colorado" />
          <Route path="/projects/:id" render={Project} />
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

        <Footer />
        <Canvas />

      </div>
    );
  }
}

export default App;