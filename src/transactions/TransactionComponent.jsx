import React from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import './transactions.css';

const TransactionComponent = ({ transaction, balance }) => {
  const cells = [];
  if (balance !== undefined) {
    cells.push(<td key="balance" rowSpan="2" className="balance">£ {balance.toFixed(2)}</td>);
  }
  return (
    <div className="transaction">
      <table>
        <tbody>
          <tr>
            <td rowSpan="2" className="date">{moment(transaction.date).format('DD/MM/YYYY')}</td>
            <td className="name">{transaction.name}</td>
            <td rowSpan="2" className="amount">£ {transaction.amount.toFixed(2)}</td>
            {cells}
          </tr>
          <tr>
            <td className="category">A category</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

TransactionComponent.propTypes = {
  transaction: PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }).isRequired,
  balance: PropTypes.number,
};

TransactionComponent.defaultProps = {
  balance: undefined,
};

export default TransactionComponent;
