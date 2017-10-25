import { assert, should } from 'chai';
import sinon from 'sinon';
import uuid from 'uuid';
import { SHOW_INFO, SHOW_ERROR } from '../app-actions';
import { importStatement, importAccountSelected, importStatementToAccount, setSelectedAccount,
  filterTransactions,
  STATEMENT_UPLOADED, IMPORT_ACCOUNT_SELECTED, IMPORT_FINISHED, IMPORT_STARTED,
  __RewireAPI__ as rewireApi } from './import-actions';

should();

describe('import actions', () => {
  describe('import statement', () => {
    it('parses and dispatches statement_uploaded', (done) => {
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

    it('rejects if parseOfx is rejected', (done) => {
      const error = sinon.stub();
      const fileContents = 'file contents';
      const parseOfx = sinon.stub();
      const dispatch = sinon.stub();

      rewireApi.__Rewire__('parseOfx', parseOfx);
      parseOfx.returns(Promise.reject(error));

      importStatement(fileContents)(dispatch)
        .then(() => {
          done(new Error('Expected promise to be rejected'));
        })
        .catch((err) => {
          assert(err.should.equal(error));
          done();
        });
    });
  });

  describe('filter transactions', () => {
    it('returns transactions when no last statement date', () => {
      const transactions = sinon.stub();

      const result = filterTransactions(undefined, transactions);

      assert(result.should.equal(transactions));
    });

    it('returns transactions after the given date', () => {
      const transaction1 = {
        date: new Date(Date.now() - (3 * 24 * 3600 * 1000)),
      };
      const transaction2 = {
        date: new Date(Date.now() - (1 * 24 * 3600 * 1000)),
      };
      const transactions = [transaction1, transaction2];

      const result = filterTransactions(
        new Date(Date.now() - (2 * 24 * 3600 * 1000)),
        transactions);

      assert(result.length.should.equal(1));
      assert(result[0].should.equal(transaction2));
    });
  });

  describe('import account selected', () => {
    it('dispatches import account selected with filtered transactions', () => {
      const accountId = uuid();
      const dispatch = sinon.stub();
      const lastStatementDate = sinon.stub();
      const transactions = sinon.stub();
      const getState = sinon.stub().returns({
        statementImport: {
          uploadedStatement: {
            date: sinon.stub(),
            balance: sinon.stub(),
            transactions,
          },
        },
        userData: {
          accounts: [
            {
              id: accountId,
              lastStatementDate,
            },
          ],
        },
      });
      const filteredTransactions = sinon.stub();
      const filterTransactionsStub = sinon.stub().returns(filteredTransactions);

      rewireApi.__Rewire__('filterTransactions', filterTransactionsStub);

      importAccountSelected(accountId)(dispatch, getState);

      assert(dispatch.calledWith(sinon.match({
        type: IMPORT_ACCOUNT_SELECTED,
        accountId,
        filteredTransactions,
      })));
      assert(filterTransactionsStub.calledWith(lastStatementDate, transactions));
    });
  });

  it('creates an import account selected action with no account id', () => {
    const result = setSelectedAccount('');

    assert(result.type.should.equal(IMPORT_ACCOUNT_SELECTED));
    assert.isNull(result.accountId);
  });

  describe('import statement to account', () => {
    it('disatches import started', (done) => {
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

      importStatementToAccount()(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: IMPORT_STARTED,
          })));
          done();
        })
        .catch(done);
    });

    it('gets statement to import and imports statement data', (done) => {
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

      importStatementToAccount()(dispatch, getState)
        .then((result) => {
          assert(importStatementData.calledWith(auth, statement, selectedAccountId,
            dispatch, getState));
          assert.isUndefined(result);
          done();
        })
        .catch(done);
    });

    it('dispatches error alert if importStatementData is rejected', (done) => {
      const error = new Error('testing');
      const importStatementData = sinon.stub().returns(Promise.reject(error));
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

      rewireApi.__Rewire__('importStatementData', importStatementData);

      importStatementToAccount()(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: SHOW_ERROR,
            msg: 'Error importing statement: Error: testing',
          })));
          done();
        });
    });

    it('finishes import', (done) => {
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
            type: IMPORT_FINISHED,
          })));
          done();
        })
        .catch(done);
    });

    it('dispatches info message', (done) => {
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
            type: SHOW_INFO,
            msg: 'Statement imported',
          })));
          done();
        })
        .catch(done);
    });

    it('updates last statement', (done) => {
      const dispatch = sinon.stub();
      const auth = sinon.stub();
      const date = sinon.stub();
      const balance = sinon.stub();
      const statement = {
        date,
        balance,
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
          assert(updateLastStatement.calledWith(auth, date, balance,
            selectedAccountId));
          assert(updateLastStatementThunk.calledWith(dispatch, getState));
          done();
        })
        .catch(done);
    });
  });
});
