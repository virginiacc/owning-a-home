var $ = jQuery = require('jquery');
var React = require('react');
var common = require('../common');
var LoanInputCell = require('./loan-input-table-cell');
var Tooltip = require('./tooltip');

var outputs = ['loan-amount', 'loan-summary'];


var LoanInputRow = React.createClass({
    propTypes: {
        prop: React.PropTypes.string.isRequired,
        loans: React.PropTypes.array.isRequired
    },
    
    generateClassName: function (outputRow) {
      var className = '';
        // adds extra top padding to labels on rows with inputs
        if ($.inArray(this.props.prop, outputs.concat(['points'])) < 0) {
            className += ' padded-row';
        }
        
        // styles label text on output rows
        if (outputRow) {
            className += ' output-row';
        }
                
        // hides the ARM input row if neither of the loans is adjustable
        if (this.props.prop === 'arm-type') {
            var armLoan = this.props.loans[0]['rate-structure'] === 'arm' || this.props.loans[1]['rate-structure'] === 'arm';
            className += armLoan ? '' : ' hidden';
        }
        
        return className;
    },
    
    generateCells: function (outputRow) {
        var loans = this.props.loans;
        var cells = [];
        
        for (var i=0; i< loans.length; i++) {
            var componentCell = (
                <LoanInputCell prop={this.props.prop} loan={loans[i]}/>
            );
            cells.push(componentCell);
        }
        
        return cells;
    },
    
    render: function () {
        var prop = this.props.prop,
            label = common.getPropLabel(prop),
            outputRow = $.inArray(prop, outputs) >= 0;
        
        return (
            <tr className={this.generateClassName(outputRow)}>
                <td className="label-cell">
                    <div className="label-text" dangerouslySetInnerHTML={{__html: label}}></div>
                    <Tooltip text={common.inputTooltips[prop]}/>
                </td>
                {this.generateCells(outputRow)}
            </tr>
        );
    }
});

module.exports = LoanInputRow;
