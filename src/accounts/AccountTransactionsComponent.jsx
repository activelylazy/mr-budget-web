import React, { Component } from 'react';
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

class AccountTransactionsComponent extends Component {
  constructor() {
    super();
    this.getAccountTransactions = this.getAccountTransactions.bind(this);
  }
  getAccountTransactions() {
    return transactionsForAccount(this.props.monthData, this.props.selectedAccountId);
  }
  getAccountOpeningDate() {
    return this.props.accounts
      .find(a => a.id === this.props.selectedAccountId)
      .openingDate;
  }
  getAccountStatementDate() {
    return this.props.accounts
      .find(a => a.id === this.props.selectedAccountId)
      .lastStatementDate;
  }
  getAccountTitle() {
    return this.props.accounts
      .find(a => a.id === this.props.selectedAccountId)
      .name;
  }
  getAccountOpeningBalance() {
    return this.props.accounts
      .find(a => a.id === this.props.selectedAccountId)
      .openingBalance;
  }
  render() {
    return (
      <div>
        <MonthNavigation
          startMonth={getMonthIfPresent(this.getAccountOpeningDate())}
          startYear={getYearIfPresent(this.getAccountOpeningDate())}
          endMonth={getMonthIfPresent(this.getAccountStatementDate())}
          endYear={getYearIfPresent(this.getAccountStatementDate())}
          title={this.getAccountTitle()}
        />
        <TransactionList
          transactions={this.getAccountTransactions()}
          openingBalance={this.getAccountOpeningBalance()}
        />
      </div>
    );
  }
}

AccountTransactionsComponent.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    openingDate: PropTypes.instanceOf(Date),
  })).isRequired,
  monthData: PropTypes.shape({
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
  }),
  selectedAccountId: PropTypes.string.isRequired,
};

AccountTransactionsComponent.defaultProps = {
  monthData: undefined,
};

export default AccountTransactionsComponent;
