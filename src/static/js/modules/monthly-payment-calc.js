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

var monthly = {};

monthly.preTaxIncomeTotal = function (data) {
  return sum([data.preTaxIncome, data.preTaxIncomeCB]);
}

monthly.takeHomeIncomeTotal = function (data) {
  return sum([data.takeHomeIncome, data.takeHomeIncomeCB]);
}

monthly.spendingAndSavings = function (data) {
  return sum([data.rent, data.utilities, data.debtPayments, data.livingExpenses, data.savings]);
}

monthly.homeMaintenanceAndImprovement = function (data) {
  return sum([data.homeImprovement, data.homeMaintenance]);
}

monthly.newHomeownershipExpenses = function (data) {
  return sum([data.condoHOA, data.homeImprovement, data.homeMaintenance]);
}

monthly.futureSavings = function (data) {
  return sum([data.emergencySavings, data.longTermSavings]);
}

monthly.availableHousingFunds = function (data) {
  var income = sum([data.takeHomeIncome, data.takeHomeIncomeCB]);
  var expenses = sum([data.debtPayments, data.livingExpenses, data.futureUtilities, data.homeImprovement, data.homeMaintenance, data.emergencySavings, data.longTermSavings]);
               
  return income - expenses;
}

monthly.estimatedTotalPayment = function (data) {
  return monthly.availableHousingFunds(data) - cleanNumber(data.condoHOA);
}

monthly.taxesAndInsurance = function (data) {
  var homePrice = cleanNumber(data.homePrice);
  var propertyTax = cleanNumber((data.propertyTax ) / 100);
  var insurance = cleanNumber(data.homeownersInsurance);
  var annualTaxesAndInsurance = (homePrice * propertyTax) + insurance;
  return annualTaxesAndInsurance / 12;
}

monthly.principalAndInterest = function (data) {
  var total = monthly.estimatedTotalPayment(data) - monthly.taxesAndInsurance(data);
  return total;
}

monthly.percentageIncomeAvailable = function (data) {
  var funds = monthly.availableHousingFunds(data);
  var income = monthly.preTaxIncomeTotal(data);
  if (income) {
    return Math.round((funds/income) * 100);
  }
}

module.exports = monthly;