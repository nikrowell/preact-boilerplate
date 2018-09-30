import { Component, h } from 'preact';
import { match } from '../router';
import TransitionGroup from './TransitionGroup';
import Preloader from './Preloader';
import Header from './Header';
import webgl from '../webgl';

class App extends Component {

  constructor(props) {
    super(props);
    this.onLoaded = this.onLoaded.bind(this);
    this.onResize = this.onResize.bind(this);

    this.state = {
      width: null,
      height: null,
      assets: null
    };
  }

  componentDidMount() {
    // fetch('http://cranium-api.localhost.com/work/brew?page=12').then(res => res.json()).then(console.log)
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
    this.onResize();
  }

  componentDidUpdate(prevProps, prevState) {

    const { width, height, assets } = this.state;

    webgl.resize(width, height);
    webgl.update(this.props, this.state, prevProps, prevState);

    if (assets && assets !== prevState.assets) {
      webgl.init({assets}).start().animateIn();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('orientationchange', this.resize)
  }

  onLoaded(assets) {
    this.setState({assets});
  }

  onResize(event) {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  renderPreloader() {
    return (
      <Preloader
        key="preloader"
        width={this.state.width}
        height={this.state.height}
        assets={this.props.assets}
        onLoaded={this.onLoaded}
      />
    );
  }

  renderRoute() {

    const matches = this.props.routes.filter(route => {
      return match(route.path);
    });

    return matches.map(({ component:Section, path, ...props }) => (
      <Section
        key={path}
        {...props}
        {...this.props}
        {...this.state}
      />
    ));
  }

  render() {

    const content = this.state.assets ? this.renderRoute() : this.renderPreloader();

    return (
      <div className="site">
        <Header />
        <TransitionGroup component="main" className="site-main" mode={this.state.transitionMode}>
          {content}
        </TransitionGroup>
        {/* <main className="site-main" style={{padding:20,background:'#EEE'}}>
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