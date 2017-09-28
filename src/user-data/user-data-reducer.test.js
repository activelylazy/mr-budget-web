import { assert, should } from 'chai';
import accountsReducer from './user-data-reducer';
import * as actions from './user-data-actions';

should();

describe('accounts reducer', () => {
  it('default state is empty list of accounts', () => {
    const state = accountsReducer(undefined, {});
    assert(state.accounts.length.should.equal(0));
  });

  it('adds an account', () => {
    const state = accountsReducer(undefined, actions.addAccountToState('new account'));

    assert(state.accounts.length.should.equal(1));
    assert(state.accounts[0].name.should.equal('new account'));
  });

  it('adds another account', () => {
    const initialState = accountsReducer(undefined, actions.addAccountToState('new account'));
    const state = accountsReducer(initialState, actions.addAccountToState('second account'));

    assert(state.accounts.length.should.equal(2));
    assert(state.accounts[0].name.should.equal('new account'));
    assert(state.accounts[1].name.should.equal('second account'));
  });

  it('loads user data', () => {
    const userData = {
      accounts: [{
        name: 'my account',
      }],
    };
    const state = accountsReducer(undefined, actions.userDataLoaded(userData));

    assert(state.accounts.length.should.equal(1));
    assert(state.accounts[0].name.should.equal('my account'));
  });
});
