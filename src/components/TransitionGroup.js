import { Component, cloneElement, toChildArray, h } from 'preact';
import { isFunction } from '../utils';

export default class TransitionGroup extends Component {

  constructor(props) {

    super(props);

    const children = this.getChildMapping(this.props.children);
    this.state = {children};

    this.enter = this.enter.bind(this);
    this.leave = this.leave.bind(this);
    this.keysToEnter = [];
    this.keysToLeave = [];
    this.entering = {};
    this.leaving = {};
    this.refs = {};
  }

  componentDidMount() {
    const children = this.state.children;
    for (const key in children) this.enter(key);
  }

  componentWillReceiveProps(nextProps) {

    const prevChildren = this.state.children;
    const nextChildren = this.getChildMapping(nextProps.children);

    this.setState({
      children: Object.assign({}, prevChildren, nextChildren)
    });

    for (const key in nextChildren) {
      const hasPrev = prevChildren.hasOwnProperty(key);
      if (nextChildren[key] && (!hasPrev || this.leaving[key])) {
        this.keysToEnter.push(key);
      }
    }

    for (const key in prevChildren) {
      const hasNext = nextChildren.hasOwnProperty(key);
      if (prevChildren[key] && !hasNext) {
        this.keysToLeave.push(key);
      }
    }
  }

  componentDidUpdate() {

    const keysToEnter = this.keysToEnter;
    const keysToLeave = this.keysToLeave;

    switch (this.props.mode) {

      case 'out-in':
        this.keysToLeave = [];
        if (keysToLeave.length) {
          keysToLeave.forEach(this.leave);
        } else {
          this.keysToEnter = [];
          keysToEnter.forEach(this.enter);
        }
        break;

      case 'in-out':
        this.keysToEnter = [];
        this.keysToLeave = [];
        if (keysToEnter.length) {
          Promise.all(keysToEnter.map(this.enter)).then(() => keysToLeave.forEach(this.leave));
        } else {
          keysToLeave.forEach(this.leave);
        }
        break;

      default:
        this.keysToEnter = [];
        this.keysToLeave = [];
        keysToEnter.forEach(this.enter);
        keysToLeave.forEach(this.leave);
        break;
    }
  }

  getChildMapping(children) {
    return toChildArray(children).reduce((result, child) => {
      child && (result[child.key] = child);
      return result;
    }, {});
  }

  enter(key) {

    const component = this.refs[key];
    const complete = this.enterComplete.bind(this, key);

    const promise = new Promise(resolve => {
      if (component && isFunction(component.animateIn)) {
        component.animateIn(resolve, component.base);
       } else {
         resolve();
       }
    }).then(complete);

    this.entering[key] = promise;
    return promise;
  }

  enterComplete(key) {
    delete this.entering[key];
    const currentChildren = this.state.children;
    if (!currentChildren.hasOwnProperty(key)) {
      this.leave(key);
    }
  }

  leave(key) {

    const component = this.refs[key];
    const complete = this.leaveComplete.bind(this, key);

    const promise = new Promise(resolve => {
      if (component && isFunction(component.animateOut)) {
        component.animateOut(resolve, component.base);
      } else {
        resolve();
      }
    }).then(complete);

    this.leaving[key] = promise;
    return promise;
  }

  leaveComplete(key) {
    const children = this.state.children;
    delete children[key];
    delete this.leaving[key];
    this.setState({children});
  }

  render() {

    const children = this.state.children;
    const { component, mode, ...props } = this.props;

    return h(component || 'div', props, Object.keys(children).map(key => {
      return cloneElement(children[key], {ref: el => this.refs[key] = el});
    }));
  }
}
