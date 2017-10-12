import { assert, should } from 'chai';
import sinon from 'sinon';
import request from 'request-promise-native';
import { loadFinancialData, FINANCIAL_DATA_LOADED, __RewireAPI__ as rewireApi } from './financial-data-actions';

should();

describe('financial data', () => {
  let requestStub;
  let unpackStub;

  beforeEach(() => {
    requestStub = sinon.stub();
    unpackStub = sinon.stub();
    rewireApi.__Rewire__('unpack', unpackStub);
    rewireApi.__Rewire__('request', requestStub);
  });

  it('fetches financial data and dispatches financial data loaded', (done) => {
    const dispatch = sinon.stub();
    const response = '{response: true}';
    const financialData = { unpackedData: true };
    const auth = {
      userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
      password: 'my password',
    };
    const year = 2017;
    const month = 10;
    requestStub.returns(Promise.resolve(response));
    unpackStub.returns(financialData);

    loadFinancialData(auth, year, month)(dispatch)
      .then(() => {
        assert(requestStub.calledWith(sinon.match({
          method: 'GET',
          uri: `http://localhost/${auth.userId}/${year}/${month}`,
        })));
        assert(unpackStub.calledWith(response, auth.password));
        assert(dispatch.calledWith(
          sinon.match({ type: FINANCIAL_DATA_LOADED, financialData, year, month })));
        done();
      })
      .catch(done);
  });
});
