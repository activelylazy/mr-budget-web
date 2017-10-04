import { assert, should } from 'chai';
import sinon from 'sinon';
import request from 'request-promise-native';
import { loadUserData, USER_DATA_LOADED, __RewireAPI__ as rewireApi } from './user-data-actions';

should();

describe('load user data', () => {
  let requestStub;
  let unpackStub;

  beforeEach(() => {
    requestStub = sinon.stub(request, 'get');
    unpackStub = sinon.stub();
    rewireApi.__Rewire__('unpack', unpackStub);
  });

  afterEach(() => {
    requestStub.restore();
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
    unpackStub.returns(userData);

    loadUserData(auth)(dispatch)
      .then(() => {
        assert(requestStub.calledWith(sinon.match({ uri: `http://localhost/${auth.userId}` })));
        assert(unpackStub.calledWith(response, auth.password));
        assert(dispatch.calledWith(sinon.match({ type: USER_DATA_LOADED, userData })));
        done();
      })
      .catch(done);
  });
});
