import Home from './sections/Home';
import About from './sections/About';
import Project from './sections/Project';

export default [{
  path: '/',
  component: Home
}, {
  path: '/about',
  component: About
}, {
  path: '/projects/:id',
  component: Project
}];