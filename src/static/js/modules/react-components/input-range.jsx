var React = require('react');
var $ = require('jquery');
var OutputUSD = require('./../react-components/output-usd.jsx');


/**
* Range input.
*/

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
  
  componentWillReceiveProps: function (props) {
    var component = this;
    this.setState({
      value: props.value
    }, function () {
      var left = component.state.value / component.props.max * (component.refs['container'].offsetWidth-component.refs['currentValue'].offsetWidth);
      component.setState({left: left});
    });    
  },
  
  componentDidMount: function () {
    var left = this.state.value / this.props.max * (this.refs['container'].offsetWidth-this.refs['currentValue'].offsetWidth);
    this.setState({left: left});
  },

  change: function (e) {
    
    var val = e.target.value;
    var left = val / this.props.max * (this.refs['container'].offsetWidth-this.refs['currentValue'].offsetWidth);
    this.setState({value: e.target.value, left: left}, function () {
      typeof this.props.onChange == 'function' && this.props.onChange(val);
    });
    //
    
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
          <div style={valStyle} ref="currentValue" className="currentValue"><OutputUSD value={this.state.value}/></div>
          
      </div>
    );
  }
});

module.exports = RangeInput;