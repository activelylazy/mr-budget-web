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

export const loadFinancialDataAndApplyTransactions = (auth, split, dispatch, getState) => // eslint-disable-line
  loadFinancialData(auth, split.year, split.month)(dispatch)
    .then(() => dispatch(applyTransactionsToMonth(split.year, split.month, split.transactions)))
    .then(() => getState().financialData[split.year][split.month]);

export const updateMonthData = (auth, split, dispatch, getState) =>
  loadFinancialDataAndApplyTransactions(auth, split, dispatch, getState)
    .then(monthData => saveFinancialData(auth, monthData, split.year, split.month));

export const importStatementData = (auth, statement, dispatch, getState) =>
  Promise.all(
    splitStatement(statement)
      .map(split => updateMonthData(auth, split, dispatch, getState)));
