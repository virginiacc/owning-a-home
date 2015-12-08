var React = require('react');
var CFButton = require('cf-button');

var PrintButton = React.createClass({
    getDefaultProps: function() {
        return {
            config: 'primary'
        };
    },
    print: function () {
        window.focus();
        window.print();
        typeof this.props.onClick == 'function' && this.props.onClick();
    },
    render: function () {
        var {onClick, ...props} = this.props;
        return (            
            <CFButton onClick={this.print} {...props}>
                {this.props.children || 'Print'}
            </CFButton>
        )
    }
});

module.exports = PrintButton;