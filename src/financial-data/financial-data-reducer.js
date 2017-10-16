import Immutable from 'seamless-immutable';
import { FINANCIAL_DATA_LOADED, APPLY_TRANSACTIONS_TO_MONTH } from './financial-data-actions';

const defaultState = Immutable({
});

function mergeYear(existingYear, month, financialData) {
  return existingYear.set(month, existingYear[month] || financialData);
}

function mergeMonthTransactions(existingMonth, transactions) {
  return existingMonth.set('transactions',
    existingMonth.transactions.concat(transactions),
  );
}

function mergeYearTransactions(existingYear, month, transactions) {
  return existingYear.set(month, mergeMonthTransactions(existingYear[month], transactions));
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case FINANCIAL_DATA_LOADED:
      return state.set(action.year,
        mergeYear(state[action.year] || Immutable({}), action.month, action.financialData));
    case APPLY_TRANSACTIONS_TO_MONTH:
      return state.set(action.year,
        mergeYearTransactions(state[action.year], action.month, action.transactions));
    default:
      return state;
  }
};
