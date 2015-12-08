var React = require('react');
var Input = require('../../../react-components/formatted-numeric-input.jsx');

var unitMap = {
  'usd': 'dollar-input',
  'pct': 'percent-input'
}

// optionally adds a unit (dollar or percent sign) to input
// when a unit value is passed in
var StyledNumericInput = React.createClass({
    render: function() {
        var {unit, containerClass, ...props} = this.props;
        var className = '';
        if (unit) {
            className += unitMap[unit];
        }
        if (containerClass) {
          className += ' ' + containerClass;
        }
        return (
            <div className={className}>
                <span className="unit"></span>
                <Input {...props}/>
            </div>
        );
    }
});

module.exports = StyledNumericInput;