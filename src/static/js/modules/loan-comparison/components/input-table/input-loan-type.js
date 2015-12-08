var React = require('react');
var StyledSelect = require('../../../react-components/styled-select.jsx');
var common = require('../../common');

var LoanTypeInput = React.createClass({
  
    disabledOption: function (loan, isJumbo, option) {
        var disabled;
        var disallowedOptions = common.armDisallowedOptions['loan-type'];
        if (isJumbo) {
            disabled = $.inArray(option.val, loan['disallowed-types']) >= 0;
        } else {
            disabled = this.props.loan['rate-structure'] === 'arm' && $.inArray(option.val, disallowedOptions) >= 0;
        }
        return disabled;
    },
    
    generateOptions: function () {
        var loan = this.props.loan;
        var items = common.options['loan-type'].slice(0);
        var jumboItem = common.jumboTypes[loan['loan-type']];
        if (jumboItem) {
            items.push(jumboItem);
        }
        return items.map(function (opt) {
            return (
                <option value={opt['val']} disabled={this.disabledOption(loan, jumboItem, opt)}>{opt.label}</option>
            );
        }, this);
    },
    
    render: function() {
        return (
            <StyledSelect {...this.props}>
              {this.generateOptions()}
            </StyledSelect>
        );
    }
});

module.exports = LoanTypeInput;