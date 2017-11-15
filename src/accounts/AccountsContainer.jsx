import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Accounts from './AccountsComponent';
import { addAccount, viewAccountTransactions } from './accounts-thunk';

const AccountsContainer = props => (
  <Accounts
    addAccount={name => props.addAccount(props.auth, name)}
    accounts={props.accounts}
    selectAccount={props.viewAccountTransactions}
    selectedAccountId={props.selectedAccountId}
    selectedMonth={props.selectedMonth}
    selectedYear={props.selectedYear}
  />
);

AccountsContainer.propTypes = {
  addAccount: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
  auth: PropTypes.shape({
    password: PropTypes.string.isRequired,
  }).isRequired,
  viewAccountTransactions: PropTypes.func.isRequired,
  selectedAccountId: PropTypes.string,
  selectedMonth: PropTypes.number,
  selectedYear: PropTypes.number,
};

AccountsContainer.defaultProps = {
  selectedAccountId: undefined,
  selectedMonth: undefined,
  selectedYear: undefined,
};

export const mapStateToProps = state => ({
  accounts: state.userData.accounts,
  selectedAccountId: state.navigation.selectedAccountId,
  selectedMonth: state.navigation.currentYear,
  selectedYear: state.navigation.currentMonth,
});

export default connect(mapStateToProps, { addAccount, viewAccountTransactions })(AccountsContainer);
