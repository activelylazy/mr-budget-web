import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Accounts from './AccountsComponent';
import { addAccount } from '../user-data/user-data-actions';

const AccountsContainer = props => (
  <Accounts
    addAccount={name => props.addAccount(props.auth, name)}
    accounts={props.accounts}
  />
);

AccountsContainer.propTypes = {
  addAccount: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
  auth: PropTypes.shape({
    password: PropTypes.string.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    accounts: state.userData.accounts,
  };
}

export default connect(mapStateToProps, { addAccount })(AccountsContainer);
