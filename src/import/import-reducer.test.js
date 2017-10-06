import { assert, should } from 'chai';
import sinon from 'sinon';
import importReducer from './import-reducer';
import * as actions from './import-actions';

should();

describe('import reducer', () => {
  it('has undefined statement initially', () => {
    const state = importReducer(undefined, {});
    assert.isUndefined(state.statement);
  });

  it('handles statement uploaded by setting statement', () => {
    const statement = sinon.stub();

    const state = importReducer(undefined, actions.statementUploaded(statement));

    assert(state.statement.should.equal(statement));
  });
});
