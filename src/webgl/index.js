import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

const renderer = new Renderer();
const gl = renderer.gl;

gl.clearColor(1, 1, 1, 1);
gl.canvas.className = 'webgl';
document.body.appendChild(gl.canvas);

const camera = new Camera(gl, {fov: 15});
camera.position.z = 15;

const num = 100;
const position = new Float32Array(num * 3);
const random = new Float32Array(num * 4);
for (let i = 0; i < num; i++) {
  position.set([Math.random(), Math.random(), Math.random()], i * 3);
  random.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
}

const geometry = new Geometry(gl, {
  position: {size: 3, data: position},
  random: {size: 4, data: random},
});

const program = new Program(gl, {
  vertexShader: `
  precision highp float;
  precision highp int;
  attribute vec3 position;
  attribute vec4 random;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  varying vec4 vRandom;
  void main() {
  vRandom = random;

  // positions are 0->1, so make -1->1
  vec3 pos = position * 2.0 - 1.0;

  // Scale towards camera to be more interesting
  pos.z *= 10.0;

  // modelMatrix is one of the automatically attached uniforms when using the Mesh class
  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  // add some movement in world space
  float t = uTime * 0.6;
  mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
  mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
  mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

  // get the model view position so that we can scale the points off into the distance
  vec4 mvPos = viewMatrix * mPos;
  gl_PointSize = 300.0 / length(mvPos.xyz) * (random.x + 0.1);
  gl_Position = projectionMatrix * mvPos;

  }
  `,
  fragmentShader: `
  precision highp float;
  precision highp int;
  uniform float uTime;
  varying vec4 vRandom;
  void main() {
  vec2 uv = gl_PointCoord.xy;

  float circle = smoothstep(0.5, 0.4, length(uv - 0.5)) * 0.8;

  gl_FragColor.rgb = 0.8 + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28) + vec3(0.1, 0.0, 0.3);
  gl_FragColor.a = circle;
  }
  `,
  uniforms: {
  uTime: {value: 0},
  },
  transparent: true,
  depthTest: false,
});

// Make sure mode is gl.POINTS
const particles = new Mesh(gl, {mode: gl.POINTS, geometry, program});
requestAnimationFrame(update);

function update(t) {
  requestAnimationFrame(update);
  // add some slight overall movement to be more interesting
  particles.rotation.x = Math.sin(t * 0.0002) * 0.1;
  particles.rotation.y = Math.cos(t * 0.0005) * 0.15;
  particles.rotation.z += 0.01;
  program.uniforms.uTime.value = t * 0.001;
  renderer.render({scene: particles, camera});
}



class WebGL {

  constructor() {
    this.width;
    this.height;
    this.raf = null;
    console.log('webgl!');
    // this.resize();
  }

  resize(width, height) {
    renderer.setSize(width, height);
    camera.perspective({aspect: gl.canvas.width / gl.canvas.height});
    // draw a frame to ensure the new size has been registered visually
    // this.draw();
    // return this;
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

  animateIn() {
    console.log('webgl animateIn!');
  }

  animate(t) {
    if (this.raf === null) return;
    window.requestAnimationFrame(this.animate);
  }
}

const instance = new WebGL();
export default instance;
