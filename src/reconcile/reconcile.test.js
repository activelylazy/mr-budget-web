import { assert, should } from 'chai';
import sinon from 'sinon';
import { checkAllAccountsReconcile, accountNeedsReconcile,
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

  describe('check all accounts do reconcile', () => {
    it('checks each account does reconcile', (done) => {
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

  describe('check account needs reconcile', () => {
    it('');
  });
});
