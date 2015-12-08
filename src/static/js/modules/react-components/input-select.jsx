var React = require('react');

var SelectInput = React.createClass({
    propTypes: {
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.bool
        ]),
        title: React.PropTypes.string,
        items: React.PropTypes.array,
        valKey: React.PropTypes.string,
        labelKey: React.PropTypes.string
    },
    
    getDefaultProps: function() {
        return {
            valKey: 'val',
            labelKey: 'label'
        };
    },
    
    generateOptions: function () {
        var valKey = this.props.valKey;
        var labelKey = this.props.labelKey;
        var items = this.props.items;
    
        var opts = items.map(function (opt) {
            return (
                <option value={opt[valKey]}>{opt[labelKey]}</option>
            );
        }, this);

        if (this.props.title) {
            opts.unshift(<option disabled value='selectTitle'>{this.props.title}</option>);
        }

        return opts;
        
    },
    
    render: function() {        
        var {children, value, valKey, labelKey, ...other} = this.props;
        var opts = this.props.items ? this.generateOptions() : this.props.children;
        return (
            <select value={this.props.value || 'selectTitle'} {...other}>
                {opts}
            </select>
        );
    }
});

module.exports = SelectInput;