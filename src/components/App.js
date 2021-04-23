import { Component, h } from 'preact';
import { css } from '@emotion/css';
import { match } from '../router';
import TransitionGroup from './TransitionGroup';
import Preloader from './Preloader';
import Header from './Header';
import webgl from '../webgl';
import store from '../store';

// import { connect } from '../store';
// import sound from '../sound';

class Tester extends Component {

  componentDidMount() {
    console.log('Tester.componentDidMount');
    this.unsubscribe = store.subscribe(state => {
      console.log('store change!', state);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  animateIn(done) {
    console.log('Tester.animateIn', this.base);
    done();
  }

  render() {
    return (
      <header>
        <Header />
        <select style={{width:150}} value={this.props.transitionMode} onChange={e => this.props.onChange(e.target.value)}>
          <option value="sync">sync</option>
          <option value="in-out">in-out</option>
          <option value="out-in">out-in</option>
        </select>
      </header>
    );
  }
}

const className = css`
  position: relative;
  z-index: 1;
`;

export default class App extends Component {

  constructor(props) {
    super(props);
    this.onLoaded = this.onLoaded.bind(this);

    this.state = {
      assets: null,
      transition: 'out-in'
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const assets = this.state.assets;
    webgl.update(this.props, this.state, prevProps, prevState);
    if (assets && assets !== prevState.assets) {
      webgl.init({assets});
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('orientationchange', this.resize);
  }

  onLoaded(assets) {
    this.setState({assets});
  }

  renderPreloader() {
    return <Preloader key="preloader" assets={this.props.assets} onComplete={this.onLoaded} />
  }

  renderRoute() {

    const matches = this.props.routes.filter(route => {
      return match(route.path);
    });

    return matches.map(({ component: Section, path, ...props }) => (
      <Section key={path} {...props} {...this.props} {...this.state} />
    ));
  }

  render() {

    const content = this.state.assets === null
      ? this.renderPreloader()
      : this.renderRoute();

    // const routes = this.props.routes;
    // routes.reduce((matches, route) => {
    //   const req = match(route.path);
    //   console.log('req:', req);
    //   return matches;
    // }, []);

    // const content = this.props.routes
    //   .reduce((matches, route) => {
    //     const req = matchPath(window.location.pathname, {path: route.path, exact: true});
    //     console.log(req)
    //     if (req) {
    //       console.log('FOUND ONE!');
    //       matches.push({route, req});
    //     }
    //     return matches;
    //   }, [])
    //   .map(({route, req}) => (
    //     <route.Component key={route.key} {...req} />
    //   ));

    return (
      <div className={className}>
        <TransitionGroup component={props => props.children[0]}>
          {this.state.assets ? <Tester transitionMode={this.state.transition} onChange={transition => this.setState({transition})} /> : null}
        </TransitionGroup>
        <TransitionGroup component="main" className="site-main" mode={this.state.transition}>
          {content}
        </TransitionGroup>
      </div>
    );
  }
}
