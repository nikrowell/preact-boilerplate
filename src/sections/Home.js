import { Component, h } from 'preact';
import gsap from 'gsap';

export default class Home extends Component {

  componentDidMount() {
    gsap.set(this.base, {autoAlpha: 0});
  }

  animateIn(done) {
    console.log('Home.animateIn');
    // done();
    gsap.to(this.base, {
      duration: 1,
      autoAlpha: 1,
      onComplete: done
    });
  }

  animateOut(done) {
    console.log('Home.animateOut');
    // done();
    gsap.to(this.base, {
      duration: 1,
      autoAlpha: 0,
      onComplete: done
    });
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
        {debug(this.props)}
      </div>
    );
  }
}
