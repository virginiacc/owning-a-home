var assign = require('object-assign');
var housePriceCalculations = require('./monthly-payment-worksheet/house-price.js');

var loanDataDefaults = {loanAmount: '', housePrice: '', insurance: '', taxes: '', downpayment: '', principalAndInterest: '', taxesAndInsurance: ''}

var monthly = {};

function cleanNumber (num) {
  num = num ? num.toString().replace(/,/g,'') : '';
  return parseFloat(num) || 0;
}

function sum (arr) {
  var result = 0;
  for (var i = 0; i < arr.length; i++) {
    result += cleanNumber(arr[i]);
  }
  return result || '';
}

monthly.loanAmount = function (data) {
  var loanData;
  if (data.takeHomeIncomeTotal && data.availableHousingFunds && data.preferredPayment && data.interestRate) {
    loanData = housePriceCalculations({
      monthlyPayment: data.preferredPayment, 
      term: 30, 
      rate: cleanNumber(data.interestRate), 
      tax: cleanNumber(data.propertyTax), 
      downpayment: 20, 
      insurance: cleanNumber(data.homeownersInsurance)
    });
    loanData.taxesAndInsurance = loanData.insurance + loanData.taxes;
    
    loanData.principalAndInterest = data.preferredPayment - loanData.taxesAndInsurance;
  } else {
    loanData = loanDataDefaults;
  }
  console.log(loanData)
  return loanData;
}

monthly.preTaxIncomeTotal = function (data) {
  return sum([data.preTaxIncome, data.preTaxIncomeCB]);
}

monthly.preTaxIncomeMonthly = function (data) {
  var totalIncome = monthly.preTaxIncomeTotal(data);
  if (totalIncome) {
    return totalIncome / 12;
  }
}

monthly.takeHomeIncomeTotal = function (data) {
  return sum([data.takeHomeIncome, data.takeHomeIncomeCB]);
}

monthly.spendingAndSavings = function (data) {
  return sum([data.rent, data.utilities, data.debtPayments, data.livingExpenses, data.savings]);
}

monthly.newHomeownershipExpenses = function (data) {
  return sum([data.condoHOA, data.homeMaintenance]);
}

monthly.availableHousingFunds = function (data) {
  var income = sum([data.takeHomeIncome, data.takeHomeIncomeCB]);
  var expenses = sum([data.debtPayments, data.livingExpenses, data.futureUtilities, data.homeMaintenance, data.futureSavings]);
               
  return income - expenses;
}

monthly.percentageIncomeAvailable = function (data) {
  var funds = monthly.availableHousingFunds(data);
  var income = monthly.preTaxIncomeTotal(data);
  if (income) {
    return Math.round((funds/income) * 100);
  }
}

monthly.preferredPayment = function (data) {
  var availableFunds = monthly['availableHousingFunds'](data);
  var preferredPayment = data['preferredMonthlyPayment'];
  return (!preferredPayment || preferredPayment > availableFunds) ? availableFunds : preferredPayment;
}

monthly.preferredPaymentPercentage = function (data) {
  var preferredPayment = monthly.preferredPayment(data);
  var preTaxIncomeMonthly = monthly.preTaxIncomeMonthly(data);
  if (preTaxIncomeMonthly) {
    if (preferredPayment) {
      return Math.round((preferredPayment / preTaxIncomeMonthly) * 100);
    } else {
      return 0;
    }
  }
}

monthly.otherExpenses = function (data) {
  var availableFunds = monthly['availableHousingFunds'](data);
  var preferredPayment = data['preferredMonthlyPayment'];
  return (!preferredPayment || preferredPayment > availableFunds) ? 0 : availableFunds - preferredPayment;
}

monthly.housePrice = function () {
  
}

module.exports = monthly;

var oldMonthly = {}
oldMonthly.estimatedTotalPayment = function (data) {
  var income = sum([data.takeHomeIncome, data.takeHomeIncomeCB]);
  var expenses = sum([data.debtPayments, data.livingExpenses, data.futureUtilities, data.homeMaintenance, data.futureSavings]);
  return income - expenses - cleanNumber(data.condoHOA);
}

oldMonthly.taxesAndInsurance = function (data) {
  var homePrice = cleanNumber(data.homePrice);
  var propertyTax = cleanNumber((data.propertyTax ) / 100);
  var insurance = cleanNumber(data.homeownersInsurance);
  var annualTaxesAndInsurance = (homePrice * propertyTax) + insurance;
  return annualTaxesAndInsurance / 12;
}

oldMonthly.principalAndInterest = function (data) {
  var total = monthly.estimatedTotalPayment(data) - monthly.taxesAndInsurance(data);
  return total;
}