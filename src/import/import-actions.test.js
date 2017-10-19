import { assert, should } from 'chai';
import sinon from 'sinon';
import uuid from 'uuid';
import { importStatement, importAccountSelected, importStatementToAccount,
  STATEMENT_UPLOADED, IMPORT_ACCOUNT_SELECTED, RESET_IMPORT, __RewireAPI__ as rewireApi } from './import-actions';

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

  describe('import statement to account', () => {
    it('gets statement to import and imports statement data', () => {
      const dispatch = sinon.stub();
      const auth = sinon.stub();
      const statement = sinon.stub();
      const selectedAccountId = sinon.stub();
      const getState = sinon.stub().returns({
        auth,
        statementImport: {
          statement,
          selectedAccountId,
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);

      importStatementToAccount()(dispatch, getState);

      assert(importStatementData.calledWith(auth, statement, selectedAccountId,
        dispatch, getState));
    });

    it('resets import', (done) => {
      const dispatch = sinon.stub();
      const auth = sinon.stub();
      const statement = sinon.stub();
      const getState = sinon.stub().returns({
        auth,
        statementImport: {
          statement,
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);

      importStatementToAccount()(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: RESET_IMPORT,
          })));
          done();
        })
        .catch(done);
    });

    it('updates last statement', (done) => {
      const dispatch = sinon.stub();
      const auth = sinon.stub();
      const statementDate = sinon.stub();
      const statementBalance = sinon.stub();
      const statement = {
        statementDate,
        statementBalance,
      };
      const selectedAccountId = sinon.stub();
      const getState = sinon.stub().returns({
        auth,
        statementImport: {
          statement,
          selectedAccountId,
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());
      const updateLastStatementThunk = sinon.stub();
      const updateLastStatement = sinon.stub().returns(updateLastStatementThunk);

      rewireApi.__Rewire__('importStatementData', importStatementData);
      rewireApi.__Rewire__('updateLastStatement', updateLastStatement);

      importStatementToAccount()(dispatch, getState)
        .then(() => {
          assert(updateLastStatement.calledWith(auth, statementDate, statementBalance,
            selectedAccountId));
          assert(updateLastStatementThunk.calledWith(dispatch, getState));
          done();
        })
        .catch(done);
    });
  });
});
