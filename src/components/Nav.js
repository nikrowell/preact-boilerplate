import { h } from 'preact';
import { Link } from '../router';

const Nav = props => (
  <nav className="nav">
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/projects/brew">Brew</Link>
      <Link to="/projects/argosy">Argosy</Link>
    </div>
  </nav>
);

export default Nav;