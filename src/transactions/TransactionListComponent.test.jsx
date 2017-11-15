import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import TransactionList from './TransactionListComponent';
import Transaction from './TransactionComponent';

should();

describe('transaction list component', () => {
  it('renders transactions', () => {
    const transaction1 = {
      id: '1',
      name: 'transaction 1',
      amount: 12.34,
    };
    const transaction2 = {
      id: '2',
      name: 'transaction 2',
      amount: 45.67,
    };
    const transactions = [transaction1, transaction2];
    const transactionList = shallow(
      <TransactionList
        transactions={transactions}
      />,
    );

    const transactionComponents = transactionList.find(Transaction);

    assert(transactionComponents.length.should.equal(2));
    assert(transactionComponents.get(0).props.transaction.should.equal(transaction1));
    assert(transactionComponents.get(1).props.transaction.should.equal(transaction2));
  });

  it('passes account balance', () => {
    const transaction1 = {
      id: '1',
      name: 'transaction 1',
      amount: 12.34,
    };
    const transaction2 = {
      id: '2',
      name: 'transaction 2',
      amount: 45.67,
    };
    const transactions = [transaction1, transaction2];
    const transactionList = shallow(
      <TransactionList
        transactions={transactions}
        openingBalance={100}
      />,
    );

    const transactionComponents = transactionList.find(Transaction);

    assert(transactionComponents.length.should.equal(2));
    assert(transactionComponents.get(0).props.balance.should.equal(112.34));
    assert(transactionComponents.get(1).props.balance.should.equal(158.01));
  });
});
