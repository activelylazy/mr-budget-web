import Immutable from 'seamless-immutable';
import { STATEMENT_UPLOADED, IMPORT_ACCOUNT_SELECTED, RESET_IMPORT } from './import-actions';

const defaultState = Immutable({
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case STATEMENT_UPLOADED:
      return Immutable({ ...state, statement: action.statement });
    case IMPORT_ACCOUNT_SELECTED:
      return Immutable({ ...state, selectedAccountId: action.accountId });
    case RESET_IMPORT:
      return defaultState;
    default:
      return state;
  }
};
