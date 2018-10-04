import { h } from 'preact';

const About = (props) => (
  <div>
    <h1>About</h1>
    {debug(props)}
  </div>
);

export default About;