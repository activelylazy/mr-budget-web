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
  });

  it('handles statement uploaded by setting statement', () => {
    const statement = sinon.stub();

    const state = importReducer(undefined, actions.statementUploaded(statement));

    assert(state.statement.should.equal(statement));
  });

  it('handles import account selected by setting selected account', () => {
    const statement = sinon.stub();
    const accountId = uuid();

    const initialState = importReducer(undefined, actions.statementUploaded(statement));
    const state = importReducer(initialState, actions.importAccountSelected(accountId));

    assert(state.selectedAccountId.should.equal(accountId));
  });

  it('handles import statement to account by resetting import state', () => {
    const initialState = {
      statement: {},
      selectedAccountId: '1234',
    };

    const state = importReducer(initialState, actions.importStatementToAccount('4321', {}));

    assert.isUndefined(state.statement);
    assert.isUndefined(state.selectedAccountId);
  });
});
