var React = require('react');


/**
* Input.
* If optional formatter function is passed in,
* formats the contents of an input when it is not focused,
* and removes the formatting while input is active.
*/

var Input = React.createClass({
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    formatter: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      value: this.props.value,
      displayValue: this.format(this.props.value)
    };
  },

  format: function (val) {
    return typeof this.props.formatter === 'function'
           ? this.props.formatter(val) 
           : val;
  },

  blur: function () {
    var val = this.props.value;
    this.setState({
      focused: false,
      displayValue: this.format(val)
    }, function () {
      typeof this.props.onBlur == 'function' && this.props.onBlur(val);
    });
    
  },

  change: function (e) {
    var val = e.target.value;
    this.setState({value: e.target.value});
    typeof this.props.onChange == 'function' && this.props.onChange(val);
  },

  focus: function () {
    this.setState({
      focused: true,
      displayValue: this.state.value
    });
    typeof this.props.onFocus == 'function' && this.props.onFocus(val);
  },

  componentWillReceiveProps: function (props) { 
    if (props.hasOwnProperty('value') && (!this.state.focused || props.value !== this.state.value)) {
      
      var stateObj = {value: props.value};
      stateObj.displayValue = this.state.focused 
                              ? props.value 
                              : this.format(props.value);
      this.setState(stateObj);
    }
  },

  render: function () {
    var {value, onChange, onBlur, onFocus, ...other} = this.props;
    return (
      <input type="text" value={this.state.displayValue} onBlur={this.blur} onFocus={this.focus} onChange={this.change} {...other} />
    );
  }
});

module.exports = Input;