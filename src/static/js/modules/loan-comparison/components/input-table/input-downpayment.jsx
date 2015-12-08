var React = require('react');
var TextInput = require('./styled-numeric-input');
var LoanOutput = require('../loan-output.jsx');

var LoanDownpaymentInput = React.createClass({  
    propTypes: {
        loan: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    componentWillReceiveProps: function (nextProps) {
      console.log(nextProps)
    },
    render: function() {  
        var {loan, value, onChange, ...props} = this.props;
        console.log('i changed')
        return (
            <div className="downpayment-input-container">
                <TextInput
                    value={this.props.loan['downpayment-percent']}
                    containerClass='small-input'
                    unit="pct" 
                    maxLength='2' 
                    onChange={onChange.bind(this, 'downpayment-percent')}
                    {...props}/>
                <TextInput 
                    value={this.props.loan['downpayment']}
                    containerClass='mid-input'
                    unit="usd" 
                    onChange={onChange.bind(this, 'downpayment')}
                    {...props}/>
                <div className="downpayment-loan-amount u-show-on-mobile">
                    <span className="loan-amount-equals">=</span><LoanOutput prop='downpayment' loan={loan}/>
                </div>
            </div>
        );
    }
});

module.exports = LoanDownpaymentInput;