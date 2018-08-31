import mitt from 'mitt';
const emitter = mitt();
const { on, off, emit } = emitter;
export { on, off, emit };
export default emitter;