import { assert, should } from 'chai';
import sinon from 'sinon';
import { APPLY_TRANSACTIONS_TO_MONTH } from '../../financial-data/financial-data-actions';
import { loadFinancialDataAndApplyTransactions, updateMonthData,
  splitStatement, importStatementData, updateTransactionsWithAccount,
  loadFinancialDataIfRequired,
  __RewireAPI__ as rewireApi } from './import-statement';

should();

describe('import statement', () => {
  describe('split statement', () => {
    it('splits statement into two months', () => {
      const statement = {
        transactions: [
          {
            id: 1,
            date: new Date(2017, 7, 1),
            name: 'transaction 1',
            amount: 11.11,
          },
          {
            id: 2,
            date: new Date(2017, 7, 14),
            name: 'transaction 2',
            amount: 22.22,
          },
          {
            id: 3,
            date: new Date(2017, 8, 1),
            name: 'transaction 3',
            amount: 33.33,
          },
        ],
      };

      const splits = splitStatement(statement);

      assert(splits.length.should.equal(2));

      assert(splits[0].year.should.equal(2017));
      assert(splits[0].month.should.equal(7));
      assert(splits[0].transactions.length.should.equal(2));
      assert(splits[0].transactions[0].id.should.equal(1));
      assert(splits[0].transactions[1].id.should.equal(2));

      assert(splits[1].year.should.equal(2017));
      assert(splits[1].month.should.equal(8));
      assert(splits[1].transactions.length.should.equal(1));
      assert(splits[1].transactions[0].id.should.equal(3));
    });
  });

  describe('load financial data if required', () => {
    it('loads data if no data present in state for year', (done) => {
      const auth = sinon.stub();
      const year = 2017;
      const month = 7;
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        financialData: {},
      });
      const loadFinancialData = sinon.stub()
        .returns(sinon.stub()
          .returns(Promise.resolve()));

      rewireApi.__Rewire__('loadFinancialData', loadFinancialData);

      loadFinancialDataIfRequired(auth, year, month, dispatch, getState)
        .then((result) => {
          assert.isUndefined(result);
          assert(loadFinancialData.calledWith(auth, year, month));
          done();
        })
        .catch(done);
    });

    it('loads data if no data present in state for month', (done) => {
      const auth = sinon.stub();
      const year = 2017;
      const month = 7;
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        financialData: {
          2017: {},
        },
      });
      const loadFinancialData = sinon.stub()
        .returns(sinon.stub()
          .returns(Promise.resolve()));

      rewireApi.__Rewire__('loadFinancialData', loadFinancialData);

      loadFinancialDataIfRequired(auth, year, month, dispatch, getState)
        .then((result) => {
          assert.isUndefined(result);
          assert(loadFinancialData.calledWith(auth, year, month));
          done();
        })
        .catch(done);
    });

    it('uses existing data if present', (done) => {
      const auth = sinon.stub();
      const year = 2017;
      const month = 7;
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        financialData: {
          2017: {
            7: sinon.stub(),
          },
        },
      });

      rewireApi.__Rewire__('loadFinancialData', undefined);

      loadFinancialDataIfRequired(auth, year, month, dispatch, getState)
        .then((result) => {
          assert.isUndefined(result);
          done();
        })
        .catch(done);
    });

    it('rejects if load financial data rejects', (done) => {
      const auth = sinon.stub();
      const year = 2017;
      const month = 7;
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        financialData: {},
      });
      const error = sinon.stub();
      const loadFinancialData = sinon.stub()
        .returns(sinon.stub()
          .returns(Promise.reject(error)));

      rewireApi.__Rewire__('loadFinancialData', loadFinancialData);

      loadFinancialDataIfRequired(auth, year, month, dispatch, getState)
        .then(() => {
          done(new Error('Expected promise to be rejected'));
        })
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

  describe('load financial data and apply transactions', () => {
    it('loads financial data if required, dispatches apply transactions, returns updated state', (done) => {
      const loadFinancialDataIfRequiredStub = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub();
      const auth = sinon.stub();
      const transactions = sinon.stub();
      const monthData = sinon.stub();

      loadFinancialDataIfRequiredStub.returns(Promise.resolve({}));
      getState.returns({
        financialData: {
          2017: {
            7: monthData,
          },
        },
      });

      rewireApi.__Rewire__('loadFinancialDataIfRequired', loadFinancialDataIfRequiredStub);

      loadFinancialDataAndApplyTransactions(auth, 2017, 7, transactions, dispatch, getState)
        .then((result) => {
          assert(loadFinancialDataIfRequiredStub.calledWith(auth, 2017, 7, dispatch, getState));
          assert(dispatch.calledWith(sinon.match({
            type: APPLY_TRANSACTIONS_TO_MONTH,
            year: 2017,
            month: 7,
            transactions,
          })));
          assert(result.should.equal(monthData));
          done();
        })
        .catch(done);
    });
  });

  describe('update month data', () => {
    it('loads financial data & applies transactions then saves updated data', (done) => {
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub();
      const monthData = sinon.stub();
      const transactions = sinon.stub();
      const loadFinancialDataAndApplyTransactionStub =
        sinon.stub().returns(Promise.resolve(monthData));
      const saveFinancialData = sinon.stub();

      rewireApi.__Rewire__('loadFinancialDataAndApplyTransactions',
        loadFinancialDataAndApplyTransactionStub);
      rewireApi.__Rewire__('saveFinancialData', saveFinancialData);

      updateMonthData(auth, 2017, 7, transactions, dispatch, getState)
        .then(() => {
          assert(loadFinancialDataAndApplyTransactionStub.calledWith(auth, 2017, 7, transactions, dispatch, getState));
          assert(saveFinancialData.calledWith(auth, monthData, 2017, 7));
          done();
        })
        .catch(done);
    });
  });

  describe('import statement to account', () => {
    it('imports statement by splitting into year+months and updating each month\'s data', (done) => {
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const statement = sinon.stub();
      const transactions = sinon.stub();
      const updatedTransactions = sinon.stub();
      const yearMonthPair = {
        year: 2017,
        month: 7,
        transactions,
      };
      const splitStatementStub = sinon.stub().returns([yearMonthPair]);
      const updateMonthDataStub = sinon.stub().returns(Promise.resolve());
      const getState = sinon.stub();
      const updateTransactionsWithAccountStub = sinon.stub().returns(updatedTransactions);
      const accountId = sinon.stub();

      rewireApi.__Rewire__('splitStatement', splitStatementStub);
      rewireApi.__Rewire__('updateMonthData', updateMonthDataStub);
      rewireApi.__Rewire__('updateTransactionsWithAccount', updateTransactionsWithAccountStub);

      importStatementData(auth, statement, accountId, dispatch, getState)
        .then(() => {
          assert(splitStatementStub.calledWith(statement));
          assert(updateTransactionsWithAccountStub.calledWith(transactions, accountId));
          assert(updateMonthDataStub.calledWith(auth, 2017, 7, updatedTransactions,
            dispatch, getState));
          done();
        })
        .catch(done);
    });
  });

  describe('update transactions with account', () => {
    it('adds account id to transactions', () => {
      const transactions = [
        {
          id: 1,
          name: 'transaction',
          amount: 12.34,
        },
      ];
      const accountId = 'abc-123';

      const result = updateTransactionsWithAccount(transactions, accountId);

      assert(result.length.should.equal(1));
      assert(result[0].id.should.equal(1));
      assert(result[0].name.should.equal('transaction'));
      assert(result[0].amount.should.equal(12.34));
      assert(result[0].accountId.should.equal(accountId));
    });
  });
});
