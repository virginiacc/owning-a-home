var $ = jQuery = require('jquery');
var React = require('react');
var assign = require('object-assign');

var common = require('../../common');
var LoanActions = require('../../actions/loan-actions');

var StyledSelect = require('../../../react-components/styled-select.jsx');
var StyledNumericInput = require('./styled-numeric-input');
var PointsInput = require('./input-points.jsx');
var DownpaymentInput = require('./input-downpayment.jsx');
var InterestRateInput = require('./input-interest-rate.jsx');
var TermInput = require('./input-loan-term.jsx');
var TypeInput = require('./input-loan-type');
var CountyInput = require('./input-county.jsx');

var Output = require('../loan-output.jsx');

var InputCellMessage = require('./loan-input-table-cell-message.jsx');

var components = {
    'price': StyledNumericInput,
    'points': PointsInput,
    'downpayment': DownpaymentInput,
    'interest-rate': InterestRateInput,
    'loan-amount': Output,
    'loan-summary': Output,
    'loan-term' : TermInput,
    'loan-type' : TypeInput,
    'county' : CountyInput
};

var LoanInputTableCell = React.createClass({ 
    propTypes: {
        prop: React.PropTypes.string.isRequired,
        loans: React.PropTypes.array.isRequired
    },
    
    handleChange: function (loanId, prop, val) {
        LoanActions.update(loanId, prop, val);
    },
    
    generateClassName: function (loan, prop) {
        var className = 'input-' + loan.id;
        className += loan['errors'].hasOwnProperty(prop) ? ' error' : '';
        return className;
    },
    
    generateComponentProps: function (loan, prop) {
        var componentProps = {
          loan: loan, 
          prop: prop, 
          value: loan[prop], 
          id: 'inputs-' + prop + '-' + loan.id
        };
        
        // setup onChange handler
        if (prop === 'downpayment') {
          componentProps.onChange = this.handleChange.bind(null, loan.id);
        } else {
          componentProps.onChange = this.handleChange.bind(null, loan.id, prop)
        }
        
        // Most inputs have a custom component, but some are basic selects/inputs with just
        // one or two properties to configure; these are set up below
        
        // pass lists of options to basic selects
        if ($.inArray(prop, ['credit-score', 'rate-structure', 'state', 'arm-type']) !== -1 ) {
            componentProps.items = common.options[prop];
        }
        
        // price gets a className
        if (prop === 'price') {
            componentProps.unit = 'usd';
        }
        
        // arm type input is hidden unless loan type is arm
        if (prop === 'arm-type') {
            componentProps.containerClass = loan['rate-structure'] === 'arm' ? '' : 'hidden';
        }
    
        return componentProps;
    },    
    
    render: function () {
        var prop = this.props.prop;
        var loan = this.props.loan;
        var InputComponent = components[prop] || StyledSelect;        
        var props = this.generateComponentProps(loan, prop);
    
        return (
            <td className={this.generateClassName(loan, prop)}>
                <InputComponent {...props}/>
                <InputCellMessage prop={prop} errors={loan.errors}/>
            </td>
        );
    }
});

module.exports = LoanInputTableCell;
