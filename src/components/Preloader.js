import { Component, h } from 'preact';
import Tween from 'gsap';
import load from 'load-asset';

export default class Preloder extends Component {

  constructor(props) {
    super(props);
    console.log('Preloader', props);
  }

  async componentDidMount() {
    const assets = await load.all(this.props.assets, this.onProgress);
    this.props.onLoaded(assets);
  }

  animateIn(done) {
    Tween.fromTo(this.base, 0.5, {
      autoAlpha: 0,
      y: 100
    }, {
      autoAlpha: 1,
      y: 0,
      onComplete: done
    });
  }

  animateOut(done) {
    Tween.to(this.base, 1, {
      autoAlpha: 0,
      onComplete: done
    });
  }

  onProgress(event) {
    console.log('onProgress', event);
  }

  render() {
    return (
      <div className="preloader">
        prealoder.....
      </div>
    );
  }
}