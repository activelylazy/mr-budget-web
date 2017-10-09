import Immutable from 'seamless-immutable';
import { STATEMENT_UPLOADED, IMPORT_ACCOUNT_SELECTED } from './import-actions';

const defaultState = Immutable({
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case STATEMENT_UPLOADED:
      return Immutable({ ...state, statement: action.statement });
    case IMPORT_ACCOUNT_SELECTED:
      return Immutable({ ...state, selectedAccount: action.accountName });
    default:
      return state;
  }
};
