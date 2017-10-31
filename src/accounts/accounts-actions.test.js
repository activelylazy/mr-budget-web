import { assert, should } from 'chai';
import { findAccountById } from './accounts-actions';

should();

describe('accounts actions', () => {
  describe('get account by id', () => {
    it('should return account by id', () => {
      const account1 = {
        id: 'abc-123',
      };
      const account2 = {
        id: 'def-456',
      };
      const accounts = [
        account1,
        account2,
      ];

      const result = findAccountById(accounts, account1.id);

      assert(result.should.equal(account1));
    });

    it('should return undefined if not found', () => {
      const result = findAccountById([], 'abc-123');
    
      assert.isUndefined(result);
    });
  });
});
