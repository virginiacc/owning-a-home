var React = require('react');

/**
* Input.
*
* If optional formatter function is passed in,
* formats the contents of an input when it is not focused,
* and removes the formatting while input is active.
* 
* Type defaults to "text"; pass in "numeric=true" for
* number input.
*/

var Input = React.createClass({
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    formatter: React.PropTypes.func,
    numeric: React.PropTypes.bool
  },

  getInitialState: function () {
    return {
      value: this.props.value,
      displayValue: this.format(this.props.value)
    };
  },
  
  getDefaultProps: function() {
    return {
      numeric: false
    };
  },

  format: function (val) {
    return typeof this.props.formatter === 'function' ? this.props.formatter(val) : val;
  },

  blur: function () {
    var val = this.props.value;
    this.setState({
      focused: false,
      displayValue: this.format(val)
    }, function () {
      typeof this.props.onBlur == 'function' && this.props.onBlur(this.state.value);    
    });
  },

  change: function (e) {
    var val = e.target.value;
    this.setState({
      value: val,
      displayValue: val
    }, function () {
      typeof this.props.onChange == 'function' && this.props.onChange(val);
    });
  },

  focus: function () {
    this.setState({
      focused: true,
      displayValue: this.state.value
    }, function () {
      typeof this.props.onFocus == 'function' && this.props.onFocus(this.state.value);
    });
  },

  componentWillReceiveProps: function (props) { 
    // update value if props.value is different than state.value
    if (props.value != this.state.value) {
      this.setState({
        value: props.value,
        displayValue: this.state.focused ? props.value : this.format(props.value)
      });
    }
  },
  
  shouldComponentUpdate: function (nextProps, nextState) {
    // re-render if displayValue has changed
    return this.state.displayValue !== nextState.displayValue;
  },

  render: function () {
    console.log('render')
    var {value, onChange, onBlur, onFocus, numeric, ...other} = this.props;
    return (
      <input type={this.props.numeric ? "number" : "text"} value={this.state.displayValue} onBlur={this.blur} onFocus={this.focus} onChange={this.change} {...other} />
    );
  }
});

module.exports = Input;