import { assert, should } from 'chai';
import sinon from 'sinon';
import { APPLY_TRANSACTIONS_TO_MONTH } from '../../financial-data/financial-data-actions';
import { loadFinancialDataAndApplyTransactions, updateMonthData,
  splitStatement, importStatementData, __RewireAPI__ as rewireApi } from './import-statement';

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


  describe('load financial data and apply transactions', () => {
    it('loads financial data, dispatches apply transactions, returns updated state', (done) => {
      const loadFinancialData = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub();
      const auth = sinon.stub();
      const transactions = sinon.stub();
      const split = {
        year: 2017,
        month: 7,
        transactions,
      };
      const monthData = sinon.stub();

      loadFinancialData.returns(sinon.stub().returns(Promise.resolve({})));
      getState.returns({
        financialData: {
          2017: {
            7: monthData,
          },
        },
      });

      rewireApi.__Rewire__('loadFinancialData', loadFinancialData);

      loadFinancialDataAndApplyTransactions(auth, 2017, 7, transactions, dispatch, getState)
        .then((result) => {
          assert(loadFinancialData.calledWith(auth, 2017, 7));
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
      const updateTransactionsWithAccount = sinon.stub().returns(updatedTransactions);
      const accountId = sinon.stub();

      rewireApi.__Rewire__('splitStatement', splitStatementStub);
      rewireApi.__Rewire__('updateMonthData', updateMonthDataStub);
      rewireApi.__Rewire__('updateTransactionsWithAccount', updateTransactionsWithAccount);

      importStatementData(auth, statement, accountId, dispatch, getState)
        .then(() => {
          assert(splitStatementStub.calledWith(statement));
          assert(updateTransactionsWithAccount.calledOnce);
          assert(updateTransactionsWithAccount.calledWith(transactions, accountId));
          assert(updateMonthDataStub.calledWith(auth, 2017, 7, updatedTransactions, dispatch, getState));
          done();
        })
        .catch(done);
    });
  });
});
