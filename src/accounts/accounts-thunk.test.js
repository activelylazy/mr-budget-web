import { assert, should } from 'chai';
import sinon from 'sinon';
import { SHOW_ERROR } from '../app-actions';
import { ADD_ACCOUNT } from '../user-data/user-data-actions';
import { NAVIGATE_TO_PERIOD, NAVIGATE_ACCOUNT } from '../navigation/navigation-actions';
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
            accountName,
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
    it('navigates to last statement date of account if no date set', (done) => {
      const auth = sinon.stub();
      const accountId = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        auth,
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
      const loadFinancialDataIfRequiredStub = sinon.stub().returns(Promise.resolve());
      rewireApi.__Rewire__('loadFinancialDataIfRequired', loadFinancialDataIfRequiredStub);

      viewAccountTransactions(accountId)(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: NAVIGATE_TO_PERIOD,
            year: 2017,
            month: 8,
          })));
          done();
        })
        .catch(done);
    });

    it('does not navigate to new period if period already selected', (done) => {
      const accountId = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        navigation: {
          currentYear: 2017,
          currentMonth: 8,
        },
      });

      viewAccountTransactions(accountId)(dispatch, getState)
        .then(() => {
          sinon.assert.neverCalledWithMatch(dispatch, {
            type: NAVIGATE_TO_PERIOD,
          });
          done();
        })
        .catch(done);
    });


    it('dispatches select account if period already selected', (done) => {
      const accountId = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        navigation: {
          currentMonth: 7,
          currentYear: 2017,
        },
      });
      viewAccountTransactions(accountId)(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: NAVIGATE_ACCOUNT,
            accountId,
          })));
          done();
        })
        .catch(done);
    });

    it('updates selected account', (done) => {
      const auth = sinon.stub();
      const accountId = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        auth,
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
      const loadFinancialDataIfRequiredStub = sinon.stub().returns(Promise.resolve());
      rewireApi.__Rewire__('loadFinancialDataIfRequired', loadFinancialDataIfRequiredStub);

      viewAccountTransactions(accountId)(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: NAVIGATE_ACCOUNT,
            accountId,
          })));
          done();
        })
        .catch(done);
    });

    it('loads financial data if required', (done) => {
      const auth = sinon.stub();
      const accountId = sinon.stub();
      const dispatch = sinon.stub();
      const getState = sinon.stub().returns({
        auth,
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
      const loadFinancialDataIfRequiredStub = sinon.stub().returns(Promise.resolve());
      rewireApi.__Rewire__('loadFinancialDataIfRequired', loadFinancialDataIfRequiredStub);

      viewAccountTransactions(accountId)(dispatch, getState)
        .then(() => {
          assert(loadFinancialDataIfRequiredStub.calledWith(auth, 2017, 8, dispatch, getState));
          done();
        })
        .catch(done);
    });
  });
});
