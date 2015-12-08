var React = require('react');
var LoanActions = require('../../actions/loan-actions');
var StyledSelect = require('../../../react-components/styled-select.jsx');

var InterestRateInput = React.createClass({
    propTypes: {
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        loan: React.PropTypes.object
    },
    fetchRates: function () {
        LoanActions.fetchRates(this.props.loan.id);
    },
    
    generateClassName: function () {
        var className = 'interest-rate-container';
        if (this.props.loan['rate-request']) {
            className += ' updating';
        }
        return className;
    },
    
    render: function() {
        var {loan, ...props} = this.props;
        props.items = loan['rates'];
        
        return (
            <div className={this.generateClassName()}>
                <StyledSelect {...props}/>
                <div className='btn btn__disabled interest-rate-loading'></div>
            </div>
        );
    }
});

module.exports = InterestRateInput;