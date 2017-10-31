import { loadFinancialData, applyTransactionsToMonth,
  saveFinancialData, financialDataLoaded } from '../../financial-data/financial-data-actions';

function findSplit(splits, date) {
  return splits.find(split => split.year === date.getFullYear() && split.month === date.getMonth());
}

export const splitStatement = (statement) => {
  const splits = [];
  statement.transactions.forEach((transaction) => {
    const split = findSplit(splits, transaction.date);
    if (split === undefined) {
      splits.push({
        year: transaction.date.getFullYear(),
        month: transaction.date.getMonth(),
        transactions: [transaction],
      });
    } else {
      split.transactions.push(transaction);
    }
  });
  return splits;
};

export const loadFinancialDataIfRequired = (auth, year, month, dispatch, getState) => {
  if (getState().financialData[year] === undefined ||
    getState().financialData[year][month] === undefined) {
    return loadFinancialData(auth, year, month, dispatch)
      .then(financialData => dispatch(financialDataLoaded(financialData, year, month)));
  }
  return Promise.resolve();
};

export const loadFinancialDataAndApplyTransactions = (auth, year, month, transactions, dispatch, getState) => // eslint-disable-line
  loadFinancialDataIfRequired(auth, year, month, dispatch, getState)
    .then(() => dispatch(applyTransactionsToMonth(year, month, transactions)))
    .then(() => getState().financialData[year][month]);

export const updateMonthData = (auth, year, month, transactions, dispatch, getState) =>
  loadFinancialDataAndApplyTransactions(auth, year, month, transactions, dispatch, getState)
    .then(monthData => saveFinancialData(auth, monthData, year, month));

export const updateTransactionsWithAccount = (transactions, accountId) =>
  transactions.map(transaction => ({ ...transaction, accountId }));

export const importStatementData = (auth, statement, accountId, dispatch, getState) =>
  Promise.all(
    splitStatement(statement)
      .map(split => updateMonthData(auth, split.year, split.month,
        updateTransactionsWithAccount(split.transactions, accountId),
        dispatch, getState)));

export const openingBalance = (statement) => {
  const totals = statement.transactions.map(t => t.amount).reduce((a, b) => a + b, 0);
  return +(statement.balance - totals).toFixed(2);
};

function monthIsBeforeEnd(month, year, endMonth, endYear) {
  if (year === endYear) {
    return month <= endMonth;
  }
  return month < 12;
}

function startMonthFor(startMonth, startYear, year) {
  if (year === startYear) {
    return startMonth;
  }
  return 0;
}

export const monthsInRange = (startMonth, startYear, endMonth, endYear) => {
  const months = [];
  for (let year = startYear; year <= endYear; year++) { // eslint-disable-line
    for (let month = startMonthFor(startMonth, startYear, year); monthIsBeforeEnd(month, year, endMonth, endYear); month++ ) { // eslint-disable-line
      months.push({
        year,
        month,
      });
    }
  }
  return months;
};

export const accountOpeningBalanceInMonth = (account, financialData, year, month) => {
  if (financialData.openingBalances[account.id] !== undefined) {
    return financialData.openingBalances[account.id];
  }
  if (account.openingDate.getMonth() === month &&
    account.openingDate.getFullYear() === year) {
    return account.openingBalance;
  }
  throw new Error(`Cannot get opening balance for account in ${month + 1}/${year}`);
};
