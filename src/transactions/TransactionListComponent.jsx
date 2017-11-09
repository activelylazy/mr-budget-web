import React from 'react';
import { PropTypes } from 'prop-types';

const TransactionListComponent = () => (
  <div>transactions</div>
);

TransactionListComponent.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })).isRequired,
};

export default TransactionListComponent;

