import {Renderer, Geometry, Program, Mesh, Color } from 'ogl';

export default class Canvas {
  constructor() {
    console.log('Canvas!');
  }
}

const renderer = new Renderer();
const gl = renderer.gl;
gl.canvas.className = 'webgl';
document.body.appendChild(gl.canvas);
gl.clearColor(1, 1, 1, 1);
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize, false);
resize();
// Triangle that covers viewport, with UVs that still span 0 > 1 across viewport
const geometry = new Geometry(gl, {
    position: {size: 3, data: new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0])},
    uv: {size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2])},
});
const program = new Program(gl, {
    vertexShader: `
    precision highp float;
    precision highp int;
    attribute vec2 uv;
    attribute vec3 position;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
    `,
    fragmentShader: `
    precision highp float;
    precision highp int;
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
        gl_FragColor.rgb = 0.5 + 0.3 * cos(vUv.xyx + uTime) + uColor;
        gl_FragColor.a = 1.0;
    }
    `,
    uniforms: {
        uTime: {value: 0},
        uColor: {value: new Color([0.3, 0.2, 0.5])}
    },
});
const mesh = new Mesh(gl, {geometry, program});
requestAnimationFrame(update);
function update(t) {
    requestAnimationFrame(update);
    program.uniforms.uTime.value = t * 0.001;
    // Don't need a camera if camera uniforms aren't required
    renderer.render({scene: mesh});
}