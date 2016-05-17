var React = require('react');
var ReactDOM = require('react-dom');
var assign = require('object-assign');

var StickyContainer = require('react-sticky').StickyContainer;

var $ = jQuery = require('jquery');
require('jquery.scrollto');

var InputUSD = require('./react-components/input-usd.jsx');
var InputPercentage = require('./react-components/input-percent.jsx');
var ResponsiveSticky = require('./react-components/responsive-sticky.jsx');
var calc = require('./monthly-payment-calc');
var WorksheetOutput = require('./monthly-payment-worksheet/worksheet-output.jsx');
var WorksheetRange = require('./monthly-payment-worksheet/worksheet-range.jsx');


var MPWInputRow = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.value !== nextProps.value;
  },
  render: function () {
    var {id, title, type, value, note, cb, ...other} = this.props;
    var noteHTML = note ? (<em dangerouslySetInnerHTML={{__html:note}}></em>) : '';
    var Component = type == 'percent' ? InputPercentage : InputUSD;

    return (
      <div className="content-l input-row">
        <div className="label-col">
          <label htmlFor={id}>
            <h4>{title}</h4>
            {noteHTML}
          </label>
        </div>
        <div className="input-col">
          <Component id={id} value={value} onChange={cb.bind(null, id)} {...other}/>
        </div>
      </div>
    )
  }
});

var MPWOutputRow = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.value !== nextProps.value;
  },
  render: function () {
   var {rowClass, prefix, title, value, note, ...other} = this.props;
   var className = "content-l output-row ";
   rowClass && (className += rowClass);
   var noteHTML = note ? (<em dangerouslySetInnerHTML={{__html:note}}></em>) : '';
    return (
      <div className={className}>
        <div className="label-col">
          <div className="label">
            <h4>{title}</h4>
            {noteHTML}
          </div>
        </div>
        <div className="input-col">
          <span>
            {prefix} <WorksheetOutput value={value} {...other}/>
          </span>
        </div>
      </div>
    )
  }
});

