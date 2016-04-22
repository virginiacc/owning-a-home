var React = require('react');
// get formatted input
var Input = require('./input.jsx');

var nonNumericRegex = /[^0-9.,]+/g; // allow commas
var nonNumericRegexStrict = /[^0-9.]+/g; // no commas

/**
* NumericInput.
* Enforces numeric values, screening out non-numeric characters.
*
*/

var NumericInput = React.createClass({
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  getInitialState: function () {
    return {
      value: this.strip(this.props.value)
    };
  },

  strip: function (val, clean) {  
    if (clean) {
      if (val) {
        val = parseFloat(val.toString().replace(nonNumericRegexStrict,'')) || 0;
        val = val.toFixed(2);
        val = Number(val).toLocaleString('en');
      } else {
        val = '';
      }
    } else {
      val && (val = val.toString().replace(nonNumericRegex,''));
    }
    return val || '';
  },

  change: function (val) {
    var numericVal = this.strip(val);    
    this.setState({value: numericVal});
    typeof this.props.onChange == 'function' && this.props.onChange(numericVal);
  },
  
  blur: function (val) {
    var numericVal = this.strip(val, true);  
    this.setState({value: numericVal});
    typeof this.props.onChange == 'function' && this.props.onChange(numericVal);
  },

  componentWillReceiveProps: function (props) {
    if (props.hasOwnProperty('value') && this.strip(props.value) !== this.state.value) {
      this.setState({value: this.strip(props.value)});
    }
  },

  render: function () {
    var {value, onChange, onKeyDown, ...other} = this.props;
    return (
      <Input type="text" value={this.state.value} onChange={this.change} onBlur={this.blur} {...other} />
    );
  }
});

module.exports = NumericInput;