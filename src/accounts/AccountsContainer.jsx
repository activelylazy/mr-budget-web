import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { navigateAccount } from '../navigation/navigation-actions';
import Accounts from './AccountsComponent';
import { addAccount } from './accounts-thunk';

const AccountsContainer = props => (
  <Accounts
    addAccount={name => props.addAccount(props.auth, name)}
    accounts={props.accounts}
    selectAccount={props.navigateAccount}
  />
);

AccountsContainer.propTypes = {
  addAccount: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
  auth: PropTypes.shape({
    password: PropTypes.string.isRequired,
  }).isRequired,
  navigateAccount: PropTypes.func.isRequired,
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
});

export default connect(mapStateToProps, { addAccount, navigateAccount })(AccountsContainer);
