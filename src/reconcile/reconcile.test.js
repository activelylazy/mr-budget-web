import { assert, should } from 'chai';
import sinon from 'sinon';
import { checkAllAccountsReconcile, __RewireAPI__ as rewireApi } from './reconcile';

should();

describe('reconcile', () => {
  describe('check all accounts do reconcile', () => {
    it('checks each account does reconcile', (done) => {
      const checkAccountReconciles = sinon.stub();
      const account = sinon.stub();
      const accounts = [account];
      const getState = sinon.stub().returns({
        userData: {
          accounts,
        },
      });
      const dispatch = sinon.stub();
      rewireApi.__Rewire__('checkAccountReconciles', checkAccountReconciles);

      checkAllAccountsReconcile(dispatch, getState)
        .then(() => {
          assert(checkAccountReconciles.calledWith(account, dispatch, getState));
          done();
        })
        .catch(done);
    });
  });

  describe('check account needs reconcile', () => {
    it('');
  });
});
