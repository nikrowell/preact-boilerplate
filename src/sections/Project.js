import { Component, h } from 'preact';
import gsap from 'gsap';

export default class Project extends Component {

  componentDidUpdate(prevProps, nextProps) {
    console.log('componentDidUpdate', prevProps, nextProps);
  }

  componentDidMount() {
    gsap.set(this.base, {autoAlpha: 0, x: -100});
  }

  animateIn(done, el) {
    gsap.to(el, {
      duration: 1,
      autoAlpha: 1,
      x: 0,
      ease: 'elastic.out',
      onComplete: done
    });
  }

  animateOut(done, el) {
    gsap.to(el, {
      duration: 1,
      autoAlpha: 0,
      x: -100,
      ease: 'expo.out',
      onComplete: done
    });
  }

  render() {
    return (
      <div>
        <h1>Project</h1>
        {debug(this.props)}
      </div>
    );
  }
}
