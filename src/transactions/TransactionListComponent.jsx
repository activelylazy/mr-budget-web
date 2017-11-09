import React from 'react';
import { PropTypes } from 'prop-types';
import Transaction from './TransactionComponent';

const TransactionListComponent = ({ transactions }) => (
  <div>
    {transactions.map(transaction => (<Transaction key={transaction.id} transaction={transaction} />))}
  </div>
);

TransactionListComponent.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })).isRequired,
};

export default TransactionListComponent;

