import { Component, h } from 'preact';
import Tween from 'gsap';
import Header from '../components/Header';

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