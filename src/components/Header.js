import { Component, h } from 'preact';
import { connect, actions } from '../store';

class Header extends Component {

  constructor(props) {
    super(props);
    console.log('Header constructor', props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    this.props.increment();
  }

  render() {
    console.log('Header render', this.props);
    return (
      <header>
        <h1>Header: {this.props.count}</h1>
        <button onClick={this.onClick}>Click Me</button>
      </header>
    );
  }
}

export default connect('count', actions)(Header);