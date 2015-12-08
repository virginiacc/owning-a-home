var React = require('react');
var StyledSelect = require('../../../react-components/styled-select.jsx');
var common = require('../../common');

var LoanTermInput = React.createClass({
  
    disabledOptionCheck: function (option) {
        var disallowedOptions = common.armDisallowedOptions['loan-term'];
        return (this.props.loan['rate-structure'] === 'arm' && $.inArray(option.val, disallowedOptions) >= 0);
    },
    
    generateOptions: function () {
        return common.options['loan-term'].map(function (opt) {
            return (
                <option value={opt['val']} disabled={this.disabledOptionCheck(opt)}>{opt.label}</option>
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

module.exports = LoanTermInput;