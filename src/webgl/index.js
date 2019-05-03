import { Renderer, Transform, Camera, Program, Mesh, Plane, Raycast, Vec2, Vec4 } from 'ogl';
import { isFunction } from '../utils';
import Tween from 'gsap';

const renderer = new Renderer({dpr: window.devicePixelRatio || 1});

const gl = renderer.gl;
gl.clearColor(1, 1, 1, 1);
gl.canvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;';

const scene = new Transform();
const camera = new Camera(gl, {fov: 45});
camera.position.z = 3;

const program = new Program(gl, {
  vertex: `
  precision highp float;
  precision highp int;
  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;
  uniform mat3 normalMatrix;
  attribute vec3 position;
  attribute vec3 normal;
  varying vec3 vNormal;

  void main() {
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
  fragment: `
  precision highp float;
  precision highp int;
  uniform float alpha;
  uniform float hit;
  varying vec3 vNormal;

  void main() {
    vec3 normal = normalize(vNormal);
    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
    vec3 color = mix(vec3(0.2, 0.8, 1.0), vec3(1.0, 0.2, 0.8), hit);
    gl_FragColor = vec4(color + lighting * 0.15, alpha);

  }`,
  uniforms: {
    time: {value: 0},
    alpha: {value: 0},
    hit: {value: 0}
  },
  transparent: true,
  cullFace: null
});

const plane = new Mesh(gl, {
  program,
  geometry: new Plane(gl, 1)
});
plane.setParent(scene);

const raycast = new Raycast(gl);

class WebGL {

  constructor() {
    this.width;
    this.height;
    // this.renderer;
    // this.gl;
    // this.camera;
    this.scene = scene;
    this.resolution = new Vec2();
    this.mouse = new Vec4();
    this.click = new Vec2();
    this.raf = null;
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
  }

  init(options) {

    if (window.DEBUG && window.dat) {
      // const config = {age: 45, color: '#FF0000'};
      // const gui = new dat.GUI();
      // gui.domElement.parentElement.style.zIndex = 1000;
      // gui.add(config, 'age', 0, 100);
      // gui.addColor(config, 'color');
    }

    window.addEventListener('resize', this.resize);
    window.addEventListener('orientationchange', this.resize);
    this.resize();

    document.body.appendChild(gl.canvas);
    document.addEventListener('mousedown',   e => this.onTouchEvent(e, 'onTouchStart'));
    document.addEventListener('touchstart',  e => this.onTouchEvent(e, 'onTouchStart'));
    document.addEventListener('mousemove',   e => this.onTouchEvent(e, 'onTouchMove'));
    document.addEventListener('touchmove',   e => this.onTouchEvent(e, 'onTouchMove'));
    document.addEventListener('mouseup',     e => this.onTouchEvent(e, 'onTouchEnd'));
    document.addEventListener('touchend',    e => this.onTouchEvent(e, 'onTouchEnd'));
    document.addEventListener('touchcancel', e => this.onTouchEvent(e, 'onTouchEnd'));

    this.traverse('init', options);
    this.start();
    this.animateIn();
  }

  traverse(fn, ...args) {
    this.scene.traverse(child => {
      isFunction(child[fn]) && child[fn].apply(child, args);
    });
  }

  onTouchEvent(event, fn) {

    if (this.raf === null) return;

    const x = (event.touches) ? event.touches[0].clientX : event.clientX;
    const y = (event.touches) ? event.touches[0].clientY : event.clientY;

    if (event.type === 'mousedown' || event.type === 'touchstart') {
      this.click.set(x, y);
    } else if(event.type === 'mousemove' || event.type === 'touchmove') {
      // TODO: store previous mouse position or projected position?
      // this.mouse.set(x, y, this.mouse.x, this.mouse.y);
      // const z =  2 * (x / this.width) - 1;
      // const w = -2 * (y / this.height) + 1;
      // this.mouse.set(x, y, z, w);
      this.mouse.set(
        2.0 * (x / this.width) - 1.0,
        2.0 * (1.0 - y / this.height) - 1.0
      );
      raycast.castMouse(camera, this.mouse);
      const hit = raycast.intersectBounds(plane);
      program.uniforms.hit.value = hit.length;
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

  resize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

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

  animateIn(options) {

    Tween.to(plane.program.uniforms.alpha, 2, {value: 1});
    Tween.fromTo(plane.position, 2, {
      y: -2
    }, {
      y: 0,
      ease: Expo.easeOut
    });

    this.traverse('animateIn', options);
  }

  animate(t) {

    if (this.raf === null) return;
    requestAnimationFrame(this.animate);

    plane.rotation.x += (  this.mouse.y - plane.rotation.x) * 0.05;
    plane.rotation.y += ( -this.mouse.x - plane.rotation.y) * 0.05;

    const uniforms = {
      resolution: this.resolution,
      mouse: this.mouse,
      click: this.click,
      time: t * 0.001
    };

    this.traverse('animate', uniforms);
    this.render();
  }

  render() {
    renderer.render({scene, camera});
  }
}

const instance = new WebGL();
export default instance;