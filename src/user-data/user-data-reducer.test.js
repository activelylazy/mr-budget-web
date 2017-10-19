import { assert, should } from 'chai';
import sinon from 'sinon';
import Immutable from 'seamless-immutable';
import accountsReducer, { __RewireAPI__ as rewireApi } from './user-data-reducer';
import * as actions from './user-data-actions';

should();

describe('accounts reducer', () => {
  it('default state is empty list of accounts', () => {
    const state = accountsReducer(undefined, {});
    assert(state.accounts.length.should.equal(0));
  });

  it('adds an account', () => {
    const uuidStub = sinon.stub();
    const anId = sinon.stub();
    rewireApi.__Rewire__('uuid', uuidStub);
    uuidStub.returns(anId);

    const state = accountsReducer(undefined, actions.addAccountToState('new account'));

    assert(state.accounts.length.should.equal(1));
    assert(state.accounts[0].name.should.equal('new account'));
    assert(state.accounts[0].id.should.equal(anId));
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

  describe('update last statement', () => {
    it('updates last statement date and balance', () => {
      const accountId = 4;
      const userData = Immutable({
        accounts: [{
          id: accountId,
          name: 'my account',
        }],
      });
      const statementBalance = 123.45;
      const statementDate = new Date();
      const state = accountsReducer(userData, {
        type: actions.UPDATE_LAST_STATEMENT,
        statementDate,
        statementBalance,
        accountId,
      });

      assert(state.accounts.length.should.equal(1));
      assert(state.accounts[0].id.should.equal(accountId));
      assert(state.accounts[0].name.should.equal('my account'));
      assert(state.accounts[0].lastStatementDate.toString().should.equal(statementDate.toString()));
      assert(state.accounts[0].lastStatementBalance.should.equal(statementBalance));
    });
  });
});
