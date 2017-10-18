import { loadFinancialData, applyTransactionsToMonth, saveFinancialData } from '../../financial-data/financial-data-actions';

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
    return loadFinancialData(auth, year, month)(dispatch);
  }
  return Promise.resolve(getState().financialData[year][month]);
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
