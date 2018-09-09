import { h } from 'preact';
import { Link } from '../router';
import store from '../store';

const Header = props => (
  <header className="site-header">
    <div className="logo">
      <Link to={store.get('site.url')}>{store.get('site.name')}</Link>
    </div>
  </header>
);

export default Header;