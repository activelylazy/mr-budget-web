import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Accounts from './AccountsComponent';
import { addAccount } from './accounts-actions';

const AccountsContainer = props => (
  <Accounts addAccount={props.addAccount} />
);

AccountsContainer.propTypes = {
  addAccount: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {

  };
}

export default connect(mapStateToProps, { addAccount })(AccountsContainer);
