import { Component, h } from 'preact';
import Tween from 'gsap';

export default class Project extends Component {

  componentDidUpdate(prevProps, nextProps) {
    console.log('componentDidUpdate', prevProps, nextProps);
  }

  componentDidMount() {
    Tween.set(this.base, {autoAlpha: 0, x: -100});
  }

  animateIn(done, el) {
    // Tween.fromTo ?
    Tween.to(el, 1, {
      autoAlpha: 1,
      x: 0,
      ease: Elastic.easeOut.config(1, 0.3),
      onComplete: done
    });
  }

  animateOut(done, el) {
    Tween.to(el, 1, {
      autoAlpha: 0,
      x: -100,
      ease: Expo.easeIn,
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