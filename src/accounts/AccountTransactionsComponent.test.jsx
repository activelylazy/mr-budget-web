import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import TransactionList from '../transactions/TransactionListComponent';
import MonthNavigation from '../transactions/MonthNavigationContainer';
import AccountTransactions, { __RewireAPI__ as rewireApi } from './AccountTransactionsComponent';

should();

describe('account transactions component', () => {
  it('renders transaction list for transactions in selected account', () => {
    const account = {
      id: 'abc-123',
      name: 'account one',
    };
    const userAccounts = [account];
    const monthData = {
      year: 2017,
      month: 7,
    };

    const accountTransactions = [];
    const transactionsForAccountStub = sinon.stub().returns(accountTransactions);
    rewireApi.__Rewire__('transactionsForAccount', transactionsForAccountStub);

    const accounts = shallow(
      <AccountTransactions
        accounts={userAccounts}
        monthData={monthData}
        selectedAccountId={account.id}
      />);

    const transactionList = accounts.find(TransactionList);
    assert(transactionList.exists());
    assert(transactionsForAccountStub.calledWith(monthData, account.id));
    assert(transactionList.prop('transactions').should.equal(accountTransactions));
  });

  it('passes account opening balance to transaction list', () => {
    const account = {
      id: 'abc-123',
      name: 'account one',
      openingBalance: 111.11,
    };
    const userAccounts = [account];
    const monthData = {
      year: 2017,
      month: 7,
    };

    const accountTransactions = [];
    const transactionsForAccountStub = sinon.stub().returns(accountTransactions);
    rewireApi.__Rewire__('transactionsForAccount', transactionsForAccountStub);

    const accounts = shallow(
      <AccountTransactions
        accounts={userAccounts}
        monthData={monthData}
        selectedAccountId={account.id}
      />);

    const transactionList = accounts.find(TransactionList);
    assert(transactionList.exists());
    assert(transactionList.prop('openingBalance').should.equal(111.11));
  });

  it('passes opening and closing dates to month navigation', () => {
    const account = {
      id: 'abc-123',
      name: 'account one',
      openingDate: new Date(2016, 4, 1),
      lastStatementDate: new Date(2018, 10, 1),
    };
    const userAccounts = [account];
    const monthData = {
      year: 2017,
      month: 7,
    };

    const accountTransactions = [];
    const transactionsForAccountStub = sinon.stub().returns(accountTransactions);
    rewireApi.__Rewire__('transactionsForAccount', transactionsForAccountStub);

    const accounts = shallow(
      <AccountTransactions
        accounts={userAccounts}
        monthData={monthData}
        selectedAccountId={account.id}
      />);

    const navigation = accounts.find(MonthNavigation);
    assert(navigation.prop('startMonth').should.equal(4));
    assert(navigation.prop('startYear').should.equal(2016));
    assert(navigation.prop('endMonth').should.equal(10));
    assert(navigation.prop('endYear').should.equal(2018));
  });

  it('passes account name as title month navigation', () => {
    const account = {
      id: 'abc-123',
      name: 'account one',
      openingDate: new Date(2016, 4, 1),
      lastStatementDate: new Date(2018, 10, 1),
    };
    const userAccounts = [account];
    const monthData = {
      year: 2017,
      month: 7,
    };

    const accountTransactions = [];
    const transactionsForAccountStub = sinon.stub().returns(accountTransactions);
    rewireApi.__Rewire__('transactionsForAccount', transactionsForAccountStub);

    const accounts = shallow(
      <AccountTransactions
        accounts={userAccounts}
        monthData={monthData}
        selectedAccountId={account.id}
      />);

    const navigation = accounts.find(MonthNavigation);
    assert(navigation.prop('title').should.equal(account.name));
  });
});
