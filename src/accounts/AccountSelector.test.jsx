import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import AccountSelector from './AccountSelector';

should();

describe('account selector', () => {
  it('displays summary of an account', () => {
    const account = {
      name: 'my account',
      lastStatementBalance: 111.22,
      lastStatementDate: new Date(Date.now() - (24 * 3600 * 1000)),
    };

    const component = shallow(
      <AccountSelector account={account} />,
    );

    const accountName = component.find('.account-name');
    assert(accountName.exists().should.equal(true));
    assert(accountName.text().should.equal('my account'));

    const accountBalance = component.find('.account-balance');
    assert(accountBalance.exists().should.equal(true));
    assert(accountBalance.text().should.equal('£ 111.22'));

    const lastUpdated = component.find('.account-updated');
    assert(lastUpdated.exists().should.equal(true));
    assert(lastUpdated.text().should.equal('last updated yesterday'));
  });

  it('does not display balance or date when not updated', () => {
    const account = {
      name: 'my account',
    };

    const component = shallow(
      <AccountSelector account={account} />,
    );

    const accountName = component.find('.account-name');
    assert(accountName.exists().should.equal(true));
    assert(accountName.text().should.equal('my account'));

    const accountBalance = component.find('.account-balance');
    assert(accountBalance.exists().should.equal(false));

    const lastUpdated = component.find('.account-updated');
    assert(lastUpdated.exists().should.equal(true));
    assert(lastUpdated.text().should.equal(' '));
  });
});
