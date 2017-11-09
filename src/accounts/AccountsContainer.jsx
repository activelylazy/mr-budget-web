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
  />
);

AccountsContainer.propTypes = {
  addAccount: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
  auth: PropTypes.shape({
    password: PropTypes.string.isRequired,
  }).isRequired,
  viewAccountTransactions: PropTypes.func.isRequired,
};

function selectedMonthData(state) {
  if (state.navigation.currentMonth === undefined ||
    state.navigation.currentYear === undefined) {
    return undefined;
  }
  return state.financialData[state.navigation.currentYear][state.navigation.currentMonth];
}

export const mapStateToProps = state => ({
  accounts: state.userData.accounts,
  monthData: selectedMonthData(state),
  selectedAccountId: state.navigation.selectedAccountId,
});

export default connect(mapStateToProps, { addAccount, viewAccountTransactions })(AccountsContainer);
