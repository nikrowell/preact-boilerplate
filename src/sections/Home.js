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
        {debug(this.props)}
      </div>
    );
  }
}