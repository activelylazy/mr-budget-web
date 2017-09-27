import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import Immutable from 'seamless-immutable';
import Accounts from './AccountsComponent';
import AccountSelector from './AccountSelector';

should();

describe('accounts component', () => {
  it('renders users accounts', () => {
    const addAccount = sinon.spy();
    const userAccounts = Immutable.from([{ name: 'my account' }]);
    const accounts = shallow(<Accounts addAccount={addAccount} accounts={userAccounts} />);

    assert(accounts.find(AccountSelector).length.should.equal(1));
  });

  it('allows user to add an account', () => {
    const addAccount = sinon.spy();
    const userAccounts = Immutable.from([]);
    const accounts = shallow(<Accounts addAccount={addAccount} accounts={userAccounts} />);

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
    const userAccounts = Immutable.from([]);
    const accounts = shallow(<Accounts addAccount={addAccount} accounts={userAccounts} />);

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
