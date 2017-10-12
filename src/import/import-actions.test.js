import { assert, should } from 'chai';
import sinon from 'sinon';
import uuid from 'uuid';
import { importStatement, importAccountSelected, STATEMENT_UPLOADED,
  IMPORT_ACCOUNT_SELECTED, __RewireAPI__ as rewireApi } from './import-actions';

should();

describe('import actions', () => {
  it('imports a statement by parsing and dispatching statement_uploaded', (done) => {
    const fileContents = 'file contents';
    const parseOfx = sinon.stub();
    const statement = sinon.stub();
    const dispatch = sinon.stub();

    rewireApi.__Rewire__('parseOfx', parseOfx);
    parseOfx.returns(Promise.resolve(statement));

    importStatement(fileContents)(dispatch)
      .then(() => {
        assert(parseOfx.calledWith(fileContents));
        assert(dispatch.calledWith(sinon.match({ type: STATEMENT_UPLOADED, statement })));
        done();
      })
      .catch(done);
  });

  it('creates an import account selected action', () => {
    const accountId = uuid();
    const result = importAccountSelected(accountId);

    assert(result.type.should.equal(IMPORT_ACCOUNT_SELECTED));
    assert(result.accountId.should.equal(accountId));
  });

  it('creates an import account selected action with no account id', () => {
    const result = importAccountSelected('');

    assert(result.type.should.equal(IMPORT_ACCOUNT_SELECTED));
    assert.isNull(result.accountId);
  });
});