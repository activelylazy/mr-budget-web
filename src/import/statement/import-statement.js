import { loadFinancialData, applyTransactionsToMonth } from '../../financial-data/financial-data-actions';

export const loadFinancialDataAndApplyTransactions = (auth, split) => (dispatch, getState) => // eslint-disable-line
  loadFinancialData(auth, split.year, split.month)(dispatch)
    .then(() => dispatch(applyTransactionsToMonth(split.year, split.month, split.transactions)))
    .then(() => getState().financialData[split.year][split.month]);

