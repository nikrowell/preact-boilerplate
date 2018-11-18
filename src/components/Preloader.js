import { Component, h } from 'preact';
import { css } from 'emotion';
import Tween from 'gsap';
import load from 'load-asset';

const className = css`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  font-family: 'Playfair Display', serif;
	font-size: 6rem;
	font-weight: 700;
  text-transform: lowercase;
  color: rgba(22,22,22,1);
  background-color: rgba(255,255,255,0.9);
  user-select: none;

  .mask {
    position: absolute;
    overflow: hidden;
    transform: translateX(-100%);
    transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
  }
  .progress-text {
    transform: translateX(100%);
    transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
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

  async componentDidMount() {
    const queue = this.props.assets;
    const assets = await load.all(queue, this.onProgress.bind(this));
    this.props.onLoaded(assets);
  }

  animateIn(done) {
    Tween.fromTo(this.base, 0.5, {
      autoAlpha: 0,
      y: 20
    }, {
      autoAlpha: 1,
      y: 0,
      onComplete: done
    });
  }

  animateOut(done) {
    Tween.to(this.base, 1, {
      autoAlpha: 0,
      delay: 1,
      onComplete: done
    });
  }

  onProgress(event) {
    console.log(event);
    this.setState({progress: event.progress});
  }

  render() {

    const translate = (1 - this.state.progress) * 100;
    const style = {transform: `translateX(${translate})`};

    return (
      <div className={className}>
        <div class="mask" aria-hidden="true" style={style}>
          <div class="progress-text" style={style}>Preloader</div>
        </div>
        <div class="static-text">Preloader</div>
      </div>
    );
  }
}