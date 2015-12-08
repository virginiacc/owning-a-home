var React = require('react');
var OutputUSD = require('../../react-components/output-usd.jsx');

var LoanOutput = React.createClass({
    propTypes: {
        loan: React.PropTypes.object,
        prop: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
    },
    render: function () {
        var {loan, prop, value, ...props} = this.props;
        var val = value || loan[prop];
        if (prop === 'loan-amount') {
            props.config = {positive: true}
        }
        if (prop === 'loan-summary' || prop === 'loan-term') {
            return (<span {...props}>{val}</span>)
        } else {
            return (<OutputUSD value={val} {...props}/>)
        }
    }
});

module.exports = LoanOutput;