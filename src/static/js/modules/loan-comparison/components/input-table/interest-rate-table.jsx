var React = require('react');
var LoanInputRow = require('./loan-input-table-row.jsx');

var InterestRateTable = React.createClass({

    render: function() { 
        return (
            <table className="unstyled loan-input-table">  
                <LoanInputRow prop="interest-rate" loans={this.props.loans}/>
            </table>
        );
    }
});

module.exports = InterestRateTable;