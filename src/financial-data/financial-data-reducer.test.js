import { assert, should } from 'chai';
import sinon from 'sinon';
import Immutable from 'seamless-immutable';
import { financialDataLoaded } from './financial-data-actions';
import financialDataReducer from './financial-data-reducer';

should();

describe('financial data reducer', () => {
  it('initial state is empty', () => {
    const state = financialDataReducer(undefined, {});

    assert(state.should.be.empty);
  });

  it('handles financial data loaded by applying to state', () => {
    const financialData = sinon.stub();
    const state = financialDataReducer(undefined, financialDataLoaded(financialData, 2017, 7));

    assert(state[2017][7].should.equal(financialData));
  });

  it('handles financial data loaded by merging with unchanged year data', () => {
    const originalData = sinon.stub();
    const initialState = Immutable({
      2016: {
        5: originalData,
      },
    });
    const financialData = sinon.stub();
    const state = financialDataReducer(initialState, financialDataLoaded(financialData, 2017, 7));

    assert(state[2016][5].should.equal(originalData));
    assert(state[2017][7].should.equal(financialData));
  });

  it('handles financial data loaded by keeping already loaded data for year & month', () => {
    const originalData = sinon.stub();
    const initialState = Immutable({
      2017: {
        7: originalData,
      },
    });
    const financialData = sinon.stub();
    const state = financialDataReducer(initialState, financialDataLoaded(financialData, 2017, 7));

    assert(state[2017][7].should.equal(originalData));
  });
});
