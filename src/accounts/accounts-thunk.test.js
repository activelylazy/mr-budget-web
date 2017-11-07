import { assert, should } from 'chai';
import sinon from 'sinon';
import { SHOW_ERROR } from '../app-actions';
import { ADD_ACCOUNT } from '../user-data/user-data-actions';
import { NAVIGATE_TO_PERIOD } from '../navigation/navigation-actions';
import { addAccount, viewAccountTransactions,
  __RewireAPI__ as rewireApi } from './accounts-thunk';

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

  describe('view account transactions', () => {
    it('navigates to last statement date of account if no date set', () => {
      const auth = sinon.stub();
      const accountId = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        userData: {
          accounts: [
            {
              id: accountId,
              lastStatementDate: new Date(2017, 8, 21),
            },
          ],
        },
        navigation: {
        },
      });

      viewAccountTransactions(auth, accountId)(dispatch, getState);
      assert(dispatch.calledWith(sinon.match({
        type: NAVIGATE_TO_PERIOD,
        year: 2017,
        // month: 7,
      })));
    });

    it('does not navigate to new period if navigation dates already set', () => {
      const auth = sinon.stub();
      const accountId = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        userData: {
          accounts: [
            {
              id: accountId,
              lastStatementDate: new Date(2017, 8, 21),
            },
          ],
        },
        navigation: {
          currentYear: 2017,
          currentMonth: 8,
        },
      });

      viewAccountTransactions(auth, accountId)(dispatch, getState);
      assert(dispatch.notCalled);
    });
  });
});
