import { assert, should } from 'chai';
import sinon from 'sinon';
import { ACCOUNT_RECONCILES } from '../user-data/user-data-actions';
import { checkAllAccountsReconcile, accountNeedsReconcile,
  checkAccountReconciles,
  __RewireAPI__ as rewireApi } from './reconcile';

should();

describe('reconcile', () => {
  describe('account needs reconcile', () => {
    it('returns false if no last statement date', () => {
      const account = {
        lastStatementDate: undefined,
      };

      assert(accountNeedsReconcile(account).should.equal(false));
    });

    it('returns true if no last reconcile date', () => {
      const account = {
        lastStatementDate: new Date(2017, 7, 3),
      };

      assert(accountNeedsReconcile(account).should.equal(true));
    });

    it('returns true if last statement date is after last reconcile date', () => {
      const account = {
        lastStatementDate: new Date(2017, 7, 3),
        lastReconcileDate: new Date(2017, 6, 1),
      };

      assert(accountNeedsReconcile(account).should.equal(true));
    });

    it('returns false if last statement date is last reconcile date', () => {
      const account = {
        lastStatementDate: new Date(2017, 7, 3),
        lastReconcileDate: new Date(2017, 7, 3),
      };

      assert(accountNeedsReconcile(account).should.equal(false));
    });
  });

  describe('check all accounts reconcile', () => {
    it('checks each account reconciles', (done) => {
      const checkAccountReconcilesStub = sinon.stub();
      const account = sinon.stub();
      const accounts = [account];
      const getState = sinon.stub().returns({
        userData: {
          accounts,
        },
      });
      const dispatch = sinon.stub();
      rewireApi.__Rewire__('checkAccountReconciles', checkAccountReconcilesStub);

      checkAllAccountsReconcile(dispatch, getState)
        .then(() => {
          assert(checkAccountReconcilesStub.calledWith(account, dispatch, getState));
          done();
        })
        .catch(done);
    });
  });

  describe('check account reconciles', () => {
    it('dispatches account reconciles if no last statement date', (done) => {
      const account = {
        id: 'abc-123',
        lastStatementDate: undefined,
      };
      const dispatch = sinon.stub();
      const getState = sinon.stub();

      checkAccountReconciles(account, dispatch, getState)
        .then(() => {
          assert(getState.notCalled);
          assert(dispatch.calledWith(sinon.match({
            type: ACCOUNT_RECONCILES,
            accountId: 'abc-123',
            reconciles: true,
          })));
          done();
        })
        .catch(done);
    });

    it('dispatches account does not reconcile if calculated balance does not match last statement balance', (done) => {
      const account = {
        id: 'abc-123',
        lastStatementDate: new Date(2017, 7, 1),
        lastStatementBalance: 555.55,
      };
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const loadFinancialDataIfRequired = sinon.stub().returns(Promise.resolve());
      rewireApi.__Rewire__('loadFinancialDataIfRequired', loadFinancialDataIfRequired);
      const accountTransactionTotals = sinon.stub().returns(100.00);
      rewireApi.__Rewire__('accountTransactionTotals', accountTransactionTotals);
      const monthData = {
        transactions: [],
        openingBalances: {
          'abc-123': 123.45,
        },
      };
      const getState = sinon.stub().returns({
        auth,
        financialData: {
          2017: {
            7: monthData,
          },
        },
      });

      checkAccountReconciles(account, dispatch, getState)
        .then(() => {
          assert(loadFinancialDataIfRequired.calledWith(auth, 2017, 7, dispatch, getState));
          assert(accountTransactionTotals.calledWith(account, monthData));
          assert(dispatch.calledWith(sinon.match({
            type: ACCOUNT_RECONCILES,
            accountId: 'abc-123',
            reconciles: false,
          })));
          done();
        })
        .catch(done);
    });

    it('dispatches account does reconcile if calculated balance matches last statement balance', (done) => {
      const account = {
        id: 'abc-123',
        lastStatementDate: new Date(2017, 7, 1),
        lastStatementBalance: 223.45,
      };
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const loadFinancialDataIfRequired = sinon.stub().returns(Promise.resolve());
      rewireApi.__Rewire__('loadFinancialDataIfRequired', loadFinancialDataIfRequired);
      const accountTransactionTotals = sinon.stub().returns(100.00);
      rewireApi.__Rewire__('accountTransactionTotals', accountTransactionTotals);
      const monthData = {
        transactions: [],
        openingBalances: {
          'abc-123': 123.45,
        },
      };
      const getState = sinon.stub().returns({
        auth,
        financialData: {
          2017: {
            7: monthData,
          },
        },
      });

      checkAccountReconciles(account, dispatch, getState)
        .then(() => {
          assert(loadFinancialDataIfRequired.calledWith(auth, 2017, 7, dispatch, getState));
          assert(accountTransactionTotals.calledWith(account, monthData));
          assert(dispatch.calledWith(sinon.match({
            type: ACCOUNT_RECONCILES,
            accountId: 'abc-123',
            reconciles: true,
          })));
          done();
        })
        .catch(done);
    });
  });
});
