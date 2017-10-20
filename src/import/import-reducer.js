import Immutable from 'seamless-immutable';
import { STATEMENT_UPLOADED, IMPORT_ACCOUNT_SELECTED, IMPORT_FINISHED,
  IMPORT_STARTED } from './import-actions';

const defaultState = Immutable({
  importInProgress: false,
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case STATEMENT_UPLOADED:
      return Immutable({ ...state, uploadedStatement: action.statement });
    case IMPORT_ACCOUNT_SELECTED:
      return Immutable({ ...state,
        statement: { ...state.uploadedStatement, transactions: action.filteredTransactions },
        selectedAccountId: action.accountId });
    case IMPORT_STARTED:
      return Immutable({ ...state, importInProgress: true });
    case IMPORT_FINISHED:
      return defaultState;
    default:
      return state;
  }
};
