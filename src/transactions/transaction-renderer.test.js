import { assert, should } from 'chai';
import { transactionsForAccount } from './transaction-renderer';

should();

describe('transaction renderer', () => {
  describe('transactions for account', () => {
    it('returns empty list when no transactions', () => {
      const monthData = {
        transactions: [],
      };
      const accountId = 'abc-123';

      const result = transactionsForAccount(monthData, accountId);
      assert(result.length.should.equal(0));
    });

    it('does not return transactions with different account id', () => {
      const monthData = {
        transactions: [
          {
            accountId: 'other',
          },
        ],
      };
      const accountId = 'abc-123';

      const result = transactionsForAccount(monthData, accountId);
      assert(result.length.should.equal(0));
    });

    it('does return transactions with same account id', () => {
      const accountId = 'abc-123';
      const monthData = {
        transactions: [
          {
            accountId,
          },
        ],
      };

      const result = transactionsForAccount(monthData, accountId);
      assert(result.length.should.equal(1));
    });
  });
});
