import Immutable from 'seamless-immutable';
import uuid from 'uuid';
import { ADD_ACCOUNT, USER_DATA_LOADED, UPDATE_LAST_STATEMENT } from './user-data-actions';

const defaultState = Immutable.from({
  accounts: [],
});

function newAccount(name) {
  return ({
    id: uuid(),
    name,
  });
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case ADD_ACCOUNT:
      return Immutable.set(state, 'accounts', state.accounts.concat(newAccount(action.accountName)));
    case USER_DATA_LOADED:
      if (state === defaultState) {
        return Immutable.from(action.userData);
      }
      return state;
    case UPDATE_LAST_STATEMENT:
      return Immutable.set(state, 'accounts', state.accounts.map(account =>
        (account.id === action.accountId
          ? ({ ...account,
            lastStatementBalance: action.statementBalance,
            lastStatementDate: action.statementDate })
          : account)));
    default:
      return state;
  }
};
