import React from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import './transactions.css';

const renderAmount = (amount) => {
  if (amount !== undefined) {
    return `£ ${amount.toFixed(2)}`;
  }
  return '';
};

const renderDate = (date) => {
  if (date !== undefined) {
    return moment(date).format('DD/MM/YYYY');
  }
  return '';
};

const TransactionComponent = ({ transaction, balance }) => {
  const cells = [];
  if (balance !== undefined) {
    cells.push(<td key="balance" rowSpan="2" className="balance">£ {balance.toFixed(2)}</td>);
  }
  const rows = [];
  rows.push(
    (<tr key="first">
      <td rowSpan="2" className="date">{renderDate(transaction.date)}</td>
      <td className="name">{transaction.name}</td>
      <td rowSpan="2" className="amount">{renderAmount(transaction.amount)}</td>
      {cells}
    </tr>));
  if (transaction.date !== undefined) {
    rows.push(
      (<tr key="second">
        <td className="category">A category</td>
      </tr>));
  }
  return (
    <div className="transaction">
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

TransactionComponent.propTypes = {
  transaction: PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    name: PropTypes.string.isRequired,
    amount: PropTypes.number,
  }).isRequired,
  balance: PropTypes.number,
};

TransactionComponent.defaultProps = {
  balance: undefined,
};

export default TransactionComponent;
