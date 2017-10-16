import { assert, should } from 'chai';
import sinon from 'sinon';
import Immutable from 'seamless-immutable';
import { financialDataLoaded, applyTransactionsToMonth } from './financial-data-actions';
import financialDataReducer from './financial-data-reducer';

should();

describe('financial data reducer', () => {
  it('initial state is empty', () => {
    const state = financialDataReducer(undefined, {});

    assert(state.should.be.empty);
  });

  describe('handles financial data loaded', () => {
    it('applies to empty state', () => {
      const financialData = sinon.stub();
      const state = financialDataReducer(undefined, financialDataLoaded(financialData, 2017, 7));

      assert(state[2017][7].should.equal(financialData));
    });

    it('merges with unchanged year data', () => {
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

    it('preserves already loaded data for year + month', () => {
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

  describe('handles apply transactions to month', () => {
    it('adds transactions to empty month', () => {
      const initialState = Immutable({
        2017: {
          7: {
            transactions: [],
          },
        },
      });

      const transactions = [
        {
          id: '1',
          date: new Date(2017, 7, 1),
          name: 'transaction 1',
          amount: 12.34,
        },
      ];

      const state = financialDataReducer(initialState,
        applyTransactionsToMonth(2017, 7, transactions));

      assert(state[2017][7].transactions.length.should.equal(1));
      assert(state[2017][7].transactions[0].id.should.equal('1'));
      assert(state[2017][7].transactions[0].name.should.equal('transaction 1'));
      assert(state[2017][7].transactions[0].amount.should.equal(12.34));
    });

    it('appends transactions to existing month data', () => {
      const initialState = Immutable({
        2017: {
          7: {
            transactions: [
              {
                id: '0',
                date: new Date(2017, 7, 1),
                name: 'transaction 0',
                amount: -11.11,
              },
            ],
            closingBalances: sinon.stub(),
          },
        },
      });

      const transactions = [
        {
          id: '1',
          date: new Date(2017, 7, 2),
          name: 'transaction 1',
          amount: 12.34,
        },
      ];

      const state = financialDataReducer(initialState,
        applyTransactionsToMonth(2017, 7, transactions));

      assert(state[2017][7].transactions.length.should.equal(2));
      assert(state[2017][7].transactions[0].id.should.equal('0'));
      assert(state[2017][7].transactions[0].name.should.equal('transaction 0'));
      assert(state[2017][7].transactions[1].id.should.equal('1'));
      assert(state[2017][7].transactions[1].name.should.equal('transaction 1'));
      assert(state[2017][7].transactions[1].amount.should.equal(12.34));
      assert(state[2017][7].closingBalances.should.equal(initialState[2017][7].closingBalances));
    });
  });
});
