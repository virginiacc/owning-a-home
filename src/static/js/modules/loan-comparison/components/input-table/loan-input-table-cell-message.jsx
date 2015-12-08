var React = require('react');
var Message = require('../message.jsx');

var LoanInputCellMessage = React.createClass({
  
    propTypes: {
        prop: React.PropTypes.string,
        errors: React.PropTypes.object
    },
    
    getErrorMessage: function (prop, errors) {
        // Checks for errors associated with a prop type. Not always one-to-one,
        // since one prop's error message might be displayed with another prop.
        if (prop === 'county') {
          return errors['county'];
        } else if (prop === 'downpayment') {
          return errors['downpayment'];
        } else if (prop === 'loan-summary') {
          // TODO: should this combine?
          return errors['loan-term'] || errors['loan-type']
        }
    },
        
    render: function() {        
        var msg = this.getErrorMessage(this.props.prop, this.props.errors);
        return  msg ? <Message message={msg} type="error"/> : false; 
    }
});

module.exports = LoanInputCellMessage;
