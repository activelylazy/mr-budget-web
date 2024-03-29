import { assert, should } from 'chai';
import sinon from 'sinon';
import { mapStateToProps } from './AccountTransactionsContainer';

should();

describe('account transactions container', () => {
  it('maps selected account id', () => {
    const accounts = sinon.stub();
    const selectedAccountId = sinon.stub();
    const state = {
      userData: {
        accounts,
      },
      navigation: {
        selectedAccountId,
      },
    };

    const result = mapStateToProps(state);

    assert(result.selectedAccountId.should.equal(selectedAccountId));
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
