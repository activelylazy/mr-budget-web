import { assert, should } from 'chai';
import sinon from 'sinon';
import { APPLY_TRANSACTIONS_TO_MONTH } from '../../financial-data/financial-data-actions';
import { loadFinancialDataAndApplyTransactions, updateMonthData, __RewireAPI__ as rewireApi } from './import-statement';

should();

describe('import statement', () => {
  describe('load financial data and apply transactions', () => {
    it('loads financial data, dispatches apply transactions, returns updated state', (done) => {
      const loadFinancialData = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub();
      const auth = sinon.stub();
      const split = {
        year: 2017,
        month: 7,
        transactions: sinon.stub(),
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

      loadFinancialDataAndApplyTransactions(auth, split, dispatch, getState)
        .then((result) => {
          assert(loadFinancialData.calledWith(auth, 2017, 7));
          assert(dispatch.calledWith(sinon.match({
            type: APPLY_TRANSACTIONS_TO_MONTH,
            year: 2017,
            month: 7,
            transactions: split.transactions,
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
      const split = {
        year: 2017,
        month: 7,
      };
      const dispatch = sinon.stub();
      const getState = sinon.stub();
      const monthData = sinon.stub();
      const loadFinancialDataAndApplyTransactionStub =
        sinon.stub().returns(Promise.resolve(monthData));
      const saveFinancialData = sinon.stub();

      rewireApi.__Rewire__('loadFinancialDataAndApplyTransactions',
        loadFinancialDataAndApplyTransactionStub);
      rewireApi.__Rewire__('saveFinancialData', saveFinancialData);

      updateMonthData(auth, split, dispatch, getState)
        .then(() => {
          assert(loadFinancialDataAndApplyTransactionStub.calledWith(auth, split, dispatch, getState));
          assert(saveFinancialData.calledWith(auth, monthData, 2017, 7));
          done();
        })
        .catch(done);
    });
  });
});
