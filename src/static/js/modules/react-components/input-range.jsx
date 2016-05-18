var React = require('react');
var $ = require('jquery');
var OutputUSD = require('./../react-components/output-usd.jsx');


/**
* Range input.
*/

// TODO: make output positioned by slider optional

var RangeInput = React.createClass({
  propTypes: {
    
  },
  
  getDefaultProps: function () {
    return {
      max: 0,
      min: 0,
      step: 1
    }
  },

  getInitialState: function () {
    return {
      value: this.props.value
    }
  },
  
  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.value !== nextProps.value || this.state.left !== nextState.left;
  },
  
  componentWillReceiveProps: function (props) {
    if (props.value !== this.props.value) {
      var component = this;
      this.setState({value: props.value}, this.updateOutputPosition);
    }
  },
  
  componentDidMount: function () {
    this.updateOutputPosition();
    
    if (window.attachEvent) {
      window.attachEvent('onresize', this.updateOutputPosition);
    }
    else if (window.addEventListener) {
      window.addEventListener('resize', this.updateOutputPosition);
    }
  },
  
  updateOutputPosition: function () {
    var left = this.getLeftOutputPosition(this.state.value);
    this.setState({left: left});
  },
  
  getLeftOutputPosition: function (val) {
    return val / this.props.max * (this.refs['container'].offsetWidth-this.refs['currentValue'].offsetWidth);
  },

  change: function (e) {
    var val = e.target.value;
    var left = this.getLeftOutputPosition(val);
    this.setState({value: e.target.value, left: left}, function () {
      typeof this.props.onChange == 'function' && this.props.onChange(val);
    });    
  },

  render: function () {
    var {value, onChange, max, min, ...other} = this.props;
    
    var valStyle = {position: 'absolute', left: this.state.left + 'px', paddingTop: '5px'}
    //var valStyle = {textAlign: 'center'};
    return (
      <div className="inputContainer" ref="container" style={{position: 'relative', marginBottom: '30px'}}>
        <input
          ref="rangeInput"
          name="preferred"
          type="range"
          min={this.props.min}
          max={this.props.max}
          step="50"
          value={this.state.value}
          onChange={this.change}
          id="preferred"
          {...other}
          />
          <div style={valStyle} ref="currentValue" className="currentValue"><OutputUSD value={this.state.value} className="medium-text"/></div>
          
      </div>
    );
  }
});

module.exports = RangeInput;