import { assert, should } from 'chai';
import sinon from 'sinon';
import { SHOW_ERROR } from '../app-actions';
import { fetchUserData, loadUserData, saveUserData, USER_DATA_LOADED,
  updateLastStatement, UPDATE_LAST_STATEMENT,
  addAccount, ADD_ACCOUNT,
  __RewireAPI__ as rewireApi } from './user-data-actions';

should();

describe('user data', () => {
  let requestStub;
  let unpackStub;
  let packStub;

  beforeEach(() => {
    requestStub = sinon.stub();
    unpackStub = sinon.stub();
    packStub = sinon.stub();
    rewireApi.__Rewire__('request', requestStub);
    rewireApi.__Rewire__('unpack', unpackStub);
    rewireApi.__Rewire__('pack', packStub);
  });

  describe('fetch user data', () => {
    it('issues request then unpacks', (done) => {
      const response = '{response: true}';
      const userData = { unpackedData: true };
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };
      requestStub.returns(Promise.resolve(response));
      unpackStub.returns(Promise.resolve(userData));

      fetchUserData(auth)
        .then(() => {
          assert(requestStub.calledWith(sinon.match({
            method: 'GET',
            uri: `http://localhost/${auth.userId}`,
          })));
          assert(unpackStub.calledWith(response, auth.password));
          done();
        })
        .catch(done);
    });

    it('rejects if request is rejected', (done) => {
      const error = sinon.stub();
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };

      requestStub.returns(Promise.reject(error));

      fetchUserData(auth)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });

    it('rejects if unpack is rejected', (done) => {
      const error = sinon.stub();
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };
      const response = '{response: true}';

      requestStub.returns(Promise.resolve(response));
      unpackStub.returns(Promise.reject(error));

      fetchUserData(auth)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

  describe('load user data', () => {
    it('fetches user data then dispatches user data loaded', (done) => {
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const userData = sinon.stub();
      const fetchUserDataStub = sinon.stub().returns(Promise.resolve(userData));

      rewireApi.__Rewire__('fetchUserData', fetchUserDataStub);

      loadUserData(auth)(dispatch)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({ type: USER_DATA_LOADED, userData })));
          done();
        })
        .catch(done);
    });

    it('rejects in case fetchUserData is rejected', (done) => {
      const error = sinon.stub();
      const auth = sinon.stub();
      const dispatch = sinon.stub();
      const fetchUserDataStub = sinon.stub().returns(Promise.reject(error));

      rewireApi.__Rewire__('fetchUserData', fetchUserDataStub);

      loadUserData(auth)(dispatch)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

  describe('save user data', () => {
    it('packs then issues request', (done) => {
      const userData = { userData: true };
      const packedData = { packed: true };
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };

      packStub.returns(Promise.resolve(packedData));
      requestStub.returns(Promise.resolve());

      saveUserData(auth, userData)
        .then(() => {
          assert(requestStub.calledWith(sinon.match({
            method: 'POST',
            uri: `http://localhost/${auth.userId}`,
          })));
          assert(packStub.calledWith(userData, auth.password));
          done();
        })
        .catch(done);
    });

    it('rejects if pack is rejected', (done) => {
      const userData = { userData: true };
      const error = sinon.stub();
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };

      packStub.returns(Promise.reject(error));

      saveUserData(auth, userData)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });

    it('rejects if request is rejected', (done) => {
      const userData = { userData: true };
      const packedData = { packedData: true };
      const error = sinon.stub();
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };

      packStub.returns(Promise.resolve(packedData));
      requestStub.returns(Promise.reject(error));

      saveUserData(auth, userData)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

  describe('update last statement', () => {
    it('dispatches update then saves latest user data', () => {
      const statementDate = sinon.stub();
      const statementBalance = sinon.stub();
      const accountId = sinon.stub();
      const dispatch = sinon.stub();
      const userData = sinon.stub();
      const getState = sinon.stub().returns({
        userData,
      });
      const saveUserDataStub = sinon.stub().returns(Promise.resolve());
      const auth = sinon.stub();

      rewireApi.__Rewire__('saveUserData', saveUserDataStub);

      updateLastStatement(auth, statementDate, statementBalance, accountId)(dispatch, getState);

      assert(dispatch.calledWith(sinon.match({
        type: UPDATE_LAST_STATEMENT,
        statementDate,
        statementBalance,
        accountId,
      })));
      assert(saveUserDataStub.calledWith(auth, userData));
    });

    it('is rejected if saveUserData is rejected', (done) => {
      const error = sinon.stub();
      const statementDate = sinon.stub();
      const statementBalance = sinon.stub();
      const accountId = sinon.stub();
      const dispatch = sinon.stub();
      const userData = sinon.stub();
      const getState = sinon.stub().returns({
        userData,
      });
      const saveUserDataStub = sinon.stub().returns(Promise.reject(error));
      const auth = sinon.stub();

      rewireApi.__Rewire__('saveUserData', saveUserDataStub);

      updateLastStatement(auth, statementDate, statementBalance, accountId)(dispatch, getState)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

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
            msg: 'Error adding account: Error: testing',
          })));
          done();
        })
        .catch(done);
    });
  });
});
