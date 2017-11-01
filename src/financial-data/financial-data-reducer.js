import Immutable from 'seamless-immutable';
import { FINANCIAL_DATA_LOADED, APPLY_TRANSACTIONS_TO_MONTH,
  SET_ACCOUNT_OPENING_BALANCE_IN_MONTH } from './financial-data-actions';

const defaultState = Immutable({
});

function mergeMonth(existingYear, month, monthUpdater) {
  return existingYear.set(month, monthUpdater(existingYear[month]));
}

function mergeMonthTransactions(existingMonth, transactions) {
  return existingMonth.set('transactions',
    existingMonth.transactions.concat(transactions),
  );
}

function setAccountOpeningBalance(existingMonth, accountId, openingBalance) {
  return existingMonth.set('openingBalances',
    existingMonth.openingBalances.set(accountId, openingBalance));
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case FINANCIAL_DATA_LOADED:
      return state.set(action.year,
        mergeMonth(state[action.year] || Immutable({}), action.month,
          existingMonth => existingMonth || action.financialData));
    case APPLY_TRANSACTIONS_TO_MONTH:
      return state.set(action.year,
        mergeMonth(state[action.year], action.month,
          existingMonth => mergeMonthTransactions(existingMonth, action.transactions)));
    case SET_ACCOUNT_OPENING_BALANCE_IN_MONTH:
      return state.set(action.year,
        mergeMonth(state[action.year], action.month,
          existingMonth => setAccountOpeningBalance(existingMonth, action.accountId, action.openingBalance)));
    default:
      return state;
  }
};
