import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import Accounts from './AccountsComponent';

should();

describe('accounts component', () => {
  it('allows user to add an account', () => {
    const addAccount = sinon.spy();
    const accounts = shallow(<Accounts addAccount={addAccount} />);

    assert(accounts.find('#add-account-button').exists().should.equal(true));
    assert(accounts.find('#add-account-name').exists().should.equal(false));

    accounts.find('#add-account-button').simulate('click');

    const accountNameInput = accounts.find('#add-account-name');
    assert(accountNameInput.exists().should.equal(true));
    accountNameInput.simulate('change', { target: { value: 'my account' } });

    accounts.find('form').simulate('submit', { preventDefault: () => {} });

    assert(addAccount.calledWith('my account'));
  });

  it('does not add an account with a single character name', () => {
    const addAccount = sinon.spy();
    const accounts = shallow(<Accounts addAccount={addAccount} />);

    assert(accounts.find('#add-account-button').exists().should.equal(true));
    assert(accounts.find('#add-account-name').exists().should.equal(false));

    accounts.find('#add-account-button').simulate('click');

    const accountNameInput = accounts.find('#add-account-name');
    assert(accountNameInput.exists().should.equal(true));
    accountNameInput.simulate('change', { target: { value: 'x' } });

    accounts.find('form').simulate('submit', { preventDefault: () => {} });

    assert(addAccount.notCalled);
  });
});
