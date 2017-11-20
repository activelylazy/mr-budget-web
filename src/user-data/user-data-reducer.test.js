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

  it('does not load user data if already loaded', () => {
    const userData = {
      accounts: [{
        name: 'my account',
      }],
    };
    const initialState = {
      accounts: [{
        name: 'original account',
      }],
    };
    const state = accountsReducer(initialState, actions.userDataLoaded(userData));

    assert(state.accounts.length.should.equal(1));
    assert(state.accounts[0].name.should.equal('original account'));
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

    it('updates last statement date and balance where new statement is more recent', () => {
      const accountId = 4;
      const userData = Immutable({
        accounts: [{
          id: accountId,
          name: 'my account',
          lastStatementDate: new Date(Date.now() - (24 * 3600 * 1000)),
          lastStatementBalance: 111.11,
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

    it('does not update last statement date and balance if it is before the most recent update', () => {
      const accountId = 4;
      const userData = Immutable({
        accounts: [{
          id: accountId,
          name: 'my account',
          lastStatementDate: new Date(Date.now() - (5 * 24 * 3600 * 1000)),
          lastStatementBalance: 111.11,
        }],
      });
      const statementBalance = 123.45;
      const statementDate = new Date(Date.now() - (6 * 24 * 3600 * 1000));
      const state = accountsReducer(userData, {
        type: actions.UPDATE_LAST_STATEMENT,
        statementDate,
        statementBalance,
        accountId,
      });

      assert(state.accounts.length.should.equal(1));
      assert(state.accounts[0].id.should.equal(accountId));
      assert(state.accounts[0].name.should.equal('my account'));
      assert(state.accounts[0].lastStatementDate.toString().should.equal(
        userData.accounts[0].lastStatementDate.toString()));
      assert(state.accounts[0].lastStatementBalance.should.equal(111.11));
    });

    it('updates opening balance when non already set', () => {
      const accountId = 4;
      const userData = Immutable({
        accounts: [{
          id: accountId,
          name: 'my account',
        }],
      });
      const startDate = new Date();
      const openingBalance = 11.22;

      const state = accountsReducer(userData,
        actions.updateAccountOpeningBalance(startDate, openingBalance, accountId));

      assert(state.accounts[0].openingBalance.should.equal(11.22));
      assert(state.accounts[0].openingDate.toString().should.equal(startDate.toString()));
    });

    it('does not update opening balance when already set', () => {
      const accountId = 4;
      const openingDate = new Date(Date.now() - (24 * 3600 * 1000));
      const userData = Immutable({
        accounts: [{
          id: accountId,
          name: 'my account',
          openingBalance: 22.33,
          openingDate,
        }],
      });
      const newDate = new Date();
      const newBalance = 11.22;

      const state = accountsReducer(userData,
        actions.updateAccountOpeningBalance(newDate, newBalance, accountId));

      assert(state.accounts[0].openingBalance.should.equal(22.33));
      assert(state.accounts[0].openingDate.toString().should.equal(openingDate.toString()));
    });
  });

  describe('set account reconciles', () => {
    it('sets account reconciles', () => {
      const accountId = 'abc-123';
      const userData = Immutable({
        accounts: [{
          id: accountId,
          name: 'my account',
        }],
      });
      const state = accountsReducer(userData,
        actions.accountReconciles(accountId, true));

      assert(state.accounts[0].accountReconciles.should.equal(true));
    });
  });
});
