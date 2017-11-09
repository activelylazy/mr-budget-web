import { assert, should } from 'chai';
import sinon from 'sinon';
import { mapStateToProps } from './AccountsContainer';

should();

describe('accounts container', () => {
  describe('mapStateToProps', () => {
    it('maps accounts', () => {
      const accounts = sinon.stub();
      const state = {
        userData: {
          accounts,
        },
        navigation: {},
      };

      const result = mapStateToProps(state);

      assert(result.accounts.should.equal(accounts));
    });

    it('maps to undefined month data when no month selected', () => {
      const accounts = sinon.stub();
      const state = {
        userData: {
          accounts,
        },
        navigation: {},
      };

      const result = mapStateToProps(state);

      assert.isUndefined(result.monthData);
    });

    it('maps to month data when year & month selected', () => {
      const accounts = sinon.stub();
      const monthData = sinon.stub();
      const state = {
        userData: {
          accounts,
        },
        navigation: {
          currentMonth: 7,
          currentYear: 2017,
        },
        financialData: {
          2017: {
            7: monthData,
          },
        },
      };

      const result = mapStateToProps(state);

      assert(result.monthData.should.equal(monthData));
    });
  });
});

