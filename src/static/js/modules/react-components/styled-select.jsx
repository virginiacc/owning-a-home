var React = require('react');
var SelectInput = require('./input-select.jsx');

// adds background image of a down arrow to select
var StyledSelectInput = React.createClass({
    propTypes: {
        containerClass: React.PropTypes.string
    },
    render: function () { 
        var {containerClass, ...other} = this.props;
        var className = 'select-content ';
        className += containerClass ? containerClass : '';
        return (
            <div className={className}>
                <SelectInput {...other}/>
            </div>
        );
    }
});

module.exports = StyledSelectInput;