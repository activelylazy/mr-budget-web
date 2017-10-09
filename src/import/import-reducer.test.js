import { assert, should } from 'chai';
import sinon from 'sinon';
import importReducer from './import-reducer';
import * as actions from './import-actions';

should();

describe('import reducer', () => {
  it('has correct initial state', () => {
    const state = importReducer(undefined, {});
    assert.isUndefined(state.statement);
    assert.isUndefined(state.selectedAccount);
  });

  it('handles statement uploaded by setting statement', () => {
    const statement = sinon.stub();

    const state = importReducer(undefined, actions.statementUploaded(statement));

    assert(state.statement.should.equal(statement));
  });

  it('handles import account selected by setting selected account', () => {
    const statement = sinon.stub();

    const initialState = importReducer(undefined, actions.statementUploaded(statement));
    const state = importReducer(initialState, actions.importAccountSelected('account one'));

    assert(state.selectedAccount.should.equal('account one'));
  });
});
