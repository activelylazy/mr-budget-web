import { assert, should } from 'chai';
import sinon from 'sinon';
import { loadUserData, saveUserData, USER_DATA_LOADED,
  updateLastStatement, UPDATE_LAST_STATEMENT,
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

  it('fetches user data and dispatches user data loaded', (done) => {
    const dispatch = sinon.stub();
    const response = '{response: true}';
    const userData = { unpackedData: true };
    const auth = {
      userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
      password: 'my password',
    };
    requestStub.returns(Promise.resolve(response));
    unpackStub.returns(Promise.resolve(userData));

    loadUserData(auth)(dispatch)
      .then(() => {
        assert(requestStub.calledWith(sinon.match({
          method: 'GET',
          uri: `http://localhost/${auth.userId}`,
        })));
        assert(unpackStub.calledWith(response, auth.password));
        assert(dispatch.calledWith(sinon.match({ type: USER_DATA_LOADED, userData })));
        done();
      })
      .catch(done);
  });

  it('saves user data', (done) => {
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
      const saveUserDataStub = sinon.stub();
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
  });
});
