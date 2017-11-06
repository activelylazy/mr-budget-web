import { assert, should } from 'chai';
import sinon from 'sinon';
import uuid from 'uuid';
import { SHOW_ERROR, SHOW_INFO } from '../app-actions';
import { STATEMENT_UPLOADED, IMPORT_STARTED, IMPORT_FINISHED,
  IMPORT_ACCOUNT_SELECTED } from './import-actions';
import { readStatement, importStatement,
  importAccountSelected,
  __RewireAPI__ as rewireApi } from './import-thunk';

should();

describe('import thunk', () => {
  describe('read statement', () => {
    it('parses and dispatches statement_uploaded', (done) => {
      const fileContents = 'file contents';
      const parseOfx = sinon.stub();
      const statement = sinon.stub();
      const dispatch = sinon.stub();

      rewireApi.__Rewire__('parseOfx', parseOfx);
      parseOfx.returns(Promise.resolve(statement));

      readStatement(fileContents)(dispatch)
        .then(() => {
          assert(parseOfx.calledWith(fileContents));
          assert(dispatch.calledWith(sinon.match({
            type: STATEMENT_UPLOADED,
            statement,
          })));
          done();
        })
        .catch(done);
    });

    it('dispatches error alert if parseOfx is rejected', (done) => {
      const error = new Error('testing');
      const fileContents = 'file contents';
      const parseOfx = sinon.stub();
      const dispatch = sinon.stub();

      rewireApi.__Rewire__('parseOfx', parseOfx);
      parseOfx.returns(Promise.reject(error));

      readStatement(fileContents)(dispatch)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: SHOW_ERROR,
            msg: 'Error uploading statement',
            error,
          })));
          done();
        });
    });
  });

  describe('import statement', () => {
    it('does nothing if import already started', (done) => {
      const dispatch = sinon.stub();
      const auth = sinon.stub();
      const statement = sinon.stub();
      const selectedAccountId = sinon.stub();
      const getState = sinon.stub().returns({
        auth,
        statementImport: {
          statement,
          selectedAccountId,
          importInProgress: true,
        },
      });

      const importStatementData = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);

      importStatement()(dispatch, getState)
        .then(() => {
          assert(dispatch.notCalled);
          assert(importStatementData.notCalled);
          done();
        })
        .catch(done);
    });

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
          importInProgress: false,
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);

      importStatement()(dispatch, getState)
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
          importInProgress: false,
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);

      importStatement()(dispatch, getState)
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
          importInProgress: false,
        },
      });

      rewireApi.__Rewire__('importStatementData', importStatementData);

      importStatement()(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: SHOW_ERROR,
            msg: 'Error importing statement',
            error,
          })));
          done();
        });
    });

    it('dispatches error alert if saveUserData is rejected', (done) => {
      const error = new Error('testing');
      const dispatch = sinon.stub();
      const statement = sinon.stub();
      const selectedAccountId = sinon.stub();
      const auth = sinon.stub();
      const getState = sinon.stub().returns({
        auth,
        statementImport: {
          statement,
          selectedAccountId,
          importInProgress: false,
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());
      const saveUserData = sinon.stub().returns(Promise.reject(error));
      const openingBalance = sinon.stub().returns();
      const updateOpeningBalances = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);
      rewireApi.__Rewire__('saveUserData', saveUserData);
      rewireApi.__Rewire__('openingBalance', openingBalance);
      rewireApi.__Rewire__('updateOpeningBalances', updateOpeningBalances);

      importStatement()(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: SHOW_ERROR,
            msg: 'Error importing statement',
            error,
          })));
          done();
        })
        .catch(done);
    });

    it('dispatches update last statement', (done) => {
      const dispatch = sinon.stub();
      const statementDate = sinon.stub();
      const statementBalance = sinon.stub();
      const selectedAccountId = sinon.stub();
      const auth = sinon.stub();
      const statement = {
        date: statementDate,
        balance: statementBalance,
      };
      const getState = sinon.stub().returns({
        auth,
        statementImport: {
          statement,
          selectedAccountId,
          importInProgress: false,
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);

      importStatement()(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: 'UPDATE_LAST_STATEMENT',
            statementDate,
            statementBalance,
            accountId: selectedAccountId,
          })));
          done();
        })
        .catch(done);
    });

    it('dispatches update opening balance', (done) => {
      const dispatch = sinon.stub();
      const statementDate = sinon.stub();
      const statementBalance = sinon.stub();
      const selectedAccountId = sinon.stub();
      const auth = sinon.stub();
      const startDate = sinon.stub();
      const statement = {
        date: statementDate,
        balance: statementBalance,
        startDate,
      };
      const getState = sinon.stub().returns({
        auth,
        statementImport: {
          statement,
          selectedAccountId,
          importInProgress: false,
        },
      });
      const startBalance = sinon.stub();
      const importStatementData = sinon.stub().returns(Promise.resolve());
      const openingBalance = sinon.stub().returns(startBalance);

      rewireApi.__Rewire__('importStatementData', importStatementData);
      rewireApi.__Rewire__('openingBalance', openingBalance);

      importStatement()(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: 'UPDATE_OPENING_BALANCE',
            startDate,
            openingBalance: startBalance,
            accountId: selectedAccountId,
          })));
          done();
        })
        .catch(done);
    });

    it('updates opening balances for months', (done) => {
      const dispatch = sinon.stub();
      const statementDate = sinon.stub();
      const statementBalance = sinon.stub();
      const selectedAccountId = sinon.stub();
      const auth = sinon.stub();
      const startDate = sinon.stub();
      const statement = {
        date: statementDate,
        balance: statementBalance,
        startDate,
      };
      const getState = sinon.stub().returns({
        auth,
        statementImport: {
          statement,
          selectedAccountId,
          importInProgress: false,
        },
      });
      const startBalance = sinon.stub();
      const importStatementData = sinon.stub().returns(Promise.resolve());
      const openingBalance = sinon.stub().returns(startBalance);
      const updateOpeningBalances = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);
      rewireApi.__Rewire__('openingBalance', openingBalance);
      rewireApi.__Rewire__('updateOpeningBalances', updateOpeningBalances);

      importStatement()(dispatch, getState)
        .then(() => {
          assert(updateOpeningBalances.calledWith(auth, selectedAccountId,
            statement, dispatch, getState));
          done();
        })
        .catch(done);
    });

    it('saves user data', (done) => {
      const dispatch = sinon.stub();
      const statementDate = sinon.stub();
      const statementBalance = sinon.stub();
      const selectedAccountId = sinon.stub();
      const auth = sinon.stub();
      const statement = {
        date: statementDate,
        balance: statementBalance,
      };
      const userData = sinon.stub();
      const getState = sinon.stub().returns({
        auth,
        statementImport: {
          statement,
          selectedAccountId,
          importInProgress: false,
        },
        userData,
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());
      const saveUserData = sinon.stub();

      rewireApi.__Rewire__('importStatementData', importStatementData);
      rewireApi.__Rewire__('saveUserData', saveUserData);

      importStatement()(dispatch, getState)
        .then(() => {
          assert(saveUserData.calledWith(auth, userData));
          done();
        })
        .catch(done);
    });

    it('finishes import', (done) => {
      const dispatch = sinon.stub();
      const auth = sinon.stub();
      const statement = sinon.stub();
      const getState = sinon.stub().returns({
        auth,
        statementImport: {
          statement,
          importInProgress: false,
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());
      const saveUserData = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);
      rewireApi.__Rewire__('saveUserData', saveUserData);

      importStatement()(dispatch, getState)
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
          importInProgress: false,
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);

      importStatement()(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: SHOW_INFO,
            msg: 'Statement imported',
          })));
          done();
        })
        .catch(done);
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
});
