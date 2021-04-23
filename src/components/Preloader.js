import { Component, h } from 'preact';
import { css } from '@emotion/css';
import gsap from 'gsap';
import load from 'load-asset';

const className = css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  font-size: 6rem;
  font-family: 'Playfair Display', serif;
	font-weight: 700;
  text-transform: lowercase;
  color: rgba(22,22,22,1);
  background-color: rgba(255,255,255,0.9);
  user-select: none;

  .mask {
    position: absolute;
    overflow: hidden;
    transform: translateX(-100%);
    transition: transform 1s cubic-bezier(0.77, 0, 0.175, 1);
  }
  .progress-text {
    transform: translateX(100%);
    transition: transform 1s cubic-bezier(0.77, 0, 0.175, 1);
  }
  .static-text {
    outline: #F00 1px dotted;
    opacity: 0.1;
  }
`;

export default class Preloder extends Component {

  constructor(props) {
    super(props);
    this.state = {progress: 0};
  }

  componentDidMount() {
    const assets = this.props.assets;
    const onProgress = this.onProgress.bind(this);
    const onComplete = this.onComplete.bind(this);
    load.all(assets, onProgress).then(onComplete);
  }

  animateIn(done) {
    gsap.fromTo(this.base, {
      duration: 0.5,
      autoAlpha: 0,
      y: 20
    }, {
      autoAlpha: 1,
      y: 0,
      onComplete: done
    });
  }

  animateOut(done) {
    gsap.to(this.base, {
      duration: 1,
      autoAlpha: 0,
      onComplete: done
    });
  }

  onProgress(event) {
    this.setState({progress: event.progress});
  }

  onComplete(assets) {
    console.log('onComplete', assets);
    const transitionEnd = (event) => {
      this.base.removeEventListener('transitionend', transitionEnd);
      this.props.onComplete(assets);
    };
    this.base.addEventListener('transitionend', transitionEnd);
  }

  render() {

    const translate = (1 - this.state.progress) * 100;

    return (
      <div className={className}>
        <div class="mask" style={{transform: `translateX(${translate * -1}%)`}} aria-hidden="true">
          <div class="progress-text" style={{transform: `translateX(${translate}%)`}}>Preloader</div>
        </div>
        <div class="static-text">Preloader</div>
      </div>
    );
  }
}
