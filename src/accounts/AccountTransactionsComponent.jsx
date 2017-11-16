import React from 'react';
import { PropTypes } from 'prop-types';
import TransactionList from '../transactions/TransactionListComponent';
import MonthNavigation from '../transactions/MonthNavigationContainer';
import { transactionsForAccount } from '../transactions/transaction-renderer';

function getMonthIfPresent(date) {
  return date === undefined ? undefined : date.getMonth();
}

function getYearIfPresent(date) {
  return date === undefined ? undefined : date.getFullYear();
}

const AccountTransactionsComponent = ({ account, monthData }) => (
  <div>
    <MonthNavigation
      startMonth={getMonthIfPresent(account.openingDate)}
      startYear={getYearIfPresent(account.openingDate)}
      endMonth={getMonthIfPresent(account.lastStatementDate)}
      endYear={getYearIfPresent(account.lastStatementDate)}
      title={account.name}
    />
    <TransactionList
      transactions={transactionsForAccount(monthData, account.id)}
      openingBalance={monthData.openingBalances[account.id]}
    />
  </div>
);

AccountTransactionsComponent.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    openingDate: PropTypes.instanceOf(Date),
    lastStatementDate: PropTypes.instanceOf(Date),
    openingBalance: PropTypes.number,
  }).isRequired,
  monthData: PropTypes.shape({
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    openingBalances: PropTypes.shape({}).isRequired,
  }),
};

AccountTransactionsComponent.defaultProps = {
  monthData: undefined,
};

export default AccountTransactionsComponent;
