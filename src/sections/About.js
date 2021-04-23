import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

function Counter() {
  const [value, setValue] = useState(0);
  return (
    <Fragment>
      <div>Counter: {value}</div>
      <button onClick={() => setValue(value + 1)}>Increment</button>
      <button onClick={() => setValue(value - 1)}>Decrement</button>
    </Fragment>
  )
}

const About = (props) => (
  <div>
    <h1>About</h1>
    <Counter />
    {debug(props)}
  </div>
);

export default About;
