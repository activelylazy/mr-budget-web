import { assert, should } from 'chai';
import sinon from 'sinon';
import { SHOW_ERROR } from '../app-actions';
import { USER_DATA_LOADED } from './user-data-actions';
import { loadUserData, __RewireAPI__ as rewireApi } from './user-data-thunk';

should();

describe('user data thunk', () => {
  describe('load user data', () => {
    it('fetches user data', (done) => {
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const userData = sinon.stub();
      const getState = sinon.stub();

      const fetchUserDataStub = sinon.stub().returns(Promise.resolve(userData));
      rewireApi.__Rewire__('fetchUserData', fetchUserDataStub);

      loadUserData(auth)(dispatch, getState)
        .then(() => {
          done();
        })
        .catch(done);
    });

    it('checks all accounts reconcile', (done) => {
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const userData = sinon.stub();
      const getState = sinon.stub();

      const checkAllAccountsReconcileStub = sinon.stub().returns(Promise.resolve());
      rewireApi.__Rewire__('checkAllAccountsReconcile', checkAllAccountsReconcileStub);

      const fetchUserDataStub = sinon.stub().returns(Promise.resolve(userData));
      rewireApi.__Rewire__('fetchUserData', fetchUserDataStub);

      loadUserData(auth)(dispatch, getState)
        .then(() => {
          assert(checkAllAccountsReconcileStub.calledWith(dispatch, getState));
          done();
        })
        .catch(done);
    });

    it('it dispatches user data loaded', (done) => {
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const userData = sinon.stub();
      const getState = sinon.stub();

      const checkAllAccountsReconcileStub = sinon.stub().returns(Promise.resolve());
      rewireApi.__Rewire__('checkAllAccountsReconcile', checkAllAccountsReconcileStub);

      const fetchUserDataStub = sinon.stub().returns(Promise.resolve(userData));
      rewireApi.__Rewire__('fetchUserData', fetchUserDataStub);

      loadUserData(auth)(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({ type: USER_DATA_LOADED, userData })));
          done();
        })
        .catch(done);
    });

    it('dispatches error in case fetchUserData is rejected', (done) => {
      const error = new Error('testing');
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub();

      const fetchUserDataStub = sinon.stub().returns(Promise.reject(error));
      rewireApi.__Rewire__('fetchUserData', fetchUserDataStub);

      loadUserData(auth)(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: SHOW_ERROR,
            msg: 'Error loading user data',
            error,
          })));
          done();
        })
        .catch(done);
    });
  });
});
