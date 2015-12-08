var $ = jQuery = require('jquery');
require('jquery-easing');
require('cf-expandables');
require('tooltips');

var React = require('react');
var LoanStore = require('../stores/loan-store');
var LoanInputTable = require('./input-table/loan-input-table.jsx');
var InterestRateTable = require('./input-table/interest-rate-table.jsx');
var LoanOutputTableGroup = require('./output-table/loan-output-table.jsx');
var LoanOutputTableMobileGroup = require('./output-table/loan-output-table-mobile.jsx');
var NextSteps = require('./next-steps.jsx');


var App = React.createClass({
    init: function () {
        LoanStore.init();
    },

    getInitialState: function() {
        this.init();
        return this.getAppState();
    },

    getAppState: function () {
        return {
            loans: LoanStore.getAll()
        }
    },

    componentDidMount: function() {
        LoanStore.addChangeListener(this._onChange);
        
        // activate tooltips
        $(this.getDOMNode()).tooltip({
            selector: '[data-toggle="tooltip"]',
            'placement': 'bottom',
            container: 'body',
            title: function getTooltipTitle(){
                return $(this).attr('title') || $(this).next('.help-text').html() || 'Tooltip information.';
            }
        });
        
        // activate expandables
        $('.expandable').expandable();
    },

    componentWillUnmount: function() {
        LoanStore.removeChangeListener(this._onChange);
    },
    
    startMobileEditing: function (loanName) {
        // We use the alphabetical loan name instead of loan id to keep track
        // of loan being edited for a couple of reasons: 
        // 1. Testing for existence of 0 as a value is complicated, &
        // 2. We need to show the name of the loan being edited in the input table section
        this.setState({
            editing: loanName
        });
    },
    
    stopMobileEditing: function (e) {
        e.preventDefault();
        this.setState({
            editing: null
        });
    },

    render: function() {
        return (
          <div>
            <div>
                <div className="block block__border-top block__padded-top" id="loans-container">
                    <div className="content-l">
                        <div className="content-l_col content-l_col-3-4">                            
                            
                            <h3><span className="round-step">1</span>Enter details for each scenario</h3>
                            <LoanOutputTableMobileGroup loans={this.state.loans} editing={this.state.editing} startEditing={this.startMobileEditing}/>
                            
                            <LoanInputTable loans={this.state.loans} editing={this.state.editing} stopEditing={this.stopMobileEditing}/>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="block">
                <div className="content-l">
                    <div className="content-l_col content-l_col-3-4 with-link">
                        <h3><span className="round-step">2</span>
                            Choose <a class="jump-link" href="/explore-rates"><span class="jump-link_text">interest rates</span></a> to use in your scenarios</h3>
                        <div className="lc-inputs" id="loan-interest-rate-container">
                            <InterestRateTable loans={this.state.loans} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="block">
                <div className="content-l">
                    <div className="content-l_col content-l_col-3-4">
                        <h3><span className="round-step">3</span>See how different factors affect your projected costs</h3>
                    </div>
                </div>
                <LoanOutputTableGroup loans={this.state.loans} />
            </div>
            <div className="block">
                <div className="content-l">
                    <div className="content-l_col content-l_col-3-4">
                        <h3><span className="round-step">4</span>Next steps</h3>
                    </div>
                </div>
                <NextSteps/>
            </div>
          </div>
        );
    },

  /**
   * Event handler for 'change' events coming from the Stores
   */
    _onChange: function() {
        this.setState(this.getAppState());
  }

});

module.exports = App;
