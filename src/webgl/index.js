import { Renderer, Camera, Transform, Texture, Program, Mesh, Plane } from 'ogl';
import Tween from 'gsap';


function createGraphic(size, draw) {
  const [ width, height ] = Array.isArray(size) ? size : [size, size];
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  const result = draw.call(context, context, width, height);
  return typeof result === 'undefined' ? context : result;
}


const renderer = new Renderer({dpr: window.devicePixelRatio || 1});
const scene = new Transform();

const gl = renderer.gl;
gl.clearColor(1, 1, 1, 1);
gl.canvas.className = 'webgl';

const camera = new Camera(gl, {fov: 45});
camera.position.z = 10;


const texture = new Texture(gl, {
  image: createGraphic(256, (context, width) => {
    const radius = width / 2;
    const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 156, 1, 1)');
    gradient.addColorStop(0.6, 'rgba(243, 81, 1, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, width);
    return context.canvas;
  })
});

const vertexShader = `
precision highp float;
precision highp int;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
precision highp float;
precision highp int;
uniform sampler2D texture;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(texture, vUv);
}`;

const program = new Program(gl, {
  vertexShader,
  fragmentShader,
  uniforms: {
    texture: {value: texture},
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






const mouse = { x: 0, y: 0 };

function traverse(fn, ...args) {
  scene.traverse(child => {
    isFunction(child[fn]) && child[fn].apply(child, args);
  });
}

// function getMousePosition(event) {
//   const x = (event.touches) ? event.touches[0].clientX : event.clientX;
//   const y = (event.touches) ? event.touches[0].clientY : event.clientY;
//   return [ x, y ];
// }

function onMouseDown(event) {
  // mouse.x =  2 * (event.clientX / this.width) - 1;
  // mouse.y = -2 * (event.clientY / this.height) + 1;
  // child objects receive event and normalized pos (using touches[0]
  // onMouseDown('onMouseUp', mouse);
}

function onMouseMove(event) {
  // traverse('onMouseMove', mouse);
}

function onMouseUp(event) {
  // traverse('onMouseUp', mouse);
}

class WebGL {

  constructor() {
    this.raf = null;
    this.width;
    this.height;
    this.animate = this.animate.bind(this);
  }

  init(options) {

    const body = document.body;

    body.appendChild(gl.canvas);

    body.addEventListener('mousemove', event => {
      mouse.x =  2 * (event.clientX / this.width) - 1;
      mouse.y = -2 * (event.clientY / this.height) + 1;
    });

    // body.addEventListener('mousedown', onMouseDown);
    // body.addEventListener('touchstart', onMouseDown);
    // body.addEventListener('mousemove', onMouseMove);
    // body.addEventListener('touchmove', onMouseMove);
    // body.addEventListener('mouseup', onMouseUp);
    // body.addEventListener('touchend', onMouseUp);
    // body.addEventListener('touchcancel', onMouseUp);

    // traverse('init', options);
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
      this.width = width;
      this.height = height;
      renderer.setSize(width, height);
      camera.perspective({aspect: gl.canvas.width / gl.canvas.height});
      this.draw();
    }

    return this;
  }

  update(props, state, prevProps, prevState) {
    console.log('webgl.update');
    // traverse('update', props, state, prevProps, prevState);
  }

  draw() {
    console.log('webgl.draw');
  }

  animate(t) {

    if (this.raf === null) return;
    requestAnimationFrame(this.animate);

    plane.rotation.x += (-mouse.y - plane.rotation.x) * 0.05;
    plane.rotation.y += ( mouse.x - plane.rotation.y) * 0.05;
    // program.uniforms.time.value = t * 0.001;
    renderer.render({scene, camera});
  }
}

const instance = new WebGL();
export default instance;