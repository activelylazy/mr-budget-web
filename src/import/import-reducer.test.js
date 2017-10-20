import { assert, should } from 'chai';
import sinon from 'sinon';
import uuid from 'uuid';
import importReducer from './import-reducer';
import * as actions from './import-actions';

should();

describe('import reducer', () => {
  it('has correct initial state', () => {
    const state = importReducer(undefined, {});
    assert.isUndefined(state.statement);
    assert.isUndefined(state.selectedAccountId);
    assert(state.importInProgress.should.equal(false));
  });

  describe('handles statement uploaded', () => {
    it('sets uploaded statement', () => {
      const statement = sinon.stub();

      const state = importReducer(undefined, actions.statementUploaded(statement));

      assert(state.uploadedStatement.should.equal(statement));
    });
  });

  describe('handles import account selected', () => {
    it('sets selected account', () => {
      const statement = sinon.stub();
      const accountId = uuid();

      const initialState = importReducer(undefined, actions.statementUploaded(statement));
      const state = importReducer(initialState, actions.setSelectedAccount(accountId));

      assert(state.selectedAccountId.should.equal(accountId));
    });

    it('sets statement to statement with filtered transactions', () => {
      const statement = {
        date: sinon.stub(),
        balance: sinon.stub(),
        transactions: sinon.stub(),
      };
      const accountId = uuid();
      const filteredTransactions = sinon.stub();

      const initialState = importReducer(undefined, actions.statementUploaded(statement));
      const state = importReducer(initialState,
        actions.setSelectedAccount(accountId, filteredTransactions));

      assert(state.statement.date.should.equal(statement.date));
      assert(state.statement.balance.should.equal(statement.balance));
      assert(state.statement.transactions.should.equal(filteredTransactions));
    });
  });

  describe('handles import started', () => {
    it('sets import in progress to true', () => {
      const initialState = {
        statement: {},
        selectedAccountId: '1234',
      };

      const state = importReducer(initialState, actions.importStarted());

      assert(state.importInProgress.should.equal(true));
    });
  });

  describe('handles import finished', () => {
    it('resets import state', () => {
      const initialState = {
        statement: {},
        selectedAccountId: '1234',
      };

      const state = importReducer(initialState, actions.importFinished());

      assert.isUndefined(state.statement);
      assert.isUndefined(state.selectedAccountId);
      assert(state.importInProgress.should.equal(false));
    });
  });
});
