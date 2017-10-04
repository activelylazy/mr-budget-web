import { assert, should } from 'chai';
import sinon from 'sinon';
import request from 'request-promise-native';
import { loadUserData, __RewireAPI__ as rewireApi } from './user-data-actions';

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
    requestStub.returns(Promise.resolve(response));
    unpackStub.returns({ unpackedData: true });

    loadUserData()(dispatch)
      .then(() => {
        assert(requestStub.calledWith(sinon.match({ uri: 'http://localhost:7000/49f6f8b6-5526-452f-9a5e-8af17c7ccf8f' })));
        assert(unpackStub.calledWith(response));
        assert(dispatch.calledOnce);
        done();
      })
      .catch(done);
  });
});
