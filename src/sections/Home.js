import { Component, h } from 'preact';
import Tween from 'gsap';
import Header from '../components/Header';


import { css } from 'emotion';
const className = css`
  color: hotpink;
  margin: 5px;
  display: inline-block;
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 10px;
`

const SomeComponent = ({ children }) => (
  <div className={className}>
    Some hotpink text.{children}
  </div>
);


export default class Home extends Component {

  // componentDidMount() {
  //   Tween.set(this.base, {autoAlpha: 0});
  // }

  animateIn(done) {
    console.log('Home.animateIn');
    // done();
    Tween.to(this.base, 1, {
      autoAlpha: 1,
      onComplete: done
    });
  }

  animateOut(done) {
    console.log('Home.animateOut');
    // done();
    Tween.to(this.base, 1, {
      autoAlpha: 0,
      onComplete: done
    });
  }

  render() {
    return (
      <div>
        <Header />
        <SomeComponent />
        <h1>Home</h1>
        <select value={this.state.transitionMode} onChange={e => this.setState({transitionMode: e.target.value})}>
          <option value="simultaneous">simultaneous</option>
          <option value="in-out">in-out</option>
          <option value="out-in">out-in</option>
        </select>
        {debug(this.props)}
      </div>
    );
  }
}