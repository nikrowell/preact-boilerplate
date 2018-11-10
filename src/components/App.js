import { Component, h } from 'preact';
import { match } from '../router';
import TransitionGroup from './TransitionGroup';
import Preloader from './Preloader';
import Header from './Header';
import webgl from '../webgl';
// import sound from '../sound';

import { css } from 'emotion'
const className = css`
  color: hotpink;
`

const SomeComponent = ({ children }) => (
  <div className={className}>
    Some hotpink text.{children}
  </div>
);


class App extends Component {

  constructor(props) {
    super(props);
    this.onLoaded = this.onLoaded.bind(this);
    this.onResize = this.onResize.bind(this);

    this.state = {
      width: null,
      height: null,
      assets: null,
      transitionMode: 'simultaneous'
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
    this.onResize();
  }

  componentDidUpdate(prevProps, prevState) {

    const { width, height, assets } = this.state;

    webgl.resize(width, height);
    webgl.update(this.props, this.state, prevProps, prevState);

    if (assets && assets !== prevState.assets) {
      webgl.init({assets});
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('orientationchange', this.resize)
  }

  onLoaded(assets) {
    this.setState({assets});
  }

  onResize() {
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
        onLoaded={this.onLoaded} />
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
        {...this.state} />
    ));
  }

  render() {

    const content = this.state.assets === null ? this.renderPreloader() : this.renderRoute();

    return (
      <div className="site">
        <Header />
        <SomeComponent />
        <select value={this.state.transitionMode} onChange={e => this.setState({transitionMode: e.target.value})}>
          <option value="simultaneous">simultaneous</option>
          <option value="in-out">in-out</option>
          <option value="out-in">out-in</option>
        </select>
        <TransitionGroup component="main" className="site-main" mode={this.state.transitionMode}>
          {content}
        </TransitionGroup>
        {debug(this.props, {color:'#64E',fontSize:17})}
        {debug(this.state, {color:'#49A',fontSize:17})}
      </div>
    );
  }
}

export default App;