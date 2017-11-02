import { assert, should } from 'chai';
import sinon from 'sinon';
import { APPLY_TRANSACTIONS_TO_MONTH, FINANCIAL_DATA_LOADED } from '../../financial-data/financial-data-actions';
import { loadFinancialDataAndApplyTransactions, updateMonthData,
  splitStatement, importStatementData, updateTransactionsWithAccount,
  loadFinancialDataIfRequired, openingBalance, monthsInRange,
  accountOpeningBalanceInMonth, earliestDate,
  __RewireAPI__ as rewireApi } from './statement-actions';

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
    it('loads data if no data present in state for year and dispatches financialDataLoaded', (done) => {
      const auth = sinon.stub();
      const year = 2017;
      const month = 7;
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        financialData: {},
      });
      const financialData = sinon.stub();
      const loadFinancialData = sinon.stub()
        .returns(Promise.resolve(financialData));

      rewireApi.__Rewire__('loadFinancialData', loadFinancialData);

      loadFinancialDataIfRequired(auth, year, month, dispatch, getState)
        .then((result) => {
          assert.isUndefined(result);
          assert(loadFinancialData.calledWith(auth, year, month));
          assert(dispatch.calledWith(sinon.match({
            type: FINANCIAL_DATA_LOADED,
            financialData,
          })));
          done();
        })
        .catch(done);
    });

    it('loads data if no data present in state for month and dispatches financialDataLoaded', (done) => {
      const auth = sinon.stub();
      const year = 2017;
      const month = 7;
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        financialData: {
          2017: {},
        },
      });
      const financialData = sinon.stub();
      const loadFinancialData = sinon.stub()
        .returns(Promise.resolve(financialData));

      rewireApi.__Rewire__('loadFinancialData', loadFinancialData);

      loadFinancialDataIfRequired(auth, year, month, dispatch, getState)
        .then((result) => {
          assert.isUndefined(result);
          assert(loadFinancialData.calledWith(auth, year, month));
          assert(dispatch.calledWith(sinon.match({
            type: FINANCIAL_DATA_LOADED,
            financialData,
          })));
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
          assert(dispatch.notCalled);
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
        .returns(Promise.reject(error));

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

      loadFinancialDataIfRequiredStub.returns(Promise.resolve());
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

    it('rejects if loadFinancialDataIfRequired is rejected', (done) => {
      const error = sinon.stub();
      const loadFinancialDataIfRequiredStub = sinon.stub().returns(Promise.reject(error));

      rewireApi.__Rewire__('loadFinancialDataIfRequired', loadFinancialDataIfRequiredStub);

      const auth = sinon.stub();
      const transactions = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub();

      loadFinancialDataAndApplyTransactions(auth, 2017, 7, transactions, dispatch, getState)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
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
        .then((result) => {
          assert(loadFinancialDataAndApplyTransactionStub
            .calledWith(auth, 2017, 7, transactions, dispatch, getState));
          assert(saveFinancialData.calledWith(auth, monthData, 2017, 7));
          assert.isUndefined(result);
          done();
        })
        .catch(done);
    });

    it('rejects if loadFinancialDataAndApplyTransactions is rejected', (done) => {
      const error = sinon.stub();
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub();
      const transactions = sinon.stub();

      const loadFinancialDataAndApplyTransactionStub =
        sinon.stub().returns(Promise.reject(error));

      rewireApi.__Rewire__('loadFinancialDataAndApplyTransactions',
        loadFinancialDataAndApplyTransactionStub);

      updateMonthData(auth, 2017, 7, transactions, dispatch, getState)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });

    it('rejects if saveFinancialData is rejected', (done) => {
      const error = sinon.stub();
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub();
      const transactions = sinon.stub();
      const monthData = sinon.stub();
      const saveFinancialData = sinon.stub().returns(Promise.reject(error));

      const loadFinancialDataAndApplyTransactionStub =
        sinon.stub().returns(Promise.resolve(monthData));

      rewireApi.__Rewire__('loadFinancialDataAndApplyTransactions',
        loadFinancialDataAndApplyTransactionStub);
      rewireApi.__Rewire__('saveFinancialData', saveFinancialData);

      updateMonthData(auth, 2017, 7, transactions, dispatch, getState)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

  describe('import statement data', () => {
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

    it('rejects if updateMonthData is rejected', (done) => {
      const error = sinon.stub();
      const updateMonthDataStub = sinon.stub().returns(Promise.reject(error));
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const statement = sinon.stub();
      const transactions = sinon.stub();
      const updatedTransactions = sinon.stub();
      const getState = sinon.stub();
      const accountId = sinon.stub();
      const yearMonthPair = {
        year: 2017,
        month: 7,
        transactions,
      };
      const splitStatementStub = sinon.stub().returns([yearMonthPair]);
      const updateTransactionsWithAccountStub = sinon.stub().returns(updatedTransactions);

      rewireApi.__Rewire__('splitStatement', splitStatementStub);
      rewireApi.__Rewire__('updateMonthData', updateMonthDataStub);
      rewireApi.__Rewire__('updateTransactionsWithAccount', updateTransactionsWithAccountStub);

      importStatementData(auth, statement, accountId, dispatch, getState)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
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

  describe('opening balance', () => {
    it('is closing balance for empty transaction list', () => {
      const statement = {
        balance: 12.34,
        transactions: [],
      };

      const result = openingBalance(statement);

      assert(result.should.equal(12.34));
    });

    it('is closing balance minus transaction total', () => {
      const statement = {
        balance: 12.34,
        transactions: [
          {
            amount: -5.00,
          },
          {
            amount: 3.12,
          },
        ],
      };

      const result = openingBalance(statement);

      assert(result.should.equal(14.22));
    });
  });

  describe('months in range', () => {
    it('returns empty list when end before start', () => {
      const result = monthsInRange(new Date(2017, 3), new Date(2017, 2));

      assert(result.length.should.equal(0));
    });

    it('returns single month when start and end equal', () => {
      const result = monthsInRange(new Date(2017, 3), new Date(2017, 3));

      assert(result.length.should.equal(1));
      assert(result[0].month.should.equal(3));
      assert(result[0].year.should.equal(2017));
    });

    it('returns multiple months in same year', () => {
      const result = monthsInRange(new Date(2017, 3), new Date(2017, 7));

      assert(result.length.should.equal(5));
      assert(result[0].month.should.equal(3));
      assert(result[0].year.should.equal(2017));
      assert(result[4].month.should.equal(7));
      assert(result[4].year.should.equal(2017));
    });

    it('returns months in two years', () => {
      const result = monthsInRange(new Date(2017, 11), new Date(2018, 3));

      assert(result.length.should.equal(5));
      assert(result[0].month.should.equal(11));
      assert(result[0].year.should.equal(2017));
      assert(result[4].month.should.equal(3));
      assert(result[4].year.should.equal(2018));
    });
  });

  describe('opening balance for account in month', () => {
    it('returns opening balance from financial data if present', () => {
      const financialData = {
        transactions: [],
        openingBalances: {
          'abc-123': 123.45,
        },
      };
      const account = {
        openingBalance: 111.11,
        openingDate: new Date(),
        id: 'abc-123',
      };

      const result = accountOpeningBalanceInMonth(account, financialData);

      assert(result.should.equal(123.45));
    });

    it('returns opening balance from account if none in financial data and year and month match', () => {
      const financialData = {
        transactions: [],
        openingBalances: {
        },
        year: 2017,
        month: 7,
      };
      const account = {
        openingBalance: 111.11,
        openingDate: new Date(2017, 7, 1),
        id: 'abc-123',
      };

      const result = accountOpeningBalanceInMonth(account, financialData);

      assert(result.should.equal(111.11));
    });
  });

  describe('earliest date', () => {
    it('returns earliest date', () => {
      const date1 = new Date(Date.now() - (24 * 3600 * 1000));
      const date2 = new Date(Date.now() - (2 * 24 * 3600 * 1000));

      assert(earliestDate(date1, date2).should.equal(date2));
    });

    it('returns other if one undefined', () => {
      const date1 = new Date(Date.now() - (24 * 3600 * 1000));

      assert(earliestDate(date1, undefined).should.equal(date1));
    });
  });
});
