import Immutable from 'seamless-immutable';
import { ADD_ACCOUNT, USER_DATA_LOADED } from './user-data-actions';

const defaultState = Immutable.from({
  accounts: [],
});

function newAccount(name) {
  return ({
    name,
  });
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case ADD_ACCOUNT:
      return Immutable.set(state, 'accounts', state.accounts.concat(newAccount(action.accountName)));
    case USER_DATA_LOADED:
      return Immutable.from(action.userData);
    default:
      return state;
  }
};
