import { assert, should } from 'chai';
import sinon from 'sinon';
import { SHOW_ERROR } from '../app-actions';
import { ADD_ACCOUNT } from '../user-data/user-data-actions';
import { addAccount, __RewireAPI__ as rewireApi } from './accounts-thunk';

should();

describe('accounts thunk', () => {
  describe('add account', () => {
    it('saves user data then dispatches add account', (done) => {
      const auth = sinon.stub();
      const accountName = sinon.stub();
      const dispatch = sinon.stub();
      const userData = sinon.stub();
      const getState = sinon.stub().returns({
        userData,
      });
      const saveUserDataStub = sinon.stub().returns(Promise.resolve());

      rewireApi.__Rewire__('saveUserData', saveUserDataStub);

      addAccount(auth, accountName)(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: ADD_ACCOUNT,
            // accountName,
          })));
          done();
        })
        .catch(done);
    });

    it('dispatches error alert if save user data is rejected', (done) => {
      const error = new Error('testing');
      const auth = sinon.stub();
      const accountName = sinon.stub();
      const dispatch = sinon.stub();
      const userData = sinon.stub();
      const getState = sinon.stub().returns({
        userData,
      });
      const saveUserDataStub = sinon.stub().returns(Promise.reject(error));

      rewireApi.__Rewire__('saveUserData', saveUserDataStub);

      addAccount(auth, accountName)(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: SHOW_ERROR,
            msg: 'Error adding account',
            error,
          })));
          done();
        })
        .catch(done);
    });
  });
});
