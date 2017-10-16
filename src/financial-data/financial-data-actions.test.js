import { assert, should } from 'chai';
import sinon from 'sinon';
import request from 'request-promise-native';
import { loadFinancialData, saveFinancialData, FINANCIAL_DATA_LOADED, __RewireAPI__ as rewireApi } from './financial-data-actions';

should();

describe('financial data', () => {
  let requestStub;
  let unpackStub;
  let packStub;

  beforeEach(() => {
    requestStub = sinon.stub();
    unpackStub = sinon.stub();
    packStub = sinon.stub();
    rewireApi.__Rewire__('unpack', unpackStub);
    rewireApi.__Rewire__('pack', packStub);
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

  it('fetches missing financial data and dispatches financial data loaded with empty data', (done) => {
    const dispatch = sinon.stub();
    const errorResponse = {
      statusCode: 404,
    };
    const auth = {
      userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
      password: 'my password',
    };
    const year = 2017;
    const month = 10;
    requestStub.returns(Promise.reject(errorResponse));

    loadFinancialData(auth, year, month)(dispatch)
      .then(() => {
        assert(requestStub.calledWith(sinon.match({
          method: 'GET',
          uri: `http://localhost/${auth.userId}/${year}/${month}`,
        })));
        assert(dispatch.calledWith(
          sinon.match({ type: FINANCIAL_DATA_LOADED, financialData: {}, year, month })));
        done();
      })
      .catch(done);
  });

  it('saves financial data', (done) => {
    const financialData = { financialData: true };
    const packedData = { packed: true };
    const auth = {
      userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
      password: 'my password',
    };
    const year = 2017;
    const month = 10;

    packStub.returns(Promise.resolve(packedData));
    requestStub.returns(Promise.resolve());

    saveFinancialData(auth, financialData, year, month)
      .then(() => {
        assert(requestStub.calledWith(sinon.match({
          method: 'POST',
          uri: `http://localhost/${auth.userId}/${year}/${month}`,
        })));
        assert(packStub.calledWith(financialData, auth.password));
        done();
      })
      .catch(done);
  });
});
