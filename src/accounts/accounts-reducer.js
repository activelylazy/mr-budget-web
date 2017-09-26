import Immutable from 'seamless-immutable';
import { ADD_ACCOUNT } from './accounts-actions';

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
    default:
      return state;
  }
};
