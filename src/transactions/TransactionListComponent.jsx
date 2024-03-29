import React from 'react';
import { PropTypes } from 'prop-types';
import Transaction from './TransactionComponent';

const TransactionListComponent = ({ transactions, openingBalance }) => {
  let balance = openingBalance;
  const transactionElements = [];
  if (openingBalance !== undefined) {
    const openingBalanceTransaction = {
      name: 'Opening balance',
    };
    transactionElements.push(<Transaction
      key={'opening-balance'}
      transaction={openingBalanceTransaction}
      balance={openingBalance}
    />);
  }
  transactions.forEach((transaction) => {
    if (balance !== undefined) {
      balance += transaction.amount;
    }
    transactionElements.push(<Transaction
      key={transaction.id}
      transaction={transaction}
      balance={balance}
    />);
  });

  return (
    <div className="full-height transaction-list">
      {transactionElements}
    </div>
  );
};

TransactionListComponent.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })).isRequired,
  openingBalance: PropTypes.number,
};

TransactionListComponent.defaultProps = {
  openingBalance: undefined,
};

export default TransactionListComponent;

