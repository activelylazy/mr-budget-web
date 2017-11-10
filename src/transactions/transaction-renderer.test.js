import { assert, should } from 'chai';
import Immutable from 'seamless-immutable';
import { transactionsForAccount } from './transaction-renderer';

should();

describe('transaction renderer', () => {
  describe('transactions for account', () => {
    it('returns empty list when no transactions', () => {
      const monthData = Immutable({
        transactions: [],
      });
      const accountId = 'abc-123';

      const result = transactionsForAccount(monthData, accountId);
      assert(result.length.should.equal(0));
    });

    it('does not return transactions with different account id', () => {
      const monthData = Immutable({
        transactions: [
          {
            accountId: 'other',
          },
        ],
      });
      const accountId = 'abc-123';

      const result = transactionsForAccount(monthData, accountId);
      assert(result.length.should.equal(0));
    });

    it('does return transactions with same account id', () => {
      const accountId = 'abc-123';
      const monthData = Immutable({
        transactions: [
          {
            accountId,
          },
        ],
      });

      const result = transactionsForAccount(monthData, accountId);
      assert(result.length.should.equal(1));
    });

    it('sorts transactions in ascending date order', () => {
      const accountId = 'abc-123';
      const monthData = Immutable({
        transactions: [
          {
            id: 'transaction-1',
            accountId,
            date: new Date(2017, 9, 10),
          },
          {
            id: 'transaction-2',
            accountId,
            date: new Date(2017, 9, 1),
          },
        ],
      });

      const result = transactionsForAccount(monthData, accountId);
      assert(result.length.should.equal(2));
      assert(result[0].id.should.equal('transaction-2'));
      assert(result[1].id.should.equal('transaction-1'));
    });
  });
});
