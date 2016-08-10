const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const util = require('./util.js');

class ImageMapOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: this.props.hovered,
      active: this.props.active
    }
  }

  handleClick = (id, e) => {
    e.preventDefault();
    const active = this.state.active === id ? null : id;
    this.setState({active: active});
    util.isFunction(this.props.onChange) && this.props.onChange('active', active);
  }

  handleHover = (id, on, e) => {
    const hovered = on ? id : null;
    if (hovered !== this.state.hovered) {
      this.setState({hovered: hovered});
      typeof this.props.onChange == 'function' && this.props.onChange('hovered', hovered);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    let state = {};
    if (nextProps.hovered !== this.state.hovered || nextProps.active !== this.state.active) {
      this.setState({
        hovered: nextProps.hovered,
        active: nextProps.active
      });
    } 
  }

  renderTerms = (terms) => {
    return this.props.terms.map(function (item) {
      
      const style = {
        top: item.top, 
        left: item.left, 
        width: item.width, 
        height: item.height
      };
      
      const className = classNames({
        'has-attention': this.state.active === item.id,
        'hover-has-attention': this.state.hovered === item.id
      }, 'image-map_overlay image-map_overlay__' + item.category)

      return (
        <a className={className}
           style={style}
           href={item.category + '-' + item.id}
           key={item.id}
           tabIndex="-1"
           onClick={this.handleClick.bind(null, item.id)}
           onMouseEnter={this.handleHover.bind(null, item.id, true)}
           onMouseLeave={this.handleHover.bind(null, item.id, false)}>
          <span className="u-visually-hidden">{item.term}</span>
        </a>
        )
    }, this);
  }

  render () {
    return <div>{this.renderTerms()}</div>;
  }
}

module.exports = ImageMapOverlay;


