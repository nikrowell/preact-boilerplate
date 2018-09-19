import { Component, h } from 'preact';
import { navigate } from './utils';

export default class Link extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    event.preventDefault();
    navigate(this.props.to);
  }

  render() {
    const { to, children } = this.props;
    return <a href={to} onClick={this.onClick}>{children}</a>;
  }
}
