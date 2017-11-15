import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import AccountTransactions from './AccountTransactionsComponent';

const AccountTransactionsContainer = props => (
  <AccountTransactions
    accounts={props.accounts}
    monthData={props.monthData}
    selectedAccountId={props.selectedAccountId}
  />
);

AccountTransactionsContainer.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
  monthData: PropTypes.shape({
  }),
  selectedAccountId: PropTypes.string,
};

AccountTransactionsContainer.defaultProps = {
  selectedAccountId: undefined,
  monthData: undefined,
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

export default connect(mapStateToProps)(AccountTransactionsContainer);
