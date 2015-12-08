var React = require('react');

var LoadingAlert = React.createClass({
    propTypes: {
      msg: React.PropTypes.string.isRequired
    },
    
    render: function() {
        var {msg, ...other} = this.props;
        
        return (
            <div {...other} role="alert">
              <p>{this.props.msg}</p>
              <img src="http://www.consumerfinance.gov/hmda/static/img/icon_spinner.gif"/>
            </div>
        );
    }
});

module.exports = LoadingAlert;

