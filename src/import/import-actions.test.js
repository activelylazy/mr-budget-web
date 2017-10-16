import { assert, should } from 'chai';
import sinon from 'sinon';
import uuid from 'uuid';
import { importStatement, importAccountSelected, importStatementToAccount,
  STATEMENT_UPLOADED, IMPORT_ACCOUNT_SELECTED, __RewireAPI__ as rewireApi } from './import-actions';
import { APPLY_TRANSACTIONS_TO_MONTH } from '../financial-data/financial-data-actions';

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

  it('imports statement to account by splitting into year+months and applying transactions', (done) => {
    const dispatch = sinon.stub();
    const getState = sinon.stub();
    const statement = sinon.stub();
    const yearMonthPair = {
      year: 2017,
      month: 7,
      transactions: sinon.stub(),
    };
    const splitStatement = sinon.stub();
    splitStatement.returns([yearMonthPair]);
    const loadFinancialData = sinon.stub();
    loadFinancialData.returns(() => Promise.resolve({}));
    const auth = sinon.stub();
    const saveFinancialData = sinon.stub();
    const monthData = sinon.stub();

    getState.returns({
      financialData: {
        2017: {
          7: monthData,
        },
      },
      statementImport: {
        statement,
      },
    });

    rewireApi.__Rewire__('splitStatement', splitStatement);
    rewireApi.__Rewire__('loadFinancialData', loadFinancialData);
    rewireApi.__Rewire__('saveFinancialData', saveFinancialData);

    importStatementToAccount(auth)(dispatch, getState)
      .then(() => {
        assert(splitStatement.calledWith(statement));
        assert(loadFinancialData.calledWith(auth, 2017, 7));
        assert(dispatch.calledWith(sinon.match({
          type: APPLY_TRANSACTIONS_TO_MONTH,
          transactions: yearMonthPair.transactions,
        })));
        assert(saveFinancialData.calledWith(auth, monthData, 2017, 7));
        done();
      })
      .catch(done);
  });
});
