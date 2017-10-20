import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import AccountSelector from './AccountSelector';

should();

describe('import component', () => {
  it('allows selection of file initially', () => {
    const account = {
      name: 'my account',
      lastStatementBalance: 111.22,
      lastStatementDate: new Date(2017, 10, 19),
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
  });
});
