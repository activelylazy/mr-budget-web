import { assert, should } from 'chai';
import accountsReducer from './accounts-reducer';
import * as actions from './accounts-actions';

should();

describe('accounts reducer', () => {
  it('default state is empty list of accounts', () => {
    const state = accountsReducer(undefined, {});
    assert(state.accounts.length.should.equal(0));
  });

  it('adds an account', () => {
    const state = accountsReducer(undefined, actions.addAccountCompleted('new account'));

    assert(state.accounts.length.should.equal(1));
    assert(state.accounts[0].name.should.equal('new account'));
  });

  it('adds another account', () => {
    const initialState = accountsReducer(undefined, actions.addAccountCompleted('new account'));
    const state = accountsReducer(initialState, actions.addAccountCompleted('second account'));

    assert(state.accounts.length.should.equal(2));
    assert(state.accounts[0].name.should.equal('new account'));
    assert(state.accounts[1].name.should.equal('second account'));
  });
});
