import React from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import './transactions.css';

const TransactionComponent = ({ transaction }) => (
  <div className="transaction">
    <table>
      <tbody>
        <tr>
          <td rowSpan="2" className="date">{moment(transaction.date).format('DD/MM/YYYY')}</td>
          <td className="desc">{transaction.name}</td>
          <td rowSpan="2" className="amount">£ {transaction.amount.toFixed(2)}</td>
        </tr>
        <tr>
          <td className="category">A category</td>
        </tr>
      </tbody>
    </table>
  </div>
);

TransactionComponent.propTypes = {
  transaction: PropTypes.shape({
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }).isRequired,
};

export default TransactionComponent;