var MonthlyPaymentWorksheet = React.createClass({
  
    getInitialState: function() {
      var state = this.props.worksheet;
      console.log(this.calculations(state))
      return this.calculations(state);
    },
    
    update: function (prop, val) {
      var obj = {};
      obj[prop] = val;
      var state = assign(this.state, obj);
      this.setState(this.calculations(state));
    },
    
    calculations: function (tempState) {      
      for (var c in calc) {
        if (calc.hasOwnProperty(c) && c !== 'loanAmount') {
          tempState[c] = calc[c](tempState);
        }
      }
      console.log(calc.loanAmount);
      console.log(calc.loanAmount(tempState))
      return assign(tempState, calc.loanAmount(tempState));
    },
    
    componentDidMount: function () {
      // TODO: this should just happen on change
      var component = this;
      setInterval(function () {
        localStorage.setItem('monthlyPaymentWorksheet', JSON.stringify(component.state));
      }, 5000)

      window.onbeforeunload = function() {
        localStorage.setItem('monthlyPaymentWorksheet', JSON.stringify(component.state));
      };
    },
    
    print: function () {
        window.focus();
        window.print();
    },
    
    scrollUp: function (e) {
        e.preventDefault();
        $.scrollTo( $('#estimate-section'), {
          duration: 600,
          offset: -30
        });
    },

    render: function() {
        var worksheet = this.state.worksheet || {};
        return (
          <div className="monthly-payment_worksheet block">
            <section className="monthly-payment_worksheet">
              <form>
              <StickyContainer>
              
                <div className="content-l content-l__large-gutters form-cols">
                  <div className="content-l_col inputs-col">
                    <div className="form-section">
                      <h2 tabIndex="0">Assess your current income, spending, and savings.</h2>
                    
                      <fieldset>
                        <legend>
                          <h3><span className="heading-number">1</span>What is your annual pre-tax income?</h3>
                        </legend>                      
                        <MPWInputRow title="Your annual pre-tax income" value={this.state.preTaxIncome} id="preTaxIncome" cb={this.update}/>
                        <MPWInputRow title="Your co-borrower's annual pre-tax income" value={this.state.preTaxIncomeCB} id="preTaxIncomeCB" cb={this.update} note="A co-borrower is anyone who will jointly buy the home and pay the mortgage with you, such as a spouse, domestic partner, or other family member."/>
                        <MPWOutputRow title="Total annual pre-tax income" value={this.state.preTaxIncomeTotal} rowClass="total-row"/>
                        <div className="content-l input-row u-mt0">
                          <div className="label-col"></div>
                          <div className="input-col">
                            <em>Your total monthly pre-tax income is <WorksheetOutput value={this.state.preTaxIncomeMonthly}/>.</em>
                          </div>
                        </div>
                      </fieldset>
                    
                      <fieldset>
                        <legend>
                          <h3><span className="heading-number">2</span>What is your monthly take-home income?</h3>
                          <div className="fieldset-note">
                            <p>Your monthly take-home income is the net amount you receive after taxes and other deductions, such as automatic retirement savings and health insurance, are taken out.</p><p><em>* Check your paystub or bank statements to figure out your take-home income.</em></p>
                          </div>
                        </legend>
                      
                        <MPWInputRow title="Your monthly take-home income" value={this.state.takeHomeIncome} id="takeHomeIncome" cb={this.update}/>
                        <MPWInputRow title="Your co-borrower's monthly take-home income" value={this.state.takeHomeIncomeCB} id="takeHomeIncomeCB" cb={this.update}/>
                        <MPWOutputRow title="Total monthly take-home income" value={this.state.takeHomeIncomeTotal} rowClass="total-row"/>
                     </fieldset>
                   
                     <fieldset>
                      <legend>
                        <h3><span className="heading-number">3</span>How does your money get used each month?</h3>
                        <div className="fieldset-note">
                          <p>Include expenses paid by both you and your co-borrower.</p>
                        </div>
                      </legend>
                      <MPWInputRow title="Rent" value={this.state.rent} id="rent" cb={this.update}/>
                      <MPWInputRow title="Utilities" value={this.state.utilities} id="utilities" cb={this.update} note="Electricity, gas, water, phone, internet, etc."/>
                      <MPWInputRow title="Debt Payments" value={this.state.debtPayments} id="debtPayments" cb={this.update} note="Student loans, car loans, credit card debt, etc."/>
                      <MPWInputRow title="Living and other expenses" value={this.state.livingExpenses} id="livingExpenses" cb={this.update} note="Groceries, transportation, child care, child support, eating out, health, entertainment, etc."/>
                      <MPWInputRow title="Monthly savings" value={this.state.savings} id="savings" cb={this.update} note="Amount you put away each month from your take-home income."/>
                      <MPWOutputRow title="Total monthly spending and savings" value={this.state.spendingAndSavings} rowClass="total-row" note="Your total monthly spending and savings should be no more than your total monthly take-home income."/>
                     </fieldset>
                  </div>
                  <div className="form-section">
                   <h2 tabIndex="0">Estimate your financial responsibilities after buying a home.</h2>
                    
                    <fieldset>
                      <legend>
                        <h3><span className="heading-number">4</span>What new expenses will you have after buying a home?</h3>
                        <div className="fieldset-note">
                          <p>There are more costs to being a homeowner than just the monthly mortgage payment. Estimate these homeownership expenses on a monthly basis.</p>
                        </div>
                      </legend>
                      
                      <MPWInputRow title="Home maintenance" value={this.state.homeMaintenance} id="homeMaintenance" cb={this.update} note="A common rule of thumb is 1% of your target home price (divide by 12 to get a monthly amount)."/>
                      <MPWInputRow title="Condo/Home Owners' Association (HOA) fees" value={this.state.condoHOA} id="condoHOA" cb={this.update} note="These fees depend on the specific home you choose and can range from nothing to several hundreds of dollars. Explore listings in your target neighborhoods to make an estimate."/>
                      <MPWOutputRow title="Total new homeownership expenses" value={this.state.newHomeownershipExpenses} rowClass="total-row"/>
                    </fieldset>
                    
                    <fieldset>
                      <legend>
                        <h3><span className="heading-number">5</span>How will your expenses change as a homeowner?</h3>
                        <div className="fieldset-note">
                          <p>If some of your utilities are included in your rent now, you'll likely have to pay for them separately as a homeowner. Utilities may also increase with a larger home.</p>
                        </div>
                      </legend>
                      
                      <MPWInputRow title="Total future monthly utilities" value={this.state.futureUtilities} id="futureUtilities" cb={this.update}/>
                    </fieldset>
                    
                    <fieldset>
                      <legend>
                        <h3><span className="heading-number">6</span>How much do you want to save each month?</h3>
                        <div className="fieldset-note">
                          <p>Your savings goals as a homeowner may be different than your current goals.</p>
                        </div>
                      </legend>
                      
                      <MPWInputRow title="Future monthly savings" value={this.state.futureSavings} id="futureSavings" cb={this.update} note="Enter the amount you want to put away each month from your take-home income."/>
                      
                    </fieldset>
                    
                    <fieldset>
                      <legend>
                        <h3><span className="heading-number">7</span>What will taxes and insurance cost?</h3>
                        <div className="fieldset-note">
                          <p>Property taxes and homeowner's insurance are an important part of your monthly payment. Update these assumptions as you move forward to get more precise estimates.</p>
                        </div>
                      </legend>
                      
                      <MPWInputRow title="Annual property tax rate (%)" value={this.state.propertyTax} id="propertyTax" cb={this.update} note="The national median is 1.1%, but rates vary widely by location. Check with your local tax authority for a more precise estimate." type="percent"/>
                      <MPWInputRow title="Annual homeowner's insurance ($)" value={this.state.homeownersInsurance} id="homeownersInsurance" cb={this.update} note="The national median is $750, but rates vary by location, the value and features of your home, and the coverage that you select."/>
                      
                    </fieldset>
                    
                    <fieldset>
                      <legend>
                        <h3><span className="heading-number">8</span>What is your expected interest rate?</h3>
                        <div className="fieldset-note">
                          <p>The interest rate you expect to receive is a key factor that affects how much you can afford to spend on a home.</p>
                        </div>
                      </legend>
                      
                      <MPWInputRow title="Expected interest rate (%)" value={this.state.interestRate} id="interestRate" cb={this.update} note="<a href=''>Explore the range of interest rates you can expect</a>" type="percent"/>
                    </fieldset>
                    </div>
                  </div>
                  
                  <div className="content-l_col outputs-col">
                    <ResponsiveSticky>
                      <div className="block sticky-outputs">
                        <h3>Estimated totals</h3>
                        <MPWOutputRow title="Estimated funds available for monthly housing expenses" value={this.state.availableHousingFunds} placeholder="--"/>
                        <div className="content-l output-row">
                          <div className="content-l_col-1">
                            <p>How much of your available funds do you want to use for monthly housing expenses?</p>
                            <WorksheetRange data={this.state} onChange={this.update.bind(null, 'preferredMonthlyPayment')}/>
                          </div>
                        </div>
                        <MPWOutputRow title="Estimated monthly principal and interest" value={this.state.principalAndInterest} placeholder="--"/>
                        <MPWOutputRow title="Estimated home price" value={this.state.housePrice} placeholder="--"/>
                      </div>
                    </ResponsiveSticky>
                  </div>
                </div>
                </StickyContainer>
                
              </form>
              
            </section>
            
            
            <section className="summary-section">
              <h2 tabIndex="0">How much can you afford?</h2>
              
              
              
              <div className="content-l content-l__large-gutters">
                <div>
                  <div className="content-l_col content-l_col-1-2 col-left">
                    <MPWOutputRow title="Estimated funds available for monthly housing expenses" value={this.state.availableHousingFunds}/>
                  </div>
                </div>
              </div>
              <div className="block block__main-section block__border-strong">
                <div className="content-l content-l__large-gutters">
              
                    <div className="content-l_col content-l_col-1-2 col-left budget-col">
                      <p>We calculated your total available for monthly housing obligations by subtracting your expenses and savings from your take-home income.</p>
                    
                      <div className="block block__sub-section">
                        <MPWOutputRow title="Take-home income" value={this.state.takeHomeIncomeTotal}/>
                        <MPWOutputRow title="Debts" value={this.state.debtPayments} prefix="-"/>
                        <MPWOutputRow title="Living expenses" value={this.state.livingExpenses} prefix="-"/>
                        <MPWOutputRow title="Future savings" value={this.state.futureSavings} prefix="-"/>
                        <MPWOutputRow title="Home maintenance" value={this.state.homeMaintenance} prefix="-"/>
                        <MPWOutputRow title="Future utilities" value={this.state.futureUtilities} prefix="-"/>
                      </div>
                      <div className="block block__sub-section">
                        <MPWOutputRow title="Estimated funds available for monthly housing expenses" value={this.state.availableHousingFunds} rowClass="summary-row"/>
                      </div>
                    </div>
                
                    <div className="content-l_col content-l_col-1-2 col-right">
                      <p>How much of your available funds do you want to use for monthly housing expenses?</p>
                      <WorksheetRange data={this.state} onChange={this.update.bind(null, 'preferredMonthlyPayment')}/>
                      <div className="block block__sub-section">
                        <MPWOutputRow title="Amount to use for housing" value={this.state.preferredPayment}/>
                        <MPWOutputRow title="Left over money" value={this.state.otherExpenses}/>
                      </div>
                      <div className="block block__sub-section">
                        <p><WorksheetOutput value={this.state.preferredPayment}  placeholder="--"/> is <WorksheetOutput value={this.state.preferredPaymentPercentage} placeholder="--%" type="percent"/> of your pre-tax income of <WorksheetOutput value={this.state.preTaxIncomeMonthly}  placeholder="--"/></p>
                        <p className="u-mb0">A mortgage lending rule of thumb is that your total monthly housing obligations should be no more than 28% of your pre-tax income. Lenders may approve you for more or less depending on your overall financial picture.</p>
                      </div>
                  </div>
                </div>
              </div>
              <div className="content-l content-l__large-gutters">
                <div className="content-l_col content-l_col-1-2 col-left budget-col">
                  <MPWOutputRow title="Estimated monthly principal and interest" value={this.state.principalAndInterest}/>
                </div>
                <div className="content-l_col content-l_col-1-2 col-right">
                  <MPWOutputRow title="Estimated home price" value={this.state.housePrice} placeholder="--"/>
                </div>
              </div>
              
              <div className="content-l content-l__large-gutters">
                <div className="content-l_col content-l_col-1-2 col-left budget-col">
                  <div className="block block__sub-section block__border-strong">
                    The <WorksheetOutput value={this.state.preferredPayment} placeholder="--"/> you want to use for monthly housing expenses needs to cover your principal & interest payment, taxes and insurance, and condo/HOA fees.
                  </div>
                  <div className="block block__sub-section">
                    <MPWOutputRow title="Amount you want to use for monthly housing expenses" value={this.state.preferredPayment}/>
                    <MPWOutputRow title="Condo/HOA fees" value={this.state.condoHOA} prefix="-" note="Usually not included in your mortgage payment."/>
                  </div>
                  <div className="block block__sub-section">
                    <MPWOutputRow title="Estimated total monthly payment" value={this.state.preferredPayment}/>
                    <MPWOutputRow title="Monthly taxes and insurance" value={this.state.taxesAndInsurance} prefix="-"/>
                  </div>
                  <div className="block block__sub-section">
                    <MPWOutputRow title="Estimated monthly principal and interest" value={this.state.principalAndInterest}/>
                  </div>
                </div>
                
                <div className="content-l_col content-l_col-1-2 col-right">
                  <div className="block block__sub-section block__border-strong">
                    <MPWOutputRow title="Estimated down payment" value={this.state.downpayment} placeholder="--"/>
                  </div>
                  <div className="block block__sub-section">
                    <MPWOutputRow title="Estimated loan amount" value={this.state.loanAmount} placeholder="--"/>
                    <p>To keep things simple at this stage, this tool calculates an estimated home price assuming that you will make a 20% down payment and that you will choose a standard, 30-year fixed mortgage.</p>
                    <p>If you put down less than 20% of your home's purchase price, you will likely have to pay for <a href="#">mortgage insurance</a>, which will increase your monthly payment. If you choose a different <a>kind of loan</a>, your monthly payment may be higher or lower.</p>
                  </div>
                </div>
              </div>
              
            </section>
            <section className="print-section">
              <h2 className="indented-content" tabIndex="0">Print your information.</h2>
              <div className="block block__bg block__bg-highlight block__flush-top">
                <div className="content-l">
                  <div className="content-l_col content-l_col-1-2">
                    <p>Finished filling out the worksheet? Be sure to print your work or save it as a PDF before navigating to a different page.</p>
                    <button className="btn btn__primary" onClick={this.print}>
                      Print or save as PDF
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
    }

});

var worksheet = localStorage.getItem('monthlyPaymentWorksheet');
if (typeof worksheet !== "undefined" && worksheet !== "undefined") {
  worksheet = JSON.parse(worksheet);
} else {
  worksheet = {};
}
console.log(worksheet);

ReactDOM.render(
  <MonthlyPaymentWorksheet worksheet={worksheet}/>, document.getElementById('app-container')
);


