import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from 'react-bootstrap';

const AccountsSelector = ({ account }) => (
  <div className="account">
    <Button>
      {account.name}
    </Button>
  </div>
);

AccountsSelector.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default AccountsSelector;
