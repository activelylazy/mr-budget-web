import Immutable from 'seamless-immutable';
import uuid from 'uuid';
import { ADD_ACCOUNT, USER_DATA_LOADED, UPDATE_LAST_STATEMENT,
  UPDATE_OPENING_BALANCE, ACCOUNT_RECONCILES } from './user-data-actions';

const defaultState = Immutable.from({
  accounts: [],
});

function newAccount(name) {
  return ({
    id: uuid(),
    name,
  });
}

const updateAccount = (account, action) => {
  if (account.id === action.accountId &&
    (account.lastStatementDate === undefined || account.lastStatementDate < action.statementDate)) {
    return { ...account,
      lastStatementBalance: action.statementBalance,
      lastStatementDate: action.statementDate };
  }
  return account;
};

const updateAccountOpeningBalance = (account, action) => {
  if (account.id === action.accountId &&
    account.openingBalance === undefined) {
    return { ...account,
      openingBalance: action.openingBalance,
      openingDate: action.startDate,
    };
  }
  return account;
};

const setAccountReconciles = (account, action) => {
  if (account.id === action.accountId) {
    return { ...account,
      accountReconciles: action.reconciles,
    };
  }
  return account;
};

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
      return Immutable.set(state, 'accounts', state.accounts.map(account => updateAccount(account, action)));
    case UPDATE_OPENING_BALANCE:
      return Immutable.set(state, 'accounts', state.accounts.map(account => updateAccountOpeningBalance(account, action)));
    case ACCOUNT_RECONCILES:
      return Immutable.set(state, 'accounts', state.accounts.map(account => setAccountReconciles(account, action)));
    default:
      return state;
  }
};
