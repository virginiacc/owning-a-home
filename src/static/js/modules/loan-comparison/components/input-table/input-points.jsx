var React = require('react');
var common = require('../../common');

var PointsInput = React.createClass({
    propTypes: {
        // value
    },
    
    render: function() {
        var {value, onChange, ...props} = this.props;
        
        var inputs = common.options.points.map(function (radio){
            var inputId = 'points' + '-' + radio.val;
            return (
                <div className='inline-radio lc-radio'>
                    <input type="radio" 
                           id={inputId}
                           value={radio.val} 
                           checked={value == radio.val}
                           onClick={onChange}
                           {...props}/>
                    <label htmlFor={inputId}>{radio.label}</label>
                </div>
            );
        }, this);
        
        return (
            <fieldset className='radio-fieldset input-content'>
                {inputs}
            </fieldset>
        );
    }
});

module.exports = PointsInput;