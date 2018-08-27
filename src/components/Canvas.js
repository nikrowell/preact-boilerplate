import { Component, h } from 'preact';

class Canvas extends Component {

  constructor(props) {

    super(props);

    this.state = {
      width: null,
      height: null,
      mouse: null
    };

    this.ctx = null;
    this.raf = null;
    this.onMousemove = this.onMousemove.bind(this);
    this.onResize = this.onResize.bind(this);
    this.draw = this.draw.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.ctx = this.base.getContext('2d');
    window.addEventListener('mousemove', this.onMousemove);
    window.addEventListener('resize', this.onResize);
    this.onResize();
    requestAnimationFrame(this.draw);
  }

  onMousemove(event) {
    this.setState({mouse: {
      x: event.pageX,
      y: event.pageY
    }});
  }

  onResize(event) {
    const scale = window.devicePixelRatio || 1;
    this.base.width = window.innerWidth * scale;
    this.base.height = window.innerHeight * scale;
    this.ctx.scale(scale, scale);
  }

  draw(time) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.base.width, this.base.height);
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#F00';
    ctx.fill();
    this.raf = requestAnimationFrame(this.draw);
  }

  render() {
    console.log('Canvas.render');
    return <canvas className="canvas" />;
  }
}

export default Canvas;