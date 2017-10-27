import { assert, should } from 'chai';
import sinon from 'sinon';
import { SHOW_ERROR, SHOW_INFO } from '../app-actions';
import { STATEMENT_UPLOADED, IMPORT_STARTED, IMPORT_FINISHED } from './import-actions';
import { readStatement, importStatement, __RewireAPI__ as rewireApi } from './import-thunk';

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
            msg: 'Error uploading statement: Error: testing',
          })));
          done();
        });
    });
  });

  describe('import statement', () => {
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
        },
      });

      rewireApi.__Rewire__('importStatementData', importStatementData);

      importStatement()(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: SHOW_ERROR,
            msg: 'Error importing statement: Error: testing',
          })));
          done();
        });
    });

    it('dispatches error alert if updateLastStatement is rejected', (done) => {
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
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());
      const updateLastStatement = sinon.stub().returns(() => Promise.reject(error));

      rewireApi.__Rewire__('importStatementData', importStatementData);
      rewireApi.__Rewire__('updateLastStatement', updateLastStatement);

      importStatement()(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: SHOW_ERROR,
            // msg: 'Error importing statement: Error: testing',
          })));
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
        },
      });
      const importStatementData = sinon.stub().returns(Promise.resolve());
      const updateLastStatementStub = sinon.stub().returns(() => Promise.resolve());

      rewireApi.__Rewire__('importStatementData', importStatementData);
      rewireApi.__Rewire__('updateLastStatement', updateLastStatementStub);

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

      importStatement()(dispatch, getState)
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