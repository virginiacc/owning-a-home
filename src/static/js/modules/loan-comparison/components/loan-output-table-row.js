var React = require('react');
var LoanOutputCell = require('./loan-output-table-cell');
var common = require('../common');
var Tooltip = require('./tooltip');

var LoanOutputRow = React.createClass({
    displayClassNames: function(type) {
        var typeClass = 'result__' + type;
        return typeClass;        
    },
    render: function () {
        var tooltipHtml = common.outputTooltips[this.props.prop]
                          ? <Tooltip text={common.outputTooltips[this.props.prop]}/>
                          : null;
        var headingType = function (prop, type, label) {
            if (type === 'primary') {
                return (
                    <LoanOutputRowPrimaryHeading prop={prop} label={label} />
                );
            } else if (type === 'sub') {
                return (
                    <th scope="row">
                        <h6>
                            {label}
                        </h6>
                        {tooltipHtml}
                    </th>
                );
            } else {
                return (
                    <th scope="colgroup">
                        <h5>
                            {label}&nbsp;
                            {tooltipHtml}
                        </h5>
                    </th>
                );
            }
        };
        var loans = this.props.loans.map(function (loan) {
            return (
                <LoanOutputCell loan={loan} prop={this.props.prop} resultType={this.props.resultType} />
            )
        }, this);
        var resultType = this.props.resultType,
            prop = this.props.prop,
            label = this.props.label,
            className = this.displayClassNames(resultType);
        
        return (
            <tr className={className}>
                {headingType(prop, resultType, label)}
                {loans}
            </tr>
        );
    }
});

var LoanOutputRowPrimaryHeading = React.createClass({
    headingIcon: function(prop) {
        var icon = 'cf-icon cf-icon-';
        if (prop === 'closing-costs') {
            icon += 'mortgage';
        } else if (prop === 'monthly-payment') {
            icon += 'date';
        } else if (prop === 'overall-costs') {
            icon += 'owning-home';
        }
        return icon;
    },
    render: function() {
        var prop = this.props.prop,
            className = 'lc-primary-result-heading';

        return (
            <th scope="row" className={className}>
                <h4 className="results-section-heading">
                    <span className={this.headingIcon(prop)}></span>&nbsp;
                    {this.props.label}
                </h4>
                <span className="expandable_header-right expandable_link">
                    <span className="expandable_cue-open">
                        <span>Show </span>
                        <span className="cf-icon cf-icon-plus-round"></span>
                    </span>
                    <span className="expandable_cue-close">
                        <span>Hide </span>
                        <span className="cf-icon cf-icon-minus-round"></span>
                    </span>
                </span>
            </th>
        )
    }
});

module.exports = LoanOutputRow;