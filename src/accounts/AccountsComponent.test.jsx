import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import Immutable from 'seamless-immutable';
import AccountSelector from './AccountSelector';
import Accounts from './AccountsComponent';
import AccountTransactions from './AccountTransactionsContainer';

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
      openingDate: new Date(),
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

  it('does not render account transactions when no account selected', () => {
    const addAccount = sinon.stub();
    const account = {
      id: 'abc-123',
      name: 'account one',
      openingDate: new Date(),
    };
    const userAccounts = [account];
    const selectAccount = sinon.stub();
    const monthData = {
      year: 2017,
      month: 7,
    };

    const accounts = shallow(
      <Accounts
        addAccount={addAccount}
        accounts={userAccounts}
        selectAccount={selectAccount}
        monthData={monthData}
      />);

    const accountTransactions = accounts.find(AccountTransactions);
    assert(accountTransactions.exists().should.equal(false));
  });

  it('does not render account transactions when no month selected', () => {
    const addAccount = sinon.stub();
    const account = {
      id: 'abc-123',
      name: 'account one',
      openingDate: new Date(),
    };
    const userAccounts = [account];
    const selectAccount = sinon.stub();

    const accounts = shallow(
      <Accounts
        addAccount={addAccount}
        accounts={userAccounts}
        selectAccount={selectAccount}
        selectedAccountId={account.id}
      />);

    const accountTransactions = accounts.find(AccountTransactions);
    assert(accountTransactions.exists().should.equal(false));
  });

  it('renders account transaction list when account and period selected', () => {
    const addAccount = sinon.stub();
    const account = {
      id: 'abc-123',
      name: 'account one',
    };
    const userAccounts = [account];
    const selectAccount = sinon.stub();

    const accounts = shallow(
      <Accounts
        addAccount={addAccount}
        accounts={userAccounts}
        selectAccount={selectAccount}
        selectedAccountId={account.id}
        selectedYear={2017}
        selectedMonth={7}
      />);

    const accountTransactions = accounts.find(AccountTransactions);
    assert(accountTransactions.exists());
  });
});
