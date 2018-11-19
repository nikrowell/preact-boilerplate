import { h } from 'preact';
import { css } from 'emotion';
import { Link } from '../router';

const logo = css`
  width: 180px;
  height: 100px;
  position: relative;

  a {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #BADA55;
    text-indent: -9999px;
  }
`;

const nav = css`
  margin: 20px;

  a {
    display: inline-block;
    margin-right: 5px;
    padding: 6px 12px;
    color: #FFF;
    background: #333;
    text-decoration: none;
  }
`;

const Header = props => (
  <header className="site-header">
    <div className={logo}>
      <Link to="/">Preact Boilerplate</Link>
    </div>
    <nav className={nav}>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/projects/brew">Brew</Link>
      <Link to="/projects/argosy">Argosy</Link>
    </nav>
  </header>
);

export default Header