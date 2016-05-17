var React = require('react');
var calc = require('./../monthly-payment-calc');
var InputRange = require('./../react-components/input-range.jsx');
var OutputUSD = require('./../react-components/output-usd.jsx');

/**
* WorksheetRange.
*
* Props other than 'prop' and 'data' that are passed in 
* will be passed through to element rendered by component.
*
*/
var WorksheetRange = React.createClass({
  
  render: function() {
    var {data, ...other} = this.props;
    var max = calc['availableHousingFunds'](data);
    var val = calc["preferredPayment"](data);
    return (
      <div>
        <div style={{float: "right"}}><OutputUSD value={max}/></div>
        <div><OutputUSD value="0"/></div>
        <InputRange value={val} max={max} {...other}/>
      </div>
    );
  }
});

module.exports = WorksheetRange;