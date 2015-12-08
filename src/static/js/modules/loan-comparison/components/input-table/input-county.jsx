var React = require('react');
var StyledSelect = require('../../../react-components/styled-select.jsx');

var CountySelect = React.createClass({
    propTypes: {
        loan: React.PropTypes.object.isRequired
    },
    render: function () {
        var {loan, ...selectProps} = this.props;
        
        // add county select props
        selectProps.labelKey = 'county';
        selectProps.valKey = 'complete_fips';
        selectProps.items = loan['counties'];
        selectProps.title = 'Select a county';

        // show loading state during county requests
        if (loan['county-request'] && !loan['need-county']) {
            selectProps.containerClass = 'loading';
        }
        
        return (
            <StyledSelect {...selectProps}/>
        );
    }
});

module.exports = CountySelect;