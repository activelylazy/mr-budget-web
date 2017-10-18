import { loadFinancialData, applyTransactionsToMonth, saveFinancialData } from '../../financial-data/financial-data-actions';

export const loadFinancialDataAndApplyTransactions = (auth, split, dispatch, getState) => // eslint-disable-line
  loadFinancialData(auth, split.year, split.month)(dispatch)
    .then(() => dispatch(applyTransactionsToMonth(split.year, split.month, split.transactions)))
    .then(() => getState().financialData[split.year][split.month]);

export const updateMonthData = (auth, split, dispatch, getState) =>
  loadFinancialDataAndApplyTransactions(auth, split, dispatch, getState)
    .then(monthData => saveFinancialData(auth, monthData, split.year, split.month));

