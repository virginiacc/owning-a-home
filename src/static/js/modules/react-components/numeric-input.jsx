var React = require('react');
var Input = require('./input.jsx');

var numRegex = /[^0-9.,]+/g; // allow commas
var numRegexStrict = /[^0-9.]+/g; // no commas

/**
* NumericInput.
* Enforces numeric values, screening out non-numeric characters.
* Defaults to showing two decimal places (where extant).
* Defaults to displaying numbers as strings with commas.
*
* TODO: at the moment, only allows positive numbers. Add option
* for handling negative numbers.
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
      value: this.cleanValForDisplay(this.props.value)
    };
  },
  
  getDefaultProps: function() {
    return {
      decimalPlaces: 2,
      displayString: true, 
      inputType: 'text',
      localeString: 'en',
      emptyVal: null
    };
  },

  strip: function (val, strict) {
    // if val exists & is not a number, replace all non-numeric characters
    if (val) {
      if (isNaN(val)) {
        val = val.toString().replace(strict ? numRegexStrict : numRegex, '');
      }
    }
    return val;
  },
  
  cleanValForDisplay: function (val) {
    // strip non-numeric characters if necessary
    var cleanVal = this.strip(val, true);
    
    // if value has changed, call onChange to update the value outside component as needed
    if (val != cleanVal) {
      typeof this.props.onChange == 'function' && this.props.onChange(cleanVal);
    }
    
    // format the value locally for display as necessary
    if (cleanVal) {
      cleanVal = this.props.decimalPlaces ? parseFloat(cleanVal) : parseInt(cleanVal, 10);

      // enforce decimal places if necessary
      if (this.props.decimalPlaces && cleanVal % 1 != 0) {
        cleanVal = cleanVal.toFixed(this.props.decimalPlaces);
      }
  
      // format number if using strings
      // TODO: make this optional even if using strings?
      if (this.props.displayString) {
        cleanVal = Number(cleanVal).toLocaleString(this.props.localeString);
      }
    }    
    
    return cleanVal;
  },  

  change: function (val) {
    var numericVal = this.strip(val); 
    this.setState({value: numericVal});
    typeof this.props.onChange == 'function' && this.props.onChange(numericVal);
  },
  
  blur: function (val) {
    val = this.cleanValForDisplay(val);
    this.setState({
      value: val, 
      focused: false
    }, function () {
      typeof this.props.onBlur == 'function' && this.props.onBlur(val);
    });
  },
  
  focus: function () {
    var state = {focused: true};
    // on focus, clear the input if its value == zero
    // placeholder zeros cause usability issues when editing inputs
    if (this.state.value == 0) {
      
      state.value = '';
    }
    this.setState(
      state, function () {
      typeof this.props.onFocus == 'function' && this.props.onFocus(val);
    })
  },

  componentWillReceiveProps: function (props) {
    console.log('rec props')
    // update state if, after processing, new value !== current value
    var displayVal = this.state.focused ? this.strip(props.value) : this.cleanValForDisplay(props.value);
    if (displayVal !== this.state.value) {
      this.setState({value: displayVal});
    }
  },
  
  shouldComponentUpdate: function (nextProps, nextState) {
    return this.state.value !== nextState.value;
  },

  render: function () {
    var {value, onChange, onBlur, onFocus, inputType, ...other} = this.props;
    return (
      <Input type={this.props.inputType} value={this.state.value} onChange={this.change} onBlur={this.blur} onFocus={this.focus} {...other} />
    );
  }
});

module.exports = NumericInput;