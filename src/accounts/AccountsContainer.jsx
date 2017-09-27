import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Accounts from './AccountsComponent';
import { addAccount } from './accounts-actions';

const AccountsContainer = props => (
  <Accounts addAccount={props.addAccount} accounts={props.accounts} />
);

AccountsContainer.propTypes = {
  addAccount: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(state) {
  return {
    accounts: state.accounts.accounts,
  };
}

export default connect(mapStateToProps, { addAccount })(AccountsContainer);
