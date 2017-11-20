import { assert, should } from 'chai';
import sinon from 'sinon';
import { ACCOUNT_RECONCILES } from '../user-data/user-data-actions';
import { checkAllAccountsReconcile, accountNeedsReconcile,
  checkAccountReconciles,
  __RewireAPI__ as rewireApi } from './reconcile';

should();

describe('reconcile', () => {
  describe('account needs reconcile', () => {
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
        lastStatementDate: undefined,
      };
      const dispatch = sinon.stub();
      const getState = sinon.stub();

      checkAccountReconciles(account, dispatch, getState)
        .then(() => {
          assert(getState.notCalled);
          assert(dispatch.calledWith(sinon.match({
            type: ACCOUNT_RECONCILES,
            reconciles: true,
          })));
          done();
        })
        .catch(done);
    });
  });
});
