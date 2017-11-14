import { assert, should } from 'chai';
import sinon from 'sinon';
import { loadAndViewFinancialDataForPeriod, __RewireAPI__ as rewireApi } from './navigation-thunk';
import { NAVIGATE_TO_PERIOD } from './navigation-actions';

should();

describe('navigation thunk', () => {
  describe('load and view financial data for period', () => {
    it('loads financial data if required', (done) => {
      const auth = sinon.stub();
      const loadFinancialDataIfRequired = sinon.stub().returns(Promise.resolve());
      rewireApi.__Rewire__('loadFinancialDataIfRequired', loadFinancialDataIfRequired);
      const dispatch = sinon.stub();
      const getState = sinon.stub();

      loadAndViewFinancialDataForPeriod(auth, 2017, 7)(dispatch, getState)
        .then(() => {
          assert(loadFinancialDataIfRequired.calledWith(auth, 2017, 7, dispatch, getState));
          done();
        })
        .catch(done);
    });

    it('dispatches navigate to period', (done) => {
      const auth = sinon.stub();
      const loadFinancialDataIfRequired = sinon.stub().returns(Promise.resolve());
      rewireApi.__Rewire__('loadFinancialDataIfRequired', loadFinancialDataIfRequired);
      const dispatch = sinon.stub();
      const getState = sinon.stub();

      loadAndViewFinancialDataForPeriod(auth, 2017, 7)(dispatch, getState)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: NAVIGATE_TO_PERIOD,
            year: 2017,
            month: 7,
          })));
          done();
        })
        .catch(done);
    });
  });
});
