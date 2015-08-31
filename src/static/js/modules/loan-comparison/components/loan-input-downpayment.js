var React = require('react');
var TextInput = require('./styled-numeric-input');
var assign = require('object-assign');
var mortgageCalculations = require('../mortgage-calculations');

var LoanDownpaymentInput = React.createClass({    
    render: function() {
        return (
            <div>
                <TextInput
                    value={this.props.loan['downpayment-percent']}
                    className='small-input percent-input' 
                    maxLength='2' 
                    onChange={this.props.onChange.bind(this, 'downpayment-percent')}/>
                <TextInput 
                    value={this.props.loan['downpayment']}
                    className='mid-input dollar-input' 
                    onChange={this.props.onChange.bind(this, 'downpayment')}/>
            </div>
        );
    }
});

module.exports = LoanDownpaymentInput;