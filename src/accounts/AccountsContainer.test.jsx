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
  });
});

