import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import Immutable from 'seamless-immutable';
import Accounts from './AccountsComponent';
import AccountSelector from './AccountSelector';
import TransactionList from '../transactions/TransactionListComponent';

should();

describe('accounts component', () => {
  it('renders users accounts', () => {
    const addAccount = sinon.spy();
    const userAccounts = Immutable.from([{ name: 'my account' }]);
    const selectAccount = sinon.stub();
    const accounts = shallow(
      <Accounts
        addAccount={addAccount}
        accounts={userAccounts}
        selectAccount={selectAccount}
      />);

    assert(accounts.find(AccountSelector).length.should.equal(1));
  });

  it('allows user to add an account', () => {
    const addAccount = sinon.spy();
    const userAccounts = Immutable.from([]);
    const selectAccount = sinon.stub();
    const accounts = shallow(
      <Accounts
        addAccount={addAccount}
        accounts={userAccounts}
        selectAccount={selectAccount}
      />);

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
    const selectAccount = sinon.stub();
    const accounts = shallow(
      <Accounts
        addAccount={addAccount}
        accounts={userAccounts}
        selectAccount={selectAccount}
      />);

    assert(accounts.find('#add-account-button').exists().should.equal(true));
    assert(accounts.find('#add-account-name').exists().should.equal(false));

    accounts.find('#add-account-button').simulate('click');

    const accountNameInput = accounts.find('#add-account-name');
    assert(accountNameInput.exists().should.equal(true));
    accountNameInput.simulate('change', { target: { value: 'x' } });

    accounts.find('form').simulate('submit', { preventDefault: () => {} });

    assert(addAccount.notCalled);
  });

  it('selects account when account selected', () => {
    const addAccount = sinon.stub();
    const account1 = {
      id: 'abc-123',
      name: 'account one',
    };
    const account2 = {
      id: 'def-456',
      name: 'account two',
    };
    const userAccounts = [
      account1, account2,
    ];
    const selectAccount = sinon.stub();

    const accounts = shallow(
      <Accounts
        addAccount={addAccount}
        accounts={userAccounts}
        selectAccount={selectAccount}
      />);

    const accountSelector = accounts.find(AccountSelector).find({ account: account2 });
    assert(accountSelector.exists());

    accountSelector.prop('onSelect')();
    assert(selectAccount.calledWith(account2.id));
  });
});
