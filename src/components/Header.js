import { h } from 'preact';
import { Link } from '../router';

const Header = props => (
  <header className="site-header">
    <div className="logo">
      <Link to="/">Preact Boilerplate</Link>
    </div>
    <nav className="nav">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/projects/brew">Brew</Link>
      <Link to="/projects/argosy">Argosy</Link>
    </nav>
  </header>
);

export default Header;