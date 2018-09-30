import { Renderer, Camera, Transform, Program, Mesh, Plane, Vec2, Vec4 } from 'ogl';
import { isFunction } from '../utils';

const renderer = new Renderer({dpr: window.devicePixelRatio || 1});
const scene = new Transform();

const gl = renderer.gl;
gl.clearColor(1, 1, 1, 1);
gl.canvas.className = 'webgl';

const camera = new Camera(gl, {fov: 45});
camera.position.z = 10;

const vertexShader = `
precision highp float;
precision highp int;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
precision highp float;
precision highp int;

void main() {
  gl_FragColor = vec4(1.0,0,0,1.0);
}`;

const program = new Program(gl, {
  vertexShader,
  fragmentShader,
  uniforms: {
    time: {value: 0}
  },
  cullFace: null // Don't cull faces so that plane is double sided
});

const plane = new Mesh(gl, {
  program,
  geometry: new Plane(gl, 3)
});

// plane.position.set(0, 0, 0);
plane.setParent(scene);

class WebGL {

  constructor() {
    this.width;
    this.height;
    // this.renderer;
    // this.camera;
    this.scene = scene;
    this.resolution = new Vec2();
    this.mouse = new Vec4();
    this.click = new Vec2();
    this.raf = null;
    this.animate = this.animate.bind(this);
  }

  init(options) {

    /* if (gui) { // assume it can be falsey, e.g. if we strip dat-gui out of bundle
      // attach dat.gui stuff here as usual
      const folder = gui.addFolder('honeycomb');
      const settings = {
        colorA: this.material.uniforms.colorA.value.getStyle(),
        colorB: this.material.uniforms.colorB.value.getStyle()
      };
      const update = () => {
        this.material.uniforms.colorA.value.setStyle(settings.colorA);
        this.material.uniforms.colorB.value.setStyle(settings.colorB);
      };
      folder.addColor(settings, 'colorA').onChange(update);
      folder.addColor(settings, 'colorB').onChange(update);
      folder.open();
    } */

    document.body.appendChild(gl.canvas);
    this.addEvents();
    this.traverse('init', options);
    return this;
  }

  addEvents() {
    document.addEventListener('mousedown', e => this.onTouchEvent(e, 'onTouchStart'));
    document.addEventListener('touchstart', e => this.onTouchEvent(e, 'onTouchStart'));
    document.addEventListener('mousemove', e => this.onTouchEvent(e, 'onTouchMove'));
    document.addEventListener('touchmove', e => this.onTouchEvent(e, 'onTouchMove'));
    document.addEventListener('mouseup', e => this.onTouchEvent(e, 'onTouchEnd'));
    document.addEventListener('touchend', e => this.onTouchEvent(e, 'onTouchEnd'));
    document.addEventListener('touchcancel', e => this.onTouchEvent(e, 'onTouchEnd'));
  }

  onTouchEvent(event, fn) {

    const x = (event.touches) ? event.touches[0].clientX : event.clientX;
    const y = (event.touches) ? event.touches[0].clientY : event.clientY;

    if (event.type === 'mousedown' || event.type === 'touchstart') {
      this.click.set(x, y);
    } else if(event.type === 'mousemove' || event.type === 'touchmove') {
      this.mouse.set(x, y, this.mouse.x, this.mouse.y);
    }

    this.traverse(fn, event, {
      mouse: this.mouse,
      click: this.click
    });
  }

  start() {
    if (this.raf !== null) return;
    this.raf = requestAnimationFrame(this.animate);
    return this;
  }

  stop() {
    if (this.raf === null) return;
    cancelAnimationFrame(this.raf);
    this.raf = null;
    return this;
  }

  resize(width, height) {

    if (width !== this.width || height !== this.height) {
      renderer.setSize(width, height);
      camera.perspective({aspect: gl.canvas.width / gl.canvas.height});
      this.width = width;
      this.height = height;
      this.resolution.set(width, height);
      this.render();
    }

    return this;
  }

  update(props, state, prevProps, prevState) {
    this.traverse('update', props, state, prevProps, prevState);
  }

  render() {
    renderer.render({scene, camera});
  }

  animate(t) {

    if (this.raf === null) return;
    requestAnimationFrame(this.animate);

    const mouseX =  2 * (this.mouse.x / this.width) - 1;
    const mouseY = -2 * (this.mouse.y / this.height) + 1;
    plane.rotation.x += (-mouseY - plane.rotation.x) * 0.05;
    plane.rotation.y += ( mouseX - plane.rotation.y) * 0.05;

    const uniforms = {
      resolution: this.resolution,
      mouse: this.mouse,
      click: this.click,
      time: t * 0.001
    };

    this.traverse('animate', uniforms);
    this.render();
  }

  animateIn(options) {
    console.log('webgl animateIn');
    this.traverse('animateIn', options);
  }

  traverse(fn, ...args) {
    this.scene.traverse(child => {
      isFunction(child[fn]) && child[fn].apply(child, args);
    });
  }
}

const instance = new WebGL();
export default instance;