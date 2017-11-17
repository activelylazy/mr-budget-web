import { assert, should } from 'chai';
import sinon from 'sinon';
import { checkAllAccountsNeedReconcile, __RewireAPI__ as rewireApi } from './reconcile';

should();

describe('reconcile', () => {
  describe('check all accounts need reconcile', () => {
    it('checks each account needs reconcile', (done) => {
      const checkAccountNeedsReconcile = sinon.stub();
      const account = sinon.stub();
      const accounts = [account];
      const getState = sinon.stub().returns({
        userData: {
          accounts,
        },
      });
      const dispatch = sinon.stub();
      rewireApi.__Rewire__('checkAccountNeedsReconcile', checkAccountNeedsReconcile);

      checkAllAccountsNeedReconcile(dispatch, getState)
        .then(() => {
          assert(checkAccountNeedsReconcile.calledWith(account, dispatch, getState));
          done();
        })
        .catch(done);
    });
  });
});
