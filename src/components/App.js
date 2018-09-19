import { Component, h } from 'preact';
import { Route, match } from '../router';
import Transition from './Transition';
import Header from './Header';
import Canvas from './Canvas';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {transitionMode: 'simultaneous'};
    this.onLinkClick = this.onLinkClick.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('click', this.onLinkClick);
    // fetch(`${store.getState().site.api}/pages/home`)
    fetch('http://cranium-api.localhost.com/work/brew?page=12')
      .then(res => res.json())
      .then(console.log)
      // .then(res => this.setState({content: res.content}));
  }

  onLinkClick(event) {
    const link = event.target;
    if (false) {
      event.preventDefault();
      navigate(link.href);
    }
  }

  render() {

    const content = this.props.routes
      .filter(route => match(route.path))
      .map(({ component:Section, path, ...props }) => <Section key={path} {...props} />);

    return (
      <div className="site">

        <Header />

        <select value={this.state.transitionMode} onChange={e => this.setState({transitionMode: event.target.value})}>
          <option value="simultaneous">simultaneous</option>
          <option value="in-out">in-out</option>
          <option value="out-in">out-in</option>
        </select>

        <small style={{display:'block',margin:10}}>Using routes array with Transition</small>
        <Transition component="main" className="site-main" mode={this.state.transitionMode}>
          {content}
        </Transition>

        {/* <small style={{display:'block',margin:10}}>Using Route instances</small>
        <main className="site-main" style={{padding:20,background:'#EEE'}}>
          {this.props.routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              render={route.component} />
          ))}
        </main> */}

        {debug(this.props, {color:'#64E',fontSize:17})}
        {debug(this.state, {color:'#49A',fontSize:17})}
      </div>
    );
  }
}

export default App;