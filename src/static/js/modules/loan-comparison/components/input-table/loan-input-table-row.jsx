var $ = jQuery = require('jquery');
var React = require('react');
var common = require('../../common');
var LoanInputCell = require('./loan-input-table-cell.jsx');
var Tooltip = require('../tooltip.jsx');

var LoanInputRow = React.createClass({
    propTypes: {
        prop: React.PropTypes.string.isRequired,
        loans: React.PropTypes.array.isRequired
    },
    
    baseRowClass: function (prop) {
        // output rows get special label style; rows with
        // text or select inputs get extra padding
        if ($.inArray(prop, ['loan-amount', 'loan-summary']) >= 0) {
            return 'output-row';
        } else if (prop !== 'points') {
            return 'input-row';
        }
    },
    
    armRowClass: function (prop) {
        // ARM input row should be hidden if none of the loans is arm
        var loans = this.props.loans,
            showRow = false;
        
        for (var i=0; i< loans.length; i++) {
            if (loans[i]['rate-structure'] === 'arm') {
                showRow = true;
            }
        }
        
        return showRow ? '' : ' hidden';
    },
    
    generateClass: function (prop) {
        var className = this.baseRowClass(prop) || '';
        if (prop === 'arm-type') {
            className += this.armRowClass(prop);
        }
        return className;
    },
    
    generateCells: function (prop) {
        var loans = this.props.loans,
            cells = [];
        
        for (var i=0; i< loans.length; i++) {
            cells.push(<LoanInputCell prop={prop} loan={loans[i]}/>);
        }
        
        return cells;
    },
    
    render: function () {
        var prop = this.props.prop;
        
        return (
            <tr className={this.generateClass(prop)}>
                <td className="label-cell">
                    <div className="label-text" dangerouslySetInnerHTML={{__html: common.getPropLabel(prop)}}></div>
                    <Tooltip text={common.inputTooltips[prop]}/>
                </td>
                {this.generateCells(prop)}
            </tr>
        );
    }
});

module.exports = LoanInputRow;
