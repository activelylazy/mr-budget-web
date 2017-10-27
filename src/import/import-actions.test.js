import { assert, should } from 'chai';
import sinon from 'sinon';
import { setSelectedAccount, filterTransactions, IMPORT_ACCOUNT_SELECTED } from './import-actions';

should();

describe('import actions', () => {
  describe('filter transactions', () => {
    it('returns transactions when no last statement date', () => {
      const transactions = sinon.stub();

      const result = filterTransactions(undefined, transactions);

      assert(result.should.equal(transactions));
    });

    it('returns transactions after the given date', () => {
      const transaction1 = {
        date: new Date(Date.now() - (3 * 24 * 3600 * 1000)),
      };
      const transaction2 = {
        date: new Date(Date.now() - (1 * 24 * 3600 * 1000)),
      };
      const transactions = [transaction1, transaction2];

      const result = filterTransactions(
        new Date(Date.now() - (2 * 24 * 3600 * 1000)),
        transactions);

      assert(result.length.should.equal(1));
      assert(result[0].should.equal(transaction2));
    });
  });

  it('creates an import account selected action with no account id', () => {
    const result = setSelectedAccount('');

    assert(result.type.should.equal(IMPORT_ACCOUNT_SELECTED));
    assert.isNull(result.accountId);
  });
});
