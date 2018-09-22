import { Component, h } from 'preact';
import { Route, match } from '../router';
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
      ready: false,
      assets: null,
      width: null,
      height: null
    };
  }

  componentDidMount() {
    // fetch('http://cranium-api.localhost.com/work/brew?page=12').then(res => res.json()).then(console.log)
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
    this.onResize();
  }

  componentDidUpdate(prevProps, prevState) {

    const { width, height, ready } = this.state;

    webgl.resize(width, height);
    webgl.update(this.props, this.state, prevProps, prevState);

    if (ready && ready !== prevState.ready) {

      webgl.init({
        delay: 0.5,
        assets: this.state.assets
      });

      webgl.start();
      // webgl.animateIn();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('orientationchange', this.resize)
  }

  onLoaded(assets) {
    console.log('onLoaded', assets[0].width, assets[0].height);
    this.setState({ready: true});
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
        assets={this.props.assets}
        onLoaded={this.onLoaded}
        width={this.state.width}
        height={this.state.height}
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

    const content = this.state.ready ? this.renderRoute() : this.renderPreloader();

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