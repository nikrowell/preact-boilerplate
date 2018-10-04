import { Component, h } from 'preact';
import Tween from 'gsap';
import load from 'load-asset';
// import webfont from 'webfontloader';

// queue.push({
//   source: 'google',
//   families: ['Montserrat:500,800', 'Roboto+Slab:300'],
//   type: loadFont
// });

// function loadFont(config) {
//   return new Promise((resolve, reject) => {
//     webfont.load({
//       [config.source]: {families: config.families},
//       classes: false,
//       active: resolve
//     });
//   });
// }

function loadScript(config) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = config.url;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default class Preloder extends Component {

  constructor(props) {
    super(props);
    console.log('Preloader', props);
  }

  async componentDidMount() {

    const queue = this.props.assets;

    if (window.DEBUG) {
      // queue.push({
      //   url: 'https://unpkg.com/dat.gui',
      //   type: loadScript
      // });
    }

    const assets = await load.all(queue, this.onProgress);
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